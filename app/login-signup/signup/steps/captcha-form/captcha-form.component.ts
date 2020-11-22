import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CaptchaComponent } from '@freelancer/captcha';
import { ResponseData } from '@freelancer/datastore';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { HeadingType } from '@freelancer/ui/heading';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { LogoSize } from '@freelancer/ui/logo';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, FontType, TextAlign, TextSize } from '@freelancer/ui/text';
import { dirtyAndValidate } from '@freelancer/ui/validators';
import { isFormControl } from '@freelancer/utils';
import { ErrorCodeApi } from 'api-typings/errors/errors';

@Component({
  selector: 'app-captcha-form',
  template: `
    <app-form-logo
      [showBackButton]="true"
      [size]="logoSize"
      [backTrackingLabel]="'CaptchaForm-Back'"
      [flMarginBottom]="Margin.MID"
      (back)="back.emit()"
    ></app-form-logo>
    <form class="Form" [formGroup]="formGroup" (ngSubmit)="handleComplete()">
      <fl-heading
        class="Form-heading"
        i18n="Signup captcha heading"
        [headingType]="HeadingType.H1"
        [size]="TextSize.MID"
        [flMarginBottom]="Margin.XXSMALL"
      >
        You're almost there!
      </fl-heading>
      <fl-bit
        *ngIf="formGroup.get('response') as control"
        class="Form-captchaSection"
        [flMarginBottom]="Margin.SMALL"
      >
        <fl-captcha
          #captchaElement
          *ngIf="isFormControl(control)"
          flTrackingLabel="CaptchaForm-CaptchaElement"
          [control]="control"
        ></fl-captcha>
      </fl-bit>
      <ng-container *ngIf="response">
        <fl-banner-alert
          *ngIf="response.status === 'error'"
          [ngSwitch]="response.errorCode"
          [type]="BannerAlertType.ERROR"
          [flMarginBottom]="Margin.SMALL"
        >
          <ng-container
            *ngSwitchCase="ErrorCodeApi.SIGNUP_CAPTCHA_INVALID"
            i18n="Invalid captcha message"
          >
            Invalid Captcha response. Please
            <fl-link
              flTrackingLabel="CaptchaForm-ResetCaptcha"
              (click)="handleReset()"
              >reset the captcha</fl-link
            >
            and try again.
          </ng-container>
          <ng-container
            *ngSwitchDefault
            i18n="
               Unknown error encountered. Try again or contact support message
            "
          >
            Something went wrong while creating your account. Please try again
            or contact
            <fl-link
              flTrackingLabel="CaptchaForm-SupportLink"
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
        i18n="Signup captcha signup button"
        [busy]="response === null"
        [stepLabel]="'CaptchaForm'"
      >
        Join Freelancer
      </app-login-signup-button>
    </form>
  `,
  styleUrls: ['./captcha-form.component.scss'],
})
export class CaptchaFormComponent {
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

  ErrorCodeApi = ErrorCodeApi;

  @Input() logoSize = LogoSize.MID;
  @Input() formGroup: FormGroup;
  @Input() response?: ResponseData<unknown, ErrorCodeApi | 'UNKNOWN_ERROR'>;

  @Output() back = new EventEmitter();
  @Output() complete = new EventEmitter();

  @ViewChild('captchaElement') captchaElement: CaptchaComponent;

  handleComplete() {
    if (this.response === null) {
      return;
    }
    dirtyAndValidate(this.formGroup);
    if (this.formGroup.valid) {
      this.complete.emit();
    }
  }

  handleReset() {
    this.captchaElement.reset();
  }
}
