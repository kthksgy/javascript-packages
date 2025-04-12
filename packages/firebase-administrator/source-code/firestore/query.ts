import { Temporal } from '@js-temporal/polyfill';
import {
  AggregateField,
  DocumentSnapshot,
  Filter,
  Timestamp,
  Transaction,
} from 'firebase-admin/firestore';

import {
  AreLimitedTo,
  AreOrderedBy,
  ArePaginatedAfter,
  ArePaginatedBefore,
  ArePaginatedNotAfter,
  ArePaginatedNotBefore,
  AreSelectedFromAfter,
  AreSelectedFromBefore,
  AreSelectedFromNotAfter,
  AreSelectedFromNotBefore,
  Contains,
  ContainsAnyOf,
  FilterProviso,
  FulfillsAllOf,
  FulfillsAnyOf,
  IsEqualTo,
  IsGreaterThan,
  IsGreaterThanOrEqualTo,
  IsLessThan,
  IsLessThanOrEqualTo,
  IsNotEqualTo,
  IsNotOneOf,
  IsOneOf,
  LimitProviso,
  PaginationProviso,
  RangeProviso,
  SortProviso,
} from '../shared-files';

import { FieldPath, Query, QuerySnapshot } from './classes';
import { createCollectionGroupReference, createCollectionReference } from './reference';

function getFilterConstraints(filters: ReadonlyArray<FilterProviso>) {
  const constraints: Array<
    ReturnType<typeof Filter.and> | ReturnType<typeof Filter.or> | ReturnType<typeof Filter.where>
  > = [];
  for (const filter of filters) {
    if (filter instanceof ContainsAnyOf) {
      constraints.push(
        Filter.where(regulatePath(filter.path), 'array-contains-any', regulateValue(filter.values)),
      );
    } else if (filter instanceof Contains) {
      constraints.push(
        Filter.where(regulatePath(filter.path), 'array-contains', regulateValue(filter.value)),
      );
    } else if (filter instanceof FulfillsAllOf) {
      constraints.push(Filter.and(...getFilterConstraints(filter.filters)));
    } else if (filter instanceof FulfillsAnyOf) {
      constraints.push(Filter.or(...getFilterConstraints(filter.filters)));
    } else if (filter instanceof IsEqualTo) {
      constraints.push(Filter.where(regulatePath(filter.path), '==', regulateValue(filter.value)));
    } else if (filter instanceof IsGreaterThanOrEqualTo) {
      constraints.push(Filter.where(regulatePath(filter.path), '>=', regulateValue(filter.value)));
    } else if (filter instanceof IsGreaterThan) {
      constraints.push(Filter.where(regulatePath(filter.path), '>', regulateValue(filter.value)));
    } else if (filter instanceof IsLessThanOrEqualTo) {
      constraints.push(Filter.where(regulatePath(filter.path), '<=', regulateValue(filter.value)));
    } else if (filter instanceof IsLessThan) {
      constraints.push(Filter.where(regulatePath(filter.path), '<', regulateValue(filter.value)));
    } else if (filter instanceof IsNotEqualTo) {
      constraints.push(Filter.where(regulatePath(filter.path), '!=', regulateValue(filter.value)));
    } else if (filter instanceof IsNotOneOf) {
      constraints.push(
        Filter.where(regulatePath(filter.path), 'not-in', regulateValue(filter.values)),
      );
    } else if (filter instanceof IsOneOf) {
      constraints.push(Filter.where(regulatePath(filter.path), 'in', regulateValue(filter.values)));
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
    filters: Array<FilterProviso>;
    limits: Array<LimitProviso>;
    paginations: Array<PaginationProviso>;
    ranges: Array<RangeProviso>;
    sorts: Array<SortProviso>;
  },
) {
  let query: Query = reference;

  query = query.where(Filter.and(...getFilterConstraints(parameters.filters)));

  for (const sort of parameters.sorts) {
    if (sort instanceof AreOrderedBy) {
      query = query.orderBy(
        regulatePath(sort.path),
        sort.direction === 'descending' ? 'desc' : 'asc',
      );
    }
  }

  for (const range of parameters.ranges) {
    if (range instanceof AreSelectedFromAfter) {
      query = query.startAfter(regulateValue(range.value));
    } else if (range instanceof AreSelectedFromBefore) {
      query = query.endBefore(regulateValue(range.value));
    } else if (range instanceof AreSelectedFromNotAfter) {
      query = query.endAt(regulateValue(range.value));
    } else if (range instanceof AreSelectedFromNotBefore) {
      query = query.startAt(regulateValue(range.value));
    }
  }

  for (const pagination of parameters.paginations) {
    if (pagination instanceof ArePaginatedAfter) {
      query = query.startAfter(pagination.cursor);
    } else if (pagination instanceof ArePaginatedBefore) {
      query = query.endBefore(pagination.cursor);
    } else if (pagination instanceof ArePaginatedNotAfter) {
      query = query.endAt(pagination.cursor);
    } else if (pagination instanceof ArePaginatedNotBefore) {
      query = query.startAt(pagination.cursor);
    }
  }

  {
    const limit = parameters.limits.at(-1);
    if (limit instanceof AreLimitedTo) {
      query = query.limit(limit.count);
    }
  }

  return query;
}

export async function executeQuery(query: Query, transaction?: Transaction) {
  if (transaction) {
    return transaction.get(query);
  } else {
    return query.get();
  }
}

export async function fetchDocumentCount(query: Query, transaction?: Transaction) {
  if (transaction) {
    return (await transaction.get(query.aggregate({ count: AggregateField.count() }))).data().count;
  } else {
    return (await query.aggregate({ count: AggregateField.count() }).get()).data().count;
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

export function listenQuery(
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
  if (path === '__name__') {
    return FieldPath.documentId();
  } else if (typeof path === 'string') {
    return path;
  } else if (
    Array.isArray(path) &&
    path.every(function (segment) {
      return typeof segment === 'string';
    })
  ) {
    return new FieldPath(...path);
  } else {
    throw new Error('Invalid path');
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
      value.epochSeconds,
      value.millisecond * 1_000_000 + value.microsecond * 1_000 + value.nanosecond,
    );
  } else if (Array.isArray(value)) {
    return value.map(regulateValue);
  } else if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(function ([key, value]) {
        return [key, regulateValue(value)];
      }),
    );
  } else {
    return value;
  }
}
