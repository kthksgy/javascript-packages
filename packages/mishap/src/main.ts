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
  /** キャプション */
  caption?: string;
  /** コード */
  code: string;
  /** HTTPレスポンスステータスコード */
  http?: number;
  /** ラベル */
  label?: string;
  /** パラメーター */
  parameters?: object;
  /** タイムスタンプ */
  timestamp: Date;

  constructor(code: string, options?: MishapOptions) {
    let message: string = code;
    if (options?.caption) {
      message += ' ' + options.caption;
    }
    if (options?.parameters) {
      message += ' ' + JSON.stringify(options.parameters);
    }
    super(message, options);

    this.caption = options?.caption;
    this.code = Mishap.buildCode(code);
    this.http = options?.http;
    this.label = Mishap.buildLabel(options?.label);
    this.parameters = options?.parameters;
    this.timestamp = options?.timestamp ?? new Date();

    this.name = Mishap.name + '[' + this.code + ']';
    this.stack = concatenateStacks(this, options?.cause);
  }

  /**
   * 原因リスト
   * このインスタンスの原因となったインスタンスを祖先を先頭にして返す。
   */
  get causes() {
    const causes = [];
    let cause: any = this.cause;
    while (cause) {
      if (cause !== null && cause !== undefined) {
        causes.unshift(cause);
        if (typeof cause === 'object' && 'cause' in cause) {
          cause = cause.cause;
        } else {
          cause = null;
        }
      } else {
        break;
      }
    }
    return causes;
  }

  /**
   * ラベルを追加する。ラベルのみ異なる新しいインスタンスを返す。
   * @param labels ラベル
   * @returns ラベルのみ異なる新しいインスタンス
   */
  addLabel(...labels: Array<string>) {
    return new Mishap(Mishap.buildCode(this.code), {
      caption: this.caption,
      cause: this.cause,
      http: this.http,
      label: Mishap.buildLabel(this.label, ...labels),
      parameters: this.parameters,
      timestamp: this.timestamp,
    });
  }

  toObject() {
    return {
      caption: this.caption,
      code: this.code,
      http: this.http,
      label: this.label,
      parameters: this.parameters,
      timestamp: this.timestamp.getTime(),
    };
  }

  /** ラベルの区切り文字 */
  static readonly LABEL_DELIMITER = '!';
  /** ラベルの接頭辞 */
  static readonly LABEL_PREFIX = '#';
  /** 既定のコード */
  static readonly DEFAULT_CODE = 'MISHAP';

  /**
   * コードを作成する。
   * @param code 使用可能な文字のみで構成されたコード
   * @returns コード(空文字列の場合は既定のコード)
   */
  static buildCode(code: string | undefined) {
    if (!code || code.includes(Mishap.LABEL_DELIMITER) || code.includes(Mishap.LABEL_PREFIX)) {
      console.warn(
        `コード("${code}")は使用不可能であるため既定のコード("${Mishap.DEFAULT_CODE}")を使用します。`,
      );
      return Mishap.DEFAULT_CODE;
    } else {
      return code;
    }
  }

  /**
   * ラベルを作成する。
   * @param labels ラベルの配列
   * @returns ラベル(空文字列の場合は`undefined`)
   */
  static buildLabel(...labels: Array<string | undefined>) {
    /** ラベル */
    let label = '';
    for (let i = 0; i < labels.length; i++) {
      const l = labels[i];
      if (!l || l.includes(Mishap.LABEL_DELIMITER)) {
        console.warn(`${i + 1}つ目のラベル("${l}")は使用不可能であるため省略します。`);
      } else {
        label += (label.length > 0 ? Mishap.LABEL_DELIMITER : '') + l;
      }
    }
    return label || undefined;
  }

  static fromObject(instance?: Record<string, unknown>) {
    if (
      instance &&
      typeof instance === 'object' &&
      (instance.caption === undefined || typeof instance.caption === 'string') &&
      typeof instance.code === 'string' &&
      (instance.http === undefined || typeof instance.http === 'number') &&
      (instance.label === undefined || typeof instance.label === 'string') &&
      (instance.parameters === undefined ||
        (instance.parameters !== null && typeof instance.parameters === 'object')) &&
      typeof instance.timestamp === 'number'
    ) {
      return new Mishap(instance.code, {
        caption: instance.caption,
        http: instance.http,
        label: instance.label,
        parameters: instance.parameters,
        timestamp: new Date(instance.timestamp),
      });
    } else {
      return new Mishap(Mishap.DEFAULT_CODE, {
        caption: '`fromObject`が意図しない形式です。',
        cause: instance,
        http: 400,
      });
    }
  }
}

/**
 * ミスハップオプション
 */
export interface MishapOptions extends ErrorOptions {
  /**
   * キャプション
   * エラーの説明をする短い文字列。
   * 秘匿情報を含めない。
   */
  caption?: string;
  /** HTTPレスポンスステータスコード */
  http?: number;
  /**
   * パラメーター
   * エラーのパラメーターオブジェクト。
   * 秘匿情報は含めない。
   */
  parameters?: object;
  /**
   * ラベル
   * エラーの初期化位置を埋め込むためのラベル。
   */
  label?: string;
  /** タイムスタンプ */
  timestamp?: Date;
}
