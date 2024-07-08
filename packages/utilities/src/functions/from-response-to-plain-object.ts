/**
 * `Response`をプレーンオブジェクトに変換する。
 * ボディを既に読み込んでいる場合は引数に渡す事で戻り値に含められる。
 * @param response レスポンス
 * @param body ボディ(既に読み込み済みの場合)
 * @returns プレーンオブジェクト
 */
export async function fromResponseToPlainObject(response: Response, body?: unknown) {
  const output = {
    body: <unknown>undefined,
    headers: Array.from(response.headers.entries()),
    redirected: response.redirected,
    status: response.status,
    statusText: response.statusText,
    type: response.type,
    url: response.url,
  };

  // 可能であればボディを読み込む。
  try {
    body = response.bodyUsed ? body : await response.text();
    if (typeof body === 'string' && body.length > 0) {
      body = JSON.parse(body);
    }
  } finally {
    output.body = body;
  }

  return output;
}
