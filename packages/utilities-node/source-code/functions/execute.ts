import { spawn } from "node:child_process";
import { type SignalConstants } from "node:os";
import { Stream } from "node:stream";

import { isArray } from "@kthksgy/utilities";

/**
 * コマンドを実行する。
 * @param target コマンドまたはコマンドライン引数の配列
 * @param options オプション
 * @returns `[標準入力(0), 標準出力(1), 標準エラー出力(2)]`
 */
export async function execute(
  target: string | Array<string>,
  options?: {
    /** 中断シグナル */
    abortSignal?: AbortSignal;
    /** サブプロセスのストリームを参照するためのコールバック */
    callback?: {
      (
        streams: readonly [
          Stream.Writable | null,
          Stream.Readable | null,
          Stream.Readable | null,
          Stream.Writable | Stream.Readable | null | undefined,
          Stream.Writable | Stream.Readable | null | undefined,
        ],
      ): void;
    };
    /** カレントワーキングディレクトリのパス(既定値: `process.cwd()`) */
    currentWorkingDirectoryPath?: string;
    /** 文字コード(既定値: `"utf8"`) */
    encoding?: BufferEncoding;
    /** 環境変数(既定値: `process.env`) */
    environmentVariables?: Partial<Record<string, string>>;
    /** グループの識別子 */
    groupIdentity?: number;
    /** キルシグナル(既定値: `"SIGTERM"`) */
    killSignal?: SignalConstants[keyof SignalConstants];
    /** ログ出力を行う時は`true`にする。 */
    logging?: boolean;
    /** シェル(既定値: `"/bin/sh"`(Unix), `process.env.ComSpec`(Windows)) */
    shell?: string;
    /** タイムアウト(ミリ秒) */
    timeOut?: number;
    /** ユーザーの識別子 */
    userIdentity?: number;
  },
) {
  const encoding = options?.encoding ?? "utf8";
  const logging = options?.logging ?? false;

  const command = isArray(target) ? target.at(0) : target;
  if (!command) {
    return [null, null, null];
  }

  const subprocess = spawn(command, isArray(target) ? target.slice(1) : [], {
    cwd: options?.currentWorkingDirectoryPath,
    env: options?.environmentVariables,
    gid: options?.groupIdentity,
    killSignal: options?.killSignal,
    shell: options?.shell,
    signal: options?.abortSignal,
    stdio: "pipe", // `["pipe", "pipe", "pipe"]`と同じ。
    timeout: options?.timeOut,
    uid: options?.userIdentity,
    windowsHide: true,
  });

  const handlers = [
    { buffers: [] as Array<Uint8Array>, logger: process.stdout, stream: subprocess.stdin },
    { buffers: [] as Array<Uint8Array>, logger: process.stdout, stream: subprocess.stdout },
    { buffers: [] as Array<Uint8Array>, logger: process.stderr, stream: subprocess.stderr },
  ] as const;

  for (const { buffers, logger, stream } of handlers) {
    stream.on("data", function (chunk) {
      buffers.push(Buffer.from(chunk));
      if (logging) {
        logger.write(chunk);
      }
    });
  }

  if (options?.callback) {
    options.callback(subprocess.stdio);
  }

  await new Promise(function (resolve, reject) {
    subprocess.on("close", function (code) {
      resolve(code);
    });
    subprocess.on("error", function (error) {
      reject(error);
    });
  });

  return [
    Buffer.concat(handlers[0].buffers).toString(encoding) || null,
    Buffer.concat(handlers[1].buffers).toString(encoding) || null,
    Buffer.concat(handlers[2].buffers).toString(encoding) || null,
  ];
}
