import {
  CollectionActions,
  CollectionStateSlice,
  deepSpread,
  mergeDocuments,
  mergeWebsocketDocuments,
  pluckDocumentFromRawStoreCollectionState,
  Reference,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { ContestQuickviewEntriesCollection } from '../contest-quickview-entries/contest-quickview-entries.types';
import { ContestEntryAction } from './contest-view-entries.backend-model';
import {
  transformContestViewEntry,
  transformEntryFileApi,
} from './contest-view-entries.transformers';
import { ContestViewEntriesCollection } from './contest-view-entries.types';

export function contestViewEntriesReducer(
  state: CollectionStateSlice<ContestViewEntriesCollection> = {},
  action:
    | CollectionActions<ContestViewEntriesCollection>
    | CollectionActions<ContestQuickviewEntriesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'contestViewEntries') {
        const { result, ref, order } = action.payload;
        if (result.entries) {
          return mergeDocuments<ContestViewEntriesCollection>(
            state,
            transformIntoDocuments(result.entries, transformContestViewEntry),
            order,
            ref,
          );
        }
        return state;
      }
      return state;
    }

    case 'API_UPDATE': {
      if (
        action.payload.type === 'contestViewEntries' ||
        action.payload.type === 'contestQuickviewEntries'
      ) {
        const { delta, originalDocument } = action.payload;
        const ref: Reference<ContestViewEntriesCollection> = {
          path: {
            collection: 'contestViewEntries',
            authUid: action.payload.ref.path.authUid,
          },
        };
        const entryId = originalDocument.id.toString();
        const entry = pluckDocumentFromRawStoreCollectionState(
          state,
          ref.path,
          entryId,
        );

        if (!entry) {
          if (action.payload.type === 'contestViewEntries') {
            throw new Error('Entry being updated is missing in the store');
          }

          // Since we load all entry IDs and use it as a reference to load the
          // next entry on quickview modal, the entry being updated might not
          // be present on the contestViewEntries store yet. Return the current
          // state instead
          return state;
        }

        // We only want instantaneous feedback for actions LIKE, DISLIKE, and
        // RATE.So if the action is not one of the previously mentioned, return
        // the current state. We do this in order to show a busy state for
        // reject and reconsider.
        if (
          !(
            action.payload.rawRequest.action === ContestEntryAction.DISLIKE ||
            action.payload.rawRequest.action === ContestEntryAction.LIKE ||
            action.payload.rawRequest.action === ContestEntryAction.RATE
          )
        ) {
          return state;
        }

        // Instant UI feedback for like count when liking/disliking an entry
        let modifiedDelta = delta;
        const likeCount = entry.likeCount ? entry.likeCount : 0;
        if (delta.isLiked !== undefined) {
          if (delta.isLiked) {
            modifiedDelta = { ...delta, likeCount: likeCount + 1 };
          } else {
            modifiedDelta = { ...delta, likeCount: likeCount - 1 };
          }
        }

        return mergeWebsocketDocuments<ContestViewEntriesCollection>(
          state,
          transformIntoDocuments([entryId], () =>
            deepSpread(entry, modifiedDelta),
          ),
          ref,
        );
      }
      return state;
    }

    case 'API_UPDATE_SUCCESS': {
      if (
        action.payload.type === 'contestViewEntries' ||
        action.payload.type === 'contestQuickviewEntries'
      ) {
        const { originalDocument, result } = action.payload;
        const ref: Reference<ContestViewEntriesCollection> = {
          path: {
            collection: 'contestViewEntries',
            authUid: action.payload.ref.path.authUid,
          },
        };
        const entryId = originalDocument.id.toString();
        const entry = pluckDocumentFromRawStoreCollectionState(
          state,
          ref.path,
          entryId,
        );

        if (!entry) {
          if (action.payload.type === 'contestViewEntries') {
            throw new Error(
              !result.entry
                ? 'Updated entry is missing from result'
                : 'Entry being updated is missing in the store',
            );
          }

          // Since we load all entry IDs and use it as a reference to load the
          // next entry on quickview modal, the entry being updated might not
          // be present on the contestViewEntries store yet. Return the current
          // state instead
          return state;
        }

        // Even though files of the updated entry is always gonna be unchanged,
        // `result.entry.files` will return a different set of data compared to the
        // result of a GET request because the result of a PUT request will be
        // coming from `GafHandler.php`, not from API endpoint.
        // - S3 buckets may differ
        // - If the entry file is a video, file extension of the file URL is not
        //   explicitly set to `.mp4` in `GafHandler.php`
        //
        // We want to maintain the same file data for the same entry so that
        // its `ContestViewEntry` observable won't trigger any change for `files`
        // property (e.g. avoid having the video file re-fetch/reload again.)
        const entryFiles = entry.files.map(file => transformEntryFileApi(file));
        const updatedEntry = { ...result.entry, files: entryFiles };

        // We used API_UPDATE to show instantaneous feedback for RATE, DISLIKE,
        // and LIKE. We return the current state if the success is for these
        // actions.
        if (
          action.payload.rawRequest.action === ContestEntryAction.DISLIKE ||
          action.payload.rawRequest.action === ContestEntryAction.LIKE ||
          action.payload.rawRequest.action === ContestEntryAction.RATE
        ) {
          return state;
        }

        return mergeWebsocketDocuments<ContestViewEntriesCollection>(
          state,
          transformIntoDocuments([entryId], () => ({
            ...entry,
            ...transformContestViewEntry(updatedEntry),
          })),
          ref,
        );
      }
      return state;
    }

    default:
      return state;
  }
}
