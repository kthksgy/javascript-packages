import { ObjectUnionIntersection } from "@kthksgy/utilities";
import { z } from "zod";

import {
  Access,
  PropertyPathDotNotation,
  PropertyPathSegmentTuple,
  SpecialPropertyPath,
} from "../../types";

import { ExtraPrimitiveType, QueryParameter } from "./base";

type NoSymbol<T> = T extends symbol
  ? never
  : T extends ReadonlyArray<any>
    ? T[number] extends symbol
      ? never
      : T
    : T;

type Value<T extends object, P> = Exclude<Access<T, P>, undefined>;

type Path<T extends object | null = null> = T extends object
  ? NoSymbol<
      | SpecialPropertyPath
      | PropertyPathDotNotation<T, ExtraPrimitiveType>
      | PropertyPathSegmentTuple<T, ExtraPrimitiveType>
    >
  : string | number | ReadonlyArray<string | number>;

export class RangeQueryParameter<V = any> extends QueryParameter {
  value: V;

  constructor(value: V) {
    super();
    this.value = value;
  }
}

/** `startAfter` */
export class AreSelectedFromAfter<V> extends RangeQueryParameter<V> {
  static x<
    T extends z.Schema,
    P extends Path<z.output<T>>,
    V extends Value<ObjectUnionIntersection<z.output<T>>, P>,
  >(_: { (..._: Array<any>): T }, __: P, value: V) {
    return new this(value);
  }
}

/** `endBefore` */
export class AreSelectedFromBefore<V> extends RangeQueryParameter<V> {
  static x<
    T extends z.Schema,
    P extends Path<z.output<T>>,
    V extends Value<ObjectUnionIntersection<z.output<T>>, P>,
  >(_: { (..._: Array<any>): T }, __: P, value: V) {
    return new this(value);
  }
}

/** `endAt` */
export class AreSelectedFromNotAfter<V> extends RangeQueryParameter<V> {
  static x<
    T extends z.Schema,
    P extends Path<z.output<T>>,
    V extends Value<ObjectUnionIntersection<z.output<T>>, P>,
  >(_: { (..._: Array<any>): T }, __: P, value: V) {
    return new this(value);
  }
}

/** `startAt` */
export class AreSelectedFromNotBefore<V> extends RangeQueryParameter<V> {
  static x<
    T extends z.Schema,
    P extends Path<z.output<T>>,
    V extends Value<ObjectUnionIntersection<z.output<T>>, P>,
  >(_: { (..._: Array<any>): T }, __: P, value: V) {
    return new this(value);
  }
}
