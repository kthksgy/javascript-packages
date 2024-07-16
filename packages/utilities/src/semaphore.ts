import { createPromise } from './create-promise';

/**
 * # セマフォ
 * 同時に実行する数を制限しながら非同期処理を実行する。
 */
export class Semaphore {
  /** 最大実行数 */
  private maxExecutions: number;
  /** 現在の実行数 */
  private numberOfExecutions: number;
  /** 実行キュー */
  private queue: Array<
    Readonly<{
      execute: { (): Promise<any> };
      reject: { (reason?: any): void };
      resolve: { (value: any | PromiseLike<any>): void };
    }>
  >;

  /**
   * @param maxExecutions 最大実行数
   */
  constructor(maxExecutions: number) {
    this.maxExecutions = maxExecutions;
    this.numberOfExecutions = 0;
    this.queue = [];

    this.execute = this.execute.bind(this);
    this.getMaxExecutions = this.getMaxExecutions.bind(this);
    this.getNumberOfExecutions = this.getNumberOfExecutions.bind(this);
    this.run = this.run.bind(this);
    this.setMaxExecutions = this.setMaxExecutions.bind(this);
  }

  /**
   * 非同期処理を実行する。
   * @param execute 実行する非同期処理
   * @returns `execute`の戻り値
   */
  async execute<T>(execute: { (): Promise<T> }): Promise<T> {
    const { promise, reject, resolve } = createPromise<T>();
    this.queue.push({ execute, resolve, reject });

    // 最大実行数に達していない場合は新たに実行サイクルを開始する。
    if (this.numberOfExecutions < this.maxExecutions) {
      /* await */ this.run(); // `await`はしない。
    }

    return promise;
  }

  /**
   * @returns 最大実行数
   */
  getMaxExecutions() {
    return this.maxExecutions;
  }

  /**
   * @returns 現在の実行数
   */
  getNumberOfExecutions() {
    return this.numberOfExecutions;
  }

  /**
   * 実行サイクルを開始する。
   */
  private async run() {
    while (this.queue.length > 0 && this.numberOfExecutions < this.maxExecutions) {
      const { execute, resolve, reject } = this.queue.shift()!;
      try {
        this.numberOfExecutions++;
        const value = await execute();
        resolve(value);
      } catch (reason) {
        reject(reason);
      } finally {
        this.numberOfExecutions--;
      }
    }
  }

  /**
   * 最大実行数を設定する。実行中の場合は自動で追加の実行サイクルを開始する。
   * @param maxExecutions 最大実行数
   */
  setMaxExecutions(maxExecutions: number) {
    this.maxExecutions = maxExecutions;

    // 実行中の場合は実行数を増やす。
    if (this.numberOfExecutions > 0) {
      for (let i = this.maxExecutions - this.numberOfExecutions; i > 0; i--) {
        /* await */ this.run(); // `await`はしない。
      }
    }
  }
}
