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
    ? aStack + "\n" + bStack.slice(bStack.indexOf("\n") + 1)
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
 * アプリケーションエラー
 * `Error`に情報を追加した独自のエラークラス。
 */
export class ApplicationError<Code extends string = string> extends Error {
  /**
   * #### 属性
   * このアプリケーションエラー固有の情報を持つためのフィールド。
   * 一般ユーザーに対しても公開される可能性があるため、秘密情報は含めない。
   */
  attributes?: ApplicationErrorAttributes;
  /** コード */
  code: Code;
  /** タイムスタンプ */
  timeStamp: Temporal.ZonedDateTime;

  constructor(code: Code, options?: ApplicationErrorOptions) {
    super(options?.message, options);

    this.attributes = options?.attributes;
    this.code = code;
    this.timeStamp = options?.timeStamp ?? Temporal.Now.zonedDateTimeISO();

    this.name = "ApplicationError[" + this.code + "]";
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

  toJSON() {
    return {
      attributes: this.attributes,
      code: this.code,
      message: this.message,
      timeStamp: this.timeStamp.toString(), // `Temporal.ZonedDateTime`は`.toJSON()`が実装されている。
    };
  }

  toObject() {
    return this.toJSON();
  }

  toString() {
    return (
      this.name +
      (this.message ? ": " + this.message : "") +
      (this.attributes ? " " + JSON.stringify(this.attributes) : "") +
      " @ " +
      this.timeStamp.toString()
    );
  }

  /** 既定のコード */
  static readonly DEFAULT_CODE = "APPLICATION_ERROR";

  static fromObject(target: ReturnType<ApplicationError["toObject"]>) {
    if (target === null || typeof target !== "object") {
      return new ApplicationError(ApplicationError.DEFAULT_CODE, {
        cause: target,
        message: `${JSON.stringify(target)} is not an object.`,
      });
    }

    let attributes;
    try {
      attributes = JSON.parse(JSON.stringify(target.attributes));
    } catch (error) {
      return new ApplicationError(ApplicationError.DEFAULT_CODE, {
        cause: error,
        message: `${JSON.stringify(target.attributes)} is not a valid JSON.`,
      });
    }
    if (attributes === null || typeof attributes !== "object") {
      return new ApplicationError(ApplicationError.DEFAULT_CODE, {
        cause: target.attributes,
        message: `${JSON.stringify(target.attributes)} is not an object.`,
      });
    }

    const message = target.message;
    if (typeof message !== "string") {
      throw new ApplicationError(ApplicationError.DEFAULT_CODE, {
        cause: target.message,
        message: `${JSON.stringify(target.message)} is not a string.`,
      });
    }

    let timeStamp;
    try {
      timeStamp = Temporal.ZonedDateTime.from(target.timeStamp);
    } catch (error) {
      return new ApplicationError(ApplicationError.DEFAULT_CODE, {
        cause: error,
        message: `${JSON.stringify(target.timeStamp)} is not a valid date.`,
      });
    }

    return new ApplicationError(target.code, { attributes, message, timeStamp });
  }
}

type O = Partial<{ [K in string]: V }>;
type A = Array<V> | ReadonlyArray<V>;
type V = string | number | boolean | A | O | null;

/** アプリケーションエラー属性 */
export type ApplicationErrorAttributes = Partial<Record<string, V>>;

/**
 * アプリケーションエラーオプション
 */
export interface ApplicationErrorOptions extends ErrorOptions {
  /** 属性 */
  attributes?: ApplicationErrorAttributes;
  /** メッセージ */
  message?: string;
  /** タイムスタンプ */
  timeStamp?: Temporal.ZonedDateTime;
}
