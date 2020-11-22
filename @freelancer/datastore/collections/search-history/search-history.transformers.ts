import { SearchHistoryEntryAjax } from './search-history.backend-model';
import { SearchHistoryEntry } from './search-history.model';

export function transformSearchHistory(
  item: SearchHistoryEntryAjax,
): SearchHistoryEntry {
  return {
    id: item.timestamp,
    userId: item.user_id,
    keyword: item.keyword,
    timestamp: item.timestamp * 1000, // Turn seconds to ms
  };
}
