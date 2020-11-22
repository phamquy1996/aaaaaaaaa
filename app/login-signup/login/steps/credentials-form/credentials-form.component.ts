import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ResponseData } from '@freelancer/datastore';
import { LoginError } from '@freelancer/login-signup';
import { Pwa } from '@freelancer/pwa';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { Focus } from '@freelancer/ui/focus';
import { HeadingType } from '@freelancer/ui/heading';
import { InputComponent, InputSize, InputType } from '@freelancer/ui/input';
import { LogoSize } from '@freelancer/ui/logo';
import { Margin } from '@freelancer/ui/margin';
import { PictureDisplay } from '@freelancer/ui/picture';
import { FontType, TextAlign, TextSize } from '@freelancer/ui/text';
import { dirtyAndValidate } from '@freelancer/ui/validators';
import { isFormControl } from '@freelancer/utils';
import { ErrorCodeApi } from 'api-typings/errors/errors';

@Component({
  selector: 'app-credentials-form',
  template: `
    <app-form-logo
      [size]="logoSize"
      [flMarginBottom]="Margin.MID"
    ></app-form-logo>
    <form class="LoginForm" [formGroup]="formGroup" (ngSubmit)="handleLogin()">
      <fl-heading
        class="LoginForm-heading"
        i18n="Login form heading"
        [attr.text-align-left]="subHeader?.length > 0"
        [headingType]="HeadingType.H2"
        [size]="TextSize.MID"
        [flMarginBottom]="subHeader?.length > 0 ? Margin.XSMALL : Margin.LARGE"
      >
        Welcome Back
      </fl-heading>
      <fl-text
        *ngIf="subHeader"
        [flMarginBottom]="Margin.MID"
        [size]="TextSize.XXSMALL"
      >
        {{ subHeader }}
      </fl-text>
      <app-apple-button
        *ngIf="showAppleSignin"
        i18n="Login form Apple login button"
        [flMarginBottom]="Margin.SMALL"
        [stepLabel]="'CredentialsForm'"
        (click)="handleAppleClick()"
      >
        Sign in with Apple
      </app-apple-button>
      <app-facebook-button
        i18n="Login form Facebook login button"
        [disabled]="!facebookLoginStatusLoaded"
        [flMarginBottom]="Margin.MID"
        [stepLabel]="'CredentialsForm'"
        (click)="handleFacebookClick()"
      >
        Log in with Facebook
      </app-facebook-button>
      <fl-hr
        i18n-label="Login form divider"
        label="or"
        [flMarginBottom]="Margin.MID"
      ></fl-hr>
      <ng-container *ngIf="formGroup.get('user') as control">
        <fl-input
          *ngIf="isFormControl(control)"
          flTrackingLabel="CredentialsForm-EmailInput"
          placeholder="Email or Username"
          i18n-placeholder="Login form email/username field placeholder"
          [flMarginBottom]="Margin.SMALL"
          [control]="control"
          [size]="InputSize.LARGE"
          [type]="InputType.EMAIL"
          #focusInput
        ></fl-input>
      </ng-container>
      <ng-container *ngIf="formGroup.get('password') as control">
        <fl-input
          *ngIf="isFormControl(control)"
          #password
          flTrackingLabel="CredentialsForm-PasswordInput"
          placeholder="Password"
          i18n-placeholder="Login form password field placeholder"
          [flMarginBottom]="Margin.MID"
          [control]="control"
          [size]="InputSize.LARGE"
          [type]="InputType.PASSWORD"
        ></fl-input>
      </ng-container>
      <fl-bit class="LoginForm-rememberMe" [flMarginBottom]="Margin.XXSMALL">
        <ng-container *ngIf="formGroup.get('rememberMe') as control">
          <fl-checkbox
            *ngIf="isFormControl(control)"
            [flPwaHideInstalled]="true"
            flTrackingLabel="CredentialsForm-RememberMe"
            i18n-label="Login form remember me checkbox label"
            label="Remember me"
            [control]="control"
          ></fl-checkbox>
        </ng-container>
        <fl-link
          flTrackingLabel="CredentialsForm-ForgotPassword"
          i18n="Login page forgot password link"
          (click)="resetPassword.emit()"
        >
          Forgot Password?
        </fl-link>
      </fl-bit>
      <app-login-signup-errors
        *ngIf="response && response.status === 'error'"
        [response]="response"
        [flMarginBottom]="Margin.SMALL"
      ></app-login-signup-errors>
      <app-login-signup-button
        i18n="Login form button (this is an action)"
        [busy]="response === null"
        [flMarginBottom]="Margin.LARGE"
        [stepLabel]="'CredentialsForm'"
      >
        Log In
      </app-login-signup-button>
      <fl-hr [flMarginBottom]="Margin.SMALL"></fl-hr>
      <fl-text
        i18n="Login form link to signup page"
        [textAlign]="TextAlign.CENTER"
        [size]="TextSize.XXSMALL"
        [flMarginBottom]="Margin.MID"
      >
        Don't have an account?
        <fl-link
          flTrackingLabel="CredentialsForm-SignupLink"
          [size]="TextSize.XXSMALL"
          (click)="switchToSignup.emit()"
        >
          Sign Up
        </fl-link>
      </fl-text>
      <fl-bit class="LoginMobileSection" [flPwaHideInstalled]="true">
        <fl-link
          [link]="'https://bnc.lt/Ed5l/nPQu9RdcWr'"
          [flMarginRight]="Margin.SMALL"
          [flTrackingLabel]="'CredentialsForm-DownloadAppStore'"
        >
          <fl-picture
            class="LoginMobileSection-badge"
            alt="Apple app store logo"
            i18n-alt="Footer App Install logo alt text"
            [src]="'login-signup/app-store-badges/apple-app-store-badge.png'"
            [display]="PictureDisplay.BLOCK"
          ></fl-picture>
        </fl-link>
        <fl-link
          [link]="'https://bnc.lt/Ed5l/nPQu9RdcWr'"
          [flTrackingLabel]="'CredentialsForm-DownloadPlayStore'"
        >
          <fl-picture
            class="LoginMobileSection-badge"
            alt="Google Play logo"
            i18n-alt="Footer App Install logo alt text"
            [src]="'login-signup/app-store-badges/google-play-store-badge.png'"
            [display]="PictureDisplay.BLOCK"
          ></fl-picture>
        </fl-link>
      </fl-bit>
    </form>
  `,
  styleUrls: ['./credentials-form.component.scss'],
})
export class CredentialsFormComponent implements OnInit, AfterViewInit {
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

  @Input() logoSize = LogoSize.MID;
  @Input() showAppleSignin = false;
  @Input() facebookLoginStatusLoaded = false;
  @Input() formGroup: FormGroup;
  @Input() response?: ResponseData<unknown, LoginError> | null;
  @Input() subHeader?: string;

  @Output() complete = new EventEmitter();
  @Output() resetPassword = new EventEmitter();
  @Output() appleClick = new EventEmitter();
  @Output() facebookClick = new EventEmitter();
  @Output() switchToSignup = new EventEmitter();

  @ViewChild('focusInput') focusInput: InputComponent;
  @ViewChild('password') passwordInput: InputComponent;

  constructor(private focus: Focus, private pwa: Pwa) {}

  ngOnInit() {
    if (this.pwa.isInstalled()) {
      const rememberMe = this.formGroup.get('rememberMe');
      if (rememberMe) {
        rememberMe.setValue(true);
      }
    }
  }

  ngAfterViewInit() {
    this.focus.focusElement(this.focusInput.nativeElement);
  }

  handleLogin() {
    if (this.response === null) {
      return;
    }
    // manually set the formgroup based on the raw input
    // some password managers don't work nicely with Angular forms
    this.formGroup.controls.user.setValue(
      this.focusInput.nativeElement.nativeElement.value,
    );
    this.formGroup.controls.password.setValue(
      this.passwordInput.nativeElement.nativeElement.value,
    );
    dirtyAndValidate(this.formGroup);
    if (this.formGroup.valid) {
      this.complete.emit();
    }
  }

  handleAppleClick() {
    this.appleClick.emit();
  }

  handleFacebookClick() {
    this.facebookClick.emit();
  }
}
