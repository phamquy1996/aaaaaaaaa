import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { EntryStatusApi } from 'api-typings/contests/contests';
import { ContestEntryAction } from './contest-view-entries.backend-model';
import {
  transformEntriesSortApi,
  transformEntryHasFeedbackApi,
} from './contest-view-entries.transformers';
import { ContestViewEntriesCollection } from './contest-view-entries.types';

// order and update logic is duplicated in contest-quickview-entries.backend.ts
// change both if you changge one
export function contestViewEntriesBackend(): Backend<
  ContestViewEntriesCollection
> {
  return {
    defaultOrder: [
      {
        field: 'statusNumber',
        direction: OrderByDirection.DESC,
      },
      {
        field: 'rating',
        direction: OrderByDirection.DESC,
      },
      {
        field: 'number',
        direction: OrderByDirection.DESC,
      },
    ],

    fetch: (_, ids, query, order) => {
      let fromRating;
      let toRating;
      let apiSort;
      let apiSortAsc;

      if (
        query &&
        query.queryParams &&
        query.queryParams.rating &&
        query.queryParams.rating[0]
      ) {
        const ratingQuery = query.queryParams.rating[0];

        if (ratingQuery.condition === '>=') {
          fromRating = ratingQuery.value;
        } else if (ratingQuery.condition === '<') {
          toRating = ratingQuery.value;
        }
      }

      if (order && order[0]) {
        apiSort = transformEntriesSortApi(order[0].field);
        // We need to set it to undefined because the backend performs ascending sort as long as `sort_asc` is set
        apiSortAsc = order[0].direction === OrderByDirection.ASC || undefined;
      }

      return {
        endpoint: `contests/0.1/entries`,
        params: {
          entries: ids || [],
          contests: getQueryParamValue(query, 'contestId'),
          statuses: getQueryParamValue(query, 'status'),
          owners: getQueryParamValue(query, 'contestOwnerId'),
          entrants: getQueryParamValue(query, 'ownerId'),
          has_feedback: transformEntryHasFeedbackApi(
            getQueryParamValue(query, 'hasFeedback')[0],
          ),
          sort_field: apiSort,
          sort_asc: apiSortAsc,
          from_rating: fromRating,
          to_rating: toRating,
          file_details: 'true',
          comment_count: 'true',
          feedback_details: 'true',
        },
      };
    },
    push: undefined,

    set: undefined,

    update: (authUid, entry, originalEntry) => {
      let payload;

      if (entry.rating) {
        payload = {
          action: ContestEntryAction.RATE,
          rating: entry.rating,
        };
      } else if (
        entry.isLiked !== undefined &&
        entry.isLiked !== originalEntry.isLiked
      ) {
        payload = {
          action: entry.isLiked
            ? ContestEntryAction.LIKE
            : ContestEntryAction.DISLIKE,
        };
      } else if (entry.status && entry.status !== originalEntry.status) {
        let action;

        switch (entry.status) {
          case EntryStatusApi.WON:
            action = ContestEntryAction.AWARD;
            break;
          case EntryStatusApi.BOUGHT:
            action = ContestEntryAction.BUY;
            break;
          case EntryStatusApi.ELIMINATED:
            action = ContestEntryAction.REJECT;
            break;
          case EntryStatusApi.WITHDRAWN_ELIMINATED:
            if (originalEntry.status === EntryStatusApi.WITHDRAWN) {
              action = ContestEntryAction.REJECT;
            } else {
              // TODO: We're doing employer side actions for now
              // add support for action = `withdraw` after T78554 is implemented
              throw new Error(`
                Unknown action for entry status transition from ${entry.status}
                to ${EntryStatusApi.WITHDRAWN_ELIMINATED}
              `);
            }
            break;
          case EntryStatusApi.ACTIVE:
            if (originalEntry.status === EntryStatusApi.ELIMINATED) {
              action = ContestEntryAction.RECONSIDER;
            } else {
              throw new Error(`
                Unknown action for entry status transition from
                ${originalEntry.status} to ${EntryStatusApi.ACTIVE}
              `);
            }
            break;
          default:
            throw new Error(`Unknown action for status: ${entry.status}`);
        }

        payload = { action };
      }

      if (!payload || !payload.action) {
        throw new Error(`Missing payload/action in entry update: ${payload}`);
      }

      return {
        endpoint: `/contests/0.1/entries/${originalEntry.id}/`,
        method: 'PUT',
        payload,
      };
    },
    remove: undefined,
  };
}
