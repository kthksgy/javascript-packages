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
 * ミスハップ
 * 通常の例外と区別するための独自の例外クラス。
 */
export class Mishap extends Error {
  /** コード */
  code: string;
  /** データ */
  data?: MishapData;
  /** タイムスタンプ */
  timestamp: Date;

  constructor(code: string, message: string, options?: MishapOptions) {
    super(message, options);

    this.code = code || Mishap.defaultCode;
    this.data = options?.data;
    this.timestamp = options?.timestamp ?? new Date();

    this.name = Mishap.name + '[' + this.code + ']';
    this.stack = concatenateStacks(this, options?.cause);
  }

  /**
   * ベースコード
   * 接尾辞を除く基本となるコード。
   * ベースコード同士を比較する事で、異なるインスタンスのエラーの種類を比較できる。
   * @example
   * ```
   * const mishap = new Mishap('code#codeSuffix', ...);
   * console.log(mishap.baseCode); // => 'code'
   * ```
   */
  get baseCode() {
    return this.code.split(Mishap.codeDelimiter, 1)[0];
  }

  /**
   * 原因リスト
   * このインスタンスの原因となったインスタンスを祖先を先頭にして返す。
   */
  get causes() {
    const causes = [];
    let cause: any = this.cause;
    while (cause) {
      causes.unshift(cause);
      cause = 'cause' in cause ? cause.cause : null;
    }
    return causes;
  }

  /** HTTPレスポンスステータスコード */
  get httpStatus() {
    return this.data?.httpStatus;
  }

  /** ネイティブのコード */
  get nativeCode() {
    return this.data?.nativeCode;
  }

  /** ネイティブのメッセージ */
  get nativeMessage() {
    return this.data?.nativeMessage;
  }

  /** コードの区切り文字 */
  static readonly codeDelimiter = '#';
  /** 既定のコード */
  static readonly defaultCode = '???';

  static fromObject(instance?: Record<string, unknown>) {
    if (
      instance &&
      typeof instance === 'object' &&
      typeof instance.code === 'string' &&
      typeof instance.message === 'string' &&
      (instance.data === undefined ||
        (instance.data !== null && typeof instance.data === 'object')) &&
      typeof instance.timestamp === 'number'
    ) {
      return new Mishap(instance.code, instance.message, {
        data: instance.data as MishapData | undefined,
        timestamp: new Date(instance.timestamp),
      });
    } else {
      return new Mishap(
        Mishap.defaultCode,
        '`fromObject`がオブジェクト以外に対して実行されました。',
        { cause: instance },
      );
    }
  }

  static of(code: string, codeSuffix: string, options?: MishapOptions & { message?: string }) {
    if (code.length === 0) {
      console.warn(`コードが空であるため、'${Mishap.defaultCode}'に修正します。`);
      code = Mishap.defaultCode;
    }

    if (codeSuffix.length === 0) {
      console.warn(`接尾辞が空であるため、'${Mishap.codeDelimiter}?'に修正します。`);
      codeSuffix = Mishap.codeDelimiter + '?';
    } else if (!codeSuffix.startsWith(Mishap.codeDelimiter)) {
      console.warn(
        `接尾辞の先頭が区切り文字ではないため、'${Mishap.codeDelimiter}${codeSuffix}'に修正します。`,
      );
      codeSuffix = Mishap.codeDelimiter + codeSuffix;
    }

    return new Mishap(code + codeSuffix, options?.message ?? '', options);
  }
}

export interface MishapData {
  /** HTTPレスポンスステータスコード */
  httpStatus?: number | null;
  /** ネイティブのコード */
  nativeCode?: string | null;
  /** ネイティブのメッセージ */
  nativeMessage?: string | null;
  /** 任意のデータ */
  [key: string]: unknown;
}

/**
 * ミスハップオプション
 */
export interface MishapOptions extends ErrorOptions {
  /** データ */
  data?: MishapData;
  /** タイムスタンプ */
  timestamp?: Date;
}
