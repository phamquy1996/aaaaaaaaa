import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppleSignInError } from '@freelancer/auth';
import { ErrorResponseData } from '@freelancer/datastore';
import { FacebookSignInError } from '@freelancer/facebook';
import { LoginError } from '@freelancer/login-signup';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { FontType } from '@freelancer/ui/text';
import { ErrorCodeApi } from 'api-typings/errors/errors';

@Component({
  selector: `app-login-signup-errors`,
  template: `
    <fl-banner-alert
      [type]="BannerAlertType.ERROR"
      [ngSwitch]="response.errorCode"
    >
      <ng-container
        *ngSwitchCase="ErrorCodeApi.AUTH_USER_MISSING"
        i18n="Login wrong username password message"
      >
        Incorrect username or password.
      </ng-container>
      <ng-container
        *ngSwitchCase="ErrorCodeApi.EMAIL_ALREADY_IN_USE"
        i18n="
           Email already in use. Provide a different email addres or sign in
          message
        "
      >
        This email address is already in use, please provide a different one or
        <fl-link
          flTrackingLabel="ErrorSwitchToLogin"
          (click)="switchToLogin.emit()"
          >log in</fl-link
        >.
      </ng-container>
      <ng-container
        *ngSwitchCase="ErrorCodeApi.AUTH_CAPTCHA_REQUIRED"
        i18n="Login wrong username password message"
      >
        Please complete the CAPTCHA to log in.
      </ng-container>
      <ng-container
        *ngSwitchCase="ErrorCodeApi.AUTH_ACCOUNT_CLOSED"
        i18n="Login wrong username password message"
      >
        This account has been closed. Please contact
        <fl-link
          flTrackingLabel="DetailsForm-LoginClosedAccountSupportLink"
          [link]="'/support/profile/can-i-reopen-my-closed-account'"
          >support</fl-link
        >
        for further details.
      </ng-container>
      <ng-container
        *ngSwitchCase="ErrorCodeApi.AUTH_ACCOUNT_SUSPENDED"
        i18n="Login wrong username password message"
      >
        This account has been suspended. Please visit
        <fl-link
          flTrackingLabel="DetailsForm-SuspendedAccountLink"
          [link]="'/users/usersuspended.php'"
          >this page</fl-link
        >
        for further details.
      </ng-container>
      <ng-container
        *ngSwitchCase="ErrorCodeApi.AUTH_2FA_BLOCKED"
        i18n="Login wrong username password message"
      >
        Your login has been blocked due to signing in from an unknown device.
        Check your email and enter the code to log in.
      </ng-container>

      <!-- error handling for facebook login / signup -->
      <ng-container
        *ngSwitchCase="ErrorCodeApi.AUTH_FACEBOOK_EMAIL_EXISTS"
        i18n="Login facebook failed message"
      >
        <!-- "again" because this error only shows up if the user goes back from FB link -->
        Your email address is already associated with a Freelancer account.
        Please log in with Facebook again and link your accounts.
      </ng-container>
      <ng-container
        *ngSwitchCase="FacebookSignInError.CANCELED"
        i18n="Login facebook canceled message"
      >
        Facebook login was canceled. Please try again.
      </ng-container>
      <ng-container
        *ngSwitchCase="FacebookSignInError.EXPIRED"
        i18n="Login facebook expired message"
      >
        Your Facebook session has expired. Please log into Facebook and try
        again.
      </ng-container>
      <ng-container
        *ngSwitchCase="FacebookSignInError.NOT_AUTHORIZED"
        i18n="Login facebook failed message"
      >
        Could not connect your Facebook account. Please try again.
      </ng-container>
      <!-- nothing much we can do about the other facebook errors -->
      <!-- our backend returned something bad -->
      <ng-container
        *ngSwitchCase="ErrorCodeApi.AUTH_FACEBOOK_LINK_FAILED"
        [ngTemplateOutlet]="genericFacebookError"
      ></ng-container>
      <!-- even facebook doesn't know -->
      <ng-container
        *ngSwitchCase="FacebookSignInError.UNKNOWN"
        [ngTemplateOutlet]="genericFacebookError"
      ></ng-container>
      <ng-template #genericFacebookError>
        <ng-container i18n="Login facebook generic error message">
          Could not connect your Facebook account. Please try again, or contact
          <fl-link
            flTrackingLabel="DetailsForm-ErrorSupportLink"
            [link]="'/support'"
            >support</fl-link
          >
          with error code "{{ response.errorCode }}"
          <ng-container *ngIf="response.requestId">
            and request ID {{ response.requestId }}
          </ng-container>
        </ng-container>
      </ng-template>
      <ng-container
        *ngSwitchCase="AppleSignInError.CANCELED"
        i18n="Login apple canceled message"
      >
        <!-- TODO: Link to native permissions? -->
        Sign in attempt was canceled. Please try again or enable Sign in with
        Apple in your permissions settings.
      </ng-container>
      <!-- nothing much we can do about the other apple errors -->
      <!-- our backend failed -->
      <ng-container
        *ngSwitchCase="ErrorCodeApi.AUTH_APPLE_LINK_FAILED"
        [ngTemplateOutlet]="genericAppleError"
      ></ng-container>
      <!-- invalid request (shouldn't happen) -->
      <ng-container
        *ngSwitchCase="AppleSignInError.INVALID"
        [ngTemplateOutlet]="genericAppleError"
      ></ng-container>
      <!-- not handled (also shouldn't happen?) -->
      <ng-container
        *ngSwitchCase="AppleSignInError.NOT_HANDLED"
        [ngTemplateOutlet]="genericAppleError"
      ></ng-container>
      <!-- even apple doesn't know -->
      <ng-container
        *ngSwitchCase="AppleSignInError.UNKNOWN"
        [ngTemplateOutlet]="genericAppleError"
      ></ng-container>
      <ng-template #genericAppleError>
        <ng-container i18n="Login apple generic error message">
          Could not connect your Apple ID. Please try again, or contact
          <fl-link
            flTrackingLabel="DetailsForm-ErrorSupportLink"
            [link]="'/support'"
            >support</fl-link
          >
          with error code "{{ response.errorCode }}"
          <ng-container *ngIf="response.requestId">
            and request ID {{ response.requestId }}
          </ng-container>
        </ng-container>
      </ng-template>
      <ng-container
        *ngSwitchCase="ErrorCodeApi.AUTH_DEVICE_TOKEN_INVALID"
        i18n="Login unrecoverable error"
      >
        Something went wrong. Please refresh the page and try again, or contact
        <fl-link
          flTrackingLabel="DetailsForm-ErrorSupportLink"
          [link]="'/support'"
          >support</fl-link
        ><fl-text *ngIf="response.requestId">
          with request ID {{ response.requestId }}</fl-text
        >.
      </ng-container>
      <ng-container
        *ngSwitchDefault
        i18n=" Unknown error encountered. Try again or contact support message "
      >
        Something went wrong while creating your account. Please try again or
        contact
        <fl-link
          flTrackingLabel="DetailsForm-ErrorSupportLink"
          [newTab]="true"
          [link]="'/support'"
          >support</fl-link
        ><fl-text *ngIf="response.requestId" [fontType]="FontType.SPAN">
          with request ID {{ response.requestId }}</fl-text
        >.
      </ng-container>
    </fl-banner-alert>
  `,
  styleUrls: ['./login-signup-errors.component.scss'],
})
export class LoginSignupErrorsComponent {
  ErrorCodeApi = ErrorCodeApi;
  AppleSignInError = AppleSignInError;
  FacebookSignInError = FacebookSignInError;

  BannerAlertType = BannerAlertType;
  FontType = FontType;

  @Input() response: ErrorResponseData<LoginError>;
  @Output() switchToLogin = new EventEmitter<null>();
}
