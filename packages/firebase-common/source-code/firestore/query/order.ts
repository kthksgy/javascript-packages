import { QueryParameter } from "./base";
import { type DocumentData, type DocumentDataSchema, type Path } from "./types";

type Direction = "ascending" | "descending";

export class OrderQueryParameter<
  P extends Path = Path,
  D extends Direction = Direction,
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

export function orderBy<
  S extends DocumentDataSchema,
  P extends Path<DocumentData<S>>,
  D extends Direction,
>(_: S | { (..._: Array<any>): S }, path: P, direction = "ascending" as D) {
  return new OrderQueryParameter(path, direction);
}
