import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotificationLevelUp } from '@freelancer/datastore/collections';

@Component({
  selector: 'app-notification-template-level-up',
  template: `
    <ng-container i18n="Notification template level up">
      <strong>Congratulations {{ event.data.username }}!</strong> You are now
      Level {{ event.data.level }}!
    </ng-container>
    <ng-container
      *ngIf="event.data.perks.length === 0"
      i18n="Notification template level up"
    >
      No upcoming perks.
    </ng-container>
    <ng-container *ngIf="event.data.perks.length !== 0">
      <strong i18n="Notification template level up">Rewards Unlocked:</strong>
      <ul>
        <li *ngFor="let perk of event.data.perks | slice: 0:4">
          <small>
            <ng-container *ngIf="perk.item && perk.magnitude > 1">
              {{ perk.magnitude }}
            </ng-container>
            <ng-container
              *ngIf="perk.item && perk.magnitude <= 1"
              i18n="Notification template level up"
            >
              Free
            </ng-container>
            <ng-container
              *ngIf="!perk.item"
              i18n="Notification template level up"
            >
              <!--
                This needs to be in one line. No spaces between these text.
              -->
              {{ perk.symbol }}{{ perk.magnitude
              }}<ng-container *ngIf="perk.name === 'BidRefreshRate'"
                >%</ng-container
              >
            </ng-container>
          </small>
        </li>
      </ul>
      <ng-container
        *ngIf="!event.data.membership"
        i18n="Notification template level up"
      >
        Upgrade your membership to receive these benefits!
      </ng-container>
    </ng-container>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateLevelUpComponent {
  @Input() event: NotificationLevelUp;
}
