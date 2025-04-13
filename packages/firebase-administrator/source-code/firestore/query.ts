import {
  CompositeFilterQueryParameter,
  FieldFilterQueryParameter,
  FilterQueryParameter,
  LimitQueryParameter,
  OrderQueryParameter,
  PageQueryParameter,
  RangeQueryParameter,
} from "@kthksgy/firebase-common/firestore";
import {
  AggregateField,
  DocumentSnapshot,
  Filter,
  Timestamp,
  Transaction,
} from "firebase-admin/firestore";
import { Temporal } from "temporal-polyfill";

import { FieldPath, Query, QuerySnapshot } from "./reexports";
import { createCollectionGroupReference, createCollectionReference } from "./reference";

function getFilterConstraints(filters: ReadonlyArray<FilterQueryParameter>) {
  const constraints: Array<
    ReturnType<typeof Filter.and> | ReturnType<typeof Filter.or> | ReturnType<typeof Filter.where>
  > = [];
  for (const filter of filters) {
    if (filter instanceof FieldFilterQueryParameter) {
      switch (filter.type) {
        case "!=":
          constraints.push(
            Filter.where(regulatePath(filter.path), "!=", regulateValue(filter.value)),
          );
          break;
        case "<":
          constraints.push(
            Filter.where(regulatePath(filter.path), "<", regulateValue(filter.value)),
          );
          break;
        case "<=":
          constraints.push(
            Filter.where(regulatePath(filter.path), "<=", regulateValue(filter.value)),
          );
          break;
        case "==":
          constraints.push(
            Filter.where(regulatePath(filter.path), "==", regulateValue(filter.value)),
          );
          break;
        case ">":
          constraints.push(
            Filter.where(regulatePath(filter.path), ">", regulateValue(filter.value)),
          );
          break;
        case ">=":
          constraints.push(
            Filter.where(regulatePath(filter.path), ">=", regulateValue(filter.value)),
          );
          break;
        case "array-contains-any":
          constraints.push(
            Filter.where(
              regulatePath(filter.path),
              "array-contains-any",
              regulateValue(filter.value),
            ),
          );
          break;
        case "array-contains":
          constraints.push(
            Filter.where(regulatePath(filter.path), "array-contains", regulateValue(filter.value)),
          );
          break;
          break;
        case "in":
          constraints.push(
            Filter.where(regulatePath(filter.path), "in", regulateValue(filter.value)),
          );
          break;
        case "not-in":
          constraints.push(
            Filter.where(regulatePath(filter.path), "not-in", regulateValue(filter.value)),
          );
          break;
      }
    } else if (filter instanceof CompositeFilterQueryParameter) {
      switch (filter.type) {
        case "and":
          constraints.push(Filter.and(...getFilterConstraints(filter.filters)));
          break;
        case "or":
          constraints.push(Filter.or(...getFilterConstraints(filter.filters)));
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
    filters: ReadonlyArray<FilterQueryParameter>;
    limits: ReadonlyArray<LimitQueryParameter>;
    orders: ReadonlyArray<OrderQueryParameter>;
    pages: ReadonlyArray<PageQueryParameter>;
    ranges: ReadonlyArray<RangeQueryParameter>;
  },
) {
  let query: Query = reference;

  query = query.where(Filter.and(...getFilterConstraints(parameters.filters)));

  for (const order of parameters.orders) {
    query = query.orderBy(
      regulatePath(order.path),
      order.direction === "descending" ? "desc" : "asc",
    );
  }

  for (const range of parameters.ranges) {
    switch (range.type1) {
      case "exclusive":
        switch (range.type2) {
          case "after":
            query = query.startAfter(regulateValue(range.value));
            break;
          case "before":
            query = query.endBefore(regulateValue(range.value));
            break;
        }
        break;
      case "inclusive":
        switch (range.type2) {
          case "after":
            query = query.startAt(regulateValue(range.value));
            break;
          case "before":
            query = query.endAt(regulateValue(range.value));
            break;
        }
        break;
    }
  }

  for (const page of parameters.pages) {
    switch (page.type1) {
      case "exclusive":
        switch (page.type2) {
          case "after":
            query = query.startAfter(regulateValue(page.cursor));
            break;
          case "before":
            query = query.endBefore(regulateValue(page.cursor));
            break;
        }
        break;
      case "inclusive":
        switch (page.type2) {
          case "after":
            query = query.startAt(regulateValue(page.cursor));
            break;
          case "before":
            query = query.endAt(regulateValue(page.cursor));
            break;
        }
        break;
    }
  }

  {
    const limit = parameters.limits.at(-1);
    if (limit) {
      query = query.limit(limit.limit);
    }
  }

  return query;
}

export const query = buildQuery;

export async function fetchDocumentCount(query: Query, transaction?: Transaction) {
  if (transaction) {
    return (await transaction.get(query.aggregate({ count: AggregateField.count() }))).data().count;
  } else {
    return (await query.aggregate({ count: AggregateField.count() }).get()).data().count;
  }
}

export async function fetchDocuments(query: Query, transaction?: Transaction) {
  if (transaction) {
    return transaction.get(query);
  } else {
    return query.get();
  }
}

export function getDocumentDataArray<T extends QuerySnapshot>(querySnapshot: T) {
  return querySnapshot.docs.map(function (documentSnapshot) {
    return documentSnapshot.data();
  });
}

export function getFirstDocumentSnapshot<T extends QuerySnapshot>(querySnapshot: T) {
  return querySnapshot.docs.at(0) ?? null;
}

export function getLastDocumentSnapshot<T extends QuerySnapshot>(querySnapshot: T) {
  return querySnapshot.docs.at(-1) ?? null;
}

export function watchDocuments(
  query: Query,
  onNext: { (snapshot: QuerySnapshot): void },
  onError?: { (error: Error): void },
) {
  return query.onSnapshot(onNext, onError);
}

/**
 * パスをクエリ制約に適当な形式に変換する。
 * @param path パス
 * @returns パス
 */
function regulatePath(path: any) {
  if (path === "__name__") {
    return FieldPath.documentId();
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
