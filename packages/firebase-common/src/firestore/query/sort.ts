import { z } from "zod";

import {
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

type Path<T extends object | null = null> = T extends object
  ? NoSymbol<
      | SpecialPropertyPath
      | PropertyPathDotNotation<T, ExtraPrimitiveType>
      | PropertyPathSegmentTuple<T, ExtraPrimitiveType>
    >
  : string | number | ReadonlyArray<string | number>;

type Direction = "ascending" | "descending";

export class SortQueryParameter<
  P extends Path = any,
  D extends Direction = any,
> extends QueryParameter {
  /** 方向 */
  direction: Direction;
  /** パス */
  path: P;

  constructor(path: P, direction: D) {
    super();
    this.direction = direction;
    this.path = path;
  }
}

/** `orderBy` */
export class AreOrderedBy<P extends Path, D extends Direction> extends SortQueryParameter<P, D> {
  static x<T extends z.Schema, P extends Path<z.output<T>>, D extends Direction>(
    _: { (..._: Array<any>): T },
    path: P,
    direction: D,
  ) {
    return new this(path, direction);
  }
}
