import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ResponseData } from '@freelancer/datastore';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { ButtonColor } from '@freelancer/ui/button';
import { Focus } from '@freelancer/ui/focus';
import { HeadingType } from '@freelancer/ui/heading';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { InputComponent, InputSize } from '@freelancer/ui/input';
import { LogoSize } from '@freelancer/ui/logo';
import { Margin } from '@freelancer/ui/margin';
import { FontType, TextAlign, TextSize } from '@freelancer/ui/text';
import { dirtyAndValidate } from '@freelancer/ui/validators';
import { isFormControl } from '@freelancer/utils';
import { ErrorCodeApi } from 'api-typings/errors/errors';

@Component({
  selector: 'app-reset-password-form',
  template: `
    <app-form-logo
      [showBackButton]="true"
      [backTrackingLabel]="'ResetPasswordForm-BackLink'"
      [size]="logoSize"
      [forceFreelancerBranding]="freelancerBranding"
      [flMarginBottom]="Margin.MID"
      (back)="back.emit()"
    ></app-form-logo>
    <form class="Form" [formGroup]="formGroup">
      <fl-heading
        class="Form-heading"
        i18n="Reset your password heading"
        [headingType]="HeadingType.H1"
        [size]="TextSize.MID"
        [flMarginBottom]="Margin.SMALL"
      >
        Reset your password
      </fl-heading>
      <fl-text
        class="Form-subHeading"
        i18n="Reset password form instructions"
        [flMarginBottom]="Margin.LARGE"
        [textAlign]="TextAlign.CENTER"
      >
        Enter your
        <fl-text *ngIf="domain" [fontType]="FontType.SPAN">
          {{ domain }}
        </fl-text>
        email address so we can reset your password.
      </fl-text>
      <ng-container *ngIf="formGroup.get('email') as control">
        <fl-input
          *ngIf="isFormControl(control)"
          flTrackingLabel="ResetPasswordForm-PasswordInput"
          i18n-placeholder="Enter email"
          placeholder="Enter email"
          [control]="control"
          [flMarginBottom]="Margin.LARGE"
          [size]="InputSize.LARGE"
          #focusInput
        ></fl-input>
      </ng-container>
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
            Something went wrong while resetting your password. Please refresh
            and try again or contact
            <fl-link
              flTrackingLabel="ResetPasswordForm-UnknownErrorContactSupportLink"
              [newTab]="true"
              [link]="'/support'"
              >support</fl-link
            >.
          </ng-container>
        </fl-banner-alert>
      </ng-container>
      <app-login-signup-button
        i18n="Reset password form next button"
        [busy]="response === null"
        [freelancerBranding]="freelancerBranding"
        [stepLabel]="'ResetPasswordForm'"
        (click)="onSubmit()"
      >
        Next
      </app-login-signup-button>
    </form>
  `,
  styleUrls: ['./reset-password-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordFormComponent implements AfterViewInit {
  BannerAlertType = BannerAlertType;
  ButtonColor = ButtonColor;
  TextSize = TextSize;
  FontType = FontType;
  HeadingType = HeadingType;
  IconColor = IconColor;
  IconSize = IconSize;
  InputSize = InputSize;
  isFormControl = isFormControl;
  LogoSize = LogoSize;
  Margin = Margin;
  TextAlign = TextAlign;

  @Input() logoSize = LogoSize.MID;
  @Input() response?: ResponseData<unknown, ErrorCodeApi | 'UNKNOWN_ERROR'>;
  @Input() freelancerBranding = false;
  @Input() domain?: string;
  @Input() formGroup: FormGroup;
  @Output() back = new EventEmitter();
  @Output() complete = new EventEmitter();

  @ViewChild('focusInput') focusInput: InputComponent;

  constructor(private focus: Focus) {}

  ngAfterViewInit() {
    this.focus.focusElement(this.focusInput.nativeElement);
  }

  onSubmit() {
    dirtyAndValidate(this.formGroup);

    if (!this.formGroup.valid) {
      return;
    }

    this.complete.emit();
  }
}
