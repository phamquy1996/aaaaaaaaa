import {
  CollectionActions,
  CollectionStateSlice,
  deepSpread,
  mergeDocuments,
  mergeWebsocketDocuments,
  pluckDocumentFromRawStoreCollectionState,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformFeedMeta } from './feed-meta.transformers';
import { FeedMetaCollection } from './feed-meta.types';

export function feedMetaReducer(
  state: CollectionStateSlice<FeedMetaCollection> = {},
  action: CollectionActions<FeedMetaCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'feedMeta') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<FeedMetaCollection>(
          state,
          transformIntoDocuments(result.feed_metas, transformFeedMeta),
          order,
          ref,
        );
      }
      return state;
    }

    case 'API_UPDATE_SUCCESS': {
      if (action.payload.type === 'feedMeta') {
        const { originalDocument, ref, result } = action.payload;
        const feedMetaId = originalDocument.id.toString();
        const feedMeta = pluckDocumentFromRawStoreCollectionState(
          state,
          ref.path,
          feedMetaId,
        );
        if (!feedMeta) {
          throw new Error('Comment Feed being updated is missing from store.');
        }

        const resultFeedMetas = transformIntoDocuments(
          [result.feed_meta],
          transformFeedMeta,
          ref.path.authUid,
        );

        const resultFeedMeta = resultFeedMetas.find(
          feed => feed.id === originalDocument.id,
        );

        if (!resultFeedMeta) {
          throw new Error('Comment Feed being updated is missing in response.');
        }

        return mergeWebsocketDocuments<FeedMetaCollection>(
          state,
          [deepSpread(originalDocument, resultFeedMeta)],
          ref,
        );
      }
      return state;
    }

    default:
      return state;
  }
}
