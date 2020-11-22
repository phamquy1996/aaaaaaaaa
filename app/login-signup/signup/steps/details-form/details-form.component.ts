import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppleSignInError } from '@freelancer/auth';
import { ResponseData } from '@freelancer/datastore';
import { FacebookSignInError } from '@freelancer/facebook';
import { LoginError } from '@freelancer/login-signup';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { Focus } from '@freelancer/ui/focus';
import { HeadingType } from '@freelancer/ui/heading';
import { InputComponent, InputSize, InputType } from '@freelancer/ui/input';
import { LinkUnderline } from '@freelancer/ui/link';
import { LogoSize } from '@freelancer/ui/logo';
import { Margin } from '@freelancer/ui/margin';
import { SelectItem } from '@freelancer/ui/select';
import {
  FontColor,
  FontType,
  FontWeight,
  TextAlign,
  TextSize,
} from '@freelancer/ui/text';
import { dirtyAndValidate } from '@freelancer/ui/validators';
import { isFormControl } from '@freelancer/utils';
import { ErrorCodeApi } from 'api-typings/errors/errors';

@Component({
  selector: 'app-details-form-header',
  template: `
    <ng-content></ng-content>
  `,
})
export class DetailsFormHeaderComponent {}

@Component({
  selector: 'app-details-form',
  template: `
    <app-form-logo
      [size]="logoSize"
      [flMarginBottom]="Margin.MID"
    ></app-form-logo>
    <form class="Form" [formGroup]="formGroup" (ngSubmit)="onSubmit()">
      <fl-heading
        class="Form-heading"
        i18n="Signup details heading"
        [headingType]="HeadingType.H1"
        [size]="TextSize.MID"
        [flMarginBottom]="Margin.SMALL"
      >
        Sign Up
      </fl-heading>
      <fl-text
        i18n="Signup details description"
        [flMarginBottom]="Margin.LARGE"
        [textAlign]="TextAlign.CENTER"
        [color]="FontColor.DARK"
      >
        <ng-content select="app-details-form-header"></ng-content>
      </fl-text>
      <ng-container *ngIf="showSSO">
        <app-apple-button
          *ngIf="showAppleSignin"
          i18n="Login form Apple login button"
          [flMarginBottom]="Margin.SMALL"
          [stepLabel]="'CredentialsForm'"
          (click)="appleClick.emit()"
        >
          Continue with Apple
        </app-apple-button>
        <app-facebook-button
          i18n="Login form Facebook login button"
          [disabled]="!facebookLoginStatusLoaded"
          [flMarginBottom]="Margin.MID"
          [stepLabel]="'DetailsForm'"
          (click)="facebookClick.emit()"
        >
          Continue with Facebook
        </app-facebook-button>
        <fl-hr
          i18n-label="Login form divider"
          label="or"
          [flMarginBottom]="Margin.MID"
        ></fl-hr>
      </ng-container>
      <ng-container *ngIf="formGroup.get('fullName') as control">
        <fl-input
          *ngIf="isFormControl(control)"
          flTrackingLabel="DetailsForm-FullNameInput"
          placeholder="Full Name"
          i18n-placeholder="Signup details full name input placeholder"
          [flMarginBottom]="Margin.SMALL"
          [control]="control"
          [disabled]="response === null"
          [size]="InputSize.LARGE"
          #focusInput
        ></fl-input>
      </ng-container>
      <ng-container *ngIf="formGroup.get('email') as control">
        <fl-input
          *ngIf="isFormControl(control)"
          flTrackingLabel="DetailsForm-EmailInput"
          placeholder="Email"
          i18n-placeholder="Signup details email input placeholder"
          [flMarginBottom]="Margin.SMALL"
          [control]="control"
          [disabled]="response === null"
          [size]="InputSize.LARGE"
          [type]="InputType.EMAIL"
          #focusInput
        ></fl-input>
      </ng-container>
      <ng-container *ngIf="formGroup.get('password') as control">
        <fl-input
          *ngIf="isFormControl(control)"
          flTrackingLabel="DetailsForm-PasswordInput"
          placeholder="Password"
          i18n-placeholder="Signup details password input placeholder"
          [flMarginBottom]="Margin.SMALL"
          [control]="control"
          [disabled]="response === null"
          [size]="InputSize.LARGE"
          [type]="InputType.PASSWORD"
        ></fl-input>
      </ng-container>
      <ng-container *ngIf="formGroup.get('country') as control">
        <fl-select
          *ngIf="isFormControl(control)"
          flTrackingLabel="DetailsForm-CountrySelect"
          placeholder="Select a Country"
          i18n-placeholder="Signup details country select placeholder"
          [flMarginBottom]="Margin.SMALL"
          [control]="control"
          [disabled]="response === null"
          [options]="countryOptions"
          [size]="InputSize.LARGE"
        ></fl-select>
      </ng-container>
      <fl-bit *ngIf="formGroup.get('termsOfUse') as control" class="Agreement">
        <fl-checkbox
          *ngIf="isFormControl(control)"
          flTrackingLabel="DetailsForm-TermsOfUseCheckbox"
          [control]="control"
          [id]="'SignupAgreement'"
        ></fl-checkbox>
        <fl-label [for]="'SignupAgreement'">
          <fl-text
            i18n="Signup details signup agreement label"
            [textAlign]="TextAlign.LEFT"
            [flMarginBottom]="Margin.SMALL"
            [size]="TextSize.XXSMALL"
            [color]="
              control.dirty && control.invalid
                ? FontColor.ERROR
                : FontColor.DARK
            "
          >
            <ng-container *ngIf="!partnerName; else consentWithPartnerName">
              I agree to the Freelancer
              <fl-link
                flTrackingLabel="DetailsForm-TermsOfUseLink"
                [link]="'/about/terms'"
                [newTab]="true"
                [underline]="LinkUnderline.ALWAYS"
                [size]="TextSize.INHERIT"
                >User Agreement</fl-link
              >
              and
              <fl-link
                flTrackingLabel="DetailsForm-PrivacyPolicyLink"
                [link]="'/about/privacy'"
                [newTab]="true"
                [size]="TextSize.INHERIT"
                [underline]="LinkUnderline.ALWAYS"
                >Privacy Policy</fl-link
              >.
            </ng-container>
            <ng-template #consentWithPartnerName>
              By creating an account you agree to the use of your personal
              information in accordance with {{ partnerName }} and
              Freelancer.com, through the platform's
              <fl-link
                flTrackingLabel="DetailsForm-TermsOfUseLink"
                [link]="'/about/terms'"
                [newTab]="true"
                [underline]="LinkUnderline.ALWAYS"
                [size]="TextSize.INHERIT"
                >Terms of Use</fl-link
              >
              and have read and understand the
              <fl-link
                flTrackingLabel="DetailsForm-PrivacyPolicyLink"
                [link]="'/about/privacy'"
                [newTab]="true"
                [size]="TextSize.INHERIT"
                [underline]="LinkUnderline.ALWAYS"
                >Privacy Policy</fl-link
              >
              and
              <fl-link
                flTrackingLabel="DetailsForm-CookiesPolicyLink"
                [link]="'/about/cookie'"
                [newTab]="true"
                [underline]="LinkUnderline.ALWAYS"
                [size]="TextSize.INHERIT"
                >Cookies Policy</fl-link
              >.
            </ng-template>
          </fl-text>
        </fl-label>
      </fl-bit>
      <fl-bit
        *ngIf="promotionalAgreement"
        class="Agreement"
        [flMarginBottom]="Margin.LARGE"
      >
        <ng-container
          *ngIf="formGroup.get('receivePromotionalEmail') as control"
        >
          <fl-checkbox
            *ngIf="isFormControl(control)"
            flTrackingLabel="DetailsForm-PromotionalEmailCheckbox"
            [control]="control"
            [id]="'PromotionsAgreement'"
          ></fl-checkbox>
          <fl-label [for]="'PromotionsAgreement'">
            <fl-text
              i18n="Signup details promotional agreement checkbox"
              [textAlign]="TextAlign.LEFT"
              [flMarginBottom]="Margin.XXSMALL"
              [size]="TextSize.XXSMALL"
            >
              I would like to receive promotional email communication<fl-text
                *ngIf="partnerDomain"
                [fontType]="FontType.SPAN"
                [size]="TextSize.INHERIT"
              >
                from {{ partnerDomain }}</fl-text
              >.
            </fl-text>
          </fl-label>
        </ng-container>
      </fl-bit>
      <app-login-signup-errors
        *ngIf="response && response.status === 'error'"
        [response]="response"
        [flMarginBottom]="Margin.SMALL"
        (switchToLogin)="switchToLogin.emit()"
      ></app-login-signup-errors>
      <app-login-signup-button
        i18n="Signup details signup button"
        [busy]="response === null"
        [flMarginBottom]="Margin.LARGE"
        [stepLabel]="'DetailsForm'"
      >
        <ng-container *ngIf="partnerDomain === 'Freelancer'">
          Join {{ partnerDomain }}
        </ng-container>
        <ng-container *ngIf="partnerDomain !== 'Freelancer'">
          Sign Up to {{ partnerDomain }}
        </ng-container>
      </app-login-signup-button>
      <ng-container *ngIf="enableLoginSignupSwitch">
        <fl-hr [flMarginBottom]="Margin.SMALL"></fl-hr>
        <fl-text
          i18n="Signup details login description"
          [textAlign]="TextAlign.CENTER"
          [size]="TextSize.XXSMALL"
          [color]="FontColor.MID"
          [flMarginBottom]="Margin.XSMALL"
        >
          Already have an account<fl-text
            *ngIf="platformName"
            [color]="FontColor.MID"
            [fontType]="FontType.SPAN"
            [size]="TextSize.XXSMALL"
          >
            on
            <fl-text
              [color]="FontColor.INHERIT"
              [fontType]="FontType.SPAN"
              [size]="TextSize.INHERIT"
              [weight]="FontWeight.BOLD"
              >{{ platformName }}</fl-text
            ></fl-text
          >?
          <fl-link
            flTrackingLabel="DetailsForm-LoginLink"
            [size]="TextSize.XXSMALL"
            (click)="switchToLogin.emit()"
          >
            Log in
          </fl-link>
        </fl-text>
      </ng-container>
    </form>
  `,
  styleUrls: ['./details-form.component.scss'],
})
export class DetailsFormComponent implements AfterViewInit {
  BannerAlertType = BannerAlertType;
  ErrorCodeApi = ErrorCodeApi;
  FontColor = FontColor;
  TextSize = TextSize;
  FontType = FontType;
  FontWeight = FontWeight;
  HeadingType = HeadingType;
  InputSize = InputSize;
  InputType = InputType;
  isFormControl = isFormControl;
  LinkUnderline = LinkUnderline;
  LogoSize = LogoSize;
  Margin = Margin;
  TextAlign = TextAlign;
  AppleSignInError = AppleSignInError;
  FacebookSignInError = FacebookSignInError;

  @Input() logoSize = LogoSize.MID;
  @Input() countryOptions: ReadonlyArray<SelectItem>;
  @Input() showSSO = false;
  @Input() showAppleSignin = false;
  @Input() facebookLoginStatusLoaded = false;
  @Input() formGroup: FormGroup;
  @Input() enableLoginSignupSwitch = true;
  @Input() partnerName?: string;
  @Input() partnerDomain?: string;
  @Input() platformName?: string;
  @Input() promotionalAgreement: boolean;
  @Input() response?:
    | ResponseData<unknown, ErrorCodeApi | 'UNKNOWN_ERROR'>
    | ResponseData<unknown, LoginError>;

  @Output() complete = new EventEmitter();
  @Output() appleClick = new EventEmitter();
  @Output() facebookClick = new EventEmitter();
  @Output() switchToLogin = new EventEmitter();

  @ViewChild('focusInput') focusInput: InputComponent;

  constructor(private focus: Focus) {}

  ngAfterViewInit() {
    this.focus.focusElement(this.focusInput.nativeElement);
  }

  onSubmit() {
    if (this.response === null) {
      return;
    }
    dirtyAndValidate(this.formGroup);
    if (this.formGroup.valid) {
      this.complete.emit();
    }
  }
}
