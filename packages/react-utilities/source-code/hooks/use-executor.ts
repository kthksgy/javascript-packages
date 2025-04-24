import { useCallback, useMemo, useState } from "react";

export type ExecutorError = Error;

export type ExecutorSettings = {
  onError: { (error: any): { error: ExecutorError; promise: Promise<void> } };
};

let defaultSettings = {
  onError(error) {
    return { error: new Error(undefined, { cause: error }), promise: Promise.resolve() };
  },
} satisfies ExecutorSettings;

export function setDefaultExecutorSettings(settings: Partial<ExecutorSettings>) {
  return (defaultSettings = {
    onError: settings.onError ?? defaultSettings.onError,
  } satisfies ExecutorSettings);
}

/**
 * 非同期処理を実行するためのユーティリティを取得する。
 * @returns ユーティリティオブジェクト
 */
export function useExecutor() {
  const [numberOfExecutions, setNumberOfExecutions] = useState(0);
  const [error, setError] = useState<ExecutorError>();

  const execute = useCallback(async function (process: { (): Promise<unknown> }) {
    try {
      setNumberOfExecutions(function (numberOfExecutions) {
        return numberOfExecutions + 1;
      });
      return await process();
    } catch (error) {
      const { error: executorError, promise } = defaultSettings.onError(error);
      setError(executorError);
      await promise;
      return executorError;
    } finally {
      setNumberOfExecutions(function (numberOfExecutions) {
        return numberOfExecutions - 1;
      });
    }
  }, []);

  const wait = useCallback(
    function (promise: Promise<any>) {
      execute(async function () {
        await promise;
      });
    },
    [execute],
  );

  return useMemo(
    () => ({ error, execute, executing: numberOfExecutions !== 0, numberOfExecutions, wait }),
    [error, execute, numberOfExecutions, wait],
  );
}
