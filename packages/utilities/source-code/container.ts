import { UniversalError } from "./universal-error";

/**
 * **コンテナー**
 * 特定の型のインスタンスを保持する。
 */
export class Container<T> {
  private instance?: T;
  private validate: { (instance: any): instance is T };

  constructor(validate: { (instance: any): instance is T }, instance?: T) {
    this.validate = validate;

    this.get = this.get.bind(this);
    this.isInitialized = this.isInitialized.bind(this);
    this.set = this.set.bind(this);

    if (validate(instance)) {
      this.instance = instance;
    }
  }

  static isNotUndefined<T>(instance: any): instance is T {
    return instance !== undefined;
  }

  get() {
    if (this.validate(this.instance)) {
      return this.instance;
    } else {
      throw new UniversalError(undefined, {
        message: "コンテナーが初期化されていません。",
      });
    }
  }

  isInitialized() {
    return this.validate(this.instance);
  }

  set(instance: T) {
    if (this.validate(instance)) {
      this.instance = instance;
    } else {
      throw new UniversalError(undefined, {
        message: "インスタンスの検証に失敗しました。",
      });
    }
  }
}
