import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Datastore, DatastoreCollection } from '@freelancer/datastore';
import {
  ContestPoll,
  ContestPollsCollection,
  ContestViewContest,
} from '@freelancer/datastore/collections';
import { DurationFormat } from '@freelancer/pipes';
import { HeadingType } from '@freelancer/ui/heading';
import { IconSize } from '@freelancer/ui/icon';
import { LinkIconPosition } from '@freelancer/ui/link';
import { ListItemPadding } from '@freelancer/ui/list-item';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, TextSize } from '@freelancer/ui/text';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import * as Rx from 'rxjs';
import { distinctUntilChanged, filter, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-contest-polls-modal',
  template: `
    <ng-container *flModalTitle i18n="Polls modal title"> Polls </ng-container>
    <fl-bit flTrackingSection="ContestViewPage.PollsModal">
      <fl-bit [flHideMobile]="true">
        <fl-heading
          class="PollsModal-heading"
          i18n="Polls modal title"
          [headingType]="HeadingType.H2"
          [size]="TextSize.MID"
        >
          Polls
        </fl-heading>
        <fl-hr></fl-hr>
      </fl-bit>

      <fl-bit class="PollsModal-content">
        <fl-link
          class="PollsModal-cta"
          flTrackingLabel="CreateNewContestPoll"
          i18n="Create new poll title"
          [flShowMobile]="true"
          [iconName]="'ui-plus-thin'"
          [iconPosition]="LinkIconPosition.RIGHT"
          [iconSize]="IconSize.XSMALL"
          [link]="'/contest/poll/create.php'"
          [queryParams]="{ project_id: (contest$ | async)?.id }"
        >
          Create New
        </fl-link>

        <perfect-scrollbar class="PollsModal-scrollbar">
          <fl-list [outerPadding]="false" [flMarginBottom]="Margin.SMALL">
            <fl-list-item
              *ngFor="let poll of polls$ | async"
              [padding]="ListItemPadding.XXXSMALL"
            >
              <fl-link
                i18n="Poll link text"
                flTrackingLabel="ContestPoll"
                [link]="'/contest/poll/result.php'"
                [queryParams]="{ poll_id: poll?.id }"
              >
                Poll #{{ poll.pollNumber }}
              </fl-link>
              <fl-bit class="PollsModal-pollDetails">
                <fl-text
                  i18n="Create date of poll"
                  [color]="FontColor.MID"
                  [flMarginRight]="Margin.XXXSMALL"
                >
                  {{ poll.dateCreated | date }}
                </fl-text>
                <fl-text
                  *ngIf="poll.votes === 1; else pluralVotesText"
                  i18n="Number of poll votes"
                  [color]="FontColor.MID"
                >
                  &bull; {{ poll.votes }} vote
                </fl-text>
                <ng-template #pluralVotesText>
                  <fl-text i18n="Number of poll votes" [color]="FontColor.MID">
                    &bull; {{ poll.votes }} votes
                  </fl-text>
                </ng-template>
              </fl-bit>
            </fl-list-item>
          </fl-list>
        </perfect-scrollbar>

        <fl-hr [flMarginBottom]="Margin.SMALL"></fl-hr>
        <fl-bit class="PollsModal-loadMore" [flSticky]="true">
          <fl-link
            *ngIf="showLoadMore$ | async"
            i18n="Load more link"
            flTrackingLabel="ContestPoll"
            (click)="onLoadMore()"
          >
            Load More
          </fl-link>
        </fl-bit>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./contest-polls-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContestPollsModalComponent implements OnInit {
  DurationFormat = DurationFormat;
  FontColor = FontColor;
  HeadingType = HeadingType;
  IconSize = IconSize;
  LinkIconPosition = LinkIconPosition;
  ListItemPadding = ListItemPadding;
  Margin = Margin;
  TextSize = TextSize;

  @Input() contest$: Rx.Observable<ContestViewContest>;

  @ViewChild(PerfectScrollbarComponent)
  psbComponent: PerfectScrollbarComponent;

  readonly POLLS_LIMIT_INCREMENT = 8;

  showLoadMore$: Rx.Observable<boolean>;

  pollsLimitSubject$ = new Rx.BehaviorSubject<number>(
    this.POLLS_LIMIT_INCREMENT,
  );
  pollsLimit$ = this.pollsLimitSubject$.asObservable();
  pollsCollection: DatastoreCollection<ContestPollsCollection>;
  polls$: Rx.Observable<ReadonlyArray<ContestPoll>>;

  constructor(private datastore: Datastore) {}

  ngOnInit() {
    const contestId$ = this.contest$.pipe(
      map(contest => contest.id),
      distinctUntilChanged(),
    );

    this.pollsCollection = this.datastore.collection<ContestPollsCollection>(
      'contestPolls',
      query =>
        query
          .where('contestId', '==', contestId$)
          .limit(this.pollsLimit$.pipe(filter(limit => limit > 0))),
    );

    this.polls$ = this.pollsCollection.valueChanges();
    this.showLoadMore$ = this.polls$.pipe(
      map(polls => polls.length % this.POLLS_LIMIT_INCREMENT === 0),
      startWith(false),
    );
  }

  onLoadMore() {
    this.pollsLimitSubject$.next(
      this.pollsLimitSubject$.value + this.POLLS_LIMIT_INCREMENT,
    );
  }
}
