import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotificationBid } from '@freelancer/datastore/collections';

@Component({
  selector: 'app-notification-template-bid',
  template: `
    <ng-container *ngIf="event.data.currency.code !== 'TKN'; else tokenText">
      <ng-container
        *ngIf="event.data.bidCount && event.data.bidCount === 2"
        i18n="Notification template bid"
      >
        <ng-container
          *ngIf="event.data.projIsHourly; else twoFixedBids"
          i8n="Notification template bid with another hourly bid"
        >
          {{ event.data.username }} and {{ event.data.bidCount - 1 }} other bid
          an average of {{ event.data.currency.sign || '$'
          }}{{ event.data.bidAvg || event.data.amount }}/hour on
          {{ event.data.projName }}
        </ng-container>
        <ng-template #twoFixedBids>
          {{ event.data.username }} and {{ event.data.bidCount - 1 }} other bid
          an average of {{ event.data.currency.sign || '$'
          }}{{ event.data.bidAvg || event.data.amount }} on
          {{ event.data.projName }}
        </ng-template>
      </ng-container>
      <ng-container
        *ngIf="event.data.bidCount && event.data.bidCount > 2"
        i18n="Notification template bid"
      >
        <ng-container
          *ngIf="event.data.projIsHourly; else multiFixedBids"
          i8n="Notification template bid with multiple hourly bids"
        >
          {{ event.data.username }} and {{ event.data.bidCount - 1 }} others bid
          an average of {{ event.data.currency.sign || '$'
          }}{{ event.data.bidAvg || event.data.amount }}/hour on
          {{ event.data.projName }}
        </ng-container>
        <ng-template #multiFixedBids>
          {{ event.data.username }} and {{ event.data.bidCount - 1 }} others bid
          an average of {{ event.data.currency.sign || '$'
          }}{{ event.data.bidAvg || event.data.amount }} on
          {{ event.data.projName }}
        </ng-template>
      </ng-container>
      <ng-container
        *ngIf="
          (event.data.bidCount && event.data.bidCount === 1) ||
          !event.data.bidCount
        "
        i18n="Notification template bid"
      >
        <ng-container
          *ngIf="event.data.projIsHourly; else singleFixedBid"
          i8n="Notification template bid for single hourly bid"
        >
          {{ event.data.username }} bid {{ event.data.currency.sign || '$'
          }}{{ event.data.amount }}/hour on {{ event.data.projName }}
        </ng-container>
        <ng-template #singleFixedBid>
          {{ event.data.username }} bid {{ event.data.currency.sign || '$'
          }}{{ event.data.amount }} on {{ event.data.projName }}
        </ng-template>
      </ng-container>
    </ng-container>

    <ng-template #tokenText>
      <ng-container
        *ngIf="event.data.bidCount && event.data.bidCount === 2"
        i18n="Notification template bid"
      >
        {{ event.data.username }} and {{ event.data.bidCount - 1 }} other bid on
        {{ event.data.projName }}
      </ng-container>
      <ng-container
        *ngIf="event.data.bidCount && event.data.bidCount > 2"
        i18n="Notification template bid"
      >
        {{ event.data.username }} and {{ event.data.bidCount - 1 }} others bid
        on {{ event.data.projName }}
      </ng-container>
      <ng-container
        *ngIf="
          (event.data.bidCount && event.data.bidCount === 1) ||
          !event.data.bidCount
        "
        i18n="Notification template bid"
      >
        {{ event.data.username }} bid on {{ event.data.projName }}
      </ng-container>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateBidComponent {
  @Input() event: NotificationBid;
}
