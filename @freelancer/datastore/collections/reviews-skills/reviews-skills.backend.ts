import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
  RawQuery,
} from '@freelancer/datastore/core';
import { RoleApi } from 'api-typings/common/common';
import { ReviewsSkills } from './reviews-skills.model';
import { ReviewsSkillsCollection } from './reviews-skills.types';

export function reviewsSkillsBackend(): Backend<ReviewsSkillsCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query) => ({
      endpoint: 'projects/0.1/reviews/skills',
      isGaf: false,
      params: {
        to_users: getQueryParamValue(query, 'toUser'),
        from_users: getQueryParamValue(query, 'fromUser'),
        review_types: getQueryParamValue(query, 'reviewType'),
        role: getRoleQueryParamValue(query),
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
function getRoleQueryParamValue(
  query: RawQuery<ReviewsSkills> | undefined,
): RoleApi | undefined {
  return getQueryParamValue(query, 'role', param => {
    // `role` param can only accept a single value
    if (param.condition !== '==' && param.condition !== 'equalsIgnoreCase') {
      throw new Error('Specify a role filter for the reviews skills');
    }
    return param.value;
  })[0];
}
