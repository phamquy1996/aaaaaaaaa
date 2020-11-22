import { Component, Input } from '@angular/core';
import { EmailVerification } from '@freelancer/email-verification';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { ButtonColor } from '@freelancer/ui/button';
import { Margin } from '@freelancer/ui/margin';
import { ToastAlertService, ToastAlertType } from '@freelancer/ui/toast-alert';
import { ErrorCodeApi } from 'api-typings/errors/errors';

export enum EmailVerificationBannerToastItem {
  RESEND_SUCCESS = 'resend-verification-email-success',
  RESEND_ALREADY_VERIFIED_ERROR = 'resend-verification-email-already-verified-error',
  RESEND_TOO_MANY_REQUESTS_ERROR = 'resend-verification-email-too-many-requests-error',
  RESEND_INTERNAL_SERVER_ERROR = 'resend-verification-email-internal-server-error',
  RESEND_UNAUTHORIZED_ERROR = 'resend-verification-email-unauthorized-error',
  RESEND_ACCOUNT_CLOSED_OR_SUSPENDED_ERROR = 'resend-verification-email-account-closed-or-suspended-error',
  RESEND_FORBIDDEN_ERROR = 'resend-verification-email-forbidden-error',
  VERIFY_SUCCESS = 'email-verification-success',
}

@Component({
  selector: 'app-email-verification-banner-alert',
  template: `
    <fl-toast-alert
      i18n="Verification email has been resent toast alert"
      [id]="EmailVerificationBannerToastItem.RESEND_SUCCESS"
      [type]="ToastAlertType.SUCCESS"
    >
      Verification email has been resent.
    </fl-toast-alert>
    <fl-toast-alert
      i18n="Email already verified toast alert"
      [id]="EmailVerificationBannerToastItem.RESEND_ALREADY_VERIFIED_ERROR"
      [type]="ToastAlertType.ERROR"
    >
      You have already verified your email address.
    </fl-toast-alert>
    <fl-card [edgeToEdge]="true" [flMarginBottom]="Margin.XSMALL">
      <fl-banner-alert
        flTrackingSection="VerifyEmailProjectViewBanner"
        bannerTitle="Email verification required"
        i18n-bannerTitle="Email verification required"
        [type]="BannerAlertType.INFO"
        [closeable]="false"
      >
        <fl-text [flMarginBottom]="Margin.MID">
          <ng-content></ng-content>
        </fl-text>
        <fl-bit>
          <fl-button
            class="EmailVerificationBannerButton"
            i18n="Resend email button"
            flTrackingLabel="ResendEmailButton"
            [color]="resendEmailButtonColor"
            [flMarginRight]="Margin.SMALL"
            [flMarginBottom]="Margin.XXSMALL"
            (click)="resendVerificationEmail()"
          >
            Resend Email
          </fl-button>
          <fl-button
            class="EmailVerificationBannerButton"
            i18n="Change email button"
            flTrackingLabel="ChangeEmailButton"
            [color]="changeEmailButtonColor"
            [flMarginRight]="Margin.SMALL"
            [flMarginBottom]="Margin.XXSMALL"
            [link]="'/users/change-password-email.php'"
          >
            Change Email Address
          </fl-button>
          <fl-button
            class="EmailVerificationBannerButton"
            i18n="Contact us button"
            flTrackingLabel="ContactUsButton"
            [color]="contactUsButtonColor"
            [link]="'/support/profile/verifying-my-email-address'"
          >
            Contact Us
          </fl-button>
        </fl-bit>
      </fl-banner-alert>
    </fl-card>
  `,
  styleUrls: ['./email-verification-banner-alert.component.scss'],
})
export class EmailVerificationBannerAlertComponent {
  BannerAlertType = BannerAlertType;
  ButtonColor = ButtonColor;
  EmailVerificationBannerToastItem = EmailVerificationBannerToastItem;
  Margin = Margin;
  ToastAlertType = ToastAlertType;

  @Input() resendEmailButtonColor = ButtonColor.SECONDARY;
  @Input() changeEmailButtonColor = ButtonColor.DEFAULT;
  @Input() contactUsButtonColor = ButtonColor.DEFAULT;

  constructor(
    private emailVerify: EmailVerification,
    private toastAlertService: ToastAlertService,
  ) {}

  resendVerificationEmail() {
    this.emailVerify.send().then(response => {
      if (response.status === 'success') {
        this.toastAlertService.open(
          EmailVerificationBannerToastItem.RESEND_SUCCESS,
        );
      } else if (
        response.status === 'error' &&
        response.errorCode === ErrorCodeApi.EMAIL_ALREADY_VERIFIED
      ) {
        this.toastAlertService.open(
          EmailVerificationBannerToastItem.RESEND_ALREADY_VERIFIED_ERROR,
        );
      }
    });
  }
}
