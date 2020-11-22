import {
  DatastoreCollectionType,
  DatastorePushCollectionType,
  DatastoreUpdateCollectionType,
  PushDocumentType,
  SearchQueryParams,
} from '@freelancer/datastore/core';
import { DatastoreFake } from './datastore';

/**
 * Transforms a (partial) document into a document for the purposes of emulating
 * computed fields in the fake Datastore.
 */
export type PushTransformer<
  C extends DatastoreCollectionType & DatastorePushCollectionType
> = (
  authUid: number,
  document: PushDocumentType<C> & Partial<Pick<C['DocumentType'], 'id'>>,
  extra?: { readonly [index: string]: string | number },
) => C['DocumentType'];

/**
 * Recreates reducer logic missing from the fake datastore for document updates.
 */
export type UpdateTransformer<
  C extends DatastoreCollectionType & DatastoreUpdateCollectionType
> = (
  authUid: number,
  document: C['DocumentType'],
  delta: Partial<C['DocumentType']>,
) => C['DocumentType'];

/**
 *
 */
export interface MutationPropagator<
  C1 extends DatastoreCollectionType & DatastorePushCollectionType,
  C2 extends DatastoreCollectionType & DatastorePushCollectionType
> {
  readonly from: C1['Name'];
  readonly to: C2['Name'];
  readonly config: {
    readonly update?: {
      targetDocumentId(
        originalDocument: C1['DocumentType'],
      ): C2['DocumentType']['id'];
      transformer?(
        authUid: number,
        delta: Partial<C1['DocumentType']>,
        originalDocument: C1['DocumentType'],
        targetDocument: C2['DocumentType'],
      ): C2['DocumentType'];
    };
    push?(
      authUid: number,
      document: PushDocumentType<C1> & Partial<Pick<C1['DocumentType'], 'id'>>,
      extra?: { readonly [index: string]: string | number },
    ): C2['DocumentType'];
  };
}

export type SearchTransformer<C extends DatastoreCollectionType> = (
  documents: ReadonlyArray<C['DocumentType']>,
  searchParams: SearchQueryParams,
) => ReadonlyArray<C['DocumentType']>;

/** Methods on DatastoreFake to be used by UI tests. */
export abstract class DatastoreTestingController {
  /**
   * Creates an object directly in the store, without transformations.
   */
  abstract createRawDocument: DatastoreFake['createRawDocument'];

  /**
   * Removes data from an entire collection, or an object from a collection.
   * When called with no arguments, resets the whole datastore.
   */
  abstract resetState: DatastoreFake['resetState'];

  /**
   * Output store state for debugging.
   */
  abstract printState: DatastoreFake['printState'];

  /**
   * Add a transformer that will be used when creating new documents of a given
   * collection. Used to specify computed fields that would be returned by a
   * real backend, e.g. object ID.
   */
  abstract addPushTransformer: DatastoreFake['addPushTransformer'];

  /**
   * Add a transformer that will be used when updating documents of a given
   * collection. Used to replicate reducers that use the backend response rather
   * than the delta.
   */
  abstract addUpdateTransformer: DatastoreFake['addUpdateTransformer'];

  /**
   * Add a propagator that will be used when pushing or updating documents of a
   * given collection. Used to specify that mutations to the original collection
   * also apply to the related collection, e.g. bids and projectViewBids are
   * related, so pushing to the former should also push to the latter.
   */
  abstract addMutationPropagator: DatastoreFake['addMutationPropagator'];

  /**
   * Add a transformer that will be used when search queries are made on a given
   * collection. The transformer allows returning custom search results from
   * existing documents in the store. If one is provided, the order of documents
   * will be preserved.
   */
  abstract addSearchTransformer: DatastoreFake['addSearchTransformer'];

  /**
   * Make all requests to a particular datastore collection fail.
   */
  abstract makeCollectionFail: DatastoreFake['makeCollectionFail'];

  /**
   * Make a specific request to the datastore fail.
   */
  abstract makeRequestFail: DatastoreFake['makeRequestFail'];

  /**
   * Make all requests to a particular datastore collection never return.
   */
  abstract makeCollectionPending: DatastoreFake['makeCollectionPending'];

  /**
   * Make a specific request to the datastore never return.
   */
  abstract makeRequestPending: DatastoreFake['makeRequestPending'];
}
