import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Datastore, DatastoreCollection } from '@freelancer/datastore';
import {
  SearchActiveProject,
  SearchActiveProjectsCollection,
  SearchContestEntry,
  SearchFreelancersCollection,
  SearchKeywordProject,
  SearchKeywordProjectsCollection,
} from '@freelancer/datastore/collections';
import { Feature } from '@freelancer/feature-flags';
import { Margin } from '@freelancer/ui/margin';
import { FontWeight, TextSize, TextTransform } from '@freelancer/ui/text';
import * as Rx from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  startWith,
} from 'rxjs/operators';

@Component({
  selector: 'app-browse',
  // TODO: T69857 Need a width for callouts
  template: `
    <fl-bit class="Content">
      <fl-bit
        class="Heading"
        flTrackingSection="NavigationPrimary"
        *flFeature="Feature.SEARCH"
      >
        <fl-text
          i18n="Browse Type heading"
          [flHideDesktop]="true"
          [flHideTablet]="true"
          [flMarginBottom]="Margin.SMALL"
          [size]="TextSize.XXSMALL"
          [textTransform]="TextTransform.UPPERCASE"
          [weight]="FontWeight.BOLD"
        >
          Browse
        </fl-text>
        <fl-search
          i18n-placeholder="Nav search placeholder"
          placeholder="Search Freelancer.com"
          (query)="handleQuery($event)"
        ></fl-search>

        <fl-hr class="Heading-divider" [flHideMobile]="true"></fl-hr>
      </fl-bit>

      <ng-container *ngIf="(query$ | async) === ''; else searchResult">
        <app-browse-links
          flTrackingSection="NavigationPrimary"
        ></app-browse-links>
      </ng-container>

      <ng-template #searchResult>
        <app-user-search-results
          flTrackingSection="NavigationPrimary"
          [loading]="loadingUsers$ | async"
          [searchResults]="freelancersSearchCollection.valueChanges() | async"
        ></app-user-search-results>
        <app-project-search-results
          flTrackingSection="NavigationPrimary"
          [loading]="loadingProjects$ | async"
          [searchResults]="searchProjects$ | async"
        ></app-project-search-results>
      </ng-template>
    </fl-bit>
  `,
  styleUrls: ['./browse.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrowseComponent implements OnInit {
  Feature = Feature;
  TextSize = TextSize;
  FontWeight = FontWeight;
  Margin = Margin;
  TextTransform = TextTransform;

  loadingProjects$: Rx.Observable<boolean>;
  loadingUsers$: Rx.Observable<boolean>;
  query$: Rx.Observable<string>;
  searchContests$: Rx.Observable<ReadonlyArray<SearchContestEntry>>;
  freelancersSearchCollection: DatastoreCollection<SearchFreelancersCollection>;
  searchProjects$: Rx.Observable<
    ReadonlyArray<SearchActiveProject | SearchKeywordProject>
  >;

  private _querySubject$ = new Rx.BehaviorSubject<string>('');

  constructor(private datastore: Datastore) {}

  ngOnInit() {
    // TODO: T70241 Search in bits should have the debounce time instead of here
    this.query$ = this._querySubject$.pipe(
      map(value => value.trim()),
      debounceTime(250),
      distinctUntilChanged(),
    );

    const searchQuery$ = this.query$.pipe(
      filter(q => q !== ''),
      map(q => ({ q })),
    );

    // TODO: T69852 Add contest after talking to design
    // this.searchContests$ = this.datastore.collection(
    //   'searchContests',
    //   query => query.search(searchQuery$).limit(3),
    // );

    this.freelancersSearchCollection = this.datastore.collection<
      SearchFreelancersCollection
    >('searchFreelancers', query => query.search(searchQuery$).limit(6));

    const keywordProjectSearchCollection = this.datastore.collection<
      SearchKeywordProjectsCollection
    >('searchKeywordProjects', query => query.search(searchQuery$).limit(1));

    const activeProjectsSearchCollection = this.datastore.collection<
      SearchActiveProjectsCollection
    >('searchActiveProjects', query => query.search(searchQuery$).limit(3));

    this.searchProjects$ = Rx.merge(
      keywordProjectSearchCollection.valueChanges(),
      activeProjectsSearchCollection.valueChanges(),
    );

    this.loadingProjects$ = Rx.merge(
      this._querySubject$.pipe(mapTo(true)),
      this.searchProjects$.pipe(mapTo(false)),
    ).pipe(startWith(true));

    this.loadingUsers$ = Rx.merge(
      this._querySubject$.pipe(mapTo(true)),
      this.freelancersSearchCollection.valueChanges().pipe(mapTo(false)),
    ).pipe(startWith(true));
  }

  handleQuery(query: string) {
    this._querySubject$.next(query);
  }
}
