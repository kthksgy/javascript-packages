import { ObjectUnionIntersection } from "@kthksgy/utilities";

import { QueryParameter } from "./base";
import { type DocumentData, type DocumentDataSchema, type Path, type Value } from "./types";

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
  static create<
    S extends DocumentDataSchema,
    P extends Path<DocumentData<S>>,
    Vs extends ReadonlyArray<Value<ObjectUnionIntersection<DocumentData<S>>, P>>,
  >(_: S | { (..._: Array<any>): S }, path: P, values: Vs) {
    return new this(path, values);
  }
}

/** `where 'array-contains'` */
export class Contains<P extends Path, V> extends ValueQueryParameter<P, V> {
  static create<
    S extends DocumentDataSchema,
    P extends Path<DocumentData<S>>,
    V extends Value<ObjectUnionIntersection<DocumentData<S>>, P>,
  >(_: S | { (..._: Array<any>): S }, path: P, value: V) {
    return new this(path, value);
  }
}

/** `where '=='` */
export class IsEqualTo<P extends Path, V> extends ValueQueryParameter<P, V> {
  static create<
    S extends DocumentDataSchema,
    P extends Path<DocumentData<S>>,
    V extends Value<ObjectUnionIntersection<DocumentData<S>>, P>,
  >(_: S | { (..._: Array<any>): S }, path: P, value: V) {
    return new this(path, value);
  }
}

/** `where '>='` */
export class IsGreaterThanOrEqualTo<P extends Path, V> extends ValueQueryParameter<P, V> {
  static create<
    S extends DocumentDataSchema,
    P extends Path<DocumentData<S>>,
    V extends Value<ObjectUnionIntersection<DocumentData<S>>, P>,
  >(_: S | { (..._: Array<any>): S }, path: P, value: V) {
    return new this(path, value);
  }
}

/** `where '>'` */
export class IsGreaterThan<P extends Path, V> extends ValueQueryParameter<P, V> {
  static create<
    S extends DocumentDataSchema,
    P extends Path<DocumentData<S>>,
    V extends Value<ObjectUnionIntersection<DocumentData<S>>, P>,
  >(_: S | { (..._: Array<any>): S }, path: P, value: V) {
    return new this(path, value);
  }
}

/** `where '<='` */
export class IsLessThanOrEqualTo<P extends Path, V> extends ValueQueryParameter<P, V> {
  static create<
    S extends DocumentDataSchema,
    P extends Path<DocumentData<S>>,
    V extends Value<ObjectUnionIntersection<DocumentData<S>>, P>,
  >(_: S | { (..._: Array<any>): S }, path: P, value: V) {
    return new this(path, value);
  }
}

/** `where '<'` */
export class IsLessThan<P extends Path, V> extends ValueQueryParameter<P, V> {
  static create<
    S extends DocumentDataSchema,
    P extends Path<DocumentData<S>>,
    V extends Value<ObjectUnionIntersection<DocumentData<S>>, P>,
  >(_: S | { (..._: Array<any>): S }, path: P, value: V) {
    return new this(path, value);
  }
}

/** `where '!='` */
export class IsNotEqualTo<P extends Path, V> extends ValueQueryParameter<P, V> {
  static create<
    S extends DocumentDataSchema,
    P extends Path<DocumentData<S>>,
    V extends Value<ObjectUnionIntersection<DocumentData<S>>, P>,
  >(_: S | { (..._: Array<any>): S }, path: P, value: V) {
    return new this(path, value);
  }
}

/** `where 'not-in'` */
export class IsNotOneOf<P extends Path, Vs extends ReadonlyArray<any>> extends ArrayQueryParameter<
  P,
  Vs
> {
  static create<
    S extends DocumentDataSchema,
    P extends Path<DocumentData<S>>,
    Vs extends ReadonlyArray<Value<ObjectUnionIntersection<DocumentData<S>>, P>>,
  >(_: S | { (..._: Array<any>): S }, path: P, values: Vs) {
    return new this(path, values);
  }
}

/** `where 'in'` */
export class IsOneOf<P extends Path, Vs extends ReadonlyArray<any>> extends ArrayQueryParameter<
  P,
  Vs
> {
  static create<
    S extends DocumentDataSchema,
    P extends Path<DocumentData<S>>,
    Vs extends ReadonlyArray<Value<ObjectUnionIntersection<DocumentData<S>>, P>>,
  >(_: S | { (..._: Array<any>): S }, path: P, values: Vs) {
    return new this(path, values);
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
