import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ResponseData } from '@freelancer/datastore';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { CardSize } from '@freelancer/ui/card';
import { VerticalAlignment } from '@freelancer/ui/grid';
import { HeadingType } from '@freelancer/ui/heading';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { LogoSize } from '@freelancer/ui/logo';
import { Margin } from '@freelancer/ui/margin';
import { SpinnerSize } from '@freelancer/ui/spinner';
import {
  FontColor,
  FontType,
  FontWeight,
  TextAlign,
  TextSize,
} from '@freelancer/ui/text';
import { ErrorCodeApi } from 'api-typings/errors/errors';

@Component({
  selector: 'app-account-type-form',
  template: `
    <app-form-logo
      [showBackButton]="true"
      [size]="logoSize"
      [backTrackingLabel]="'AccountTypeForm-Back'"
      [flMarginBottom]="Margin.MID"
      (back)="back.emit()"
    ></app-form-logo>
    <form class="Form" [formGroup]="formGroup">
      <fl-heading
        i18n="Signup account type selection heading"
        [headingType]="HeadingType.H1"
        [size]="TextSize.MID"
      >
        Select account type
      </fl-heading>
      <fl-text
        [flMarginBottom]="Margin.MID"
        [textAlign]="TextAlign.LEFT"
        [color]="FontColor.DARK"
      >
        <ng-container *ngIf="subheaderText; else defaultSubheaderText">
          {{ subheaderText }}
        </ng-container>
        <ng-template #defaultSubheaderText>
          <ng-container i18n="Signup account type selection description">
            Don't worry, this can be changed later.
          </ng-container>
        </ng-template>
      </fl-text>
      <fl-card
        flTrackingLabel="AccountTypeForm-FreelancerCard"
        flTrackingConversion="User Sign Up"
        [flTrackingExtraParams]="{ account_type: 'freelancer' }"
        [clickable]="true"
        [size]="CardSize.SMALL"
        [flMarginBottom]="Margin.SMALL"
        (click)="handleAccountTypeSelected('freelancer')"
      >
        <fl-grid [vAlign]="VerticalAlignment.VERTICAL_CENTER">
          <fl-col [col]="4">
            <fl-picture
              i18n-alt="Alternative text"
              alt="Work illustration"
              [src]="'login-signup/work.svg'"
              [fullWidth]="true"
            ></fl-picture>
          </fl-col>
          <fl-col [col]="6">
            <fl-text [size]="TextSize.SMALL" [weight]="FontWeight.BOLD">
              <ng-container
                *ngIf="freelancerLabel; else defaultFreelancerLabel"
              >
                {{ freelancerLabel }}
              </ng-container>
              <ng-template #defaultFreelancerLabel>
                <ng-container i18n="Signup account type freelancer label">
                  I want to work
                </ng-container>
              </ng-template>
            </fl-text>
          </fl-col>
          <fl-col [col]="2">
            <fl-spinner
              *ngIf="
                response === null &&
                  formGroup.value.accountType === 'freelancer';
                else freelancerArrowIcon
              "
              flTrackingLabel="AccountTypeForm-SignupAsFreelancerSpinner"
              [size]="SpinnerSize.SMALL"
            ></fl-spinner>
            <ng-template #freelancerArrowIcon>
              <fl-icon name="ui-arrow-right"></fl-icon>
            </ng-template>
          </fl-col>
        </fl-grid>
      </fl-card>
      <fl-card
        flTrackingLabel="AccountTypeForm-EmployerCard"
        flTrackingConversion="User Sign Up"
        [flTrackingExtraParams]="{ account_type: 'employer' }"
        [clickable]="true"
        [size]="CardSize.SMALL"
        [flMarginBottom]="Margin.SMALL"
        (click)="handleAccountTypeSelected('employer')"
      >
        <fl-grid [vAlign]="VerticalAlignment.VERTICAL_CENTER">
          <fl-col [col]="4">
            <fl-picture
              i18n-alt="Alternative text"
              alt="Hire illustration"
              [src]="'login-signup/hire.svg'"
              [fullWidth]="true"
            ></fl-picture>
          </fl-col>
          <fl-col [col]="6">
            <fl-text [size]="TextSize.SMALL" [weight]="FontWeight.BOLD">
              <ng-container *ngIf="employerLabel; else defaultEmployerLabel">
                {{ employerLabel }}
              </ng-container>
              <ng-template #defaultEmployerLabel>
                <ng-container i18n="Signup account type employer label">
                  I want to hire
                </ng-container>
              </ng-template>
            </fl-text>
          </fl-col>
          <fl-col [col]="2">
            <fl-spinner
              *ngIf="
                response === null && formGroup.value.accountType === 'employer';
                else employerArrowIcon
              "
              flTrackingLabel="AccountTypeForm-SignupAsEmployerSpinner"
              [size]="SpinnerSize.SMALL"
            ></fl-spinner>
            <ng-template #employerArrowIcon>
              <fl-icon name="ui-arrow-right"></fl-icon>
            </ng-template>
          </fl-col>
        </fl-grid>
      </fl-card>
      <ng-container *ngIf="response">
        <fl-banner-alert
          *ngIf="response.status === 'error'"
          [type]="BannerAlertType.ERROR"
          [ngSwitch]="response.errorCode"
          [flMarginBottom]="Margin.SMALL"
        >
          <ng-container
            *ngSwitchCase="ErrorCodeApi.EMAIL_ALREADY_IN_USE"
            i18n="Email address already registered error message."
          >
            This email address is already registered. Please choose another one.
          </ng-container>
          <ng-container
            *ngSwitchCase="ErrorCodeApi.USERNAME_ALREADY_IN_USE"
            i18n="Username already registered error message."
          >
            This username is already registered. Please choose another one.
          </ng-container>
          <ng-container
            *ngSwitchCase="ErrorCodeApi.TOO_MANY_REQUESTS"
            i18n="Too many requests error message."
          >
            You are performing too many requests. Please try again later.
          </ng-container>
          <ng-container
            *ngSwitchCase="ErrorCodeApi.FORBIDDEN"
            i18n="Signup forbidden error message."
          >
            We regret to inform you that this service is currently unavailable
            in your region.
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
              flTrackingLabel="AccountTypeForm-SupportLink"
              [newTab]="true"
              [link]="'/support'"
              >support</fl-link
            ><fl-text *ngIf="response.requestId" [fontType]="FontType.SPAN">
              with request ID {{ response.requestId }}</fl-text
            >.
          </ng-container>
        </fl-banner-alert>
      </ng-container>
    </form>
  `,
  styleUrls: ['./account-type-form.component.scss'],
})
export class AccountTypeFormComponent {
  BannerAlertType = BannerAlertType;
  CardSize = CardSize;
  ErrorCodeApi = ErrorCodeApi;
  FontColor = FontColor;
  FontType = FontType;
  TextSize = TextSize;
  FontWeight = FontWeight;
  HeadingType = HeadingType;
  IconColor = IconColor;
  IconSize = IconSize;
  LogoSize = LogoSize;
  Margin = Margin;
  SpinnerSize = SpinnerSize;
  TextAlign = TextAlign;
  VerticalAlignment = VerticalAlignment;

  @Input() logoSize = LogoSize.MID;
  @Input() formGroup: FormGroup;
  @Input() response?: ResponseData<unknown, ErrorCodeApi | 'UNKNOWN_ERROR'>;
  @Input() employerLabel?: string;
  @Input() freelancerLabel?: string;
  @Input() subheaderText?: string;

  @Output() back = new EventEmitter();
  @Output() complete = new EventEmitter();

  handleAccountTypeSelected(accountType: string) {
    if (this.response === null) {
      return;
    }
    this.formGroup.patchValue({ accountType });
    this.complete.emit();
  }
}
