import { QueryParameter } from "./base";

type AbstractDocumentSnapshot = { ref: any };

export class PaginationQueryParameter extends QueryParameter {
  /** カーソル */
  cursor: AbstractDocumentSnapshot;

  constructor(cursor: AbstractDocumentSnapshot) {
    super();
    this.cursor = cursor;
  }
}

/** `startAfter + DocumentSnapshot` */
export class ArePaginatedAfter extends PaginationQueryParameter {
  static x(cursor: AbstractDocumentSnapshot) {
    return new this(cursor);
  }
}

/** `endBefore + DocumentSnapshot` */
export class ArePaginatedBefore extends PaginationQueryParameter {
  static x(cursor: AbstractDocumentSnapshot) {
    return new this(cursor);
  }
}

/** `endAt + DocumentSnapshot` */
export class ArePaginatedNotAfter extends PaginationQueryParameter {
  static x(cursor: AbstractDocumentSnapshot) {
    return new this(cursor);
  }
}

/** `startAt + DocumentSnapshot` */
export class ArePaginatedNotBefore extends PaginationQueryParameter {
  static x(cursor: AbstractDocumentSnapshot) {
    return new this(cursor);
  }
}
