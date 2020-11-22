import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ContestEngagement,
  ContestViewContest,
  ContestViewEntry,
} from '@freelancer/datastore/collections';
import { DurationFormat } from '@freelancer/pipes';
import { CalloutColor } from '@freelancer/ui/callout';
import { HeadingColor, HeadingType } from '@freelancer/ui/heading';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { TabsColor } from '@freelancer/ui/tabs';
import {
  FontColor,
  FontWeight,
  TextSize,
  TextTransform,
} from '@freelancer/ui/text';
import { ContestStatusApi } from 'api-typings/contests/contests';
import * as Rx from 'rxjs';
import { map } from 'rxjs/operators';

export enum ContestTab {
  DETAILS = 'details',
  ENTRIES = 'entries',
  COMMENTS = 'comments',
  HANDOVER = 'handover',
  REVIEWS = 'reviews',
  UPGRADES = 'upgrades',
}

@Component({
  selector: 'app-contest-view-header',
  template: `
    <fl-container
      *ngIf="contest$ | async as contest"
      flTrackingSection="ContestViewPage.Header"
    >
      <ng-container *flViewHeaderTemplate i18n="Contest title">
        {{ contest?.title }}
      </ng-container>
      <fl-bit
        class="ContestViewHeader-primary"
        [flMarginBottom]="Margin.MID"
        [flHideMobile]="true"
      >
        <fl-heading
          class="ContestViewHeader-title"
          [attr.title]="contest?.title"
          [color]="HeadingColor.LIGHT"
          [size]="TextSize.LARGE"
          [headingType]="HeadingType.H1"
        >
          <fl-bit class="ContestViewHeader-title-content">
            {{ contest?.title }}
          </fl-bit>
        </fl-heading>
        <fl-contest-status
          class="ContestViewHeader-status"
          [status]="contest?.status"
          [flHideMobile]="true"
        ></fl-contest-status>
      </fl-bit>
      <fl-bit [flShowMobile]="true" [flSticky]="true" [flStickyOrder]="1">
        <ng-container *ngTemplateOutlet="contestTabs"></ng-container>
      </fl-bit>
      <fl-bit [flHideMobile]="true">
        <ng-container *ngTemplateOutlet="contestTabs"></ng-container>
      </fl-bit>
      <ng-template #contestTabs>
        <fl-bit class="ContestViewHeader-secondary">
          <fl-tabs
            *ngIf="selectedTab$ | async as selectedTab"
            class="ContestViewHeader-tabs"
            [color]="TabsColor.LIGHT"
          >
            <fl-tab-item
              flTrackingLabel="DetailsTab"
              title="Details"
              i18n-title="Contest header details tab title"
              [selected]="selectedTab === ContestTab.DETAILS"
              (click)="handleTabClick(ContestTab.DETAILS)"
            ></fl-tab-item>
            <fl-tab-item
              flTrackingLabel="EntriesTab"
              title="Entries"
              i18n-title="Contest header entries tab title"
              [selected]="selectedTab === ContestTab.ENTRIES"
              (click)="handleTabClick(ContestTab.ENTRIES)"
            ></fl-tab-item>
            <fl-tab-item
              flTrackingLabel="CommentsTab"
              title="Comments"
              i18n-title="Contest header comments tab title"
              [selected]="selectedTab === ContestTab.COMMENTS"
              (click)="handleTabClick(ContestTab.COMMENTS)"
            ></fl-tab-item>
            <fl-tab-item
              flTrackingLabel="UpgradesTab"
              *ngIf="showExtend$ | async"
              title="Extend"
              i18n-title="Contest header upgrades tab title"
              [selected]="selectedTab === ContestTab.UPGRADES"
              (click)="handleTabClick(ContestTab.UPGRADES)"
            ></fl-tab-item>
            <fl-tab-item
              flTrackingLabel="UpgradesTab"
              *ngIf="showUpgrades$ | async"
              title="Upgrades"
              i18n-title="Contest header upgrades tab title"
              [selected]="selectedTab === ContestTab.UPGRADES"
              (click)="handleTabClick(ContestTab.UPGRADES)"
            ></fl-tab-item>
            <fl-tab-item
              flTrackingLabel="HandoverTab"
              *ngIf="awardedEntry$ | async"
              title="Handover"
              i18n-title="Contest header handover tab title"
              [selected]="selectedTab === ContestTab.HANDOVER"
              (click)="handleTabClick(ContestTab.HANDOVER)"
            ></fl-tab-item>
            <!-- TODO: Show after reviews tab has been implemented -->
            <fl-tab-item
              *ngIf="false"
              flTrackingLabel="ReviewsTab"
              title="Reviews"
              i18n-title="Contest header reviews tab title"
              [selected]="selectedTab === ContestTab.REVIEWS"
              (click)="handleTabClick(ContestTab.REVIEWS)"
            ></fl-tab-item>
          </fl-tabs>
          <fl-bit
            *ngIf="isContestOngoing$ | async"
            class="ContestDurationContainer"
            [flHideMobile]="true"
            [flMarginRight]="Margin.SMALL"
          >
            <fl-icon
              [name]="'ui-clock-v2'"
              [color]="IconColor.WHITE"
              [size]="IconSize.SMALL"
              [flMarginRight]="Margin.XXSMALL"
            ></fl-icon>
            <fl-text
              *ngIf="contestDuration$ | async as duration"
              i18n="Contest details duration text"
              [color]="FontColor.LIGHT"
              [textTransform]="TextTransform.UPPERCASE"
              [weight]="FontWeight.BOLD"
            >
              Contest ends in
              {{ duration | duration: DurationFormat.LONG | async }}
            </fl-text>
          </fl-bit>
          <app-engagement-meter
            [flHideMobile]="true"
            [engagement$]="engagement$"
            [contest$]="contest$"
          >
          </app-engagement-meter>
        </fl-bit>
        <fl-bit *ngIf="false" class="NewEntriesNotification">
          <fl-floating-action
            text="You have 1 new entry"
            i18n-text="New entry notification"
            [icon]="'ui-refresh'"
          ></fl-floating-action>
          <fl-floating-action
            text="You have N new entries"
            i18n-text="New entries notification"
            [icon]="'ui-refresh'"
          ></fl-floating-action>
        </fl-bit>
      </ng-template>
    </fl-container>
  `,
  styleUrls: [`./contest-view-header.component.scss`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContestViewHeaderComponent implements OnInit, OnDestroy {
  DurationFormat = DurationFormat;
  FontColor = FontColor;
  FontWeight = FontWeight;
  HeadingColor = HeadingColor;
  TextSize = TextSize;
  HeadingType = HeadingType;
  IconColor = IconColor;
  IconSize = IconSize;
  Margin = Margin;
  CalloutColor = CalloutColor;
  ContestTab = ContestTab;
  TabsColor = TabsColor;
  TextTransform = TextTransform;

  @Input() contest$: Rx.Observable<ContestViewContest>;
  @Input() engagement$: Rx.Observable<ContestEngagement>;
  @Input() isContestOwner$: Rx.Observable<boolean>;
  @Input() awardedEntry$: Rx.Observable<ContestViewEntry | undefined>;

  selectedTab$: Rx.Observable<ContestTab>;
  isStickyTab$: Rx.Observable<boolean>;

  awardedEntrySubscription?: Rx.Subscription;
  awardedEntryId: number | undefined;
  hasWhitelistQueryParamSubscription?: Rx.Subscription;
  hasWhitelistQueryParam: boolean;
  contestDuration$: Rx.Observable<number>;
  isContestOngoing$: Rx.Observable<boolean>;
  showExtend$: Rx.Observable<boolean>;
  showUpgrades$: Rx.Observable<boolean>;

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.awardedEntrySubscription = this.awardedEntry$.subscribe(
      awardedEntry =>
        (this.awardedEntryId = awardedEntry ? awardedEntry.id : undefined),
    );

    this.hasWhitelistQueryParamSubscription = this.activatedRoute.queryParams.subscribe(
      queryParams => (this.hasWhitelistQueryParam = queryParams.w === 't'),
    );

    this.selectedTab$ = this.activatedRoute.params.pipe(
      map(params => params.tabName as ContestTab),
    );

    this.showExtend$ = Rx.combineLatest([
      this.isContestOwner$,
      this.contest$,
      this.awardedEntry$,
    ]).pipe(
      map(
        ([isContestOwner, contest, awardedEntry]) =>
          isContestOwner &&
          !awardedEntry &&
          contest.status === ContestStatusApi.PENDING,
      ),
    );

    this.showUpgrades$ = Rx.combineLatest([
      this.isContestOwner$,
      this.contest$,
      this.awardedEntry$,
    ]).pipe(
      map(
        ([isContestOwner, contest, awardedEntry]) =>
          isContestOwner &&
          !awardedEntry &&
          ![
            ContestStatusApi.CLOSED,
            ContestStatusApi.INACTIVE,
            ContestStatusApi.PENDING,
          ].includes(contest.status),
      ),
    );

    this.isContestOngoing$ = this.contest$.pipe(
      map(
        contest =>
          ![ContestStatusApi.PENDING, ContestStatusApi.CLOSED].includes(
            contest.status,
          ),
      ),
    );

    this.contestDuration$ = this.contest$.pipe(
      map(contest =>
        contest.timeEnded ? contest.timeEnded - new Date().getTime() : 0,
      ),
    );
  }

  handleTabClick(selectedTab: ContestTab) {
    if (selectedTab === ContestTab.HANDOVER) {
      this.router.navigate(['/contest/handover.php'], {
        queryParams: {
          entry_id: this.awardedEntryId,
          from_webapp: true,
        },
      });
    } else {
      const queryParams = this.hasWhitelistQueryParam ? { w: 't' } : {};
      this.router.navigate([selectedTab], {
        relativeTo: this.activatedRoute,
        queryParams,
      });
    }
  }

  ngOnDestroy() {
    if (this.awardedEntrySubscription) {
      this.awardedEntrySubscription.unsubscribe();
    }
    if (this.hasWhitelistQueryParamSubscription) {
      this.hasWhitelistQueryParamSubscription.unsubscribe();
    }
  }
}
