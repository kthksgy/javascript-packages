import { useCallback, useMemo, useRef, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ExecutorModuleAugmentation {}

type ExecutorModule = Omit<{ Error: Error }, keyof ExecutorModuleAugmentation> &
  ExecutorModuleAugmentation;

export type ExecutorSettings = {
  /**
   * **デバウンス遅延[ミリ秒]**
   * デバウンス時に処理が実行されるまでの遅延時間。
   */
  debounceDelay: number;
  onError: { (error: any): Promise<ExecutorModule["Error"]> };
  /**
   * **スロットル遅延[ミリ秒]**
   * スロットル時に次の処理が実行可能になるまでの遅延時間。
   */
  throttleDelay: number;
};

let defaultSettings: ExecutorSettings = {
  debounceDelay: 3000,
  async onError(error) {
    return new Error(undefined, { cause: error });
  },
  throttleDelay: 3000,
};

export function setDefaultExecutorSettings(settings: Partial<ExecutorSettings>) {
  return (defaultSettings = {
    debounceDelay: settings.debounceDelay ?? defaultSettings.debounceDelay,
    onError: settings.onError ?? defaultSettings.onError,
    throttleDelay: settings.throttleDelay ?? defaultSettings.throttleDelay,
  });
}

export class ExecutorAbort {}

/**
 * 非同期処理を実行するためのユーティリティを取得する。
 * @returns ユーティリティオブジェクト
 */
export function useExecutor(settings?: Partial<ExecutorSettings>) {
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const debounceResolver = useRef<{ resolve: { (value: ExecutorAbort): void } }>(undefined);
  const throttleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [numberOfExecutions, setNumberOfExecutions] = useState(0);
  const [debouncing, setDebouncing] = useState(false);
  const [throttling, setThrottling] = useState(false);

  const debounce = useCallback(
    async function <T>(process: { (): Promise<T> }) {
      const { promise, resolve } = Promise.withResolvers<
        T | ExecutorAbort | ExecutorModule["Error"]
      >();

      if (debounceTimer.current !== undefined) {
        clearTimeout(debounceTimer.current);
      }
      if (debounceResolver.current !== undefined) {
        debounceResolver.current.resolve(new ExecutorAbort());
      }

      setDebouncing(true);
      debounceTimer.current = setTimeout(async function () {
        try {
          setNumberOfExecutions(function (numberOfExecutions) {
            return numberOfExecutions + 1;
          });

          setThrottling(true); // スロットルを開始する。

          debounceTimer.current = undefined;
          debounceResolver.current = undefined;
          setDebouncing(false);

          resolve(await process());
        } catch (error) {
          const executorError = await defaultSettings.onError(error);
          resolve(executorError);
        } finally {
          setNumberOfExecutions(function (numberOfExecutions) {
            return numberOfExecutions - 1;
          });

          throttleTimer.current = setTimeout(function () {
            throttleTimer.current = undefined;
            setThrottling(false);
          }, settings?.throttleDelay ?? defaultSettings.throttleDelay);
        }
      }, settings?.debounceDelay ?? defaultSettings.debounceDelay);
      debounceResolver.current = { resolve };

      return await promise;
    },
    [settings?.debounceDelay, settings?.throttleDelay],
  );

  const execute = useCallback(
    async function <T>(process: { (): Promise<T> }) {
      try {
        setNumberOfExecutions(function (numberOfExecutions) {
          return numberOfExecutions + 1;
        });

        setThrottling(true); // スロットルを開始する。

        // デバウンスを終了する。
        if (debounceTimer.current !== undefined) {
          clearTimeout(debounceTimer.current);
        }
        if (debounceResolver.current !== undefined) {
          debounceResolver.current.resolve(new ExecutorAbort());
        }
        debounceTimer.current = undefined;
        debounceResolver.current = undefined;
        setDebouncing(false);

        return await process();
      } catch (error) {
        const executorError = await defaultSettings.onError(error);
        return executorError;
      } finally {
        setNumberOfExecutions(function (numberOfExecutions) {
          return numberOfExecutions - 1;
        });

        throttleTimer.current = setTimeout(function () {
          throttleTimer.current = undefined;
          setThrottling(false);
        }, settings?.throttleDelay ?? defaultSettings.throttleDelay);
      }
    },
    [settings?.throttleDelay],
  );

  const reset = useCallback(function () {
    if (debounceTimer.current !== undefined) {
      clearTimeout(debounceTimer.current);
    }
    if (debounceResolver.current !== undefined) {
      debounceResolver.current.resolve(new ExecutorAbort());
    }
    debounceTimer.current = undefined;
    debounceResolver.current = undefined;
    setDebouncing(false);

    if (throttleTimer.current !== undefined) {
      clearTimeout(throttleTimer.current);
      throttleTimer.current = undefined;
    }
    setThrottling(false);
  }, []);

  const throttle = useCallback(
    async function <T>(process: { (): Promise<T> }) {
      if (throttleTimer.current !== undefined) {
        return new ExecutorAbort();
      }

      try {
        setNumberOfExecutions(function (numberOfExecutions) {
          return numberOfExecutions + 1;
        });

        setThrottling(true); // スロットルを開始する。

        // デバウンスを終了する。
        if (debounceTimer.current !== undefined) {
          clearTimeout(debounceTimer.current);
        }
        if (debounceResolver.current !== undefined) {
          debounceResolver.current.resolve(new ExecutorAbort());
        }
        debounceTimer.current = undefined;
        debounceResolver.current = undefined;
        setDebouncing(false);

        return await process();
      } catch (error) {
        const executorError = await defaultSettings.onError(error);
        return executorError;
      } finally {
        setNumberOfExecutions(function (numberOfExecutions) {
          return numberOfExecutions - 1;
        });

        throttleTimer.current = setTimeout(function () {
          throttleTimer.current = undefined;
          setThrottling(false);
        }, settings?.throttleDelay ?? defaultSettings.throttleDelay);
      }
    },
    [settings?.throttleDelay],
  );

  const wait = useCallback(
    function (promise: Promise<any>) {
      execute(async function () {
        await promise;
      });
    },
    [execute],
  );

  return useMemo(
    function () {
      return {
        debounce,
        debounceDelay: settings?.debounceDelay ?? defaultSettings.debounceDelay,
        debouncing,
        execute,
        executing: numberOfExecutions !== 0,
        numberOfExecutions,
        reset,
        throttle,
        throttleDelay: settings?.throttleDelay ?? defaultSettings.throttleDelay,
        throttling,
        wait,
      };
    },
    [
      debounce,
      debouncing,
      execute,
      numberOfExecutions,
      reset,
      settings?.debounceDelay,
      settings?.throttleDelay,
      throttle,
      throttling,
      wait,
    ],
  );
}
