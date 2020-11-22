import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformArticles } from './articles.transformers';
import { ArticlesCollection } from './articles.types';

export function articlesReducer(
  state: CollectionStateSlice<ArticlesCollection> = {},
  action: CollectionActions<ArticlesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'articles') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<ArticlesCollection>(
          state,
          transformIntoDocuments(result.articles, transformArticles),
          order,
          ref,
        );
      }
      return state;
    }

    default:
      return state;
  }
}
