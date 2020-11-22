import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ResponseData } from '@freelancer/datastore';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { HeadingType } from '@freelancer/ui/heading';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { LogoSize } from '@freelancer/ui/logo';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, FontType, TextAlign, TextSize } from '@freelancer/ui/text';
import { isFormControl } from '@freelancer/utils';
import { ErrorCodeApi } from 'api-typings/errors/errors';

@Component({
  selector: 'app-signup-gdpr-form',
  template: `
    <app-form-logo
      [showBackButton]="true"
      [size]="logoSize"
      [backTrackingLabel]="'SignupGdprForm-Back'"
      [flMarginBottom]="Margin.MID"
      (back)="back.emit()"
    ></app-form-logo>
    <form class="Form" [formGroup]="formGroup" (ngSubmit)="handleComplete()">
      <fl-heading
        class="Form-heading"
        i18n="Signup GDPR email opt-in heading"
        [headingType]="HeadingType.H1"
        [size]="TextSize.MID"
        [flMarginBottom]="Margin.XXSMALL"
      >
        Email Opt-In
      </fl-heading>
      <fl-text
        i18n="Signup GDPR email opt-in description"
        [flMarginBottom]="Margin.SMALL"
        [textAlign]="TextAlign.LEFT"
        [color]="FontColor.DARK"
      >
        Would you like to receive marketing promotions, special offers,
        inspirations, and updates to Freelancer's products and policies? You can
        unsubscribe at any time.
      </fl-text>
      <fl-bit
        *ngIf="formGroup.get('privacyConsent') as control"
        [flMarginBottom]="Margin.LARGE"
      >
        <fl-checkbox
          *ngIf="isFormControl(control)"
          flTrackingLabel="SignupGdprForm-PrivacyConsentCheckbox"
          i18n-label="Signup GDPR email opt-in label"
          label="Yes, I want to receive emails."
          [control]="control"
          [id]="'PrivacyConsent'"
        ></fl-checkbox>
      </fl-bit>
      <fl-heading
        class="Heading"
        i18n="Signup GDPR personal use heading"
        [headingType]="HeadingType.H1"
        [size]="TextSize.MID"
        [flMarginBottom]="Margin.XXSMALL"
      >
        Account Type
      </fl-heading>
      <fl-text
        i18n="Signup GDPR personal use description"
        [flMarginBottom]="Margin.SMALL"
        [textAlign]="TextAlign.LEFT"
        [color]="FontColor.DARK"
      >
        Do you intend to use Freelancer for personal use? Using Freelancer for
        cases other than business may be subject to additional VAT.
      </fl-text>
      <fl-bit
        *ngIf="formGroup.get('personalUse') as control"
        [flMarginBottom]="Margin.LARGE"
      >
        <fl-checkbox
          *ngIf="isFormControl(control)"
          flTrackingLabel="SignupGdprForm-PersonalUseCheckbox"
          i18n-label="Signup GDPR personal use label"
          label="Yes, I am using Freelancer for personal use."
          [control]="control"
          [id]="'PersonalUse'"
        ></fl-checkbox>
      </fl-bit>
      <ng-container *ngIf="response">
        <fl-banner-alert
          *ngIf="response.status === 'error'"
          [type]="BannerAlertType.ERROR"
          [flMarginBottom]="Margin.SMALL"
        >
          <ng-container
            i18n="
               Unknown error encountered. Try again or contact support message
            "
          >
            Something went wrong while creating your account. Please try again
            or contact
            <fl-link
              flTrackingLabel="SignupGdprForm-SupportLink"
              [newTab]="true"
              [link]="'/support'"
              >support</fl-link
            ><fl-text *ngIf="response.requestId" [fontType]="FontType.SPAN">
              with request ID {{ response.requestId }}</fl-text
            >.
          </ng-container>
        </fl-banner-alert>
      </ng-container>
      <app-login-signup-button
        i18n="Signup GDPR signup button"
        [busy]="response === null"
        [stepLabel]="'SignupGdprForm'"
      >
        Sign Up
      </app-login-signup-button>
    </form>
  `,
  styleUrls: ['./gdpr-form.component.scss'],
})
export class GdprFormComponent {
  BannerAlertType = BannerAlertType;
  FontColor = FontColor;
  TextSize = TextSize;
  FontType = FontType;
  HeadingType = HeadingType;
  IconColor = IconColor;
  IconSize = IconSize;
  isFormControl = isFormControl;
  LogoSize = LogoSize;
  Margin = Margin;
  TextAlign = TextAlign;

  @Input() logoSize = LogoSize.MID;
  @Input() formGroup: FormGroup;
  @Input() response?: ResponseData<unknown, ErrorCodeApi | 'UNKNOWN_ERROR'>;

  @Output() back = new EventEmitter();
  @Output() complete = new EventEmitter();

  handleComplete() {
    if (this.response === null) {
      return;
    }
    this.complete.emit();
  }
}
