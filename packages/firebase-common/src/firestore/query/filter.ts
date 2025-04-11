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

export class FilterQueryParameter extends QueryParameter {}

class ArrayQueryParameter<
  P extends Path,
  Vs extends ReadonlyArray<any>,
> extends FilterQueryParameter {
  /** パス */
  readonly path: P;
  /** 値 */
  readonly values: Vs;

  constructor(path: P, values: Vs) {
    super();
    this.path = path;
    this.values = values;
  }
}
class ValueQueryParameter<P extends Path, V> extends FilterQueryParameter {
  /** パス */
  readonly path: P;
  /** 値 */
  readonly value: V;

  constructor(path: P, value: V) {
    super();
    this.path = path;
    this.value = value;
  }
}

/** `where 'array-contains-any'` */
export class ContainsAnyOf<
  P extends Path,
  Vs extends ReadonlyArray<any>,
> extends ArrayQueryParameter<P, Vs> {
  static x<
    T extends z.Schema,
    P extends Path<z.output<T>>,
    Vs extends ReadonlyArray<Value<ObjectUnionIntersection<z.output<T>>, P>>,
  >(_: { (..._: Array<any>): T }, path: P, value: Vs) {
    return new this(path, value);
  }
}

/** `where 'array-contains'` */
export class Contains<P extends Path, V> extends ValueQueryParameter<P, V> {
  static x<
    T extends z.Schema,
    P extends Path<z.output<T>>,
    V extends Value<ObjectUnionIntersection<z.output<T>>, P>,
  >(_: { (..._: Array<any>): T }, path: P, value: V) {
    return new this(path, value);
  }
}

/** `where '=='` */
export class IsEqualTo<P extends Path, V> extends ValueQueryParameter<P, V> {
  static x<
    T extends z.Schema,
    P extends Path<z.output<T>>,
    V extends Value<ObjectUnionIntersection<z.output<T>>, P>,
  >(_: { (..._: Array<any>): T }, path: P, value: V) {
    return new this(path, value);
  }
}

/** `where '>='` */
export class IsGreaterThanOrEqualTo<P extends Path, V> extends ValueQueryParameter<P, V> {
  static x<
    T extends z.Schema,
    P extends Path<z.output<T>>,
    V extends Value<ObjectUnionIntersection<z.output<T>>, P>,
  >(_: { (..._: Array<any>): T }, path: P, value: V) {
    return new this(path, value);
  }
}

/** `where '>'` */
export class IsGreaterThan<P extends Path, V> extends ValueQueryParameter<P, V> {
  static x<
    T extends z.Schema,
    P extends Path<z.output<T>>,
    V extends Value<ObjectUnionIntersection<z.output<T>>, P>,
  >(_: { (..._: Array<any>): T }, path: P, value: V) {
    return new this(path, value);
  }
}

/** `where '<='` */
export class IsLessThanOrEqualTo<P extends Path, V> extends ValueQueryParameter<P, V> {
  static x<
    T extends z.Schema,
    P extends Path<z.output<T>>,
    V extends Value<ObjectUnionIntersection<z.output<T>>, P>,
  >(_: { (..._: Array<any>): T }, path: P, value: V) {
    return new this(path, value);
  }
}

/** `where '<'` */
export class IsLessThan<P extends Path, V> extends ValueQueryParameter<P, V> {
  static x<
    T extends z.Schema,
    P extends Path<z.output<T>>,
    V extends Value<ObjectUnionIntersection<z.output<T>>, P>,
  >(_: { (..._: Array<any>): T }, path: P, value: V) {
    return new this(path, value);
  }
}

/** `where '!='` */
export class IsNotEqualTo<P extends Path, V> extends ValueQueryParameter<P, V> {
  static x<
    T extends z.Schema,
    P extends Path<z.output<T>>,
    V extends Value<ObjectUnionIntersection<z.output<T>>, P>,
  >(_: { (..._: Array<any>): T }, path: P, value: V) {
    return new this(path, value);
  }
}

/** `where 'not-in'` */
export class IsNotOneOf<P extends Path, Vs extends ReadonlyArray<any>> extends ArrayQueryParameter<
  P,
  Vs
> {
  static x<
    T extends z.Schema,
    P extends Path<z.output<T>>,
    Vs extends ReadonlyArray<Value<ObjectUnionIntersection<z.output<T>>, P>>,
  >(_: { (..._: Array<any>): T }, path: P, value: Vs) {
    return new this(path, value);
  }
}

/** `where 'in'` */
export class IsOneOf<P extends Path, Vs extends ReadonlyArray<any>> extends ArrayQueryParameter<
  P,
  Vs
> {
  static x<
    T extends z.Schema,
    P extends Path<z.output<T>>,
    Vs extends ReadonlyArray<Value<ObjectUnionIntersection<z.output<T>>, P>>,
  >(_: { (..._: Array<any>): T }, path: P, value: Vs) {
    return new this(path, value);
  }
}

/** `and` */
export class FulfillsAllOf<T extends Array<FilterQueryParameter>> extends FilterQueryParameter {
  /** フィルター */
  filters: T;

  constructor(...filters: T) {
    super();
    this.filters = filters;
  }
}

/** `or` */
export class FulfillsAnyOf<T extends Array<FilterQueryParameter>> extends FilterQueryParameter {
  /** フィルター */
  filters: T;

  constructor(...filters: T) {
    super();
    this.filters = filters;
  }
}
