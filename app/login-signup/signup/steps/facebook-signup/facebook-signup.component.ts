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
import { ErrorResponseData } from '@freelancer/datastore';
import { LoginError } from '@freelancer/login-signup';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { HeadingType } from '@freelancer/ui/heading';
import { InputSize, InputType } from '@freelancer/ui/input';
import { LinkUnderline } from '@freelancer/ui/link';
import { LogoSize } from '@freelancer/ui/logo';
import { Margin } from '@freelancer/ui/margin';
import { PictureDisplay } from '@freelancer/ui/picture';
import { FontColor, TextAlign, TextSize } from '@freelancer/ui/text';
import { User } from '@freelancer/ui/user-avatar';
import { dirtyAndValidate } from '@freelancer/ui/validators';
import { isFormControl } from '@freelancer/utils';
import { ErrorCodeApi } from 'api-typings/errors/errors';

@Component({
  selector: 'app-facebook-signup',
  template: `
    <app-form-logo
      [backTrackingLabel]="'FacebookSignup-Back'"
      [size]="logoSize"
      [flMarginBottom]="Margin.MID"
    ></app-form-logo>
    <form
      class="FacebookSignupForm"
      [formGroup]="formGroup"
      (ngSubmit)="onSubmit()"
    >
      <fl-heading
        class="FacebookSignupForm-heading"
        i18n="Facebook account link heading"
        [headingType]="HeadingType.H2"
        [size]="TextSize.MID"
        [flMarginBottom]="Margin.SMALL"
      >
        Sign Up
      </fl-heading>
      <fl-bit
        *ngIf="avatarUser"
        class="FacebookSignupForm-picture"
        [flMarginBottom]="Margin.SMALL"
      >
        <fl-user-avatar [users]="[avatarUser]"></fl-user-avatar>
      </fl-bit>
      <fl-heading
        class="FacebookSignupForm-heading"
        i18n="Facebook account link heading"
        [headingType]="HeadingType.H2"
        [size]="TextSize.MID"
        [flMarginBottom]="Margin.MID"
      >
        Welcome {{ user?.name }}!
      </fl-heading>
      <fl-text
        *ngIf="!this.user?.email"
        i18n="Login form backup email explanation"
        [flMarginBottom]="Margin.XSMALL"
      >
        Please supply a backup email. We'll make sure you don't create duplicate
        accounts and will use this email to let you know if there's an issue
        with your account.
      </fl-text>
      <ng-container *ngIf="formGroup.get('email') as control">
        <fl-input
          *ngIf="isFormControl(control)"
          flTrackingLabel="FacebookSignup-EmailInput"
          placeholder="Email"
          i18n-placeholder="Login form email/username field placeholder"
          [flMarginBottom]="Margin.SMALL"
          [disabled]="!!this.user?.email"
          [control]="control"
          [size]="InputSize.LARGE"
          [type]="InputType.EMAIL"
        ></fl-input>
      </ng-container>
      <fl-bit *ngIf="formGroup.get('termsOfUse') as control" class="Agreement">
        <fl-checkbox
          *ngIf="isFormControl(control)"
          flTrackingLabel="FacebookSignup-TermsOfUseCheckbox"
          [control]="control"
          [id]="'FacebookSignupAgreement'"
        ></fl-checkbox>
        <fl-label [for]="'FacebookSignupAgreement'">
          <fl-text
            i18n="Facebook link explainer text"
            [textAlign]="TextAlign.LEFT"
            [flMarginBottom]="Margin.SMALL"
            [size]="TextSize.XXSMALL"
            [color]="
              control.dirty && control.invalid
                ? FontColor.ERROR
                : FontColor.DARK
            "
          >
            I agree to the Freelancer
            <fl-link
              flTrackingLabel="FacebookSignup-TermsOfUseLink"
              [link]="'/info/plainterms.html'"
              [newTab]="true"
              [underline]="LinkUnderline.ALWAYS"
              [size]="TextSize.INHERIT"
              >User Agreement</fl-link
            >
            and
            <fl-link
              flTrackingLabel="FacebookSignup-PrivacyPolicyLink"
              [link]="'/about/privacy'"
              [newTab]="true"
              [size]="TextSize.INHERIT"
              [underline]="LinkUnderline.ALWAYS"
              >Privacy Policy</fl-link
            >.
          </fl-text>
        </fl-label>
      </fl-bit>
      <app-login-signup-errors
        *ngIf="response && response.status === 'error'"
        [response]="response"
        [flMarginBottom]="Margin.SMALL"
        (switchToLogin)="switchToLogin.emit()"
      ></app-login-signup-errors>
      <app-login-signup-button
        i18n="Login form button (this is an action)"
        [stepLabel]="'FacebookSignup'"
      >
        Join Freelancer
      </app-login-signup-button>
    </form>
  `,
  styleUrls: ['./facebook-signup.component.scss'],
})
export class FacebookSignupComponent implements OnChanges {
  BannerAlertType = BannerAlertType;
  TextSize = TextSize;
  FontColor = FontColor;
  HeadingType = HeadingType;
  InputSize = InputSize;
  InputType = InputType;
  isFormControl = isFormControl;
  LogoSize = LogoSize;
  Margin = Margin;
  PictureDisplay = PictureDisplay;
  TextAlign = TextAlign;
  LinkUnderline = LinkUnderline;

  ErrorCodeApi = ErrorCodeApi;

  avatarUser?: User;

  @Input() logoSize = LogoSize.MID;
  @Input() formGroup: FormGroup;
  @Input() user?: SSOUser;
  @Input() response: ErrorResponseData<LoginError>;

  @Output() complete = new EventEmitter();
  @Output() switchToLogin = new EventEmitter();

  ngOnChanges(changes: SimpleChanges) {
    if ('user' in changes) {
      this.avatarUser = this.user
        ? {
            username: this.user.name,
            avatar: this.user.profileUrl,
          }
        : undefined;
      if (this.user && this.user.email) {
        this.formGroup.patchValue({ email: this.user.email });
      }
    }
  }

  onSubmit() {
    // Make sure the user acknowledged the terms of use before they proceed.
    const { email, termsOfUse } = this.formGroup.controls;
    dirtyAndValidate(this.formGroup);
    if (email.valid && termsOfUse.valid) {
      this.complete.emit();
    }
  }
}
