/**
 * エラーオブジェクトのスタック文字列を結合する。
 * @param a エラーオブジェクトA
 * @param b エラーオブジェクトB
 * @returns スタック
 */
function concatenateStacks(a: unknown, b: unknown) {
  /** エラーオブジェクトAのスタック文字列 */
  const aStack = typeof a === 'string' && a.length > 0 ? a : hasStack(a) ? a.stack : undefined;
  /** エラーオブジェクトBのスタック文字列 */
  const bStack = typeof b === 'string' && b.length > 0 ? b : hasStack(b) ? b.stack : undefined;

  return aStack && bStack
    ? aStack + '\n' + bStack.slice(bStack.indexOf('\n') + 1)
    : aStack ?? bStack;
}

/**
 * インスタンスがスタック文字列を持つかどうかを判定する。
 * @param instance インスタンス
 * @returns スタック文字列を持つ場合、`true`
 */
function hasStack<T>(instance: T): instance is T & { stack: string } {
  return (
    instance !== null &&
    typeof instance === 'object' &&
    'stack' in instance &&
    typeof instance.stack === 'string' &&
    instance.stack.length > 0
  );
}

/**
 * 属性をサニタイズして、JSONオブジェクトである事を保証する。
 * @param attributes 属性
 * @returns サニタイズされた属性
 */
function sanitizeAttributes(attributes: unknown) {
  if (typeof attributes !== 'object' || attributes === null) {
    return undefined;
  }

  return JSON.parse(JSON.stringify(attributes));
}

/**
 * ミスハップ
 * 通常の例外と区別するための独自の例外クラス。
 */
export class Mishap extends Error {
  /**
   * #### 属性
   * このミスハップ固有の情報を持つためのフィールド。
   * 一般ユーザーに対しても公開される可能性があるため、秘密情報は含めない。
   */
  attributes?: MishapAttributes;
  /** コード */
  code: string;
  /** タイムスタンプ */
  timestamp: Date;

  constructor(code: string, options?: MishapOptions) {
    super(options?.message, options);

    this.attributes = sanitizeAttributes(options?.attributes);
    this.code = code;
    this.timestamp = options?.timestamp ?? new Date();

    this.name = 'Mishap[' + this.code + ']';
    this.stack = concatenateStacks(this, options?.cause);
  }

  /**
   * 原因リスト
   * このインスタンスの原因となったインスタンスを祖先を先頭にして返す。
   */
  get causes() {
    const causes = new Set();
    let cause: any = this.cause;
    while (cause !== undefined) {
      if (causes.has(cause)) {
        break;
      }

      causes.add(cause);

      if (typeof cause === 'object' && cause !== null && 'cause' in cause) {
        cause = cause.cause;
      } else {
        break;
      }
    }

    return Array.from(causes).reverse();
  }

  toJSON() {
    return {
      attributes: this.attributes,
      code: this.code,
      message: this.message,
      timestamp: this.timestamp.toISOString(),
    };
  }

  toObject() {
    return this.toJSON();
  }

  toString() {
    return (
      this.name +
      (this.message ? ': ' + this.message : '') +
      (this.attributes ? ' ' + JSON.stringify(this.attributes) : '') +
      ' @ ' +
      this.timestamp.toISOString()
    );
  }

  /** 既定のコード */
  static readonly DEFAULT_CODE = 'MISHAP';

  static fromObject(instance: any) {
    try {
      if (typeof instance !== 'object' || instance === null) {
        throw new Mishap(Mishap.DEFAULT_CODE, {
          cause: instance,
          message: `${JSON.stringify(instance)} is not an object.`,
        });
      }

      const attributes = sanitizeAttributes(instance.attributes);

      const message = instance.message;
      if (typeof message !== 'string') {
        throw new Mishap(Mishap.DEFAULT_CODE, {
          cause: instance.message,
          message: `${JSON.stringify(message)} is not a string.`,
        });
      }

      const timestamp = new Date(instance.timestamp);
      if (Number.isSafeInteger(timestamp.getTime())) {
        throw new Mishap(Mishap.DEFAULT_CODE, {
          cause: instance.timestamp,
          message: `${JSON.stringify(instance.timestamp)} is not a valid date.`,
        });
      }

      return new Mishap(instance.code, { attributes, message, timestamp });
    } catch (error) {
      if (error instanceof Mishap) {
        return error;
      } else {
        return new Mishap(Mishap.DEFAULT_CODE, {
          cause: error,
          message: `Mishap.fromObject(${JSON.stringify(instance)}) failed.`,
        });
      }
    }
  }

  /**
   * `Response`から生成する。
   * @param response レスポンス
   * @param body ボディ(既に読み込み済みの場合)
   * @returns ミスハップ
   */
  static async fromResponse(response: Response, body?: unknown) {
    const cause = {
      body: <any>undefined,
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
      cause.body = body;
    }

    return new Mishap(Mishap.DEFAULT_CODE, { cause: new Error(JSON.stringify(cause)) });
  }
}

type JsonObject = { [Key in string]: JsonValue } & { [Key in string]?: JsonValue | undefined };
type JsonArray = JsonValue[] | readonly JsonValue[];
type JsonValue = string | number | boolean | JsonObject | JsonArray | null;

/** ミスハップ属性 */
export type MishapAttributes = Record<string, JsonValue | undefined>;

/**
 * ミスハップオプション
 */
export interface MishapOptions extends ErrorOptions {
  /** 属性 */
  attributes?: MishapAttributes;
  /** メッセージ */
  message?: string;
  /** タイムスタンプ */
  timestamp?: Date;
}
