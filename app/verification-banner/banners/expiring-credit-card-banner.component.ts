import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Datastore } from '@freelancer/datastore';
import {
  ExpiringCreditCardBanner,
  UserInteractionsCollection,
} from '@freelancer/datastore/collections';
import { BannerAnnouncementType } from '@freelancer/ui/banner-announcement';
import { ContainerSize } from '@freelancer/ui/container';
import { LinkColor, LinkHoverColor, LinkUnderline } from '@freelancer/ui/link';

@Component({
  selector: 'app-expiring-credit-card-banner',
  template: `
    <fl-banner-announcement
      bannerTitle="Additional information required"
      i18n-bannerTitle="Verification banner title"
      [icon]="'ui-credit-card-v2'"
      [type]="BannerAnnouncementType.INFO"
      [closeable]="true"
      [containerSize]="containerSize"
      (close)="handleClose()"
    >
      <ng-container
        *ngIf="banner.daysLeft > 1"
        i18n="Verification banner message"
      >
        It looks like your preferred payment method is expiring in the next
        {{ banner.daysLeft }} days.
      </ng-container>
      <ng-container
        *ngIf="banner.daysLeft === 1"
        i18n="Verification banner message"
      >
        It looks like your preferred payment method is expiring tomorrow.
      </ng-container>
      <ng-container
        *ngIf="banner.daysLeft <= 0"
        i18n="Verification banner message"
      >
        It looks like your preferred payment method has expired.
      </ng-container>
      <ng-container i18n="Verification banner call to action">
        Please make sure to
        <fl-link
          flTrackingLabel="ExpiringCreditCardUpdate"
          [color]="LinkColor.LIGHT"
          [hoverColor]="LinkHoverColor.LIGHT"
          [underline]="LinkUnderline.ALWAYS"
          [link]="'/users/settings.php'"
          [fragment]="'PaymentSettings'"
        >
          add a new payment method or update your preferred payment method
        </fl-link>
        as soon as possible.
      </ng-container>
    </fl-banner-announcement>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpiringCreditCardBannerComponent {
  BannerAnnouncementType = BannerAnnouncementType;
  LinkColor = LinkColor;
  LinkHoverColor = LinkHoverColor;
  LinkUnderline = LinkUnderline;
  private CLOSE_EVENT = 'expiring-credit-card-banner-CLOSE';

  @Input() banner: ExpiringCreditCardBanner;
  @Input() containerSize: ContainerSize;

  constructor(private datastore: Datastore) {}

  handleClose() {
    this.datastore.createDocument<UserInteractionsCollection>(
      'userInteractions',
      { eventName: this.CLOSE_EVENT },
    );
  }
}
