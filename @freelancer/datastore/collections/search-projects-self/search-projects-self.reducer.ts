import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformSearchProjectsSelfEntry } from './search-projects-self.transformers';
import { SearchProjectsSelfCollection } from './search-projects-self.types';

export function searchProjectsSelfReducer(
  state: CollectionStateSlice<SearchProjectsSelfCollection> = {},
  action: CollectionActions<SearchProjectsSelfCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'searchProjectsSelf') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<SearchProjectsSelfCollection>(
          state,
          transformIntoDocuments(
            [
              ...result.projects.projects.map(
                project => ({ type: 'project', project } as const),
              ),
              ...result.contests.contests.map(
                contest => ({ type: 'contest', contest } as const),
              ),
            ],

            transformSearchProjectsSelfEntry,
          ),
          order,
          ref,
          result.total_count,
        );
      }
      return state;
    }

    default:
      return state;
  }
}
