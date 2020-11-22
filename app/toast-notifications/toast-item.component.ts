import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import {
  ProjectFeedEntry,
  ToastNotificationItem,
} from '@freelancer/datastore/collections';
import { TimeUtils } from '@freelancer/time-utils';
import { Assets } from '@freelancer/ui/assets';
import { IconBackdrop, IconColor, IconSize } from '@freelancer/ui/icon';
import { LinkUnderline } from '@freelancer/ui/link';
import { FontColor } from '@freelancer/ui/text';
import { AvatarSize } from '@freelancer/ui/user-avatar';
import * as Rx from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  mapTo,
  scan,
  startWith,
  switchMap,
  switchMapTo,
  takeWhile,
} from 'rxjs/operators';

@Component({
  selector: 'app-toast-item',
  template: `
    <fl-card
      class="CardContainer"
      [clickable]="true"
      [edgeToEdge]="true"
      (mouseover)="resetTimer()"
    >
      <fl-button
        class="ToastContainer"
        display="block"
        [link]="routerLink"
        [queryParams]="urlTree?.queryParams"
        [fragment]="urlTree?.fragment"
        flTrackingLabel="ToastItemLink"
      >
        <app-media-object>
          <app-media-object-thumbnail>
            <fl-user-avatar
              *ngIf="!isProjectFeedEntry"
              [size]="AvatarSize.SMALL"
              [users]="[{ avatar: userAvatar }]"
            ></fl-user-avatar>
            <fl-icon
              *ngIf="isProjectFeedEntry"
              [name]="thumbnailIcon"
              [color]="IconColor.WHITE"
              [backdrop]="IconBackdrop.TRANSPARENT"
              [size]="IconSize.SMALL"
            ></fl-icon>
          </app-media-object-thumbnail>
          <app-media-object-content>
            <fl-text [color]="FontColor.LIGHT">
              <ng-container
                *ngIf="isProjectFeedEntry; else notificationTemplates"
              >
                <app-notification-template-project-feed
                  [event]="event"
                  [lightColor]="true"
                ></app-notification-template-project-feed>
              </ng-container>
            </fl-text>
          </app-media-object-content>
        </app-media-object>
      </fl-button>
      <fl-button
        class="ToastClose"
        (click)="handleCloseButtonClick()"
        flTrackingLabel="ToastItemClose"
      >
        <fl-icon
          name="ui-close"
          i18n-label="Notification close icon tooltip"
          label="Close notification"
          [color]="IconColor.LIGHT"
          [size]="IconSize.SMALL"
        ></fl-icon>
      </fl-button>
      <ng-template #notificationTemplates>
        <ng-container [ngSwitch]="event.type">
          <app-notification-template-article-comment
            [event]="event"
            *ngSwitchCase="'articleCommentReceived'"
          >
          </app-notification-template-article-comment>
          <app-notification-template-award-milestone-reminder
            [event]="event"
            *ngSwitchCase="'awardMilestoneReminder'"
          >
          </app-notification-template-award-milestone-reminder>
          <app-notification-template-award-reminder
            [event]="event"
            *ngSwitchCase="'awardReminder'"
          >
          </app-notification-template-award-reminder>
          <app-notification-template-award
            [event]="event"
            *ngSwitchCase="'award'"
          >
          </app-notification-template-award>
          <app-notification-template-award-badge
            [event]="event"
            *ngSwitchCase="'awardBadge'"
          >
          </app-notification-template-award-badge>
          <app-notification-template-award-credit
            [event]="event"
            *ngSwitchCase="'awardCredit'"
          >
          </app-notification-template-award-credit>
          <app-notification-template-award-xp
            [event]="event"
            *ngSwitchCase="'awardXp'"
          >
          </app-notification-template-award-xp>
          <app-notification-template-bid [event]="event" *ngSwitchCase="'bid'">
          </app-notification-template-bid>
          <app-notification-template-contest-entry-awarded-employer
            [event]="event"
            *ngSwitchCase="'contestAwardedToEmployer'"
          >
          </app-notification-template-contest-entry-awarded-employer>
          <app-notification-template-contest-entry-awarded-freelancer
            [event]="event"
            *ngSwitchCase="'contestAwardedToFreelancer'"
          >
          </app-notification-template-contest-entry-awarded-freelancer>
          <app-notification-template-contest-entry-bought-employer
            [event]="event"
            *ngSwitchCase="'contestEntryBoughtToEmployer'"
          >
          </app-notification-template-contest-entry-bought-employer>
          <app-notification-template-contest-entry-bought-freelancer
            [event]="event"
            *ngSwitchCase="'contestEntryBoughtToFreelancer'"
          >
          </app-notification-template-contest-entry-bought-freelancer>
          <app-notification-template-contest-entry-commented-to-freelancer
            [event]="event"
            *ngSwitchCase="'contestEntryCommentedToFreelancer'"
          ></app-notification-template-contest-entry-commented-to-freelancer>
          <app-notification-template-contest-entry-rated-to-freelancer
            [event]="event"
            *ngSwitchCase="'contestEntryRatedToFreelancer'"
          ></app-notification-template-contest-entry-rated-to-freelancer>
          <app-notification-template-contest-entry-rejected-to-freelancer
            [event]="event"
            *ngSwitchCase="'contestEntryRejectedToFreelancer'"
          ></app-notification-template-contest-entry-rejected-to-freelancer>
          <app-notification-template-contest-entry-reconsidered-to-freelancer
            [event]="event"
            *ngSwitchCase="'contestEntryReconsideredToFreelancer'"
          ></app-notification-template-contest-entry-reconsidered-to-freelancer>
          <app-notification-template-contest-entry
            [event]="event"
            *ngSwitchCase="'contestEntry'"
          >
          </app-notification-template-contest-entry>
          <app-notification-template-contest-pcb-notification
            [event]="event"
            *ngSwitchCase="'contestPCBNotification'"
          >
          </app-notification-template-contest-pcb-notification>
          <app-notification-template-contest-pcb-notification-full-view
            [event]="event"
            *ngSwitchCase="'contestPCBNotificationFullView'"
          >
          </app-notification-template-contest-pcb-notification-full-view>
          <app-notification-template-create-milestone
            [event]="event"
            *ngSwitchCase="'createMilestone'"
          >
          </app-notification-template-create-milestone>
          <app-notification-template-draft-contest
            [event]="event"
            *ngSwitchCase="'draftContest'"
          >
          </app-notification-template-draft-contest>
          <app-notification-template-deny
            [event]="event"
            *ngSwitchCase="'denyed'"
          >
          </app-notification-template-deny>
          <app-notification-template-failing-project
            [event]="event"
            *ngSwitchCase="'failingProject'"
          >
          </app-notification-template-failing-project>
          <app-notification-template-follower
            [event]="event"
            *ngSwitchCase="'notifyfollower'"
          >
          </app-notification-template-follower>
          <app-notification-template-invite-to-contest
            [event]="event"
            *ngSwitchCase="'inviteToContest'"
          >
          </app-notification-template-invite-to-contest>
          <app-notification-template-invite-user-bid
            [event]="event"
            *ngSwitchCase="'inviteUserBid'"
          >
          </app-notification-template-invite-user-bid>
          <app-notification-template-invoice-requested
            [event]="event"
            *ngSwitchCase="'invoiceRequested'"
          >
          </app-notification-template-invoice-requested>
          <app-notification-template-level-up
            [event]="event"
            *ngSwitchCase="'levelUp'"
          >
          </app-notification-template-level-up>
          <app-notification-template-project-completed
            [event]="event"
            *ngSwitchCase="'completed'"
          >
          </app-notification-template-project-completed>
          <app-notification-template-quick-hire-project
            [event]="event"
            *ngSwitchCase="'quickHireProject'"
          >
          </app-notification-template-quick-hire-project>
          <app-notification-template-quick-hire-project
            [event]="event"
            *ngSwitchCase="'hireMe'"
          >
          </app-notification-template-quick-hire-project>
          <app-notification-template-release-milestone
            [event]="event"
            *ngSwitchCase="'releaseMilestone'"
          >
          </app-notification-template-release-milestone>
          <app-notification-template-request-end-project
            [event]="event"
            *ngSwitchCase="'requestEndProject'"
          >
          </app-notification-template-request-end-project>
          <app-notification-template-request-milestone
            [event]="event"
            *ngSwitchCase="'requestMilestone'"
          >
          </app-notification-template-request-milestone>
          <app-notification-template-request-to-release
            [event]="event"
            *ngSwitchCase="'requestToRelease'"
          >
          </app-notification-template-request-to-release>
          <app-notification-template-service-approved
            [event]="event"
            *ngSwitchCase="'serviceApproved'"
          >
          </app-notification-template-service-approved>
          <app-notification-template-service-project-ending
            [event]="event"
            *ngSwitchCase="'serviceProjectEndingSeller'"
          >
          </app-notification-template-service-project-ending>
          <app-notification-template-service-project-posted
            [event]="event"
            *ngSwitchCase="'serviceProjectPostedSeller'"
          >
          </app-notification-template-service-project-posted>
          <app-notification-template-service-rejected
            [event]="event"
            *ngSwitchCase="'serviceRejected'"
          >
          </app-notification-template-service-rejected>
          <app-notification-template-sign-up-free-trial-upsell
            [event]="event"
            *ngSwitchCase="'signUpFreeTrialUpsell'"
          >
          </app-notification-template-sign-up-free-trial-upsell>
          <app-notification-template-default
            *ngSwitchDefault
            [error]="
              'Missing notification template component for: ' + event.type
            "
          ></app-notification-template-default>
        </ng-container>
      </ng-template>
    </fl-card>
  `,
  styleUrls: ['./toast-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastItemComponent implements OnInit, OnChanges, OnDestroy {
  AvatarSize = AvatarSize;
  FontColor = FontColor;
  IconBackdrop = IconBackdrop;
  IconColor = IconColor;
  IconSize = IconSize;
  LinkUnderline = LinkUnderline;

  /**
   * Timer for the toast item to emit hiding event.
   * Always keep this on a 1000ms increments.
   */
  @Input()
  set timer(value: number) {
    if (value % 1000 || value < 1000) {
      throw Error('Timer values for toast items must be on 1000ms increments.');
    }

    this._timer = value;
  }
  get timer() {
    return this._timer;
  }
  private _timer: number;

  @Input() event: ToastNotificationItem;
  @Input()
  set paused(value: boolean) {
    this._paused = value;
    this._pausedSubject$.next(value);
  }
  get paused() {
    return this._paused;
  }
  private _paused = false;
  private _pausedSubject$ = new Rx.Subject<boolean>();
  private paused$ = this._pausedSubject$
    .asObservable()
    .pipe(startWith(this._paused), distinctUntilChanged());

  // These getters are used instead of calling a function directly in the
  // template in hopes of future-proofing this code if Angular ever supports
  // something like Vue's computed property.
  get isProjectFeedEntry() {
    return this._isProjectFeedEntry(this.event);
  }

  get thumbnailIcon() {
    if (this._isProjectFeedEntry(this.event)) {
      switch (this.event.type) {
        case 'contest':
        case 'xpContest': {
          return 'ui-trophy';
        }
        case 'localJobPosted': {
          return 'ui-pin-location';
        }
        case 'failingProject':
        case 'project':
        case 'recruiterProject':
        default: {
          if (this.event.recruiter) {
            return 'ui-recruiter';
          }
          return 'ui-computer';
        }
      }
    }
    // If not project feed, this will return undefined.
  }

  get userAvatar() {
    if (!this._isProjectFeedEntry(this.event)) {
      return (
        this.event.data.imgUrl ||
        this.assets.getUrl('default-notification-image.svg')
      );
    }
  }

  private _timerResetSubject$ = new Rx.Subject<true>();
  private timerSubscription?: Rx.Subscription;

  /** we need to parse the url and separate it into link, params and fragment */
  urlTree?: UrlTree;
  routerLink?: string;

  @Output() hide = new EventEmitter<void>();

  constructor(
    private router: Router,
    private timeUtils: TimeUtils,
    private assets: Assets,
  ) {}

  ngOnInit() {
    const timer$ = this.paused$.pipe(
      switchMap(paused =>
        !paused
          ? // Return an interval emit every second, map it to 1000 for us to
            // use on the next operator to reduce 1000ms for the remaining time.
            this.timeUtils.rxInterval(1000).pipe(mapTo(1000))
          : Rx.EMPTY,
      ),
      scan(
        (timeLeft, elapsedMs) => (elapsedMs ? timeLeft - elapsedMs : timeLeft),
        this._timer,
      ),
      takeWhile(timeLeft => timeLeft >= 0),
      startWith(this._timer),
    );

    const timerFinishWithReset$ = this._timerResetSubject$
      // startWith true to trigger the timer on init, but always restart the
      // timer when the timerResetSubject observable emits.
      .asObservable()
      .pipe(
        startWith(true),
        switchMapTo(timer$),
        filter(timeLeft => timeLeft <= 0),
      );

    this.timerSubscription = timerFinishWithReset$.subscribe(() => {
      this.hide.emit();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    const properties = Object.keys(changes);
    if (properties.includes('event')) {
      const link = this._isProjectFeedEntry(this.event)
        ? this.event.linkUrl
        : this.event.data.linkUrl;
      this.urlTree = this.router.parseUrl(link || '');
      const primaryLink = this.urlTree.root.children.primary;

      // UrlSegmentGroup#toString() doesn't have info of the leading slash.
      // Put it back when calling it.
      this.routerLink = primaryLink ? `/${primaryLink.toString()}` : undefined;
    }
  }

  ngOnDestroy() {
    // Unsubscribe the timer for garbage collection.
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  resetTimer() {
    this._timerResetSubject$.next(true);
  }

  handleCloseButtonClick() {
    // Stop propagation to avoid the click on the parent fl-button taking to the
    // notification link.
    this.hide.emit();
  }

  private _isProjectFeedEntry(
    event: ToastNotificationItem,
  ): event is ProjectFeedEntry {
    return !('parent_type' in event);
  }
}
