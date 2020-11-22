import { isDefined, toObservable } from '@freelancer/utils';
import * as Rx from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { arrayIsShallowEqual, OrderByDirection } from './helpers';
import {
  ArrayElement,
  DatastoreCollectionType,
  NearbyQueryParamValue,
  QueryParam,
  QueryParams,
  RangeQueryParam,
  SearchQueryParams,
} from './store.model';

/**
 * This file is the query class exposed to developers via datastore.list()
 *
 * It exposes a query that can be built up by chaining methods like:
 * ```lang=ts
 * this.datastore.list(
 *   'messages',
 *   this.auth.getUserId(),
 *   query => query.where('threadId', '==', this.thread.id).limit(50),
 * );
 * ```
 *
 * This API (and much of this class) is based on the interface from Firebase
 * and angularfire2, in particular:
 *   - firebase-js-sdk/packages/firestore/src/core/query.ts
 *   - firebase-js-sdk/packages/firestore/src/api/database.ts
 *   - firebase-js-sdk/packages/firestore-types/index.d.ts
 *   - angularfire2/src/firestore/interfaces.ts
 *   - angularfire2/src/firestore/firestore.ts
 */

/**
 * Filter conditions in a `Query.where()` clause are specified using the
 * strings '<', '<=', '==', '>=', and '>'.
 */
export type WhereFilterRangeOp = '<' | '<=' | '>=' | '>';
export type WhereFilterEqualsOp = '==';
export type WhereFilterStringComparisonOp = 'equalsIgnoreCase';
export type WhereFilterInListOp = 'in';
export type WhereFilterListIncludesOp = 'includes';
export type WhereFilterListIntersectsOp = 'intersects';
export type WhereFilterArrayEqualsOp = 'equalsIgnoreOrder';
export type WhereFilterNearbyOp = 'nearby';

export type WhereFilterOp =
  | WhereFilterEqualsOp
  | WhereFilterRangeOp
  | WhereFilterStringComparisonOp
  | WhereFilterInListOp
  | WhereFilterListIncludesOp
  | WhereFilterListIntersectsOp
  | WhereFilterArrayEqualsOp
  | WhereFilterNearbyOp;

export type NumericOrStringField<K, T> = K extends keyof T
  ? T[K] extends number | string
    ? K
    : never
  : never;

// We only want to sort on numeric or string fields, not undefined ones
export interface SingleOrdering<C extends DatastoreCollectionType> {
  readonly field: NumericOrStringField<
    keyof C['DocumentType'],
    C['DocumentType']
  >;
  readonly direction: OrderByDirection;
}

export type Ordering<C extends DatastoreCollectionType> =
  // tslint:disable-next-line:readonly-array
  [SingleOrdering<C>, ...SingleOrdering<C>[]];

export interface NullQueryObject {
  readonly limit: undefined;
  readonly queryParams: undefined;
  readonly searchQueryParams: SearchQueryParams; // FIXME: Consider making null when we make query a tagged union
  readonly order: undefined;
}

export const nullQueryObject: NullQueryObject = {
  limit: undefined,
  queryParams: undefined,
  searchQueryParams: {},
  order: undefined,
};

export const emptyQueryObject = {
  limit: undefined,
  queryParams: {},
  searchQueryParams: {},
  order: undefined,
};

export interface QueryObject<C extends DatastoreCollectionType> {
  readonly limit: number | undefined;
  readonly queryParams: QueryParams<C['DocumentType']>;
  readonly searchQueryParams: SearchQueryParams;
  readonly order: Ordering<C> | undefined;
}

export class NullQuery {
  get query$(): Rx.Observable<NullQueryObject> {
    return Rx.of(nullQueryObject);
  }
}

export interface DocumentQuery<
  C extends DatastoreCollectionType,
  OtherId extends keyof C['DocumentType']
> {
  readonly index: OtherId;
  readonly caseInsensitive?: boolean;
}

export interface DocumentOptionsObject<Q, ResourceGroup> {
  readonly query$?: Q | Rx.Observable<Q | undefined>;
  readonly resourceGroup$?: ResourceGroup | Rx.Observable<ResourceGroup>;
}

export function isDocumentOptionsObject<Q, ResourceGroup>(
  param$:
    | Q
    | Rx.Observable<Q | undefined>
    | DocumentOptionsObject<Q, ResourceGroup>
    | undefined,
): param$ is DocumentOptionsObject<Q, ResourceGroup> {
  return (
    param$ !== undefined && ('query$' in param$ || 'resourceGroup$' in param$)
  );
}

export function isInequalityParam<T>(
  param: QueryParam<T>,
): param is RangeQueryParam<T, keyof T> {
  const op = param.condition;
  return op === '<=' || op === '>=' || op === '<' || op === '>';
}

/**
 * Used to filter, limit and sort objects in a collection. Refine your view of
 * the collection by adding clauses with their respective methods.
 *
 * Every method accepts an Observable in place of the value. If any clause
 * uses an Observable value, that Observable MUST emit something before the
 * collection can be fetched. By extension if you use multiple clauses, their
 * values must all emit before the collection can emit.
 */
export class Query<C extends DatastoreCollectionType> {
  private constructor(
    private readonly queryParams$:
      | Rx.Observable<QueryParams<C['DocumentType']>>
      | undefined,
    private readonly searchQueryParams$:
      | Rx.Observable<SearchQueryParams>
      | undefined,
    private readonly limitValue$: Rx.Observable<number> | undefined,
    private readonly orderByValue$: Rx.Observable<Ordering<C>> | undefined,
  ) {}

  static newQuery<C extends DatastoreCollectionType>() {
    return new Query<C>(undefined, undefined, undefined, undefined);
  }

  /**
   * Adds criteria to refine the results of a collection query.
   * The `field` and `value` parameters must have matching types according
   * to the model file of the desired collection (see `<collection>.model.ts`).
   *
   * For example, if we want to query the 'projects' collection by title, our
   * where clause should look like:
   *
   * `.where('title', '==', 'someStringTitle')`
   *
   * Other exampls:
   * `.where('rating', '<=', 10)`
   * `.where('seoUrl', 'equalsIgnoreCase', seoUrl)`
   * `.where('completeStatus', 'in', [BidCompleteStatusApi.COMPLETE, BidCompleteStatusApi.PENDING])`,
   * `.where('members', 'includes', userId$)`,
   * `.where('location', 'nearby', { range: 150_000, latitude, longitude })`
   * `.where('skills', 'intersects', skills)`.
   */
  where<T extends keyof C['DocumentType']>(
    field: T,
    condition: WhereFilterEqualsOp,
    value$: C['DocumentType'][T] | Rx.Observable<C['DocumentType'][T]>,
  ): Query<C>;
  where<T extends keyof C['DocumentType']>(
    field: T,
    condition: WhereFilterRangeOp,
    value$:
      | (C['DocumentType'][T] & (string | number))
      | Rx.Observable<C['DocumentType'][T] & (string | number)>,
  ): Query<C>;
  where<T extends keyof C['DocumentType']>(
    field: T,
    condition: WhereFilterNearbyOp,
    value$: NearbyQueryParamValue | Rx.Observable<NearbyQueryParamValue>,
  ): Query<C>;
  where<T extends keyof C['DocumentType']>(
    field: T,
    condition: WhereFilterStringComparisonOp,
    value$:
      | (C['DocumentType'][T] & string)
      | Rx.Observable<C['DocumentType'][T] & string>,
  ): Query<C>;
  where<T extends keyof C['DocumentType']>(
    field: T,
    condition: WhereFilterInListOp,
    values$:
      | ReadonlyArray<C['DocumentType'][T]>
      | Rx.Observable<ReadonlyArray<C['DocumentType'][T]>>,
  ): Query<C>;
  where<T extends keyof C['DocumentType']>(
    field: T,
    condition: WhereFilterListIncludesOp,
    value$:
      | ArrayElement<C['DocumentType'][T]>
      | Rx.Observable<ArrayElement<C['DocumentType'][T]>>,
  ): Query<C>;
  where<T extends keyof C['DocumentType']>(
    field: T,
    condition: WhereFilterListIntersectsOp | WhereFilterArrayEqualsOp,
    values$:
      | ReadonlyArray<ArrayElement<C['DocumentType'][T]>>
      | Rx.Observable<ReadonlyArray<ArrayElement<C['DocumentType'][T]>>>,
  ): Query<C>;
  where<T extends keyof C['DocumentType']>(
    field: T,
    condition: WhereFilterOp,
    value$: any,
  ): Query<C> {
    const newParam$: Rx.Observable<QueryParam<
      C['DocumentType']
    >> = toObservable(value$).pipe(
      condition === 'in'
        ? distinctUntilChanged(arrayIsShallowEqual)
        : distinctUntilChanged(),
      map(v => constructWhereCondition(field, condition, v)),
    );

    // First where clause added
    if (this.queryParams$ === undefined) {
      return new Query(
        newParam$.pipe(
          map(
            param =>
              ({
                [field]: [param] as ReadonlyArray<
                  QueryParam<C['DocumentType']>
                >,
              } as QueryParams<C['DocumentType']>),
          ),
        ),
        this.searchQueryParams$,
        this.limitValue$,
        this.orderByValue$,
      );
    }

    return new Query(
      Rx.combineLatest([this.queryParams$, newParam$]).pipe(
        filter(([currParams, newParam]) =>
          this.isValidWhereClause(currParams, newParam, field),
        ),
        map(([currParams, newParam]) => this.mergeParams(currParams, newParam)),
        distinctUntilChanged(),
      ),
      this.searchQueryParams$,
      this.limitValue$,
      this.orderByValue$,
    );
  }

  private mergeParams<T>(
    currParams: QueryParams<T>,
    newParam: QueryParam<T>,
  ): QueryParams<T> {
    if (currParams[newParam.name]) {
      // Concat param under existing key
      return {
        ...currParams,
        [newParam.name]: [...(currParams[newParam.name] as any), newParam],
      };
    }

    return {
      ...currParams,
      [newParam.name]: [newParam],
    };
  }

  private isValidWhereClause(
    currParams: QueryParams<C['DocumentType']>,
    newParam: QueryParam<C['DocumentType']>,
    field: keyof C['DocumentType'],
  ) {
    const existingClauses = currParams[field];
    // A new clause on a field is always allowed
    if (!isDefined(existingClauses)) {
      return true;
    }

    // There must be exactly one non-inequality clause
    if (
      !isInequalityParam(newParam) ||
      existingClauses.some(param => !isInequalityParam(param))
    ) {
      throw new Error(
        `Duplicate where clause on field '${field}' is not allowed`,
      );
    }

    if (!this.isValidInequalities([...existingClauses, newParam])) {
      throw new Error(
        `Multiple inequality filters on the field '${field}' must form a valid range`,
      );
    }

    return true;
  }

  private isValidInequalities(
    clauses: ReadonlyArray<QueryParam<C['DocumentType']>>,
  ): boolean {
    return (
      !!clauses.length &&
      clauses.length === 2 &&
      clauses.some(param => param.condition.startsWith('>')) &&
      clauses.some(param => param.condition.startsWith('<'))
    );
  }

  orderBy(
    field: SingleOrdering<C>['field'],
    direction$:
      | SingleOrdering<C>['direction']
      | Rx.Observable<SingleOrdering<C>['direction']>,
  ): Query<C> {
    return new Query(
      this.queryParams$,
      this.searchQueryParams$,
      this.limitValue$,

      this.orderByValue$
        ? Rx.combineLatest([this.orderByValue$, toObservable(direction$)]).pipe(
            map(
              ([orderBy, direction]) =>
                [...orderBy, { field, direction }] as Ordering<C>,
            ),
          )
        : toObservable(direction$).pipe(
            map(direction => [{ field, direction }] as Ordering<C>),
          ),
    );
  }

  limit(n$: number | Rx.Observable<number>): Query<C> {
    if (this.limitValue$) {
      throw new Error("You can't call `limit` twice.");
    }

    return new Query(
      this.queryParams$,
      this.searchQueryParams$,
      toObservable(n$).pipe(distinctUntilChanged()),
      this.orderByValue$,
    );
  }

  search(
    query$: SearchQueryParams | Rx.Observable<SearchQueryParams>,
  ): Query<C> {
    return this.searchQueryParams$
      ? new Query(
          this.queryParams$,
          Rx.combineLatest([
            this.searchQueryParams$,
            toObservable(query$),
          ]).pipe(
            map(([searchValue, newQuery]) => ({ ...searchValue, ...newQuery })),
          ),
          this.limitValue$,
          this.orderByValue$,
        )
      : new Query(
          this.queryParams$,
          toObservable(query$),
          this.limitValue$,
          this.orderByValue$,
        );
  }

  /**
   * An empty query which does not trigger a network request. To be used with
   * dynamic queries (queries wrapped in Observables).
   *
   * Note that this will always result in an empty list, and is not the same as
   * passing the default query (`query => query`) or no query (`undefined`).
   */
  null(): NullQuery {
    return new NullQuery();
  }

  // Grab the properties of the query as an observable
  get query$(): Rx.Observable<QueryObject<C>> {
    return Rx.combineLatest([
      this.limitValue$ || Rx.of(undefined),
      this.queryParams$ || Rx.of({}),
      this.searchQueryParams$ || Rx.of({}),
      this.orderByValue$ || Rx.of(undefined),
    ]).pipe(
      map(([limit, queryParams, searchQueryParams, order]) => ({
        limit,
        queryParams,
        searchQueryParams,
        order,
      })),
    );
  }
}

/**
 * Not designed to be used outside this file except for mocks.
 */
export function constructWhereCondition<
  C extends DatastoreCollectionType,
  T extends keyof C['DocumentType'] = keyof C['DocumentType']
>(
  field: T,
  condition: WhereFilterOp,
  value: any,
): QueryParam<C['DocumentType'], T> {
  // massive ternary is because otherwise type error
  return condition === 'in'
    ? { name: field, condition, values: value }
    : condition === '=='
    ? { name: field, condition, value }
    : condition === '<='
    ? { name: field, condition, value }
    : condition === '<'
    ? { name: field, condition, value }
    : condition === '>='
    ? { name: field, condition, value }
    : condition === '>'
    ? { name: field, condition, value }
    : condition === 'includes'
    ? { name: field, condition, value }
    : condition === 'intersects'
    ? { name: field, condition, values: value }
    : condition === 'equalsIgnoreOrder'
    ? { name: field, condition, values: value }
    : condition === 'nearby'
    ? { name: field, condition, value }
    : { name: field, condition, value };
}
