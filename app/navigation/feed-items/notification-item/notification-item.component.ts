import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { NotificationEntry } from '@freelancer/datastore/collections';
import { Assets } from '@freelancer/ui/assets';

@Component({
  selector: 'app-notification-item',
  template: `
    <app-feed-item
      class="NotificationItem"
      [link]="event.data.linkUrl"
      [users]="[{ avatar: defaultThumbnailUrl }]"
      flTrackingLabel="NotificationFeedItem"
      thumbnail="image"
      thumbnailAlt="Relevant notification image thumbnail"
      [size]="size"
    >
      <app-notification-template-article-comment
        *ngIf="event.type === 'articleCommentReceived'"
        [event]="event"
      >
      </app-notification-template-article-comment>
      <app-notification-template-award-milestone-reminder
        *ngIf="event.type === 'awardMilestoneReminder'"
        [event]="event"
      >
      </app-notification-template-award-milestone-reminder>
      <app-notification-template-award-reminder
        *ngIf="event.type === 'awardReminder'"
        [event]="event"
      >
      </app-notification-template-award-reminder>
      <app-notification-template-award
        *ngIf="event.type === 'award'"
        [event]="event"
      >
      </app-notification-template-award>
      <app-notification-template-award-badge
        *ngIf="event.type === 'awardBadge'"
        [event]="event"
      >
      </app-notification-template-award-badge>
      <app-notification-template-award-credit
        *ngIf="event.type === 'awardCredit'"
        [event]="event"
      >
      </app-notification-template-award-credit>
      <app-notification-template-award-xp
        *ngIf="event.type === 'awardXp'"
        [event]="event"
      >
      </app-notification-template-award-xp>
      <app-notification-template-bid
        *ngIf="event.type === 'bid'"
        [event]="event"
      >
      </app-notification-template-bid>
      <app-notification-template-contest-entry-awarded-employer
        *ngIf="event.type === 'contestAwardedToEmployer'"
        [event]="event"
      >
      </app-notification-template-contest-entry-awarded-employer>
      <app-notification-template-contest-entry-awarded-freelancer
        *ngIf="event.type === 'contestAwardedToFreelancer'"
        [event]="event"
      >
      </app-notification-template-contest-entry-awarded-freelancer>
      <app-notification-template-contest-entry-bought-employer
        *ngIf="event.type === 'contestEntryBoughtToEmployer'"
        [event]="event"
      >
      </app-notification-template-contest-entry-bought-employer>
      <app-notification-template-contest-entry-bought-freelancer
        *ngIf="event.type === 'contestEntryBoughtToFreelancer'"
        [event]="event"
      >
      </app-notification-template-contest-entry-bought-freelancer>
      <app-notification-template-contest-entry-commented-to-freelancer
        *ngIf="event.type === 'contestEntryCommentedToFreelancer'"
        [event]="event"
      ></app-notification-template-contest-entry-commented-to-freelancer>
      <app-notification-template-contest-entry-rated-to-freelancer
        *ngIf="event.type === 'contestEntryRatedToFreelancer'"
        [event]="event"
      ></app-notification-template-contest-entry-rated-to-freelancer>
      <app-notification-template-contest-entry-rejected-to-freelancer
        *ngIf="event.type === 'contestEntryRejectedToFreelancer'"
        [event]="event"
      ></app-notification-template-contest-entry-rejected-to-freelancer>
      <app-notification-template-contest-entry-reconsidered-to-freelancer
        *ngIf="event.type === 'contestEntryReconsideredToFreelancer'"
        [event]="event"
      ></app-notification-template-contest-entry-reconsidered-to-freelancer>
      <app-notification-template-contest-entry
        *ngIf="event.type === 'contestEntry'"
        [event]="event"
      >
      </app-notification-template-contest-entry>
      <app-notification-template-contest-pcb-notification
        *ngIf="event.type === 'contestPCBNotification'"
        [event]="event"
      >
      </app-notification-template-contest-pcb-notification>
      <app-notification-template-contest-pcb-notification-full-view
        *ngIf="event.type === 'contestPCBNotificationFullView'"
        [event]="event"
      >
      </app-notification-template-contest-pcb-notification-full-view>
      <app-notification-template-create-milestone
        *ngIf="event.type === 'createMilestone'"
        [event]="event"
      >
      </app-notification-template-create-milestone>
      <app-notification-template-draft-contest
        *ngIf="event.type === 'draftContest'"
        [event]="event"
      >
      </app-notification-template-draft-contest>
      <app-notification-template-deny
        *ngIf="event.type === 'denyed'"
        [event]="event"
      >
      </app-notification-template-deny>
      <app-notification-template-failing-project
        *ngIf="event.type === 'failingProject'"
        [event]="event"
      >
      </app-notification-template-failing-project>
      <app-notification-template-giveget-child-received-signup-bonus
        *ngIf="event.type === 'giveGetChildReceivedSignupBonus'"
        [event]="event"
      >
      </app-notification-template-giveget-child-received-signup-bonus>
      <app-notification-template-task-create
        *ngIf="event.type === 'tasklistCreateV1'"
        [event]="event"
      >
      </app-notification-template-task-create>
      <app-notification-template-giveget-child-signup
        *ngIf="event.type === 'giveGetChildSignUp'"
        [event]="event"
      >
      </app-notification-template-giveget-child-signup>
      <app-notification-template-giveget-child-partial-milestone-release
        *ngIf="event.type === 'giveGetChildPartialMilestoneRelease'"
        [event]="event"
      >
      </app-notification-template-giveget-child-partial-milestone-release>
      <app-notification-template-giveget-parent-bonus
        *ngIf="event.type === 'giveGetParentBonus'"
        [event]="event"
      >
      </app-notification-template-giveget-parent-bonus>
      <app-notification-template-follower
        *ngIf="event.type === 'notifyfollower'"
        [event]="event"
      >
      </app-notification-template-follower>
      <app-notification-template-invite-to-contest
        *ngIf="event.type === 'inviteToContest'"
        [event]="event"
      >
      </app-notification-template-invite-to-contest>
      <app-notification-template-invite-user-bid
        *ngIf="event.type === 'inviteUserBid'"
        [event]="event"
      >
      </app-notification-template-invite-user-bid>
      <app-notification-template-invoice-requested
        *ngIf="event.type === 'invoiceRequested'"
        [event]="event"
      >
      </app-notification-template-invoice-requested>
      <app-notification-template-level-up
        *ngIf="event.type === 'levelUp'"
        [event]="event"
      >
      </app-notification-template-level-up>
      <app-notification-template-project-completed
        *ngIf="event.type === 'completed'"
        [event]="event"
      >
      </app-notification-template-project-completed>
      <app-notification-template-quick-hire-project
        *ngIf="event.type === 'quickHireProject'"
        [event]="event"
      >
      </app-notification-template-quick-hire-project>
      <app-notification-template-quick-hire-project
        *ngIf="event.type === 'hireMe'"
        [event]="event"
      >
      </app-notification-template-quick-hire-project>
      <app-notification-template-release-milestone
        *ngIf="event.type === 'releaseMilestone'"
        [event]="event"
      >
      </app-notification-template-release-milestone>
      <app-notification-template-request-end-project
        *ngIf="event.type === 'requestEndProject'"
        [event]="event"
      >
      </app-notification-template-request-end-project>
      <app-notification-template-request-milestone
        *ngIf="event.type === 'requestMilestone'"
        [event]="event"
      >
      </app-notification-template-request-milestone>
      <app-notification-template-request-to-release
        *ngIf="event.type === 'requestToRelease'"
        [event]="event"
      >
      </app-notification-template-request-to-release>
      <app-notification-template-service-approved
        *ngIf="event.type === 'serviceApproved'"
        [event]="event"
      >
      </app-notification-template-service-approved>
      <app-notification-template-service-project-ending
        *ngIf="event.type === 'serviceProjectEndingSeller'"
        [event]="event"
      >
      </app-notification-template-service-project-ending>
      <app-notification-template-service-project-posted
        *ngIf="event.type === 'serviceProjectPostedSeller'"
        [event]="event"
      >
      </app-notification-template-service-project-posted>
      <app-notification-template-service-rejected
        *ngIf="event.type === 'serviceRejected'"
        [event]="event"
      >
      </app-notification-template-service-rejected>
      <app-notification-template-showcase-source-approval
        *ngIf="event.type === 'showcaseSourceApproval'"
        [event]="event"
      >
      </app-notification-template-showcase-source-approval>
      <app-notification-template-sign-up-free-trial-upsell
        *ngIf="event.type === 'signUpFreeTrialUpsell'"
        [event]="event"
      >
      </app-notification-template-sign-up-free-trial-upsell>
      <ng-content></ng-content>
      <div>
        <fl-relative-time
          [date]="event.time"
          [suffix]="true"
        ></fl-relative-time>
      </div>
    </app-feed-item>
  `,
  styleUrls: ['./notification-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationItemComponent implements OnInit {
  @Input() event: NotificationEntry;
  @Input() size: 'small' | 'mid';
  defaultThumbnailUrl: string;

  constructor(private assets: Assets) {}

  ngOnInit() {
    this.defaultThumbnailUrl =
      this.event.data.imgUrl ||
      this.assets.getUrl('default-notification-image.svg');
  }
}
