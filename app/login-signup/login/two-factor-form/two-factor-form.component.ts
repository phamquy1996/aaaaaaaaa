import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ResponseData } from '@freelancer/datastore';
import { TotpMethod } from '@freelancer/datastore/collections';
import { LoginError } from '@freelancer/login-signup';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { ButtonColor } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { InputSize } from '@freelancer/ui/input';
import { LogoSize } from '@freelancer/ui/logo';
import { Margin } from '@freelancer/ui/margin';
import { FontType, TextSize } from '@freelancer/ui/text';
import { dirtyAndValidate } from '@freelancer/ui/validators';
import { isFormControl } from '@freelancer/utils';
import { ErrorCodeApi } from 'api-typings/errors/errors';

@Component({
  selector: 'app-two-factor-form',
  template: `
    <app-form-logo
      [showBackButton]="true"
      [size]="logoSize"
      [backTrackingLabel]="'TwoFactorForm-Back'"
      [flMarginBottom]="Margin.MID"
      (back)="back.emit()"
    ></app-form-logo>
    <form [formGroup]="formGroup" class="Form" (ngSubmit)="handleVerify()">
      <fl-heading
        class="Form-header"
        i18n="Login 2-step verification header"
        [headingType]="HeadingType.H2"
        [size]="TextSize.MID"
        [flMarginBottom]="Margin.MID"
      >
        2-Step Verification
      </fl-heading>
      <fl-text [ngSwitch]="method" [flMarginBottom]="Margin.SMALL">
        <ng-container
          *ngSwitchCase="TotpMethod.EMAIL"
          i18n="Login 2-step verification message for email"
        >
          A verification code has been sent to you via email. Please verify that
          6 digit code below to continue.
        </ng-container>
        <ng-container
          *ngSwitchCase="TotpMethod.SMS"
          i18n="Login 2-step verification message for email"
        >
          A verification code has been sent to you via SMS. Please verify that 6
          digit code below to continue.
        </ng-container>
        <ng-container
          *ngSwitchCase="TotpMethod.APP_PUSH"
          i18n="Login 2-step verification message for email"
        >
          A verification code has been sent to you via your Freelancer app.
          Please verify that 6 digit code below to continue.
        </ng-container>
        <ng-container
          *ngSwitchCase="TotpMethod.GENERATOR"
          i18n="Login 2-step verification message for email"
        >
          A verification code has been sent to you via your generator app.
          Please verify that 6 digit code below to continue.
        </ng-container>
        <ng-container
          *ngSwitchDefault
          i18n="Login 2-step verification message when we don't know the method"
        >
          A verification code has been sent to you via Email, SMS or app. Please
          verify that 6 digit code below to continue.
        </ng-container>
      </fl-text>
      <fl-bit class="ResendCodeSection" [flMarginBottom]="Margin.SMALL">
        <fl-link
          flTrackingLabel="TwoFactorForm-Resend"
          i18n="Login 2-step verification resend button"
          (click)="resend.emit()"
        >
          Resend code
        </fl-link>
      </fl-bit>
      <fl-bit *ngIf="resendResponse" [flMarginBottom]="Margin.SMALL">
        <fl-banner-alert
          *ngIf="resendResponse.status === 'success'"
          [type]="BannerAlertType.INFO"
          [ngSwitch]="method"
        >
          <ng-container
            *ngSwitchCase="TotpMethod.EMAIL"
            i18n="Login 2-step resend message for email"
          >
            The code has been resent. Please check your email.
          </ng-container>
          <ng-container
            *ngSwitchCase="TotpMethod.SMS"
            i18n="Login 2-step resend message for email"
          >
            The code has been resent. Please check your SMS.
          </ng-container>
          <ng-container
            *ngSwitchCase="TotpMethod.APP_PUSH"
            i18n="Login 2-step resend message for email"
          >
            The code has been resent. Please check your Freelancer app.
          </ng-container>
          <ng-container
            *ngSwitchCase="TotpMethod.GENERATOR"
            i18n="Login 2-step resend message for email"
          >
            The code has been resent. Please check your generator app.
          </ng-container>
          <ng-container
            *ngSwitchDefault
            i18n="Login 2-step resend message when we don't know the method"
          >
            The code has been resent. Please check your Email, SMS or app.
          </ng-container>
        </fl-banner-alert>
        <fl-banner-alert
          *ngIf="resendResponse.status === 'error'"
          i18n="Login 2-step resend failed error message"
          [type]="BannerAlertType.ERROR"
        >
          Could not resend the code. Please refresh the page and try logging in
          again.
        </fl-banner-alert>
      </fl-bit>
      <ng-container *ngIf="formGroup.get('totp') as control">
        <fl-input
          *ngIf="isFormControl(control)"
          flTrackingLabel="TwoFactorForm-Input"
          i18n-placeholder="Login 2-step verification input"
          placeholder="6 digit code"
          [size]="InputSize.LARGE"
          [control]="control"
          [maxLength]="6"
          [flMarginBottom]="Margin.SMALL"
        ></fl-input>
      </ng-container>
      <ng-container *ngIf="response">
        <fl-banner-alert
          *ngIf="response.status === 'error'"
          [type]="BannerAlertType.ERROR"
          [ngSwitch]="response.errorCode"
          [flMarginBottom]="Margin.SMALL"
        >
          <ng-container
            *ngSwitchCase="ErrorCodeApi.AUTH_TOTP_INVALID"
            i18n="Two factor authentication error"
          >
            This code is incorrect. Please try again.
          </ng-container>
          <ng-container *ngSwitchDefault i18n="Two factor authentication error">
            Something went wrong with login verification. Please refresh and try
            again, or contact
            <fl-link
              flTrackingLabel="TwoFactorForm-ErrorSupportLink"
              [link]="'/support'"
              >support</fl-link
            ><fl-text *ngIf="response.requestId" [fontType]="FontType.SPAN">
              with request ID {{ response.requestId }}</fl-text
            >.
          </ng-container>
        </fl-banner-alert>
      </ng-container>
      <app-login-signup-button
        i18n="Login 2-step verification button"
        [busy]="response === null"
        [stepLabel]="'TwoFactorForm'"
      >
        Verify
      </app-login-signup-button>
    </form>
  `,
  styleUrls: ['./two-factor-form.component.scss'],
})
export class TwoFactorFormComponent {
  BannerAlertType = BannerAlertType;
  ButtonColor = ButtonColor;
  FontType = FontType;
  TextSize = TextSize;
  HeadingType = HeadingType;
  InputSize = InputSize;
  isFormControl = isFormControl;
  Margin = Margin;

  TotpMethod = TotpMethod;
  ErrorCodeApi = ErrorCodeApi;

  @Input() logoSize = LogoSize.MID;
  @Input() method?: TotpMethod;
  @Input() formGroup: FormGroup;
  @Input() resendResponse?: ResponseData<unknown, LoginError> | null;
  @Input() response?: ResponseData<unknown, LoginError> | null;

  @Output() complete = new EventEmitter();
  @Output() back = new EventEmitter();
  @Output() resend = new EventEmitter();

  handleVerify() {
    if (this.response === null) {
      return;
    }
    dirtyAndValidate(this.formGroup);
    if (this.formGroup.valid) {
      this.complete.emit();
    }
  }
}
