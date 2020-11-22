import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SSOUser } from '@freelancer/auth';
import { ResponseData } from '@freelancer/datastore';
import { LoginError } from '@freelancer/login-signup';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { HeadingType } from '@freelancer/ui/heading';
import { InputSize, InputType } from '@freelancer/ui/input';
import { LogoSize } from '@freelancer/ui/logo';
import { Margin } from '@freelancer/ui/margin';
import { PictureDisplay } from '@freelancer/ui/picture';
import { FontType, TextAlign, TextSize } from '@freelancer/ui/text';
import { User } from '@freelancer/ui/user-avatar';
import { dirtyAndValidate } from '@freelancer/ui/validators';
import { isFormControl } from '@freelancer/utils';
import { ErrorCodeApi } from 'api-typings/errors/errors';

@Component({
  selector: 'app-facebook-link',
  template: `
    <app-form-logo
      [showBackButton]="true"
      [size]="logoSize"
      [backTrackingLabel]="'FacebookLink-Back'"
      [flMarginBottom]="Margin.MID"
      (back)="back.emit()"
    ></app-form-logo>
    <form
      class="FacebookLinkForm"
      [formGroup]="formGroup"
      (ngSubmit)="handleLogin()"
    >
      <fl-heading
        class="FacebookLinkForm-heading"
        i18n="Facebook account link heading"
        [headingType]="HeadingType.H2"
        [size]="TextSize.MID"
        [flMarginBottom]="Margin.SMALL"
      >
        Link to existing Freelancer account
      </fl-heading>
      <fl-bit
        *ngIf="avatarUser"
        class="FacebookLinkForm-picture"
        [flMarginBottom]="Margin.SMALL"
      >
        <fl-user-avatar [users]="[avatarUser]"></fl-user-avatar>
      </fl-bit>
      <fl-heading
        class="FacebookLinkForm-heading"
        i18n="Facebook account link heading"
        [headingType]="HeadingType.H2"
        [size]="TextSize.MID"
        [flMarginBottom]="Margin.MID"
      >
        Welcome {{ user?.name }}!
      </fl-heading>
      <fl-text
        i18n="Facebook link explainer text"
        [flMarginBottom]="Margin.SMALL"
      >
        Your email address is already associated with a Freelancer account.
        Enter your password below to link accounts.
      </fl-text>
      <ng-container *ngIf="formGroup.get('user') as control">
        <fl-input
          *ngIf="isFormControl(control)"
          flTrackingLabel="FacebookLink-EmailInput"
          placeholder="Email or Username"
          i18n-placeholder="Login form email/username field placeholder"
          [flMarginBottom]="Margin.SMALL"
          [disabled]="true"
          [control]="control"
          [size]="InputSize.LARGE"
          [type]="InputType.EMAIL"
        ></fl-input>
      </ng-container>
      <ng-container *ngIf="formGroup.get('password') as control">
        <fl-input
          *ngIf="isFormControl(control)"
          flTrackingLabel="FacebookLink-PasswordInput"
          placeholder="Password"
          i18n-placeholder="Login form password field placeholder"
          [flMarginBottom]="Margin.MID"
          [control]="control"
          [size]="InputSize.LARGE"
          [type]="InputType.PASSWORD"
        ></fl-input>
      </ng-container>
      <fl-bit
        class="FacebookLinkForm-forgotPassword"
        [flMarginBottom]="Margin.SMALL"
      >
        <fl-bit><!-- empty bit for easier flexing --></fl-bit>
        <fl-link
          flTrackingLabel="FacebookLink-ForgotPassword"
          i18n="Login page forgot password link"
          (click)="resetPassword.emit()"
        >
          Forgot Password?
        </fl-link>
      </fl-bit>
      <ng-container *ngIf="response">
        <fl-banner-alert
          *ngIf="response.status === 'error'"
          [type]="BannerAlertType.ERROR"
          [ngSwitch]="response.errorCode"
          [flMarginBottom]="Margin.SMALL"
        >
          <ng-container
            *ngSwitchCase="ErrorCodeApi.AUTH_USER_MISSING"
            i18n="Login wrong username password message"
          >
            Incorrect username or password.
          </ng-container>
          <ng-container
            *ngSwitchCase="ErrorCodeApi.AUTH_ACCOUNT_CLOSED"
            i18n="Login wrong username password message"
          >
            This account has been closed. Please contact
            <fl-link
              flTrackingLabel="FacebookLink-ClosedAccountSupportLink"
              [link]="'/support/profile/can-i-reopen-my-closed-account'"
              >support</fl-link
            >
            for further details.
          </ng-container>
          <!-- this shouldn't actually appear: see login-component::112 -->
          <ng-container
            *ngSwitchCase="ErrorCodeApi.AUTH_ACCOUNT_SUSPENDED"
            i18n="Login wrong username password message"
          >
            This account has been suspended. Please visit
            <fl-link
              flTrackingLabel="FacebookLink-SuspendedAccountLink"
              [link]="'/users/usersuspended.php'"
              >this page</fl-link
            >
            for further details.
          </ng-container>
          <ng-container
            *ngSwitchCase="ErrorCodeApi.AUTH_CAPTCHA_REQUIRED"
            i18n="Login wrong username password message"
          >
            Please complete the CAPTCHA to log in.
          </ng-container>
          <ng-container
            *ngSwitchCase="ErrorCodeApi.AUTH_2FA_BLOCKED"
            i18n="Login wrong username password message"
          >
            Your login has been blocked due to signing in from an unknown
            device. Check your email and enter the code to log in.
          </ng-container>
          <ng-container
            *ngSwitchCase="ErrorCodeApi.AUTH_FACEBOOK_LINK_FAILED"
            i18n="Login facebook failed message"
          >
            Could not connect your Facebook account. Please try again.
          </ng-container>
          <ng-container
            *ngSwitchCase="ErrorCodeApi.AUTH_DEVICE_TOKEN_INVALID"
            i18n="Login unrecoverable error"
          >
            Something went wrong. Please refresh the page and try again, or
            contact
            <fl-link
              flTrackingLabel="FacebookLink-ErrorSupportLink"
              [link]="'/support'"
              >support</fl-link
            ><fl-text *ngIf="response.requestId" [fontType]="FontType.SPAN">
              with request ID {{ response.requestId }}</fl-text
            >.
          </ng-container>
          <ng-container *ngSwitchDefault i18n="Login unknown error message">
            Something went wrong. Please check your credentials and try again,
            or contact
            <fl-link
              flTrackingLabel="FacebookLink-ErrorSupportLink"
              [link]="'/support'"
              >support</fl-link
            ><fl-text *ngIf="response.requestId" [fontType]="FontType.SPAN">
              with request ID {{ response.requestId }}</fl-text
            >.
          </ng-container>
        </fl-banner-alert>
      </ng-container>
      <app-login-signup-button
        i18n="Login form button (this is an action)"
        [busy]="response === null"
        [stepLabel]="'FacebookLink'"
      >
        Log In
      </app-login-signup-button>
    </form>
  `,
  styleUrls: ['./facebook-link.component.scss'],
})
export class FacebookLinkComponent implements OnChanges {
  BannerAlertType = BannerAlertType;
  TextSize = TextSize;
  FontType = FontType;
  HeadingType = HeadingType;
  InputSize = InputSize;
  InputType = InputType;
  isFormControl = isFormControl;
  LogoSize = LogoSize;
  Margin = Margin;
  PictureDisplay = PictureDisplay;
  TextAlign = TextAlign;

  ErrorCodeApi = ErrorCodeApi;

  avatarUser?: User;

  @Input() logoSize = LogoSize.MID;
  @Input() formGroup: FormGroup;
  @Input() user: SSOUser;
  @Input() response?: ResponseData<unknown, LoginError> | null;

  @Output() back = new EventEmitter();
  @Output() complete = new EventEmitter();
  @Output() resetPassword = new EventEmitter();

  ngOnChanges(changes: SimpleChanges) {
    if ('user' in changes) {
      this.avatarUser = this.user
        ? {
            username: this.user.name,
            avatar: this.user.profileUrl,
          }
        : undefined;
      if (this.user) {
        this.formGroup.patchValue({ user: this.user.email });
      }
    }
  }

  handleLogin() {
    if (this.response === null) {
      return;
    }
    dirtyAndValidate(this.formGroup);
    if (this.formGroup.valid) {
      this.complete.emit();
    }
  }
}
