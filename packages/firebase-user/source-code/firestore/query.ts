import { Temporal } from '@js-temporal/polyfill';
import { Mishap } from '@kthksgy/utilities';
import {
  DocumentSnapshot,
  FieldPath,
  FirestoreError,
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
  onSnapshot,
} from 'firebase/firestore';

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

import { Query, QuerySnapshot } from './classes';
import { createCollectionGroupReference, createCollectionReference } from './reference';

function getFilterConstraints(filters: ReadonlyArray<FilterProviso>) {
  const constraints: Array<
    ReturnType<typeof _and> | ReturnType<typeof _or> | ReturnType<typeof _where>
  > = [];
  for (const filter of filters) {
    if (filter instanceof ContainsAnyOf) {
      constraints.push(
        _where(regulatePath(filter.path), 'array-contains-any', regulateValue(filter.values)),
      );
    } else if (filter instanceof Contains) {
      constraints.push(
        _where(regulatePath(filter.path), 'array-contains', regulateValue(filter.value)),
      );
    } else if (filter instanceof FulfillsAllOf) {
      constraints.push(_and(...getFilterConstraints(filter.filters)));
    } else if (filter instanceof FulfillsAnyOf) {
      constraints.push(_or(...getFilterConstraints(filter.filters)));
    } else if (filter instanceof IsEqualTo) {
      constraints.push(_where(regulatePath(filter.path), '==', regulateValue(filter.value)));
    } else if (filter instanceof IsGreaterThanOrEqualTo) {
      constraints.push(_where(regulatePath(filter.path), '>=', regulateValue(filter.value)));
    } else if (filter instanceof IsGreaterThan) {
      constraints.push(_where(regulatePath(filter.path), '>', regulateValue(filter.value)));
    } else if (filter instanceof IsLessThanOrEqualTo) {
      constraints.push(_where(regulatePath(filter.path), '<=', regulateValue(filter.value)));
    } else if (filter instanceof IsLessThan) {
      constraints.push(_where(regulatePath(filter.path), '<', regulateValue(filter.value)));
    } else if (filter instanceof IsNotEqualTo) {
      constraints.push(_where(regulatePath(filter.path), '!=', regulateValue(filter.value)));
    } else if (filter instanceof IsNotOneOf) {
      constraints.push(_where(regulatePath(filter.path), 'not-in', regulateValue(filter.values)));
    } else if (filter instanceof IsOneOf) {
      constraints.push(_where(regulatePath(filter.path), 'in', regulateValue(filter.values)));
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
  const constraints = [];
  const filter = _and(...getFilterConstraints(parameters.filters));

  for (const sort of parameters.sorts) {
    if (sort instanceof AreOrderedBy) {
      constraints.push(
        _orderBy(regulatePath(sort.path), sort.direction === 'descending' ? 'desc' : 'asc'),
      );
    }
  }

  for (const range of parameters.ranges) {
    if (range instanceof AreSelectedFromAfter) {
      constraints.push(_startAfter(regulateValue(range.value)));
    } else if (range instanceof AreSelectedFromBefore) {
      constraints.push(_endBefore(regulateValue(range.value)));
    } else if (range instanceof AreSelectedFromNotAfter) {
      constraints.push(_endAt(regulateValue(range.value)));
    } else if (range instanceof AreSelectedFromNotBefore) {
      constraints.push(_startAt(regulateValue(range.value)));
    }
  }

  for (const pagination of parameters.paginations) {
    if (pagination instanceof ArePaginatedAfter) {
      constraints.push(_startAfter(pagination.cursor));
    } else if (pagination instanceof ArePaginatedBefore) {
      constraints.push(_endBefore(pagination.cursor));
    } else if (pagination instanceof ArePaginatedNotAfter) {
      constraints.push(_endAt(pagination.cursor));
    } else if (pagination instanceof ArePaginatedNotBefore) {
      constraints.push(_startAt(pagination.cursor));
    }
  }

  {
    const limit = parameters.limits.at(-1);
    if (limit instanceof AreLimitedTo) {
      constraints.push(_limit(limit.count));
    }
  }

  return _query(reference, filter, ...constraints);
}

export async function executeQuery(query: Query, transaction?: Transaction) {
  if (transaction) {
    throw new Mishap(Mishap.DEFAULT_CODE, {
      message: 'この機能は`firebase`パッケージでは利用できません。',
    });
  } else {
    return getDocs(query);
  }
}

export async function fetchDocumentCount(query: Query, transaction?: Transaction) {
  if (transaction) {
    throw new Mishap(Mishap.DEFAULT_CODE, {
      message: 'この機能は`firebase`パッケージでは利用できません。',
    });
  } else {
    return (await getCountFromServer(query)).data().count;
  }
}

export function getDocumentDataArray<T extends QuerySnapshot>(querySnapshot: T) {
  return querySnapshot.docs.map(function (documentSnapshot) {
    return documentSnapshot.data({ serverTimestamps: 'estimate' });
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
  onError?: { (error: FirestoreError): void },
) {
  return onSnapshot(query, onNext, onError);
}

/**
 * パスをクエリ制約に適当な形式に変換する。
 * @param path パス
 * @returns パス
 */
function regulatePath(path: any) {
  if (path === '__name__') {
    return documentId();
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
