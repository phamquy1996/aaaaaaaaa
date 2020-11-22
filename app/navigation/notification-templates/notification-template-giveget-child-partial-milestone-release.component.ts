import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotificationGiveGetChildPartialMilestoneRelease } from '@freelancer/datastore/collections';
import { FontType } from '@freelancer/ui/text';

@Component({
  selector: 'app-notification-template-giveget-child-partial-milestone-release',
  template: `
    <ng-container
      *ngIf="event.data.childId"
      i18n="Notification template giveget child partial milestone release"
    >
      Your referral
      <fl-text [fontType]="FontType.STRONG">
        {{ event.data.childName }}
      </fl-text>
      has released their first ever milestone. Once they release
      {{
        event.data.bonusRequirement
          | currency: event.data.currencyCode:'symbol':'1.0-0'
      }}
      {{ event.data.currencyCode }} worth of milestones, you will get free
      credit as well. Invite more users to earn more bonus credit!
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateGiveGetChildPartialMilestoneReleaseComponent {
  FontType = FontType;
  @Input() event: NotificationGiveGetChildPartialMilestoneRelease;
}
