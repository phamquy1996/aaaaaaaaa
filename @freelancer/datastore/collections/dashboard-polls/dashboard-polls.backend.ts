import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
  RawQuery,
} from '@freelancer/datastore/core';
import { isDefined } from '@freelancer/utils';
import { DashboardPoll } from './dashboard-polls.model';
import { DashboardPollsCollection } from './dashboard-polls.types';

export function dashboardPollsBackend(): Backend<DashboardPollsCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'dashboard/polls.php',
      isGaf: true,
      params: {
        answered: getQueryParamsPolls(query),
      },
    }),
    push: undefined,
    set: undefined,
    update: (authUid, partial, original) => {
      if (original.id === undefined) {
        throw new Error('Poll ID must be provided to update a poll.');
      }
      return {
        endpoint: 'dashboard/polls.php',
        isGaf: true,
        asFormData: false,
        method: 'PUT',
        payload: {
          id: original.id,
          hide: partial.hide,
          answers: partial.answer
            ? partial.answer.filter(isDefined).filter(hasId)
            : [],
          answered: partial.answered,
        },
      };
    },
    remove: undefined,
  };
}
function getQueryParamsPolls(
  query: RawQuery<DashboardPoll> | undefined,
): boolean | undefined {
  return getQueryParamValue(query, 'answered', param =>
    param.condition === '==' && param.value ? true : undefined,
  )[0];
}

function hasId<T>(object: {
  readonly id?: T | undefined;
}): object is { readonly id: T } {
  return object.id !== undefined;
}
