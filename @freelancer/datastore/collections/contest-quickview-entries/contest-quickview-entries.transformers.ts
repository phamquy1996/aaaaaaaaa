import { EntryApi, EntryStockItemApi } from 'api-typings/contests/contests';
import { transformContestViewEntry } from '../contest-view-entries/contest-view-entries.transformers';
import {
  ContestEntryStockItem,
  ContestQuickviewEntry,
} from './contest-quickview-entries.model';

export function transformContestQuickviewEntry(
  entry: EntryApi,
): ContestQuickviewEntry {
  return {
    ...transformContestViewEntry(entry),
    stockItems: entry.stock_items
      ? entry.stock_items.map(transformContestEntryStockItem)
      : [],
  };
}

export function transformContestEntryStockItem(
  stockItem: EntryStockItemApi,
): ContestEntryStockItem {
  return {
    id: stockItem.id,
    name: stockItem.name,
    url: stockItem.link,
    isFree: stockItem.is_free,
  };
}

export function transformContestEntryStockItemApi(
  stockItem: ContestEntryStockItem,
): EntryStockItemApi {
  return {
    id: stockItem.id,
    name: stockItem.name,
    link: stockItem.url,
    is_free: stockItem.isFree,
  };
}
