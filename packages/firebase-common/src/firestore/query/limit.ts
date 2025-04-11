import { QueryParameter } from "./base";

export class LimitQueryParameter extends QueryParameter {}

/** `limit` */
export class AreLimitedTo<N extends number> extends LimitQueryParameter {
  /** 数 */
  readonly count: N;

  constructor(count: N) {
    super();
    this.count = count;
  }

  static n<N extends number>(count: N) {
    return new AreLimitedTo(count);
  }
}
