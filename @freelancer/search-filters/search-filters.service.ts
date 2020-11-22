import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fromPairs, isDefined } from '@freelancer/utils';
import * as Rx from 'rxjs';
import { map, publishReplay, refCount, take } from 'rxjs/operators';
import { FilterArrayItem, FilterValue } from './search-filters.model';

@Injectable({
  providedIn: 'root',
})
export class SearchFiltersService {
  private supportedFiltersSubjectMap: {
    [searchType: string]: {
      [filter: string]: Rx.ReplaySubject<
        ReadonlyArray<FilterArrayItem> | FilterValue
      >;
    };
  } = {};

  private supportedFiltersValueChangesMap: {
    [searchType: string]: {
      [filter: string]: Rx.Observable<
        ReadonlyArray<FilterArrayItem> | FilterValue
      >;
    };
  } = {};

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}

  private initializeFilter(type: string, filter: string): void {
    if (!(type in this.supportedFiltersSubjectMap)) {
      this.supportedFiltersSubjectMap[type] = {};
      this.supportedFiltersValueChangesMap[type] = {};
    }

    if (!(filter in this.supportedFiltersSubjectMap[type])) {
      this.supportedFiltersSubjectMap[type][filter] = new Rx.ReplaySubject<
        ReadonlyArray<FilterArrayItem> | FilterValue
      >();
      this.supportedFiltersValueChangesMap[type][
        filter
      ] = this.supportedFiltersSubjectMap[type][filter]
        .asObservable()
        .pipe(publishReplay(1), refCount());
    }

    const filterValueFromUrl = this.activatedRoute.snapshot.queryParams[filter];

    this.supportedFiltersSubjectMap[type][filter].next(
      this.decodeFilterValueFromUrl(filterValueFromUrl),
    );
  }

  valueChanges(
    type: string,
    filter: string,
  ): Rx.Observable<ReadonlyArray<FilterArrayItem> | FilterValue> {
    if (
      !(type in this.supportedFiltersSubjectMap) ||
      !(filter in this.supportedFiltersSubjectMap[type])
    ) {
      this.initializeFilter(type, filter);
    }

    return this.supportedFiltersValueChangesMap[type][filter];
  }

  /**
   * Calling `setFilter` will trigger a `valueChanges` emission, with the value passed here as the
   * emission value.
   *
   * As a side effect, the URL will also be updated with the value passed here, for the corresponding
   * filter (retaining the existing URL values for the other filters). With the array type, the `value`
   * property of the items with `selected: true` will be encoded to the URL as a comma-separated string,
   * while the non-array type will be encoded to the URL with `encodeURIComponent(JSON.stringify(x))`.
   */
  setFilter(
    type: string,
    filter: string,
    value: ReadonlyArray<FilterArrayItem> | FilterValue,
  ) {
    if (
      !(type in this.supportedFiltersSubjectMap) ||
      !(filter in this.supportedFiltersSubjectMap[type])
    ) {
      this.initializeFilter(type, filter);
    }

    this.supportedFiltersSubjectMap[type][filter].next(value);

    this.router.navigate([], {
      queryParams: {
        ...this.activatedRoute.snapshot.queryParams,
        [filter]: this.encodeFilterValueForUrl(value),
      },
      replaceUrl: true,
    });
  }

  /**
   * For a particular search type, create a snapshot of the current state of
   * filters and update the URL with those filters encoded as query params.
   */
  updateUrlFromCurrentState(type: string) {
    // FIXME: T187088. This is a temporary check while we haven't released
    // the filter service integrations yet. Clean this up after release.
    if (!this.supportedFiltersValueChangesMap[type]) {
      return;
    }

    this.getLatestFilterParamsSnapshot$(type)
      .toPromise()
      .then(queryParams =>
        this.router.navigate([], {
          queryParams,
          replaceUrl: true,
          queryParamsHandling: 'merge',
        }),
      );
  }

  /**
   * Generate the query params for a particular search type.
   *
   * This simply gets the observables map of supportedFiltersValueChangesMap,
   * but also completes them and encodes the emissions for the URL.
   */
  private getLatestFilterParamsSnapshot$(
    type: string,
  ): Rx.Observable<{ [filter: string]: string | undefined }> {
    const latestFilters = fromPairs(
      Object.entries(this.supportedFiltersValueChangesMap[type]).map(
        ([filterKey, filterValue$]) => [
          filterKey,
          filterValue$.pipe(
            map(filterValue => this.encodeFilterValueForUrl(filterValue)),
            take(1),
          ),
        ],
      ),
    );

    return Rx.forkJoin(latestFilters);
  }

  private decodeFilterValueFromUrl(
    filterValue: string | undefined,
  ): ReadonlyArray<FilterArrayItem> | FilterValue {
    if (!isDefined(filterValue)) {
      return '';
    }

    try {
      // If it's "JSON parsable", we return the value as parsed.
      const parsedFilterValue = JSON.parse(decodeURIComponent(filterValue));
      return parsedFilterValue;
    } catch (e) {
      // If it's not "JSON parsable" (i.e. a comma-separated string),
      // it will throw an exception, and we fall back to an attempt
      // to split the value by comma.
      const arrayFilterValue = Array.from(new Set(filterValue.split(',')));
      return arrayFilterValue.map(item => ({
        value: item,
        selected: true,
      }));
    }
  }

  private encodeFilterValueForUrl(
    filterValue: ReadonlyArray<FilterArrayItem> | FilterValue,
  ): string | undefined {
    if (Array.isArray(filterValue)) {
      const encodedArrayFilterValue = filterValue
        .filter(item => item.selected)
        .map(item => item.value)
        .join(',');

      return encodedArrayFilterValue !== ''
        ? encodedArrayFilterValue
        : undefined;
    }

    return filterValue !== ''
      ? encodeURIComponent(JSON.stringify(filterValue))
      : undefined;
  }
}
