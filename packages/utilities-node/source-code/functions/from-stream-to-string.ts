import { Stream } from "node:stream";

export async function fromStreamToString(
  stream: Stream.Readable | Stream.Writable | null | undefined,
  options?: { encoding?: BufferEncoding },
) {
  if (stream) {
    const chunks: Array<Uint8Array> = [];
    return await new Promise<string>(function (resolve, reject) {
      stream.on("data", function (chunk) {
        chunks.push(Buffer.from(chunk));
      });
      stream.on("end", function () {
        resolve(Buffer.concat(chunks).toString(options?.encoding ?? "utf8"));
      });
      stream.on("error", function (error) {
        reject(error);
      });
    });
  } else {
    return "";
  }
}
