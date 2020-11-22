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
import {
  Datastore,
  DatastoreCollection,
  ResponseData,
} from '@freelancer/datastore';
import {
  RecommendedUsername,
  RecommendedUsernamesCollection,
} from '@freelancer/datastore/collections';
import { LoginSignupService } from '@freelancer/login-signup';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
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
import * as Rx from 'rxjs';

@Component({
  selector: 'app-username-select-form',
  template: `
    <app-form-logo
      [showBackButton]="true"
      [size]="logoSize"
      [backTrackingLabel]="'UsernameSelectForm-Back'"
      [flMarginBottom]="Margin.MID"
      (back)="back.emit()"
    ></app-form-logo>
    <form class="Form" [formGroup]="formGroup" (ngSubmit)="onSubmit()">
      <fl-heading
        i18n="Signup username heading"
        [headingType]="HeadingType.H1"
        [size]="TextSize.MID"
        [flMarginBottom]="Margin.MID"
      >
        Choose a username
      </fl-heading>
      <fl-text
        i18n="Signup username description"
        [flMarginBottom]="Margin.MID"
        [textAlign]="TextAlign.LEFT"
      >
        Please note that a username cannot be changed once chosen.
      </fl-text>
      <ng-container *ngIf="formGroup.get('username') as control">
        <fl-input
          *ngIf="isFormControl(control)"
          flTrackingLabel="UsernameSelectForm-UsernameSelectInput"
          placeholder="Username"
          i18n-placeholder="Signup username input placeholder"
          [flMarginBottom]="Margin.XSMALL"
          [control]="control"
          [disabled]="response === null"
          [size]="InputSize.LARGE"
          #focusInput
        ></fl-input>
      </ng-container>
      <fl-text
        *ngIf="recommendedUsernames$ | async as suggestions"
        i18n="Signup username suggestions"
        [textAlign]="TextAlign.LEFT"
        [flMarginBottom]="Margin.LARGE"
      >
        Suggestions:
        <fl-text
          *ngFor="let suggestion of suggestions; index as i"
          flTrackingLabel="UsernameSelectForm-UsernameSuggestion"
          [fontType]="FontType.SPAN"
        >
          {{ i > 0 ? '/' : '' }}
          <fl-link
            flTrackingLabel="UsernameSelectForm-UsernameSuggestionLink"
            [flMarginRight]="Margin.XXXSMALL"
            (click)="formGroup.patchValue({ username: suggestion.username })"
          >
            {{ suggestion.username }}
          </fl-link>
        </fl-text>
      </fl-text>
      <ng-container *ngIf="response">
        <fl-banner-alert
          *ngIf="response.status === 'error'"
          [type]="BannerAlertType.ERROR"
          [ngSwitch]="response.errorCode"
          [flMarginBottom]="Margin.SMALL"
        >
          <ng-container
            *ngSwitchCase="ErrorCodeApi.USERNAME_ALREADY_IN_USE"
            i18n="Username already is already registered message"
          >
            This username is already registered. Please choose another one.
          </ng-container>
          <ng-container
            *ngSwitchCase="ErrorCodeApi.EMAIL_ALREADY_IN_USE"
            i18n="Email address already registered error message."
          >
            This email address is already registered. Please choose another one.
          </ng-container>
          <ng-container
            *ngSwitchCase="ErrorCodeApi.TOO_MANY_REQUESTS"
            i18n="Too many requests error message."
          >
            You are performing too many requests. Please try again later.
          </ng-container>
          <ng-container
            *ngSwitchDefault
            i18n="
               Unknown error encountered. Try again or contact support message
            "
          >
            Something went wrong while selecting your username. Please try again
            or contact
            <fl-link
              flTrackingLabel="UsernameSelectForm-UnknownErrorContactSupportLink"
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
        i18n="Signup username next button"
        [busy]="response === null"
        [stepLabel]="'UsernameSelectForm'"
      >
        Next
      </app-login-signup-button>
    </form>
  `,
  styleUrls: ['./username-select-form.component.scss'],
})
export class UsernameSelectFormComponent implements AfterViewInit, OnInit {
  BannerAlertType = BannerAlertType;
  ErrorCodeApi = ErrorCodeApi;
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

  recommendedUsernamesCollection: DatastoreCollection<
    RecommendedUsernamesCollection
  >;
  recommendedUsernames$: Rx.Observable<ReadonlyArray<RecommendedUsername>>;
  usernameCheckPromise?: Promise<boolean>;

  @Input() logoSize = LogoSize.MID;
  @Input() email: string;
  @Input() formGroup: FormGroup;
  @Input() response?: ResponseData<unknown, ErrorCodeApi | 'UNKNOWN_ERROR'>;
  @Output() back = new EventEmitter();
  @Output() complete = new EventEmitter();

  @ViewChild('focusInput') focusInput: InputComponent;

  constructor(
    private datastore: Datastore,
    private loginSignupService: LoginSignupService,
    private focus: Focus,
  ) {}

  ngAfterViewInit() {
    this.focus.focusElement(this.focusInput.nativeElement);
  }

  ngOnInit() {
    if (this.email) {
      this.recommendedUsernamesCollection = this.datastore.collection<
        RecommendedUsernamesCollection
      >('recommendedUsernames', query =>
        query.where('email', '==', this.email),
      );

      this.recommendedUsernames$ = this.recommendedUsernamesCollection.valueChanges();
    }
  }

  onSubmit() {
    if (this.response === null) {
      return;
    }

    // don't `dirtyAndValidate` if it's already invalid
    // so it won't clear the manual USERNAME_ALREADY_IN_USE error.
    if (this.formGroup.valid) {
      dirtyAndValidate(this.formGroup);
    }
    if (this.formGroup.valid) {
      const { username } = this.formGroup.controls;
      // Check whether the username is already registered with another account.
      this.loginSignupService
        .checkUserDetails({
          username: username.value,
        })
        .then(response => {
          if (response.status === 'error') {
            username.setErrors({
              USERNAME_ALREADY_IN_USE:
                'This username is already registered. Please choose another one.',
            });
          } else {
            // Proceed to the next step if the username has not been registered.
            this.complete.emit();
          }
        });
    }
  }
}
