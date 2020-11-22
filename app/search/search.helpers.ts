import {
  FilterArrayItem,
  SearchFiltersService,
} from '@freelancer/search-filters';
import * as Rx from 'rxjs';
import { take } from 'rxjs/operators';
import {
  ContestFilters,
  ProjectFilters,
  SearchType,
  UserFilters,
} from './search.model';

export function handleFilterDropdownSelect(
  value: FilterArrayItem['value'],
  searchType: SearchType,
  filterType: ContestFilters | ProjectFilters | UserFilters,
  filterValuesFromService$: Rx.Observable<ReadonlyArray<FilterArrayItem>>,
  searchFiltersService: SearchFiltersService,
) {
  filterValuesFromService$
    .pipe(take(1))
    .toPromise()
    .then(filterValuesFromService =>
      searchFiltersService.setFilter(searchType, filterType, [
        {
          value,
          selected: true,
        },
        ...filterValuesFromService,
      ]),
    );
}
