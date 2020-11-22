import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Datastore } from '@freelancer/datastore';
import { UserInteractionsCollection } from '@freelancer/datastore/collections';
import { BannerAnnouncementType } from '@freelancer/ui/banner-announcement';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { ContainerSize } from '@freelancer/ui/container';

@Component({
  selector: 'app-credit-card-verification-banner',
  template: `
    <fl-banner-announcement
      bannerTitle="Credit card authentication is required"
      i18n-bannerTitle="Verification banner title"
      [icon]="'ui-credit-card-v2'"
      [type]="BannerAnnouncementType.INFO"
      [containerSize]="containerSize"
      (close)="handleClose()"
    >
      <fl-banner-announcement-message i18n="Verification banner message">
        You are required to authenticate the ownership of your credit card.
      </fl-banner-announcement-message>
      <fl-banner-announcement-buttons>
        <fl-button
          i18n="Verification banner call to action"
          flTrackingLabel="CreditCardVerify.Start"
          [color]="ButtonColor.TRANSPARENT_LIGHT"
          [size]="ButtonSize.SMALL"
          [link]="'/payments-and-trust'"
        >
          Authenticate Card
        </fl-button>
      </fl-banner-announcement-buttons>
    </fl-banner-announcement>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditCardVerificationBannerComponent {
  BannerAnnouncementType = BannerAnnouncementType;
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  private CLOSE_EVENT = 'credit-card-verification-banner-CLOSE';

  @Input() containerSize: ContainerSize;

  constructor(private datastore: Datastore) {}

  handleClose() {
    this.datastore.createDocument<UserInteractionsCollection>(
      'userInteractions',
      { eventName: this.CLOSE_EVENT },
    );
  }
}
