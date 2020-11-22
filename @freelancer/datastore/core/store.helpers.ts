import {
  assertNever,
  fromPairs,
  haversineDistance,
  isDefined,
  jsonStableStringify,
  partition,
  toNumber,
  toObservable,
} from '@freelancer/utils';
import * as Rx from 'rxjs';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import {
  compareMultipleFields,
  flatMap,
  isEqual,
  mapValues,
  sameElements,
  setDiff,
} from './helpers';
import {
  emptyQueryObject,
  isInequalityParam,
  NullQuery,
  NullQueryObject,
  Ordering,
  Query,
  QueryObject,
} from './query';
import {
  ApproximateTotalCountType,
  ArrayElement,
  ArrayEqualsQueryParam,
  CollectionStateSlice,
  DatastoreCollectionType,
  Documents,
  DocumentWithMetadata,
  InListQueryParam,
  ListIntersectsQueryParam,
  MapCoordinates,
  NearbyQueryParamValue,
  Path,
  QueryParam,
  QueryParams,
  QueryResult,
  QueryResults,
  RangeQueryParam,
  RawQuery,
  Reference,
  StoreState,
  UserCollectionStateSlice,
} from './store.model';

function paramMatchesdocumentWithMetadata<T>(
  documentWithMetadata: DocumentWithMetadata<T>,
  param: QueryParam<T>,
) {
  if (param.name in documentWithMetadata.rawDocument) {
    const documentValue = documentWithMetadata.rawDocument[param.name];

    switch (param.condition) {
      case '==':
        return isEqual(documentValue, param.value);
      case '<':
        return documentValue < param.value;
      case '<=':
        return documentValue <= param.value;
      case '>=':
        return documentValue >= param.value;
      case '>':
        return documentValue > param.value;
      case 'in':
        return param.values.some(value => isEqual(documentValue, value));
      case 'equalsIgnoreCase':
        return (
          param.value.toUpperCase() === String(documentValue).toUpperCase()
        );
      case 'includes':
        return ((documentValue as unknown) as ArrayElement<
          T[keyof T]
        >[]).some(value => isEqual(param.value, value));
      case 'intersects':
        return param.values.some(paramValue =>
          ((documentValue as unknown) as ArrayElement<
            T[keyof T]
          >[]).some(value => isEqual(paramValue, value)),
        );
      case 'equalsIgnoreOrder':
        return param.values.every(paramValue =>
          ((documentValue as unknown) as ArrayElement<T[keyof T]>[]).includes(
            paramValue,
          ),
        );
      case 'nearby': {
        const distance = haversineDistance(
          param.value,
          (documentValue as unknown) as MapCoordinates, // Not sure if we can avoid the type cast
        );

        // Allow up to a 100m over the asked range due to API rounding or
        // slightly different implementations of Haversine to be allowed.
        const precisionInMeters = 100;

        return distance - param.value.range < precisionInMeters;
      }
      default:
        return assertNever(param);
    }
  }

  return false;
}

/**
 * Checks if an document matches a query's params and returns the mismatched ones
 * If there are no params then it does so trivially.
 */
export function getMismatchedQueryParams<T>(
  documentWithMetadata: DocumentWithMetadata<T>,
  queryParams?: QueryParams<T>,
): ReadonlyArray<QueryParams<T>[keyof T]> {
  if (!queryParams) {
    return [];
  }
  const mismatchedParams = Object.values<
    ReadonlyArray<QueryParam<T>> | undefined
  >(queryParams).filter(clauses => {
    if (!clauses) {
      return false;
    }

    return isValidInterval(clauses)
      ? !clauses.every(param =>
          paramMatchesdocumentWithMetadata(documentWithMetadata, param),
        )
      : !clauses.some(param =>
          paramMatchesdocumentWithMetadata(documentWithMetadata, param),
        );
  });
  return mismatchedParams;
}

export function documentWithMetadataMatchesQueryParams<T>(
  documentWithMetadata: DocumentWithMetadata<T>,
  queryParams?: QueryParams<T>,
) {
  return (
    getMismatchedQueryParams(documentWithMetadata, queryParams).length === 0
  );
}

/** Checks if query params form a valid bounded interval like a < x < b */
function isValidInterval<T, K extends keyof T>(
  params: ReadonlyArray<QueryParam<T, K>>,
): params is readonly [RangeQueryParam<T, K>, RangeQueryParam<T, K>] {
  const [firstParam, secondParam] = params;
  return (
    firstParam &&
    secondParam &&
    isInequalityParam(firstParam) &&
    isInequalityParam(secondParam) &&
    firstParam.condition.startsWith('>') &&
    secondParam.condition.startsWith('<') &&
    firstParam.value <= secondParam.value
  );
}

/**
 * Gets a list of documents which match a particular query. If the data isn't
 * available for a particular query it will return the "best guess" by applying
 * the query to the default list in the store.
 *
 * Note: Not for general use - only intended for datastore internals.
 *
 * @param storeSlice the object after collection and authUid has been indexed
 * @param ref the reference for the requested data.
 * @param defaultOrder the default order of the collection
 *
 * @returns An array of documents, or undefined if none matched
 */
export function selectDocumentsForReference<C extends DatastoreCollectionType>(
  storeSlice: UserCollectionStateSlice<C>,
  ref: Reference<C>,
  defaultOrder: Ordering<C>,
): ReadonlyArray<C['DocumentType']> | undefined {
  if (!storeSlice) {
    return undefined;
  }

  const queryString = stringifyReference(ref);

  // If the reference is only for `ids` without a query, return those
  if (
    ref.path.ids &&
    (!ref.query ||
      (!isSearchQuery(ref.query) &&
        (!ref.query.queryParams ||
          Object.keys(ref.query.queryParams).length === 0)))
  ) {
    // If you asked for nothing return nothing.
    if (ref.path.ids.length === 0) {
      return [];
    }
    // Otherwise don't return nothing if there's nothing in the store yet.
    const documents = ref.path.ids
      .map(id => storeSlice.documents[id])
      .filter(isDefined)
      .map(document => document.rawDocument);
    return documents.length !== 0 ? documents : undefined;
  }

  // If queried list exists, return that.
  if (storeSlice.queries[queryString]) {
    return storeSlice.queries[queryString].ids.map(
      id => storeSlice.documents[id].rawDocument,
    );
  }

  // If the query is a search query and it's not in the store then don't try guess
  if (isSearchQuery(ref.query)) {
    return undefined;
  }

  // New query, so filter default list first.
  if (
    (!ref.order || isEqual(ref.order, defaultOrder)) &&
    storeSlice.queries.default
  ) {
    const matchingObjects = storeSlice.queries.default.ids
      .map(id => storeSlice.documents[id])
      .filter(isDefined)
      .filter(documentWithMetadata =>
        documentWithMetadataMatchesQueryParams(
          documentWithMetadata,
          ref.query && ref.query.queryParams,
        ),
      )
      .slice(0, ref.query && ref.query.limit)
      .map(documentWithMetadata => documentWithMetadata.rawDocument);

    return matchingObjects.length > 0 ? matchingObjects : undefined;
  }

  return undefined;
}

/**
 * Stringifies a reference for indexing into the `queries` section of the
 * NgRx store.
 *
 * If the reference has no query it returns `default`.
 * If the reference has a query and `ids` it includes the `ids` in the string.
 */
export function stringifyReference<C extends DatastoreCollectionType>(
  ref: Reference<C>,
) {
  const {
    path: { ids },
    query,
    order,
  } = ref;

  if (query) {
    interface KeyConditionValue {
      key: string;
      condition: string;
      value: any;
    }

    const { queryParams, searchQueryParams, limit, offset } = query;

    // FIXME: Refactor to be a tagged union
    if (!queryParams && !isSearchQuery(query)) {
      // null query - this should never appear in the store
      return 'null';
    }

    const stringifiedQueryParams: readonly KeyConditionValue[] = queryParams
      ? flatMap(
          Object.entries(queryParams),
          ([key, clauses]: [
            string,
            // NonNullable<QueryParams<C['DocumentType']>[keyof C['DocumentType']]>,
            any, // FIXME
          ]) =>
            clauses.map((param: any) => {
              // FIXME
              // When stringifying pick something that can be concatenated without ambiguity
              switch (param.condition) {
                case '==':
                case '<=':
                case '<':
                case '>=':
                case '>':
                  return {
                    key,
                    condition: param.condition,
                    value: param.value,
                  };
                case 'equalsIgnoreCase':
                  return { key, condition: '~ignoreCase~', value: param.value };
                case 'equalsIgnoreOrder':
                  return {
                    key,
                    condition: '~ignoreOrder~',
                    value: param.values,
                  };
                case 'includes':
                  return { key, condition: '~includes~', value: param.value };
                case 'in':
                  return { key, condition: '~in~', value: param.values };
                case 'intersects':
                  return {
                    key,
                    condition: '~intersects~',
                    value: param.values,
                  };
                case 'nearby':
                  return { key, condition: '~nearby~', value: param.value };
                default:
                  return assertNever((param as unknown) as never); // FIXME
              }
            }),
        )
      : [];

    const stringifiedSearchQueryParams: KeyConditionValue[] = searchQueryParams
      ? Object.entries(searchQueryParams).map(([key, searchQueryParam]) => ({
          key,
          condition: `~searchParam~`,
          value: searchQueryParam.toString(),
        }))
      : [];

    const stringifiedIds: KeyConditionValue[] = ids
      ? [...ids].sort().map(id => ({
          key: 'id',
          condition: '~in~',
          value: id,
        }))
      : [];

    const stringifiedOrder: KeyConditionValue[] = order
      ? order.map((ordering, index) => ({
          key: ordering.field.toString(),
          condition: `~order${index}~`,
          value: ordering.direction,
        }))
      : [];

    const stringifiedPagination: KeyConditionValue[] = Object.entries({
      limit,
      offset,
    })
      .map(
        ([key, value]) =>
          ({ key, condition: '==', value } as KeyConditionValue),
      )
      .filter(({ key, condition, value }) => value !== undefined);

    const entries = [
      ...stringifiedPagination,
      ...stringifiedQueryParams,
      ...stringifiedSearchQueryParams,
      ...stringifiedOrder,
      ...stringifiedIds,
    ]
      .map(
        ({ key, condition, value }) =>
          `${key}${condition}${jsonStableStringify(value, true)}`,
      )
      .sort()
      .join(';');

    return entries || 'default';
  }

  // undefined query - this can happen for no-query #collection calls or #object(s) calls
  return 'default';
}

// RawQuery (internal query type) with an extra `order` field
interface FlattenedQuery<C extends DatastoreCollectionType>
  extends RawQuery<C['DocumentType']> {
  readonly order: Ordering<C> | undefined;
}

/**
 * Turns a query function passed by datastore clients to an Observable of
 * its params and other properties (limit, order).
 *
 * There are 3 cases:
 * - queryFn is `undefined` or default (query => query) -> params to `{}`
 * - queryFn contains explicit clauses (where, limit, orderBy) -> params passed through
 *   - 'where' clauses with an empty 'in' parameter (i.e. `[]`) are filtered out
 * - queryFn is the null query -> params to `undefined`
 *
 * @returns flattened query used by #collection in the datastore
 */
export function flattenQuery<C extends DatastoreCollectionType>(
  queryFn?: (q: Query<C>) => Query<C> | Rx.Observable<Query<C> | NullQuery>,
): Rx.Observable<FlattenedQuery<C>> {
  const queryObject$: Rx.Observable<QueryObject<C> | NullQueryObject> = queryFn
    ? toObservable(queryFn(Query.newQuery())).pipe(switchMap(q => q.query$))
    : Rx.of(emptyQueryObject);

  return queryObject$.pipe(
    map(query => ({
      ...query,
      isDocumentQuery: false,
      queryParams: removeInvalidQueryParams(query.queryParams),
    })),
    distinctUntilChanged(
      (x, y) =>
        stringifyReference({
          path: { collection: '', authUid: '' },
          query: x,
          order: x.order,
        }) ===
        stringifyReference({
          path: { collection: '', authUid: '' },
          query: y,
          order: y.order,
        }),
    ),
  );
}

export function isSearchQuery<T>(query: RawQuery<T> | undefined) {
  return (
    query &&
    query.searchQueryParams !== undefined &&
    Object.keys(query.searchQueryParams).length !== 0
  );
}

/** #document queries (by secondary ID) are not considered plain document references */
export function isPlainDocumentRef<C extends DatastoreCollectionType>(
  ref: Reference<C>,
): boolean {
  return ref.query === undefined;
}

/**
 * Any #document call, whether by primary or secondary ID, is considered a
 * document reference. If made by primary ID, query is undefined. If made by
 * secondary ID, query is defined but isDocumentQuery is true.
 */
export function isDocumentRef<C extends DatastoreCollectionType>(
  ref: Reference<C>,
): boolean {
  return ref.query === undefined || ref.query.isDocumentQuery;
}

/**
 * Gets any `ids` from the query which are queried by `==` or `in`.
 * These can be safely turned into document-based queries.
 */
export function getEqualOrInIdsFromQuery(
  query: RawQuery<ObjectWithId> | undefined,
): ReadonlyArray<string> | undefined {
  const ids = getQueryParamValue(
    query,
    'id',
    param =>
      (param.condition === '==' ? param.value : undefined) ||
      (param.condition === 'in' ? param.values : undefined),
  )
    .filter(isDefined)
    .map(x => x.toString());
  return ids.length === 0 ? undefined : ids;
}

/**
 *
 */
export function removeEqualOrInIdsFromQuery(
  query: RawQuery<ObjectWithId> | undefined,
): RawQuery<ObjectWithId> | undefined {
  if (!query || !query.queryParams) {
    return query;
  }

  const updatedQueryParams = fromPairs(
    Object.entries(query.queryParams)
      .map(([name, queryParams]) => {
        if (name !== 'id' || !queryParams) {
          return [name, queryParams] as const;
        }

        const filteredConditions = queryParams.filter(
          queryParam => !['==', 'in'].includes(queryParam.condition),
        );

        return filteredConditions.length === 0
          ? undefined
          : ([name, filteredConditions] as const);
      })
      .filter(isDefined),
  );

  return {
    ...query,
    queryParams: updatedQueryParams,
  };
}

/**
 * If the query only contains lookups by `id`, that is is of the form
 * `id in list` or `id == list`.
 */
export function isIdQuery(query: RawQuery<ObjectWithId> | undefined): boolean {
  return (
    query !== undefined &&
    query.queryParams !== undefined &&
    Object.keys(query.queryParams).length === 1 &&
    query.queryParams.id !== undefined &&
    query.queryParams.id.length === 1 &&
    ['==', 'in'].includes(query.queryParams.id[0].condition) &&
    !isSearchQuery(query)
  );
}

export function isNullRef<C extends DatastoreCollectionType>(
  ref: Reference<C>,
) {
  // FIXME: Make query a tagged union
  return (
    !ref.path.ids &&
    (!ref.query || (!ref.query.queryParams && !isSearchQuery(ref.query)))
  );
}

/**
 * Removes `in` clauses from parameters where the value is an empty array `[]`.
 * If this would result in no parameters remaining, return `undefined`
 * instead of the empty params object `{}`.
 *
 * The purpose of this is to achieve the same thing as the null query, making the
 * collection Observable emit an empty list immediately without triggering a
 * network request. E.g. `query.where('id', 'in', [])` => `[]` immediately.
 *
 * To avoid this behaviour, you must explicitly check for an empty 'in' clause,
 * by chaining `notEmpty` or otherwise.
 */
// TODO: Consider moving this elsewhere to keep `flattenQuery` focused, maybe
// a separate query object transformation step
export function removeInvalidQueryParams<T>(
  queryParams?: QueryParams<T>,
): QueryParams<T> | undefined {
  // Don't touch params from a null query or default query
  if (!queryParams || Object.keys(queryParams).length === 0) {
    return queryParams;
  }

  const validParamsEntries: [
    string,
    QueryParams<T>[keyof T],
  ][] = Object.entries<ReadonlyArray<QueryParam<T>> | undefined>(
    queryParams,
  ).filter(([key, clauses]) => {
    if (!clauses) {
      return false;
    }

    const clausesWithoutEmptyIns = clauses.filter(
      param => !(param.condition === 'in' && param.values.length === 0),
    );

    return clausesWithoutEmptyIns.length > 0;
  });

  // TODO: Convert this to fromPairs
  const parsed: QueryParams<T> = validParamsEntries.reduce(
    (
      parsedParams: QueryParams<T>,
      [key, param]: [string, QueryParams<T>[keyof T]],
    ) => ({
      ...parsedParams,
      [key]: param,
    }),
    {},
  );

  return Object.keys(parsed).length > 0 ? parsed : undefined;
}

/**
 * Merges the unwrapped documents of a collection, only overwriting the ones
 * that have changed.
 */
export function mergeRawDocuments<C extends DatastoreCollectionType>(
  currentDocuments: Documents<C['DocumentType']>,
  newDocuments: Documents<C['DocumentType']>,
): Documents<C['DocumentType']> {
  // The `newDocuments`, keeping the unwrapped object from `currentDocuments` but
  // with updated metadata (timeFetched/updated) if they compare deep equal,
  const updatedNewDocuments = mapValues(newDocuments, (newDocument, key) =>
    key in currentDocuments &&
    isEqual(currentDocuments[key].rawDocument, newDocument.rawDocument)
      ? {
          ...newDocument,
          rawDocument: currentDocuments[key].rawDocument,
        }
      : newDocument,
  );

  return {
    ...currentDocuments,
    ...updatedNewDocuments,
  };
}

/**
 * Merges a number of documents into the store state.
 * The `state` parameter refers to a single slice of state corresponding to one
 * collection or "feature", e.g. `users`, `projects`, etc.
 *
 * New documents are always merged with existing documents. All lists in the slice
 * are then updated:
 * - Each list corresponds to a query object. If a datastore call does not have
 *   a query it corresponds the `default` list, e.g. plain `document` calls.
 * - The current list (as determined by the query) is overwritten entirely for
 *   queried calls, and merged for non-queried calls.
 * - All other lists are merged.
 *
 * We also allow a custom sorting function to allow resorting the list.
 */
export function mergeDocuments<C extends DatastoreCollectionType>(
  state: CollectionStateSlice<C>,
  rawDocuments: ReadonlyArray<C['DocumentType']>,
  order: Ordering<C>,
  ref: Reference<C>,
  approximateTotalCount?: ApproximateTotalCountType<C>,
): CollectionStateSlice<C> {
  const documents = addDocumentMetadata(rawDocuments);
  const originalUserCollectionSlice = state[ref.path.authUid];
  const userCollectionSlice: UserCollectionStateSlice<C> =
    originalUserCollectionSlice && originalUserCollectionSlice.documents
      ? originalUserCollectionSlice
      : {
          documents: {},
          queries: {},
        };

  const queryString = isPlainDocumentRef(ref)
    ? undefined
    : stringifyReference(ref);
  const updatedDocuments = mergeRawDocuments(
    userCollectionSlice.documents,
    documents,
  );

  /**
   * The ordering of a search result is generally determined as a similarity score
   * based on the query being performed. Since this is dependent on the query
   * being performed it doesn't make sense to store this score in the document,
   * and so instead we need to trust the ordering from the backend.
   *
   * Since we can neither evaluate if a document matches a search query,
   * nor compute this similarity score used for the ordering we cannot support
   * live updates for search queries.
   */
  const newListIds = isSearchQuery(ref.query)
    ? rawDocuments.map(document => document.id.toString())
    : Object.keys(documents)
        .filter(key => {
          const mismatched = getMismatchedQueryParams(
            documents[key],
            ref.query ? ref.query.queryParams : undefined,
          );
          // complicated error display logic because we want to be as useful as possible
          if (mismatched.length > 0) {
            const invalidDocumentMessage = `Attempted to merge invalid document into list for ${
              ref.path.collection
            }: fields ${jsonStableStringify(
              // stringify + sort so this looks the same every time for Sentry
              mismatched.map(params => params && params[0].name).sort(),
            )} in backend object did not match query.`;

            // display console error with extra information for debugging
            console.error(
              invalidDocumentMessage,
              queryString,
              documents[key].rawDocument,
            );
            // print each of the wrong params
            mismatched.forEach(params => {
              if (params) {
                console.error(
                  `Expected "${params[0].name}" to match ${jsonStableStringify(
                    params,
                  )} but was actually "${jsonStableStringify(
                    documents[key].rawDocument[params[0].name],
                  )}"`,
                );
              }
            });
            // only throw 10% of the time in case we are using this "legitimately"
            if (toNumber(ref.path.authUid) % 10 === 9) {
              throw new Error(invalidDocumentMessage);
            }
          }
          return mismatched.length === 0;
        })
        .sort((id1, id2) =>
          compareMultipleFields<C['DocumentType']>(order)(
            updatedDocuments[id1].rawDocument,
            updatedDocuments[id2].rawDocument,
          ),
        );

  const otherQueryResultsUpdated: QueryResults<C> = fromPairs(
    Object.entries(userCollectionSlice.queries)
      .filter(([key]) => key !== queryString)
      .map(([key, queryResult]) => [
        key,
        updateDocuments(queryResult, documents, updatedDocuments),
      ]),
  );

  const query: RawQuery<C['DocumentType']> = ref.query || {
    queryParams: {},
    searchQueryParams: {},
    isDocumentQuery: false,
  };

  // For plain `document` calls, merge all lists. For queried datastore calls, e.g.
  // `collection` and `document` by secondary ID, overwrite the current list
  // and merge all other lists.
  const updatedLists: QueryResults<C> = queryString
    ? {
        ...otherQueryResultsUpdated,
        [queryString]: {
          ids: newListIds,
          query,
          order,
          approximateTotalCount,
          timeFetched: Date.now(),
          timeUpdated: Date.now(),
        },
      }
    : otherQueryResultsUpdated;

  return {
    ...state,
    [ref.path.authUid]: {
      documents: updatedDocuments,
      queries: updatedLists,
    },
  };
}

/* This merges a number of documents into the state.
 * If an offset it specified then the new documents are placed at that offset.
 * If an offset is not specified then the new documents will be:
 *   - merged if they have the same id as an existing document OR
 *   - placed at the start of the list (and the offset of existing items moved up)
 *
 * We also allow a custom sorting function to allow resorting the list.
 * If this is used all the offsets will be then be reindexed from 0.
 * TODO T40096: This is a websocket version of mergeDocuments, which has more
 * logic right now to apply the websocket data on the right place of the store
 * slice. Maybe we can merge this with mergeDocuments again?
 */
export function mergeWebsocketDocuments<C extends DatastoreCollectionType>(
  state: CollectionStateSlice<C>,
  rawDocuments: ReadonlyArray<C['DocumentType']>,
  ref: Reference<C>,
): CollectionStateSlice<C> {
  const documents = addDocumentMetadata(rawDocuments);
  const slice = state[ref.path.authUid];
  const storeSlice =
    slice && slice.documents
      ? slice
      : {
          documents: {},
          queries: {},
        };

  const updatedDocuments = mergeRawDocuments(storeSlice.documents, documents);

  if (!storeSlice.queries) {
    return state;
  }

  const updatedQueryResult: QueryResults<C> = fromPairs(
    Object.entries(storeSlice.queries).map(([key, list]) => [
      key,
      updateDocuments(list, documents, updatedDocuments),
    ]),
  );

  return {
    ...state,
    [ref.path.authUid]: {
      documents: updatedDocuments,
      queries: { ...storeSlice.queries, ...updatedQueryResult },
    },
  };
}

function updateDocuments<C extends DatastoreCollectionType>(
  queryResult: QueryResult<C>,
  documents: Documents<C['DocumentType']>,
  updatedDocuments: Documents<C['DocumentType']>,
): QueryResult<C> {
  const { query, order } = queryResult;
  const { queryParams, offset, limit } = query;

  // If the offset is non-zero we don't add it to the new list.
  if (offset) {
    return queryResult;
  }

  // If the query is a search query we can't process it so we leave the list unchanged
  if (isSearchQuery(query)) {
    return queryResult;
  }

  // Existing document ids of the old list
  const currDocumentIds = queryResult ? Array.from(queryResult.ids) : [];

  // Find which documents modified by the websocket now match (or don't match)
  // the query. These should be added (or removed) from the list
  const [matchingIds, nonMatchingIds] = partition(
    Object.entries(documents),
    ([documentId, documentWithMetadata]) =>
      documentWithMetadataMatchesQueryParams(documentWithMetadata, queryParams),
  ).map(entityEntries => entityEntries.map(([documentId]) => documentId));

  // The new list is the old list plus any matching document ids, minus any
  // non-matching document ids, while ensuring all ids are unique
  const filteredDocumentIds = setDiff(
    currDocumentIds.concat(matchingIds),
    nonMatchingIds,
  );

  // Finally, apply limit to the ids before merging into list
  const updatedDocumentIds = [...filteredDocumentIds]
    .sort((id1, id2) =>
      compareMultipleFields<C['DocumentType']>(order)(
        updatedDocuments[id1].rawDocument,
        updatedDocuments[id2].rawDocument,
      ),
    )
    .slice(0, limit);

  return sameElements(currDocumentIds, updatedDocumentIds)
    ? { ...queryResult, ids: updatedDocumentIds }
    : { ...queryResult, ids: updatedDocumentIds, timeUpdated: Date.now() };
}

/**
 * Add/overwrite a list of documents to the datastore that are from a websocket.
 * If you instead want to modify an existing object use
 * `transformWebsocketDocuments`.]
 * If your transformer maps to `undefined` then the document will be ignored.
 */
export function addWebsocketDocuments<C extends DatastoreCollectionType, O>(
  state: CollectionStateSlice<C>,
  list: ReadonlyArray<O>,
  transform: (a: O) => C['DocumentType'] | undefined,
  ref: Reference<C>,
): CollectionStateSlice<C>;
export function addWebsocketDocuments<C extends DatastoreCollectionType, O, E>(
  state: CollectionStateSlice<C>,
  list: ReadonlyArray<O>,
  transform: (a: O, extra: E) => C['DocumentType'] | undefined,
  ref: Reference<C>,
  extra: E,
): CollectionStateSlice<C>;
export function addWebsocketDocuments<C extends DatastoreCollectionType, O, E>(
  state: CollectionStateSlice<C>,
  list: ReadonlyArray<O>,
  transform: (a: O, extra?: E) => C['DocumentType'] | undefined,
  ref: Reference<C>,
  extra?: E,
): CollectionStateSlice<C> {
  return mergeWebsocketDocuments<C>(
    state,
    transformOptionalWebsocketObjects(list, transform, extra),
    ref,
  );
}

/**
 * Update documents in the collection by running a transformation on them.
 * If an document is not found in the store, it is ignored.
 *
 * @param state slice of store state representing a collection
 * @param list ids of the documents to update
 * @param transform applied to every document with an id in `list`
 * @param ref a Datastore reference, links back to the dispatching action
 */
export function updateWebsocketDocuments<C extends DatastoreCollectionType>(
  state: CollectionStateSlice<C>,
  list: ReadonlyArray<string> | ReadonlyArray<number>,
  transform: (a: C['DocumentType']) => C['DocumentType'],
  ref: Reference<C>,
): CollectionStateSlice<C> {
  return mergeWebsocketDocuments<C>(
    state,
    transformOptionalWebsocketObjects<C['DocumentType'], string | number>(
      list,
      id => {
        const document = pluckDocumentFromRawStoreCollectionState(
          state,
          ref.path,
          id,
        );
        return document ? transform(document) : undefined;
      },
    ),
    ref,
  );
}

/**
 * Update all documents in the collection by running a transformation on them.
 * The transform function should return the original object if it does not need
 * to be updated.
 *
 * Note: Due to performance considerations, you should strongly favour
 * `updateWebsocketDocuments` over this variant. This variant should only be used
 * when access to ALL the documents is required to perform an update (e.g.
 * filtering them based on some property of the document).
 * If you are unsure, use the other one.
 *
 * @param state store state representing a collection
 * @param transform applied to every document in the collection
 * @param ref a Datastore reference, links back to the dispatching action
 */
export function updateAllDocuments<C extends DatastoreCollectionType>(
  state: CollectionStateSlice<C>,
  transform: (a: C['DocumentType']) => C['DocumentType'],
  ref: Reference<C>,
): CollectionStateSlice<C> {
  const slice = state[ref.path.authUid];
  return mergeWebsocketDocuments<C>(
    state,
    transformOptionalWebsocketObjects<C['DocumentType'], string | number>(
      Object.keys(slice ? slice.documents : {}),
      id => {
        const document = pluckDocumentFromRawStoreCollectionState(
          state,
          ref.path,
          id,
        );
        if (!document) {
          return undefined;
        }

        const transformedObject = transform(document);
        // Transformed object is the same, skip over this document
        return transformedObject === document ? undefined : transformedObject;
      },
    ),
    ref,
  );
}

interface ObjectWithId {
  readonly id: number | string;
}

export function transformIntoDocuments<T extends ObjectWithId, O>(
  list: ReadonlyArray<O> | { readonly [id: number]: O | undefined } | undefined,
  transform: (a: NonNullable<O>) => T,
): ReadonlyArray<T>;

export function transformIntoDocuments<T extends ObjectWithId, O, E>(
  list: ReadonlyArray<O> | { readonly [id: number]: O | undefined } | undefined,
  transform: (a: NonNullable<O>, extra: E) => T,
  extra: E,
): ReadonlyArray<T>;

export function transformIntoDocuments<T extends ObjectWithId, O, E>(
  list: ReadonlyArray<O> | { readonly [id: number]: O | undefined } | undefined,
  transform: (a: NonNullable<O>, extra?: E) => T,
  extra?: E,
): ReadonlyArray<T> {
  if (!list) {
    return [];
  }

  const actualList: ReadonlyArray<NonNullable<O>> = (Array.isArray(list)
    ? list
    : Object.values<O | undefined>(list)
  ).filter(isDefined);

  return actualList.map(o => transform(o, extra)).filter(isDefined);
}

export function addDocumentMetadata<T extends ObjectWithId>(
  rawDocuments: ReadonlyArray<T>,
): Documents<T> {
  return fromPairs(
    rawDocuments.map(rawDocument => [
      rawDocument.id,
      {
        rawDocument,
        timeFetched: Date.now(),
        timeUpdated: Date.now(),
      },
    ]),
  );
}

/**
 * This should only be used for websocket transformers as we shouldn't skip
 * objects when transforming get requests or it will break pagination.
 * It should not be exported.
 */
function transformOptionalWebsocketObjects<T extends ObjectWithId, O>(
  list: ReadonlyArray<O>,
  transform: (a: O) => T | undefined,
): ReadonlyArray<T>;
function transformOptionalWebsocketObjects<T extends ObjectWithId, O, E>(
  list: ReadonlyArray<O>,
  transform: (a: O, extra: E) => T | undefined,
  extra: E,
): ReadonlyArray<T>;
function transformOptionalWebsocketObjects<T extends ObjectWithId, O, E>(
  list: ReadonlyArray<O>,
  transform: (a: O, extra?: E) => T | undefined,
  extra?: E,
): ReadonlyArray<T> {
  return list.map(o => transform(o, extra)).filter(isDefined);
}

export function pathsEqual<C extends DatastoreCollectionType>(
  a: Path<C>,
  b: Path<C>,
) {
  return (
    a.collection === b.collection &&
    a.authUid === b.authUid &&
    sameElements(a.ids || [], b.ids || [])
  );
}

export function referencesEqual<C extends DatastoreCollectionType>(
  a: Reference<C>,
  b: Reference<C>,
) {
  return (
    pathsEqual(a.path, b.path) &&
    stringifyReference(a) === stringifyReference(b)
  );
}

export function resourceGroupsEqual<C extends DatastoreCollectionType>(
  a?: C['ResourceGroup'],
  b?: C['ResourceGroup'],
) {
  return (a === undefined && b === undefined) || (a && b && isEqual(a, b));
}

export function pluckDocumentFromRawStore<C extends DatastoreCollectionType>(
  store: StoreState,
  path: Path<C>,
  id: string | number,
): C['DocumentType'] | undefined {
  const slice = store[path.collection][path.authUid];
  return slice && slice.documents[id]
    ? slice.documents[id].rawDocument
    : undefined;
}

export function pluckDocumentFromRawStoreCollectionState<
  C extends DatastoreCollectionType
>(
  storeCollectionState: CollectionStateSlice<C>,
  path: Path<C>,
  id: string | number,
): C['DocumentType'] | undefined {
  const slice = storeCollectionState[path.authUid];
  if (!slice || !slice.documents[id]) {
    return undefined;
  }
  return slice.documents[id].rawDocument;
}

export function removeDocumentById<C extends DatastoreCollectionType>(
  ref: Reference<C>,
  state: CollectionStateSlice<C>,
  id: string | number,
): CollectionStateSlice<C> {
  const data = state[ref.path.authUid] || { queries: {}, documents: {} };
  const documents = { ...data.documents };
  delete documents[id];

  // Remove the deleted ID from any list
  const lists = Object.entries(data.queries).reduce(
    (obj, [queryString, list]) => {
      const newIds = (list?.ids ?? []).filter(
        listId => listId.toString() !== id.toString(),
      );

      return {
        ...obj,
        [queryString]: sameElements(list?.ids ?? [], newIds)
          ? { ...list, ids: newIds }
          : { ...list, ids: newIds, timeUpdated: Date.now() },
      };
    },
    {} as QueryResults<C>,
  );

  return {
    ...state,
    [ref.path.authUid]: { documents, queries: lists },
  };
}

/**
 * Gets the query param value of a specific query param name and returns it in
 * an array.
 *
 * Note that for the `intersects` and `equalsIgnoreTrue` param conditions, the
 * param value (which already must be an array) is wrapped inside another array.
 * E.g. For the query `query => query.where('skills', 'intersects', [1, 2, 3])`:
 * `getQueryParamValue(query, 'skills') => [[1, 2, 3]]`. See TODO below on why
 *
 * @param query The query.
 * @param name The key of the entity for the query.
 * @param valueSelector (optional) Maps the param value into a new value. This
 * can be useful when the param value is an object but you want to retrieve a
 * nested property.
 *
 * @returns An array of the values.
 */
// TODO: Ideally this return type is consistently a flat array, i.e. if T[K] is
// an array, don't wrap it in another array. This could be achieved by conditional
// types pending resolution of https://github.com/Microsoft/TypeScript/issues/28917.
// In the meantime, we do this to ensure consistency with the type system and other
// `where` conditions which only work with array fields, e.g. 'includes',
// 'equalsIgnoreOrder' and 'intersects'
export function getQueryParamValue<T, K extends keyof T, R>(
  query: RawQuery<T> | undefined,
  name: K,
  valueSelector: (param: QueryParam<T, K>) => R,
): ReadonlyArray<R>;
export function getQueryParamValue<T, K extends keyof T>(
  query: RawQuery<T> | undefined,
  name: K,
): ReadonlyArray<T[K]>;
export function getQueryParamValue<T, K extends keyof T, R>(
  query: RawQuery<T> | undefined,
  name: K,
  valueSelector?: (param: QueryParam<T, K>) => R,
): ReadonlyArray<any> {
  if (!query || !query.queryParams) {
    return [];
  }

  const clauses = query.queryParams[name];
  if (!clauses) {
    return [];
  }

  const paramValues = clauses.reduce((acc, param) => {
    const value = valueSelector
      ? valueSelector(param)
      : isArrayParamValue(param)
      ? param.values
      : param.value;

    // 'in' + 'includes' are special cases to make actual return value consistent
    // with the return type inferred by TypeScript
    switch (param.condition) {
      case 'in':
        return [...acc, ...(value as ReadonlyArray<any>)];
      case 'includes':
        return [...acc, [value]];
      default:
        return [...acc, value];
    }
  }, [] as ReadonlyArray<any>);

  return paramValues;
}

function isArrayParamValue<T, K extends keyof T>(
  param: QueryParam<T, K>,
): param is
  | InListQueryParam<T, K>
  | ListIntersectsQueryParam<T, K>
  | ArrayEqualsQueryParam<T, K> {
  const isArrayParamCondition =
    param.condition === 'in' ||
    param.condition === 'intersects' ||
    param.condition === 'equalsIgnoreOrder';

  if (isArrayParamCondition && !Array.isArray((param as any).values)) {
    throw new Error(
      `Query parameter on field '${param.name}' has condition '${param.condition}' but does not have an array value.`,
    );
  }

  return isArrayParamCondition;
}

export function getBoundedIntervalQueryParamValues<T, K extends keyof T>(
  query: RawQuery<T> | undefined,
  name: K,
): readonly [T[K] & number, T[K] & number] | undefined {
  if (!query || !query.queryParams) {
    return undefined;
  }

  const params: readonly QueryParam<T, K>[] | undefined =
    query.queryParams[name];
  if (!isDefined(params)) {
    return undefined;
  }

  return isValidInterval(params)
    ? ([params[0].value, params[1].value] as const)
    : undefined;
}

/**
 * Get the query param value for a nearby query and returns the first
 * nearby query param coordinate object, or undefined if the query did not
 * have the nearby condition specified.
 *
 * Note: Will throw if the given nearby query param was not valid.
 *
 * @param {RawQuery<T> | undefined} query
 * @param {K} name The key of the entity for the query with has the
 * map coordinates defined.
 *
 * @returns {NearbyQueryParamValue | undefined}
 */
export function getNearbyQueryParamValue<T, K extends keyof T>(
  query: RawQuery<T> | undefined,
  name: K,
): NearbyQueryParamValue | undefined {
  return getQueryParamValue(query, name, param => {
    if (param.condition !== 'nearby') {
      return undefined;
    }

    if (
      typeof param.value.latitude !== 'number' ||
      typeof param.value.longitude !== 'number'
    ) {
      throw new Error(
        'Must supply numeric latitude and longitude with nearby queries.',
      );
    }

    return param.value;
  })[0];
}
