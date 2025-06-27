import { Temporal } from "temporal-polyfill";

/**
 * エラーオブジェクトのスタック文字列を結合する。
 * @param a エラーオブジェクトA
 * @param b エラーオブジェクトB
 * @returns スタック
 */
function concatenateStacks(a: unknown, b: unknown) {
  /** エラーオブジェクトAのスタック文字列 */
  const aStack = typeof a === "string" && a.length > 0 ? a : doesHaveStack(a) ? a.stack : undefined;
  /** エラーオブジェクトBのスタック文字列 */
  const bStack = typeof b === "string" && b.length > 0 ? b : doesHaveStack(b) ? b.stack : undefined;

  return aStack && bStack
    ? aStack + "\n\n" + bStack.slice(bStack.indexOf("\n") + 1)
    : (aStack ?? bStack);
}

/**
 * 対象がスタックを持つかどうかを判定する。
 * @param target 対象
 * @returns `target.stack`が1文字以上の`string`型の時、`true`
 */
function doesHaveStack<T>(target: T): target is T & { stack: string } {
  return (
    target !== null &&
    typeof target === "object" &&
    "stack" in target &&
    typeof target.stack === "string" &&
    target.stack.length > 0
  );
}

/**
 * ユニバーサルエラー
 * `Error`に情報を追加した独自のエラークラス。
 */
export class UniversalError<Code extends string = string> extends Error {
  /** コード */
  code: Code;
  /** 日時 */
  dateTime: Temporal.ZonedDateTime;
  /**
   * **メッセージ2**
   * 用途は決まっていないが、`message1`には開発者向けのメッセージを、
   * `message2`には利用者向けのメッセージを指定するような使い方を想定している。
   */
  message2?: string;
  /**
   * #### プロパティ
   * このユニバーサルエラー固有の情報を持つためのフィールド。
   * 一般ユーザーに対しても公開される可能性があるため、秘密情報は含めない。
   */
  properties?: UniversalErrorProperties;

  constructor(code: Code, options?: UniversalErrorOptions) {
    super(options?.message ?? options?.message1 ?? options?.message2, options);

    this.code = code;
    this.dateTime = options?.dateTime ?? Temporal.Now.zonedDateTimeISO();
    this.message2 = options?.message2;
    this.properties = options?.properties;

    this.name = "UniversalError[" + this.code + "]";
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

      if (typeof cause === "object" && cause !== null && "cause" in cause) {
        cause = cause.cause;
      } else {
        break;
      }
    }

    return Array.from(causes).reverse();
  }

  /**
   * **メッセージ1**
   * 通常のエラーメッセージ。`this.message`と同じ。
   * `message2`と違い、開発者向けのメッセージを想定している。
   */
  get message1() {
    return this.message;
  }
  set message1(message: string) {
    this.message = message;
  }

  toJSON() {
    return {
      code: this.code,
      dateTime: this.dateTime.toString(), // `Temporal.ZonedDateTime`は`.toJSON()`が実装されている。
      // `message1`には秘匿情報が含まれる可能性があるため、標準のJSON化処理には含めない。
      // message1: this.message1,
      message2: this.message2, // メモランダムは存在しない場合がある。
      properties: this.properties, // プロパティは存在しない場合がある。
    };
  }

  toObject(secure = false) {
    return secure ? { ...this.toJSON(), message1: this.message1 } : this.toJSON();
  }

  toString() {
    return (
      this.name +
      (this.message1 ? ": " + this.message1 : "") +
      (this.message2 && this.message2 !== this.message1 ? " " + this.message2 : "") +
      (this.properties ? " " + JSON.stringify(this.properties) : "") +
      " @ " +
      this.dateTime.toString()
    );
  }

  /** 既定のコード */
  static readonly DEFAULT_CODE = "ERROR";

  static fromObject(object: ReturnType<UniversalError["toObject"]>) {
    if (object === null || typeof object !== "object") {
      return new UniversalError(UniversalError.DEFAULT_CODE, {
        cause: object,
        message: `オブジェクト"${JSON.stringify(object)}"がオブジェクトではありません。`,
      });
    }

    const code = object.code;
    if (typeof code !== "string") {
      return new UniversalError(UniversalError.DEFAULT_CODE, {
        cause: object.code,
        message: `コード"${JSON.stringify(object.code)}"が文字列ではありません。`,
      });
    }

    let dateTime;
    try {
      dateTime = Temporal.ZonedDateTime.from(object.dateTime);
    } catch (error) {
      return new UniversalError(UniversalError.DEFAULT_CODE, {
        cause: error,
        message: `日時"${JSON.stringify(object.dateTime)}"が不正です。`,
      });
    }

    let message2;
    if (Object.hasOwn(object, "message2")) {
      message2 = object.message2;
      if (typeof message2 !== "string") {
        throw new UniversalError(UniversalError.DEFAULT_CODE, {
          cause: object.message2,
          message: `メモランダム"${JSON.stringify(object.message2)}"が文字列ではありません。`,
        });
      }
    }

    let properties;
    if (Object.hasOwn(object, "properties")) {
      try {
        properties = JSON.parse(JSON.stringify(object.properties));
      } catch (error) {
        return new UniversalError(UniversalError.DEFAULT_CODE, {
          cause: error,
          message: `プロパティ"${JSON.stringify(object.properties)}"が不正です。`,
        });
      }
      if (properties === null || typeof properties !== "object") {
        return new UniversalError(UniversalError.DEFAULT_CODE, {
          cause: object.properties,
          message: `プロパティ"${JSON.stringify(object.properties)}"がオブジェクトではありません。`,
        });
      }
    }

    return new UniversalError(code, { dateTime, message2, properties });
  }
}

/**
 * ユニバーサルエラーオプション
 */
export interface UniversalErrorOptions extends ErrorOptions {
  /** 日時 */
  dateTime?: Temporal.ZonedDateTime;
  /** メモランダム(共有可能なメッセージ) */
  memorandum?: string;
  /**
   * **メッセージ**
   * 指定されていない場合、自動で`message1`または`message2`が代わりに指定される。
   */
  message?: string;
  /**
   * **メッセージ1**
   * 標準のエラーメッセージ(`Error.message`)と同じ。
   * `message`が指定されている場合、無視される。
   * 指定されていない場合、自動で`message2`が代わりに指定される。
   */
  message1?: string;
  /** メッセージ2 */
  message2?: string;
  /** プロパティ */
  properties?: UniversalErrorProperties;
}

type O = Partial<{ [K in string]: V }>;
type A = Array<V> | ReadonlyArray<V>;
type V = string | number | boolean | A | O | null;

/** ユニバーサルエラープロパティ */
export type UniversalErrorProperties = Partial<Record<string, V>>;
