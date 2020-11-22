import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { UserStatus } from '@freelancer/datastore/collections';
import { ModalService } from '@freelancer/ui';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { IconColor } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { TextSize } from '@freelancer/ui/text';

@Component({
  template: `
    <fl-bit
      class="ProfileVerifications-content"
      flTrackingSection="ProfileVerificationsModal"
    >
      <fl-heading
        i18n="Verifications title"
        [size]="TextSize.SMALL"
        [headingType]="HeadingType.H3"
        [flMarginBottom]="Margin.MID"
      >
        Verifications
      </fl-heading>

      <app-profile-verifications-item
        i18n="Identity verification status"
        [verificationIcon]="'ui-user'"
        [isVerified]="status.identityVerified"
        [flMarginBottom]="Margin.SMALL"
      >
        Identity Verified
      </app-profile-verifications-item>

      <app-profile-verifications-item
        i18n="Payment verification status"
        [verificationIcon]="'ui-payment-verified'"
        [isVerified]="status.paymentVerified"
        [flMarginBottom]="Margin.SMALL"
      >
        Payment Verified
      </app-profile-verifications-item>

      <app-profile-verifications-item
        i18n="Phone verification status"
        [verificationIcon]="'ui-phone'"
        [isVerified]="status.phoneVerified"
        [flMarginBottom]="Margin.SMALL"
      >
        Phone Verified
      </app-profile-verifications-item>

      <app-profile-verifications-item
        i18n="Email verification status"
        [verificationIcon]="'ui-mail'"
        [isVerified]="status.emailVerified"
        [flMarginBottom]="Margin.SMALL"
      >
        Email Verified
      </app-profile-verifications-item>

      <app-profile-verifications-item
        i18n="Facebook connected status"
        [verificationIcon]="'ui-facebook'"
        [isVerified]="status.facebookConnected"
        [flMarginBottom]="Margin.MID"
      >
        Facebook Connected
      </app-profile-verifications-item>

      <fl-bit class="ProfileVerifications-button">
        <fl-button
          flTrackingLabel="CloseProfileVerificationsModalButton"
          i18n="Close profile verifications modal button"
          [color]="ButtonColor.DEFAULT"
          [size]="ButtonSize.SMALL"
          (click)="closeModal()"
        >
          Close
        </fl-button>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./profile-verifications-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileVerificationsModalComponent {
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  HeadingType = HeadingType;
  IconColor = IconColor;
  Margin = Margin;
  TextSize = TextSize;

  @Input() status: UserStatus;

  constructor(private modalService: ModalService) {}

  closeModal() {
    this.modalService.close();
  }
}
