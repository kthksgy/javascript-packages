import { QueryParameter } from "./base";
import { type DocumentData, type DocumentDataSchema, type Path } from "./types";

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
  static create<S extends DocumentDataSchema, P extends Path<DocumentData<S>>, D extends Direction>(
    _: S | { (..._: Array<any>): S },
    path: P,
    direction: D,
  ) {
    return new this(path, direction);
  }
}
