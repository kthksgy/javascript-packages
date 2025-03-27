import { exec } from "node:child_process";
import { type SignalConstants } from "node:os";
import Stream from "node:stream";

import { createPromise } from "@kthksgy/utilities";

import { fromStreamToString } from "./from-stream-to-string";

/**
 * コマンドを実行する。
 * @param command コマンド
 * @param options オプション
 * @returns `[標準入力(0), 標準出力(1), 標準エラー出力(2)]`
 */
export async function execute(
  command: string,
  options?: {
    /** 中断シグナル */
    abortSignal?: AbortSignal;
    /** カレントワーキングディレクトリのパス(既定値: `process.cwd()`) */
    currentWorkingDirectoryPath?: string;
    /** 環境変数(既定値: `process.env`) */
    environmentVariables?: Partial<Record<string, string>>;
    /** グループの識別子 */
    groupIdentity?: number;
    /** ストリームのハンドラー */
    handleStreams?: {
      (
        streams: [
          Stream.Writable | null,
          Stream.Readable | null,
          Stream.Readable | null,
          Stream.Writable | Stream.Readable | null | undefined,
          Stream.Writable | Stream.Readable | null | undefined,
        ],
      ): Promise<void>;
    };
    /** キルシグナル(既定値: `"SIGTERM"`) */
    killSignal?: SignalConstants[keyof SignalConstants];
    /** バッファサイズ(既定値: `1024 * 1024`) */
    maxBuffer?: number;
    /** シェル(既定値: `"/bin/sh"`(Unix), `process.env.ComSpec`(Windows)) */
    shell?: string;
    /** タイムアウト(ミリ秒) */
    timeOut?: number;
    /** ユーザーの識別子 */
    userIdentity?: number;
  },
) {
  const { promise: promise1, reject, resolve } = createPromise<readonly [string, string]>();

  const subprocess = exec(
    command,
    {
      cwd: options?.currentWorkingDirectoryPath,
      env: options?.environmentVariables,
      gid: options?.groupIdentity,
      killSignal: options?.killSignal,
      maxBuffer: options?.maxBuffer,
      shell: options?.shell,
      signal: options?.abortSignal,
      timeout: options?.timeOut,
      uid: options?.userIdentity,
      windowsHide: true,
    },
    function (error, stdout, stderr) {
      if (error) {
        reject(error);
      } else if (!stdout && stderr) {
        reject(new Error(stderr));
      } else {
        resolve([stdout, stderr]);
      }
    },
  );

  const promise2 = fromStreamToString(subprocess.stdin);

  const promise3 = options?.handleStreams?.(subprocess.stdio);

  const [[fd1, fd2], fd0] = await Promise.all([promise1, promise2, promise3]);

  return [fd0 || null, fd1 || null, fd2 || null];
}
