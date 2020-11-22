import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Datastore } from '@freelancer/datastore';
import {
  EmailVerificationBanner,
  UserInteractionsCollection,
} from '@freelancer/datastore/collections';
import { EmailVerification } from '@freelancer/email-verification';
import { BannerAnnouncementType } from '@freelancer/ui/banner-announcement';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { ContainerSize } from '@freelancer/ui/container';
import { ToastAlertService, ToastAlertType } from '@freelancer/ui/toast-alert';
import { assertNever } from '@freelancer/utils';
import { ErrorCodeApi } from 'api-typings/errors/errors';
import * as Rx from 'rxjs';
import { EmailVerificationBannerToastItem } from '../../email-verification-banner/email-verification-banner-alert.component';

@Component({
  selector: 'app-email-verification-banner',
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
      Email already verified.
    </fl-toast-alert>
    <fl-toast-alert
      i18n="Too many requests error toast alert"
      [id]="EmailVerificationBannerToastItem.RESEND_TOO_MANY_REQUESTS_ERROR"
      [type]="ToastAlertType.ERROR"
    >
      You have made too many resend requests. Please try again later.
    </fl-toast-alert>
    <fl-toast-alert
      i18n="Internal server error toast alert"
      [id]="EmailVerificationBannerToastItem.RESEND_INTERNAL_SERVER_ERROR"
      [type]="ToastAlertType.ERROR"
    >
      Something went wrong. Please try again or contact
      <fl-link
        flTrackingLabel="EmailVerificationBannerSupportLink"
        [link]="'/support/'"
        >support</fl-link
      >.
    </fl-toast-alert>
    <fl-toast-alert
      i18n="Too many requests error toast alert"
      [id]="EmailVerificationBannerToastItem.RESEND_UNAUTHORIZED_ERROR"
      [type]="ToastAlertType.ERROR"
    >
      Unauthorized request.
    </fl-toast-alert>
    <fl-toast-alert
      i18n="Too many requests error toast alert"
      [id]="
        EmailVerificationBannerToastItem.RESEND_ACCOUNT_CLOSED_OR_SUSPENDED_ERROR
      "
      [type]="ToastAlertType.ERROR"
    >
      Unable to verify inactive account.
    </fl-toast-alert>
    <fl-toast-alert
      i18n="Too many requests error toast alert"
      [id]="EmailVerificationBannerToastItem.RESEND_FORBIDDEN_ERROR"
      [type]="ToastAlertType.ERROR"
    >
      You do not have sufficient permissions to perform this request. Please
      contact
      <fl-link
        flTrackingLabel="EmailVerificationBannerSupportLink"
        [link]="'/support/'"
        >support</fl-link
      >.
    </fl-toast-alert>
    <fl-banner-announcement
      *ngIf="showBanner$ | async"
      bannerTitle="Email verification required"
      i18n-bannerTitle="Verification banner title"
      [icon]="'ui-mail'"
      [type]="BannerAnnouncementType.INFO"
      [containerSize]="containerSize"
      (close)="handleClose()"
    >
      <fl-banner-announcement-message i18n="Verification banner message">
        To activate your account, please click "Verify your email address" on
        the email we sent to {{ banner.email }}.
      </fl-banner-announcement-message>
      <fl-banner-announcement-buttons>
        <fl-button
          i18n="Resend email button"
          flTrackingLabel="EmailVerify.Resend"
          [color]="ButtonColor.TRANSPARENT_LIGHT"
          [size]="ButtonSize.SMALL"
          (click)="handleResendClicked()"
        >
          Resend Email
        </fl-button>
      </fl-banner-announcement-buttons>
    </fl-banner-announcement>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailVerificationBannerComponent {
  BannerAnnouncementType = BannerAnnouncementType;
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  EmailVerificationBannerToastItem = EmailVerificationBannerToastItem;
  ToastAlertType = ToastAlertType;

  private showBannerSubject$ = new Rx.BehaviorSubject<boolean>(true);
  showBanner$ = this.showBannerSubject$.asObservable();

  @Input() banner: EmailVerificationBanner;
  @Input() containerSize: ContainerSize;
  private CLOSE_EVENT = 'email-verification-banner-CLOSE';

  constructor(
    private emailVerify: EmailVerification,
    private datastore: Datastore,
    private toastAlertService: ToastAlertService,
  ) {}

  handleClose() {
    this.datastore.createDocument<UserInteractionsCollection>(
      'userInteractions',
      { eventName: this.CLOSE_EVENT },
    );
  }

  handleResendClicked() {
    this.emailVerify.send().then(response => {
      if (response.status === 'success') {
        this.showBannerSubject$.next(false);
        this.toastAlertService.open(
          EmailVerificationBannerToastItem.RESEND_SUCCESS,
        );
        return;
      }

      switch (response.errorCode) {
        case ErrorCodeApi.EMAIL_ALREADY_VERIFIED:
          this.showBannerSubject$.next(false);
          this.toastAlertService.open(
            EmailVerificationBannerToastItem.RESEND_ALREADY_VERIFIED_ERROR,
          );
          break;

        case ErrorCodeApi.TOO_MANY_REQUESTS:
          this.showBannerSubject$.next(false);
          this.toastAlertService.open(
            EmailVerificationBannerToastItem.RESEND_TOO_MANY_REQUESTS_ERROR,
          );
          break;

        case ErrorCodeApi.UNAUTHORIZED:
          this.showBannerSubject$.next(false);
          this.toastAlertService.open(
            EmailVerificationBannerToastItem.RESEND_UNAUTHORIZED_ERROR,
          );
          break;

        case ErrorCodeApi.USER_ACCOUNT_CLOSED_OR_SUSPENDED:
          this.showBannerSubject$.next(false);
          this.toastAlertService.open(
            EmailVerificationBannerToastItem.RESEND_ACCOUNT_CLOSED_OR_SUSPENDED_ERROR,
          );
          break;

        case ErrorCodeApi.FORBIDDEN:
          this.showBannerSubject$.next(false);
          this.toastAlertService.open(
            EmailVerificationBannerToastItem.RESEND_FORBIDDEN_ERROR,
          );
          break;

        case ErrorCodeApi.INTERNAL_SERVER_ERROR:
        case 'UNKNOWN_ERROR':
          this.toastAlertService.open(
            EmailVerificationBannerToastItem.RESEND_INTERNAL_SERVER_ERROR,
          );
          break;

        default:
          return assertNever(response.errorCode);
      }
    });
  }
}
