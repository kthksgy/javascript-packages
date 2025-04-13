import { ObjectUnionIntersection } from "@kthksgy/utilities";

import { QueryParameter } from "./base";
import { type DocumentData, type DocumentDataSchema, type Path, type Value } from "./types";

type AbstractDocumentSnapshot = { ref: any };

export type BoundType1 = "exclusive" | "inclusive";
export type BoundType2 = "after" | "before";

export class RangeQueryParameter<
  Type1 extends BoundType1 = BoundType1,
  Type2 extends BoundType2 = BoundType2,
  V = any,
> extends QueryParameter {
  value: V;
  readonly type1: Type1;
  readonly type2: Type2;

  constructor(type1: Type1, type2: Type2, value: V) {
    super();
    this.type1 = type1;
    this.type2 = type2;
    this.value = value;
  }
}

/**
 * #### ページクエリパラメータ
 */
export class PageQueryParameter<
  Type1 extends BoundType1 = BoundType1,
  Type2 extends BoundType2 = BoundType2,
> extends QueryParameter {
  /** カーソル */
  cursor: AbstractDocumentSnapshot;
  /** タイプ */
  readonly type1: Type1;
  readonly type2: Type2;

  constructor(type1: Type1, type2: Type2, cursor: AbstractDocumentSnapshot) {
    super();
    this.cursor = cursor;
    this.type1 = type1;
    this.type2 = type2;
  }
}

export function endBefore<
  S extends DocumentDataSchema,
  P extends Path<DocumentData<S>>,
  V extends Value<ObjectUnionIntersection<DocumentData<S>>, P>,
>(_: S | { (..._: Array<any>): S }, __: P, value: V): RangeQueryParameter<"exclusive", "before", V>;
export function endBefore(
  documentSnapshot: AbstractDocumentSnapshot,
): PageQueryParameter<"exclusive", "before">;

export function endBefore(
  ...parameters:
    | [AbstractDocumentSnapshot]
    | [DocumentDataSchema | { (..._: ReadonlyArray<any>): DocumentDataSchema }, Path, any]
) {
  if (parameters.length === 1) {
    return new PageQueryParameter("exclusive", "before", parameters[0]);
  } else {
    return new RangeQueryParameter("exclusive", "before", parameters[2]);
  }
}

export function endAt<
  S extends DocumentDataSchema,
  P extends Path<DocumentData<S>>,
  V extends Value<ObjectUnionIntersection<DocumentData<S>>, P>,
>(_: S | { (..._: Array<any>): S }, __: P, value: V): RangeQueryParameter<"inclusive", "before", V>;
export function endAt(
  documentSnapshot: AbstractDocumentSnapshot,
): PageQueryParameter<"inclusive", "before">;

export function endAt(
  ...parameters:
    | [AbstractDocumentSnapshot]
    | [DocumentDataSchema | { (..._: ReadonlyArray<any>): DocumentDataSchema }, Path, any]
) {
  if (parameters.length === 1) {
    return new PageQueryParameter("inclusive", "before", parameters[0]);
  } else {
    return new RangeQueryParameter("inclusive", "before", parameters[2]);
  }
}

export function startAfter<
  S extends DocumentDataSchema,
  P extends Path<DocumentData<S>>,
  V extends Value<ObjectUnionIntersection<DocumentData<S>>, P>,
>(_: S | { (..._: Array<any>): S }, __: P, value: V): RangeQueryParameter<"exclusive", "after", V>;
export function startAfter(
  documentSnapshot: AbstractDocumentSnapshot,
): PageQueryParameter<"exclusive", "after">;
export function startAfter(
  ...parameters:
    | [AbstractDocumentSnapshot]
    | [DocumentDataSchema | { (..._: ReadonlyArray<any>): DocumentDataSchema }, Path, any]
) {
  if (parameters.length === 1) {
    return new PageQueryParameter("exclusive", "after", parameters[0]);
  } else {
    return new RangeQueryParameter("exclusive", "after", parameters[2]);
  }
}

export function startAt<
  S extends DocumentDataSchema,
  P extends Path<DocumentData<S>>,
  V extends Value<ObjectUnionIntersection<DocumentData<S>>, P>,
>(_: S | { (..._: Array<any>): S }, __: P, value: V): RangeQueryParameter<"inclusive", "after", V>;
export function startAt(
  documentSnapshot: AbstractDocumentSnapshot,
): PageQueryParameter<"inclusive", "after">;
export function startAt(
  ...parameters:
    | [AbstractDocumentSnapshot]
    | [DocumentDataSchema | { (..._: ReadonlyArray<any>): DocumentDataSchema }, Path, any]
) {
  if (parameters.length === 1) {
    return new PageQueryParameter("inclusive", "after", parameters[0]);
  } else {
    return new RangeQueryParameter("inclusive", "after", parameters[2]);
  }
}
