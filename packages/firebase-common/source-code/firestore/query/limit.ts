import { QueryParameter } from "./base";

export class LimitQueryParameter<Limit extends number = number> extends QueryParameter {
  /** 数 */
  readonly limit: Limit;

  constructor(limit: Limit) {
    super();
    this.limit = limit;
  }
}

export function createLimitQueryParameter<Limit extends number>(limit: Limit) {
  return new LimitQueryParameter(limit);
}

export const limit = createLimitQueryParameter;
