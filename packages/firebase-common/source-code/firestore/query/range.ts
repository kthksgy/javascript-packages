import { ObjectUnionIntersection } from "@kthksgy/utilities";

import { QueryParameter } from "./base";
import { type DocumentData, type DocumentDataSchema, type Path, type Value } from "./types";

export class RangeQueryParameter<V = any> extends QueryParameter {
  value: V;

  constructor(value: V) {
    super();
    this.value = value;
  }
}

/** `startAfter` */
export class AreSelectedFromAfter<V> extends RangeQueryParameter<V> {
  static create<
    S extends DocumentDataSchema,
    P extends Path<DocumentData<S>>,
    V extends Value<ObjectUnionIntersection<DocumentData<S>>, P>,
  >(_: S | { (..._: Array<any>): S }, __: P, value: V) {
    return new this(value);
  }
}

/** `endBefore` */
export class AreSelectedFromBefore<V> extends RangeQueryParameter<V> {
  static create<
    S extends DocumentDataSchema,
    P extends Path<DocumentData<S>>,
    V extends Value<ObjectUnionIntersection<DocumentData<S>>, P>,
  >(_: S | { (..._: Array<any>): S }, __: P, value: V) {
    return new this(value);
  }
}

/** `endAt` */
export class AreSelectedFromNotAfter<V> extends RangeQueryParameter<V> {
  static create<
    S extends DocumentDataSchema,
    P extends Path<DocumentData<S>>,
    V extends Value<ObjectUnionIntersection<DocumentData<S>>, P>,
  >(_: S | { (..._: Array<any>): S }, __: P, value: V) {
    return new this(value);
  }
}

/** `startAt` */
export class AreSelectedFromNotBefore<V> extends RangeQueryParameter<V> {
  static create<
    S extends DocumentDataSchema,
    P extends Path<DocumentData<S>>,
    V extends Value<ObjectUnionIntersection<DocumentData<S>>, P>,
  >(_: S | { (..._: Array<any>): S }, __: P, value: V) {
    return new this(value);
  }
}
