import {
  CollectionActions,
  CollectionStateSlice,
  deepSpread,
  mergeDocuments,
  mergeWebsocketDocuments,
  Ordering,
  pluckDocumentFromRawStoreCollectionState,
  RecursivePartial,
  Reference,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { EntryStockItemApi } from 'api-typings/contests/contests';
import { ContestEntryAction } from '../contest-view-entries/contest-view-entries.backend-model';
import { transformEntryFileApi } from '../contest-view-entries/contest-view-entries.transformers';
import { ContestViewEntriesCollection } from '../contest-view-entries/contest-view-entries.types';
import { ContestQuickviewEntry } from './contest-quickview-entries.model';
import {
  transformContestEntryStockItemApi,
  transformContestQuickviewEntry,
} from './contest-quickview-entries.transformers';
import { ContestQuickviewEntriesCollection } from './contest-quickview-entries.types';

export function contestQuickviewEntriesReducer(
  state: CollectionStateSlice<ContestQuickviewEntriesCollection> = {},
  action:
    | CollectionActions<ContestViewEntriesCollection>
    | CollectionActions<ContestQuickviewEntriesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (
        action.payload.type === 'contestQuickviewEntries' ||
        action.payload.type === 'contestViewEntries'
      ) {
        const { result, order } = action.payload;
        if (result.entries) {
          const reference: Reference<ContestQuickviewEntriesCollection> = {
            path: {
              collection: 'contestQuickviewEntries',
              authUid: action.payload.ref.path.authUid,
            },
          };
          let { entries } = result;

          if (action.payload.type === 'contestViewEntries') {
            entries = entries.map(entry => {
              const quickviewEntry = pluckDocumentFromRawStoreCollectionState(
                state,
                reference.path,
                entry.id,
              );
              const stockItems: ReadonlyArray<EntryStockItemApi> = !quickviewEntry
                ? []
                : quickviewEntry.stockItems.map(
                    transformContestEntryStockItemApi,
                  );

              return { ...entry, stock_items: stockItems };
            });
          }

          return mergeDocuments<ContestQuickviewEntriesCollection>(
            state,
            transformIntoDocuments(entries, transformContestQuickviewEntry),
            // cast from `Ordering<ContestViewEntriesCollection>`, which is functionally the same type
            // we can't just reconstruct it like with Reference because the type is complex
            order as Ordering<ContestQuickviewEntriesCollection>,
            reference,
          );
        }
        return state;
      }
      return state;
    }

    case 'API_UPDATE': {
      if (
        action.payload.type === 'contestQuickviewEntries' ||
        action.payload.type === 'contestViewEntries'
      ) {
        const { delta, originalDocument } = action.payload;
        const ref: Reference<ContestQuickviewEntriesCollection> = {
          path: {
            collection: 'contestQuickviewEntries',
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
          if (action.payload.type === 'contestQuickviewEntries') {
            throw new Error('Entry being updated is missing in the store');
          }

          // If the change is from contestViewEntries, there's a chance that
          // the entry is not present ins contestQuickviewEntries store yet. Return
          // the current state instead
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
        let modifiedDelta: RecursivePartial<ContestQuickviewEntry> = delta;
        const likeCount = entry.likeCount ? entry.likeCount : 0;
        if (delta.isLiked !== undefined) {
          if (delta.isLiked) {
            modifiedDelta = { ...delta, likeCount: likeCount + 1 };
          } else {
            modifiedDelta = { ...delta, likeCount: likeCount - 1 };
          }
        }

        const { stockItems } = entry;
        const quickviewEntry = { ...entry, stockItems };

        return mergeWebsocketDocuments<ContestQuickviewEntriesCollection>(
          state,
          transformIntoDocuments([entryId], () =>
            deepSpread(quickviewEntry, modifiedDelta),
          ),
          ref,
        );
      }
      return state;
    }

    case 'API_UPDATE_SUCCESS': {
      if (
        action.payload.type === 'contestQuickviewEntries' ||
        action.payload.type === 'contestViewEntries'
      ) {
        const { originalDocument, result } = action.payload;
        const ref: Reference<ContestQuickviewEntriesCollection> = {
          path: {
            collection: 'contestQuickviewEntries',
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
          if (action.payload.type === 'contestQuickviewEntries') {
            throw new Error(
              !result.entry
                ? 'Updated entry is missing from result'
                : 'Entry being updated is missing in the store',
            );
          }

          // If the change is from contestViewEntries, there's a chance that
          // the entry is not present ins contestQuickviewEntries store yet. Return
          // the current state instead
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
        const entryFiles = entry.files.map(transformEntryFileApi);
        const stockItems = entry.stockItems.map(
          transformContestEntryStockItemApi,
        );

        const updatedEntry = {
          ...result.entry,
          files: entryFiles,
          stock_items: stockItems,
        };

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

        return mergeWebsocketDocuments<ContestQuickviewEntriesCollection>(
          state,
          transformIntoDocuments([entryId], () => ({
            ...entry,
            ...transformContestQuickviewEntry(updatedEntry),
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
