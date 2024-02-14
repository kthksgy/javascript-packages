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

    this.code = code || Mishap.DEFAULT_CODE;
    this.data = options?.data;
    this.timestamp = options?.timestamp ?? new Date();

    this.name = Mishap.name + '[' + this.code + ']';
    this.stack = concatenateStacks(this, options?.cause);
  }

  /**
   * ベースコード
   * コードフラグメントを除くコードの基幹部分。
   * ベースコード同士を比較する事で、異なるインスタンスのエラーの種類を比較できる。
   * @example
   * ```
   * const mishap = new Mishap('code#codeFragment', ...);
   * console.log(mishap.baseCode); // => 'code'
   * ```
   */
  get baseCode() {
    return this.code.split(Mishap.CODE_FRAGMENT_MARKER, 1)[0];
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

  /** コードフラグメントの区切り文字 */
  static readonly CODE_FRAGMENT_DELIMITER = '!';
  /** コードフラグメントの開始文字 */
  static readonly CODE_FRAGMENT_MARKER = '#';
  /** 既定のコード */
  static readonly DEFAULT_CODE = '???';

  /**
   * コードを作成する。
   * @param code 基幹となるコード
   * @param codeFragments コードフラグメント
   * @returns コード
   */
  static buildCode(code: string, ...codeFragments: Array<string>) {
    if (!code) {
      console.warn(`コード("${code}")の代わりに既定のコード(${Mishap.DEFAULT_CODE})を使用します。`);
      code = Mishap.DEFAULT_CODE;
    }

    if (codeFragments.length > 0) {
      /** コードフラグメント */
      let codeFragment = Mishap.buildCodeFragment(...codeFragments);
      if (
        code.includes(Mishap.CODE_FRAGMENT_MARKER) &&
        codeFragment.startsWith(Mishap.CODE_FRAGMENT_MARKER)
      ) {
        codeFragment = Mishap.CODE_FRAGMENT_DELIMITER + code.slice(1);
      }
    }

    return code;
  }

  /**
   * コードフラグメントを作成する。
   * @param codeFragments コードフラグメント
   * @returns コードフラグメント
   */
  static buildCodeFragment(...codeFragments: Array<string>) {
    /** コードフラグメント */
    let codeFragment = '';
    for (let i = 0; i < codeFragments.length; i++) {
      /** 部分文字列の接頭辞 */
      const prefix = i === 0 ? Mishap.CODE_FRAGMENT_MARKER : Mishap.CODE_FRAGMENT_DELIMITER;

      let suffix = codeFragments[i];
      if (
        suffix.startsWith(Mishap.CODE_FRAGMENT_DELIMITER) ||
        suffix.startsWith(Mishap.CODE_FRAGMENT_MARKER)
      ) {
        suffix = suffix.slice(1);
      }

      if (prefix && suffix) {
        codeFragment += prefix + suffix;
      } else {
        console.warn(`コードフラグメント("${prefix}${suffix}")はコードに追加されませんでした。`);
      }
    }
    return codeFragment;
  }

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
        Mishap.DEFAULT_CODE,
        '`fromObject`がオブジェクト以外に対して実行されました。',
        { cause: instance },
      );
    }
  }

  static of(code: string, codeFragment: string, options?: MishapOptions & { message?: string }) {
    return new Mishap(Mishap.buildCode(code, codeFragment), options?.message ?? '', options);
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
