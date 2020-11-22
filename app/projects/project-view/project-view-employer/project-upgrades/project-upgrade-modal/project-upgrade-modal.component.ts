import { Component, Input } from '@angular/core';
import { CartReturnAction } from '@freelancer/datastore/collections';
import {
  PartialPaymentsCartItem,
  PaymentsCart,
} from '@freelancer/payments-cart';
import { ModalService } from '@freelancer/ui';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { ButtonColor } from '@freelancer/ui/button';
import { Margin } from '@freelancer/ui/margin';
import { UpgradeType } from '@freelancer/ui/upgrade-tag';

@Component({
  selector: 'app-project-upgrade-modal',
  template: `
    <fl-bit
      flTrackingSection="ProjectUpgradeModal"
      [ngSwitch]="upgradeType"
      [flMarginBottom]="error ? Margin.MID : Margin.NONE"
    >
      <app-project-upgrade-modal-content
        *ngSwitchCase="UpgradeType.ASSISTED"
        upgradeAvailableButtonLabel="Upgrade"
        i18n-upgradeAvailableButtonLabel="Upgrade project button"
        upgradeAvailableHeading="Not sure who to hire?"
        i18n-upgradeAvailableHeading="Heading for recruiter upgrade"
        hasUpgradeHeading="This project already has the Recruiter upgrade!"
        i18n-hasUpgradeHeading="
           Heading when project already has recruiter upgrade
        "
        imgAlt="Recruiter icon"
        i18n-imgAlt="Recruiter icon"
        [busy]="busy"
        [imgSrc]="'project-view-page/icons-big/recruiter-logo.svg'"
        [projectHasUpgrade]="alreadyHasUpgrade"
        [upgradeType]="UpgradeType.ASSISTED"
        (upgrade)="handleUpgrade()"
        (close)="handleClose()"
      >
        <fl-text i18n="Recruiter upgrade explanation">
          Not sure who to hire, want more options to consider or pressed for
          time? Let our expert recruiter team find you the perfect freelancer.
          Upgrade your project now for only
          {{ cartItem.amount | flCurrency: currencyCode }}.
        </fl-text>
      </app-project-upgrade-modal-content>
    </fl-bit>

    <fl-banner-alert
      *ngIf="error"
      i18n="Generic project upsell error message"
      [type]="BannerAlertType.ERROR"
    >
      Something went wrong trying to upgrade your project. Please contact
      support@freelancer.com with this request ID:
      {{ errorRequestId }}.
    </fl-banner-alert>
  `,
})
export class ProjectUpgradeModalComponent {
  BannerAlertType = BannerAlertType;
  ButtonColor = ButtonColor;
  Margin = Margin;
  UpgradeType = UpgradeType;

  @Input() alreadyHasUpgrade: boolean;
  @Input() cartDescription: string;
  @Input() cartItem: PartialPaymentsCartItem;
  @Input() cartReturnAction: CartReturnAction;
  @Input() upgradeType: UpgradeType;
  @Input() currencyCode: string;

  busy = false;
  error = false;
  errorRequestId: string;

  constructor(private cart: PaymentsCart, private modalService: ModalService) {}

  handleClose(): void {
    this.modalService.close();
  }

  handleUpgrade(): void {
    this.busy = true;
    this.error = false;

    this.cart
      .handle(this.cartDescription, this.cartReturnAction, [this.cartItem])
      .catch(response => {
        this.busy = false;
        this.error = true;
        this.errorRequestId = response.requestId;
      });
  }
}
