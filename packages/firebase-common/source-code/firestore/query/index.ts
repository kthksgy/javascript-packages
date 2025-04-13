import { FilterQueryParameter } from "./filter";
import { LimitQueryParameter } from "./limit";
import { OrderQueryParameter } from "./order";
import { PageQueryParameter, RangeQueryParameter } from "./range";

export * from "./base";
export * from "./filter";
export * from "./limit";
export * from "./order";
export * from "./range";

export interface QueryParameters {
  filters: ReadonlyArray<FilterQueryParameter>;
  limits: ReadonlyArray<LimitQueryParameter>;
  orders: ReadonlyArray<OrderQueryParameter>;
  pages: ReadonlyArray<PageQueryParameter>;
  ranges: ReadonlyArray<RangeQueryParameter>;
}

/**
 * 既定のクエリパラメータを取得する。空の配列を持つオブジェクトを返す。
 * @returns 既定のクエリパラメータ(空の配列を持つオブジェクト)
 */
export function getDefaultQueryParameters() {
  return {
    filters: [] as Array<FilterQueryParameter>,
    limits: [] as Array<LimitQueryParameter>,
    orders: [] as Array<OrderQueryParameter>,
    pages: [] as Array<PageQueryParameter>,
    ranges: [] as Array<RangeQueryParameter>,
  };
}
