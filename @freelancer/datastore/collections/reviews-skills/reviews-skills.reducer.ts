import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformReviewsSkills } from './reviews-skills.transformers';
import { ReviewsSkillsCollection } from './reviews-skills.types';

export function reviewsSkillsReducer(
  state: CollectionStateSlice<ReviewsSkillsCollection> = {},
  action: CollectionActions<ReviewsSkillsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'reviewsSkills') {
        const { result, ref, order } = action.payload;

        return mergeDocuments<ReviewsSkillsCollection>(
          state,
          transformIntoDocuments(result.reviews_skills, transformReviewsSkills),
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
