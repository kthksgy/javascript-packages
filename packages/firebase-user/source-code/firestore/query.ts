import {
  CompositeFilterQueryParameter,
  FieldFilterQueryParameter,
  FilterQueryParameter,
  LimitQueryParameter,
  OrderQueryParameter,
  PageQueryParameter,
  RangeQueryParameter,
} from "@kthksgy/firebase-common/firestore";
import { ApplicationError } from "@kthksgy/utilities";
import {
  DocumentSnapshot,
  FieldPath,
  Timestamp,
  Transaction,
  and as _and,
  endAt as _endAt,
  endBefore as _endBefore,
  limit as _limit,
  or as _or,
  orderBy as _orderBy,
  query as _query,
  startAfter as _startAfter,
  startAt as _startAt,
  where as _where,
  documentId,
  getCountFromServer,
  getDocs,
} from "firebase/firestore";
import { Temporal } from "temporal-polyfill";

import {
  Query,
  QuerySnapshot,
  createCollectionGroupReference,
  createCollectionReference,
} from "./reexports";

function getFilterConstraints(filters: ReadonlyArray<FilterQueryParameter>) {
  const constraints: Array<
    ReturnType<typeof _and> | ReturnType<typeof _or> | ReturnType<typeof _where>
  > = [];
  for (const filter of filters) {
    if (filter instanceof FieldFilterQueryParameter) {
      switch (filter.type) {
        case "!=":
          constraints.push(_where(regulatePath(filter.path), "!=", regulateValue(filter.value)));
          break;
        case "<":
          constraints.push(_where(regulatePath(filter.path), "<", regulateValue(filter.value)));
          break;
        case "<=":
          constraints.push(_where(regulatePath(filter.path), "<=", regulateValue(filter.value)));
          break;
        case "==":
          constraints.push(_where(regulatePath(filter.path), "==", regulateValue(filter.value)));
          break;
        case ">":
          constraints.push(_where(regulatePath(filter.path), ">", regulateValue(filter.value)));
          break;
        case ">=":
          constraints.push(_where(regulatePath(filter.path), ">=", regulateValue(filter.value)));
          break;
        case "array-contains-any":
          constraints.push(
            _where(regulatePath(filter.path), "array-contains-any", regulateValue(filter.value)),
          );
          break;
        case "array-contains":
          constraints.push(
            _where(regulatePath(filter.path), "array-contains", regulateValue(filter.value)),
          );
          break;
          break;
        case "in":
          constraints.push(_where(regulatePath(filter.path), "in", regulateValue(filter.value)));
          break;
        case "not-in":
          constraints.push(
            _where(regulatePath(filter.path), "not-in", regulateValue(filter.value)),
          );
          break;
      }
    } else if (filter instanceof CompositeFilterQueryParameter) {
      switch (filter.type) {
        case "and":
          constraints.push(_and(...getFilterConstraints(filter.filters)));
          break;
        case "or":
          constraints.push(_or(...getFilterConstraints(filter.filters)));
          break;
      }
    }
  }
  return constraints;
}

export function buildQuery(
  reference:
    | Query
    | ReturnType<typeof createCollectionGroupReference>
    | ReturnType<typeof createCollectionReference>,
  parameters: {
    filters: Array<FilterQueryParameter>;
    limits: Array<LimitQueryParameter>;
    orders: Array<OrderQueryParameter>;
    paginations: Array<PageQueryParameter>;
    ranges: Array<RangeQueryParameter>;
  },
) {
  const constraints = [];
  const filter = _and(...getFilterConstraints(parameters.filters));

  for (const sort of parameters.orders) {
    constraints.push(
      _orderBy(regulatePath(sort.path), sort.direction === "descending" ? "desc" : "asc"),
    );
  }

  for (const range of parameters.ranges) {
    switch (range.type) {
      case "endBefore":
        constraints.push(_endBefore(regulateValue(range.value)));
        break;
      case "endAt":
        constraints.push(_endAt(regulateValue(range.value)));
        break;
      case "startAfter":
        constraints.push(_startAfter(regulateValue(range.value)));
        break;
      case "startAt":
        constraints.push(_startAt(regulateValue(range.value)));
        break;
    }
  }

  for (const pagination of parameters.paginations) {
    switch (pagination.type) {
      case "endBefore":
        constraints.push(_endBefore(pagination.cursor));
        break;
      case "endAt":
        constraints.push(_endAt(pagination.cursor));
        break;
      case "startAfter":
        constraints.push(_startAfter(pagination.cursor));
        break;
      case "startAt":
        constraints.push(_startAt(pagination.cursor));
        break;
    }
  }

  {
    const limit = parameters.limits.at(-1);
    if (limit !== undefined) {
      constraints.push(_limit(limit.limit));
    }
  }

  return _query(reference, filter, ...constraints);
}

export async function fetchDocumentCount(query: Query, transaction?: Transaction) {
  if (transaction) {
    throw new ApplicationError(ApplicationError.DEFAULT_CODE, {
      message: "この機能は`firebase`パッケージでは利用できません。",
    });
  } else {
    return (await getCountFromServer(query)).data().count;
  }
}

export async function fetchDocuments(query: Query, transaction?: Transaction) {
  if (transaction) {
    throw new ApplicationError(ApplicationError.DEFAULT_CODE, {
      message: "この機能は`firebase`パッケージでは利用できません。",
    });
  } else {
    return getDocs(query);
  }
}

export function getDocumentDataArray<T extends QuerySnapshot>(querySnapshot: T) {
  return querySnapshot.docs.map(function (documentSnapshot) {
    return documentSnapshot.data({ serverTimestamps: "estimate" });
  });
}

export function getFirstDocumentSnapshot<T extends QuerySnapshot>(querySnapshot: T) {
  return querySnapshot.docs.at(0) ?? null;
}

export function getLastDocumentSnapshot<T extends QuerySnapshot>(querySnapshot: T) {
  return querySnapshot.docs.at(-1) ?? null;
}

/**
 * パスをクエリ制約に適当な形式に変換する。
 * @param path パス
 * @returns パス
 */
function regulatePath(path: any) {
  if (path === "__name__") {
    return documentId();
  } else if (typeof path === "string") {
    return path;
  } else if (
    Array.isArray(path) &&
    path.every(function (segment) {
      return typeof segment === "string";
    })
  ) {
    return new FieldPath(...path);
  } else {
    throw new Error("Invalid path");
  }
}

/**
 * 値をクエリ制約に適当な形式に変換する。
 * @param value 値
 * @returns 値
 */
function regulateValue<T>(value: T): any {
  if (value instanceof DocumentSnapshot) {
    return value;
  } else if (value instanceof Temporal.ZonedDateTime) {
    return new Timestamp(
      value.epochMilliseconds / 1_000,
      value.millisecond * 1_000_000 + value.microsecond * 1_000 + value.nanosecond,
    );
  } else if (Array.isArray(value)) {
    return value.map(regulateValue);
  } else if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(function ([key, value]) {
        return [key, regulateValue(value)];
      }),
    );
  } else {
    return value;
  }
}
