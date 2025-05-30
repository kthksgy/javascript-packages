import { type ObjectUnionIntersection } from "@kthksgy/utilities";

import { QueryParameter } from "./base";
import { type DocumentData, type DocumentDataSchema, type Path, type Value } from "./types";

export type FieldFilterQueryParameterType =
  | "!="
  | "<"
  | "<="
  | "=="
  | ">"
  | ">="
  | "array-contains-any"
  | "array-contains"
  | "in"
  | "not-in";

export type CompositeFilterQueryParameterType = "and" | "or";

export class FilterQueryParameter extends QueryParameter {}

/**
 * #### フィールドフィルタークエリパラメータ
 * フィールドに対するフィルターを表すクエリパラメータ。
 * ネイティブの`where()`に相当する。
 */
export class FieldFilterQueryParameter<
  P extends Path = Path,
  Type extends FieldFilterQueryParameterType = FieldFilterQueryParameterType,
  V = any,
> extends FilterQueryParameter {
  /** パス */
  readonly path: P;
  /** タイプ */
  readonly type: Type;
  /** 値 */
  readonly value: V;

  constructor(path: P, type: Type, value: V) {
    super();
    this.path = path;
    this.type = type;
    this.value = value;
  }
}

/**
 * #### コンポジットフィルタークエリパラメータ
 * フィルターを組み合わせるためのクエリパラメータ。
 * ネイティブの`and()`または`or()`に相当する。
 */
export class CompositeFilterQueryParameter<
  Type extends CompositeFilterQueryParameterType = CompositeFilterQueryParameterType,
  Filters extends ReadonlyArray<FilterQueryParameter> = ReadonlyArray<FilterQueryParameter>,
> extends FilterQueryParameter {
  /** フィルター */
  readonly filters: Filters;
  /** タイプ */
  readonly type: CompositeFilterQueryParameterType;

  constructor(type: Type, ...filters: Filters) {
    super();
    this.filters = filters;
    this.type = type;
  }
}

export function createCompositeFilterQueryParameter<
  Filters extends ReadonlyArray<FilterQueryParameter>,
>(type: CompositeFilterQueryParameterType, ...filters: Filters) {
  return new CompositeFilterQueryParameter(type, ...filters);
}

export function createFieldFilterQueryParameter<
  S extends DocumentDataSchema,
  P extends Path<DocumentData<S>>,
  Type extends FieldFilterQueryParameterType,
  V extends Type extends "in" | "not-in"
    ? ReadonlyArray<Value<ObjectUnionIntersection<DocumentData<S>>, P>>
    : Type extends "array-contains"
      ? Value<ObjectUnionIntersection<DocumentData<S>>, P> extends ReadonlyArray<any>
        ? Value<ObjectUnionIntersection<DocumentData<S>>, P>[number]
        : never
      : Value<ObjectUnionIntersection<DocumentData<S>>, P>,
>(_: S | { (..._: Array<any>): S }, path: P, type: Type, value: V) {
  return new FieldFilterQueryParameter(path, type, value);
}

export function and<Filters extends ReadonlyArray<FilterQueryParameter>>(...filters: Filters) {
  return new CompositeFilterQueryParameter("and", ...filters);
}

export function or<Filters extends ReadonlyArray<FilterQueryParameter>>(...filters: Filters) {
  return new CompositeFilterQueryParameter("or", ...filters);
}

export function where<Type extends FieldFilterQueryParameterType>(
  path: string | ReadonlyArray<string>,
  type: FieldFilterQueryParameterType,
  value: Type extends "in" | "not-in" ? ReadonlyArray<any> : any,
) {
  return new FieldFilterQueryParameter(path, type, value);
}
