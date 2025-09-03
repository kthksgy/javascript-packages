import { Temporal } from "temporal-polyfill";

/**
 * スタックAにスタックBを重複しないように連結する。
 * @param a スタックA
 * @param b スタックB
 * @returns 新しいスタック
 */
function concatenateStacks2(a: string | undefined, b: string | undefined) {
  if (a && b) {
    const lines = b.split("\n");
    return (
      a
        .split("\n")
        .filter(function (line) {
          return !lines.includes(line);
        })
        .join("\n") + b
    );
  } else {
    return a || b;
  }
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
export class UniversalError<
  Code extends string = typeof UniversalError.DEFAULT_CODE,
> extends Error {
  /** コード */
  code: Code;
  /** 日時 */
  dateTime: Temporal.ZonedDateTime;
  /** **データ** このエラーに関連するデータ。 */
  data?: UniversalErrorData;

  /**
   * @param code エラーコード
   * @param options エラーオプション
   * 文字列を指定した場合、メッセージとして扱う。
   */
  constructor(
    code: Code = UniversalError.DEFAULT_CODE as Code,
    options?: string | UniversalErrorOptions,
  ) {
    if (typeof options === "string") {
      super(options);
      this.code = code;
      this.dateTime = Temporal.Now.zonedDateTimeISO();
    } else {
      super(options?.message, options);
      this.code = code;
      this.dateTime = options?.dateTime ?? Temporal.Now.zonedDateTimeISO();
      if (options?.data) {
        this.data = options.data;
      }
    }

    Object.defineProperty(this, "name", {
      configurable: true,
      enumerable: false,
      value: "UniversalError#" + this.code,
      writable: true,
    });

    if (Object.hasOwn(Error, "captureStackTrace")) {
      Error.captureStackTrace(this, this.constructor);
      if (typeof options !== "string" && doesHaveStack(options?.cause)) {
        this.stack = concatenateStacks2(this.stack, options.cause.stack);
      }
    }
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

      if (typeof cause === "object" && cause !== null && Object.hasOwn(cause, "cause")) {
        cause = cause.cause;
      } else {
        break;
      }
    }

    return Array.from(causes).reverse();
  }

  toObject(secure = false) {
    if (secure) {
      return {
        dateTime: this.dateTime.toString(),
        ...(this.code !== UniversalError.DEFAULT_CODE && { code: this.code }),
        ...(this.data && { data: this.data }),
        ...(this.message.length > 0 && { message: this.message }),
      };
    } else {
      return {
        dateTime: this.dateTime.toString(),
        ...(this.code !== UniversalError.DEFAULT_CODE && { code: this.code }),
        ...(this.data?.public && { data: { public: this.data?.public } }),
      };
    }
  }

  toString() {
    return (
      this.name +
      (this.message ? ": " + this.message : "") +
      (this.data ? " " + JSON.stringify(this.data) : "") +
      " [" +
      this.dateTime.toString() +
      "]"
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

    const code = Object.hasOwn(object, "code") ? object.code : undefined;
    if (code !== undefined && typeof code !== "string") {
      return new UniversalError(UniversalError.DEFAULT_CODE, {
        cause: object.code,
        message: `コード"${JSON.stringify(object.code)}"が文字列ではありません。`,
      });
    }

    let dateTime;
    try {
      if (Object.hasOwn(object, "dateTime")) {
        dateTime = Temporal.ZonedDateTime.from(object.dateTime);
      }
    } catch (error) {
      return new UniversalError(UniversalError.DEFAULT_CODE, {
        cause: error,
        message: `日時"${JSON.stringify(object.dateTime)}"が不正です。`,
      });
    }

    const message = Object.hasOwn(object, "message") ? object.message : undefined;
    if (message !== undefined && typeof message !== "string") {
      return new UniversalError(UniversalError.DEFAULT_CODE, {
        cause: object.message,
        message: `メッセージ"${JSON.stringify(object.message)}"が文字列ではありません。`,
      });
    }

    const data = Object.hasOwn(object, "data") ? object.data : undefined;
    if (data === null || typeof data !== "object") {
      return new UniversalError(UniversalError.DEFAULT_CODE, {
        cause: object.data,
        message: `data(${JSON.stringify(object.data)})がオブジェクトではありません。`,
      });
    }

    return new UniversalError(code, { data, dateTime, message });
  }

  /**
   * このインスタンスを更新し、新しいインスタンスを返す。
   * `options`を省略した場合、`this`を返す。
   * @param options オプション
   * @returns 新しいインスタンスまたは`this`
   */
  renew<NewCode extends string = Code>(
    options?: Readonly<Partial<{ code: NewCode } & Omit<UniversalErrorOptions, "cause">>>,
  ) {
    if (options === undefined) {
      return this;
    } else {
      const error = new UniversalError<Code | NewCode>(options?.code ?? this.code, {
        ...this,
        ...options,
      });
      if (this.stack !== undefined) {
        error.stack = this.stack;
      }
      return error;
    }
  }
}

/**
 * ユニバーサルエラーオプション
 */
export interface UniversalErrorOptions extends ErrorOptions {
  /** データ */
  data?: UniversalErrorData;
  /** 日時 */
  dateTime?: Temporal.ZonedDateTime;
  /** メッセージ */
  message?: string;
}

type O = Partial<{ [K in string]: V }>;
type A = Array<V> | ReadonlyArray<V>;
type V = string | number | boolean | A | O | null;

/** ユニバーサルエラーデータ */
export type UniversalErrorData = Partial<Record<"private" | "public", Record<string, V>>>;
