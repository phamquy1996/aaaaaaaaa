import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Datastore } from '@freelancer/datastore';
import { UserInteractionsCollection } from '@freelancer/datastore/collections';
import { BannerAnnouncementType } from '@freelancer/ui/banner-announcement';
import { ContainerSize } from '@freelancer/ui/container';
import { LinkColor, LinkHoverColor, LinkUnderline } from '@freelancer/ui/link';

@Component({
  selector: 'app-credit-card-verification-in-progress-banner',
  template: `
    <fl-banner-announcement
      bannerTitle="Credit card authentication required"
      i18n-bannerTitle="Verification banner title"
      [icon]="'ui-credit-card-v2'"
      [type]="BannerAnnouncementType.INFO"
      [closeable]="true"
      [containerSize]="containerSize"
      (close)="handleClose()"
    >
      <ng-container i18n="Verification banner message">
        You're only a few seconds away from completing your required credit card
        authentication.
      </ng-container>
      <fl-link
        i18n="Verification banner call to action"
        flTrackingLabel="CreditCardVerify.Continue"
        [color]="LinkColor.LIGHT"
        [hoverColor]="LinkHoverColor.LIGHT"
        [underline]="LinkUnderline.ALWAYS"
        [link]="'/payments-and-trust'"
      >
        Complete authentication now
      </fl-link>
    </fl-banner-announcement>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditCardVerificationInProgressBannerComponent {
  BannerAnnouncementType = BannerAnnouncementType;
  LinkColor = LinkColor;
  LinkHoverColor = LinkHoverColor;
  LinkUnderline = LinkUnderline;
  private CLOSE_EVENT = 'credit-card-verification-in-progress-banner-CLOSE';

  @Input() containerSize: ContainerSize;

  constructor(private datastore: Datastore) {}

  handleClose() {
    this.datastore.createDocument<UserInteractionsCollection>(
      'userInteractions',
      {
        eventName: this.CLOSE_EVENT,
      },
    );
  }
}
