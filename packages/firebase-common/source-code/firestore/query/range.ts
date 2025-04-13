import { ObjectUnionIntersection } from "@kthksgy/utilities";

import { QueryParameter } from "./base";
import { type DocumentData, type DocumentDataSchema, type Path, type Value } from "./types";

type AbstractDocumentSnapshot = { ref: any };

export type RangeQueryParameterType = "startAfter" | "startAt" | "endBefore" | "endAt";

export class RangeQueryParameter<
  Type extends RangeQueryParameterType = RangeQueryParameterType,
  V = any,
> extends QueryParameter {
  value: V;
  readonly type: RangeQueryParameterType;

  constructor(type: Type, value: V) {
    super();
    this.type = type;
    this.value = value;
  }
}

/**
 * #### ページクエリパラメータ
 */
export class PageQueryParameter<
  Type extends RangeQueryParameterType = RangeQueryParameterType,
> extends QueryParameter {
  /** カーソル */
  cursor: AbstractDocumentSnapshot;
  /** タイプ */
  readonly type: RangeQueryParameterType;

  constructor(type: Type, cursor: AbstractDocumentSnapshot) {
    super();
    this.cursor = cursor;
    this.type = type;
  }
}

export function endBefore<
  S extends DocumentDataSchema,
  P extends Path<DocumentData<S>>,
  V extends Value<ObjectUnionIntersection<DocumentData<S>>, P>,
>(_: S | { (..._: Array<any>): S }, __: P, value: V): RangeQueryParameter<"endBefore", V>;
export function endBefore(
  documentSnapshot: AbstractDocumentSnapshot,
): PageQueryParameter<"endBefore">;

export function endBefore(
  ...parameters:
    | [AbstractDocumentSnapshot]
    | [DocumentDataSchema | { (..._: ReadonlyArray<any>): DocumentDataSchema }, Path, any]
) {
  if (parameters.length === 1) {
    return new PageQueryParameter("endBefore", parameters[0]);
  } else {
    return new RangeQueryParameter("endBefore", parameters[2]);
  }
}

export function endAt<
  S extends DocumentDataSchema,
  P extends Path<DocumentData<S>>,
  V extends Value<ObjectUnionIntersection<DocumentData<S>>, P>,
>(_: S | { (..._: Array<any>): S }, __: P, value: V): RangeQueryParameter<"endAt", V>;
export function endAt(documentSnapshot: AbstractDocumentSnapshot): PageQueryParameter<"endAt">;

export function endAt(
  ...parameters:
    | [AbstractDocumentSnapshot]
    | [DocumentDataSchema | { (..._: ReadonlyArray<any>): DocumentDataSchema }, Path, any]
) {
  if (parameters.length === 1) {
    return new PageQueryParameter("endAt", parameters[0]);
  } else {
    return new RangeQueryParameter("endAt", parameters[2]);
  }
}

export function startAfter<
  S extends DocumentDataSchema,
  P extends Path<DocumentData<S>>,
  V extends Value<ObjectUnionIntersection<DocumentData<S>>, P>,
>(_: S | { (..._: Array<any>): S }, __: P, value: V): RangeQueryParameter<"startAfter", V>;
export function startAfter(
  documentSnapshot: AbstractDocumentSnapshot,
): PageQueryParameter<"startAfter">;
export function startAfter(
  ...parameters:
    | [AbstractDocumentSnapshot]
    | [DocumentDataSchema | { (..._: ReadonlyArray<any>): DocumentDataSchema }, Path, any]
) {
  if (parameters.length === 1) {
    return new PageQueryParameter("startAfter", parameters[0]);
  } else {
    return new RangeQueryParameter("startAfter", parameters[2]);
  }
}

export function startAt<
  S extends DocumentDataSchema,
  P extends Path<DocumentData<S>>,
  V extends Value<ObjectUnionIntersection<DocumentData<S>>, P>,
>(_: S | { (..._: Array<any>): S }, __: P, value: V): RangeQueryParameter<"startAt", V>;
export function startAt(documentSnapshot: AbstractDocumentSnapshot): PageQueryParameter<"startAt">;
export function startAt(
  ...parameters:
    | [AbstractDocumentSnapshot]
    | [DocumentDataSchema | { (..._: ReadonlyArray<any>): DocumentDataSchema }, Path, any]
) {
  if (parameters.length === 1) {
    return new PageQueryParameter("startAt", parameters[0]);
  } else {
    return new RangeQueryParameter("startAt", parameters[2]);
  }
}
