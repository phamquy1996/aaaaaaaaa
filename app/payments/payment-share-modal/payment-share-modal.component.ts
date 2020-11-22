import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Auth } from '@freelancer/auth';
import { Datastore, DatastoreCollection } from '@freelancer/datastore';
import {
  BillingAgreement,
  BillingAgreementsCollection,
  CurrenciesIncludingExternalCollection,
  Currency,
  PaymentShareTeam,
  PaymentShareTeamsCollection,
} from '@freelancer/datastore/collections';
import { PaymentsUtils } from '@freelancer/payments-utils';
import { ModalRef } from '@freelancer/ui';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { PictureImage } from '@freelancer/ui/picture';
import { FontWeight, TextSize } from '@freelancer/ui/text';
import { ToggleSize } from '@freelancer/ui/toggle';
import {
  dirtyAndValidate,
  maxLength,
  required,
} from '@freelancer/ui/validators';
import { isFormControl, toNumber } from '@freelancer/utils';
import { DepositMethodApi } from 'api-typings/payments/payments';
import {
  PaymentShareEntityTypeApi,
  PaymentShareSpendingLimitDurationApi,
  PaymentShareTeamStatusApi,
} from 'api-typings/users/users';
import * as Rx from 'rxjs';
import { map, take } from 'rxjs/operators';

export enum FormField {
  IS_TEAM_PAYMENT_ENABLED = 'isTeamPaymentEnabled',
  PAYMENT_METHOD_NAME = 'paymentMethodName',
  IS_SPENDING_LIMIT_ACTIVE = 'isSpendingLimitActive',
  SPENDING_LIMIT_DURATION = 'spendingLimitDuration',
  MAXIMUM_SPEND_LIMIT = 'maximumSpendLimit',
}

export enum SpendLimitStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

enum ModalResult {
  SETUP = 'setup',
  UPDATE = 'update',
}

@Component({
  template: `
    <fl-bit *ngIf="(isLoading$ | async) === false; else loading">
      <fl-banner-alert
        *ngIf="showError$ | async"
        i18n="Payment share modal error text"
        [type]="BannerAlertType.ERROR"
        [flMarginBottom]="Margin.SMALL"
        (close)="onErrorBannerClose()"
      >
        Something went wrong. Please try again or contact support.
      </fl-banner-alert>
      <fl-bit [flMarginBottom]="Margin.MID">
        <fl-heading
          *ngIf="!isTeamExists"
          i18n="Set up Team Payment Setting Modal Header"
          [flMarginBottom]="Margin.XXXSMALL"
          [headingType]="HeadingType.H2"
          [size]="TextSize.MID"
          >Set up Team Payment
        </fl-heading>
        <fl-heading
          *ngIf="isTeamExists"
          i18n="Team Payment Optional Modal Header"
          [flMarginBottom]="Margin.XXXSMALL"
          [headingType]="HeadingType.H2"
          [size]="TextSize.MID"
          >Team Payment Options
        </fl-heading>
        <fl-text i18n="Team Payment Setting Modal Description">
          Setting up Team Payment allows team members you add to make payments
          using your payment method.
        </fl-text>
      </fl-bit>
      <fl-grid>
        <fl-col [col]="12" [colTablet]="4">
          <app-payment-share-modal-credit-card
            *ngIf="billingAgreement$ | async as billingAgreement"
            [billingAgreement]="billingAgreement"
            [billingAgreementCurrency]="currency$ | async"
            [logo]="logo$ | async"
            [flMarginRight]="Margin.MID"
          ></app-payment-share-modal-credit-card>
        </fl-col>

        <fl-col [col]="12" [colTablet]="4">
          <fl-bit
            *ngIf="formGroup.get(FormField.IS_TEAM_PAYMENT_ENABLED) as control"
            class="TeamPaymentToggle"
          >
            <fl-toggle
              *ngIf="isFormControl(control)"
              flTrackingLabel="TeamPaymentToggle"
              [control]="control"
              [size]="ToggleSize.MID"
            >
            </fl-toggle>
            <fl-bit>
              <fl-text
                *ngIf="control.value"
                i18n="Team Payment Enabled"
                [weight]="FontWeight.BOLD"
              >
                Team payment enabled
              </fl-text>
              <fl-text
                *ngIf="!control.value"
                i18n="Team Payment Disabled"
                [weight]="FontWeight.BOLD"
              >
                Team payment disabled
              </fl-text>
            </fl-bit>
          </fl-bit>
        </fl-col>
      </fl-grid>
      <fl-bit [flMarginBottom]="Margin.MID">
        <app-payment-share-modal-general-setting
          [formGroup]="formGroup"
          [billingAgreementCurrency]="currency$ | async"
        >
        </app-payment-share-modal-general-setting>
      </fl-bit>
      <fl-bit>
        <!-- MembersSettings Component-->
      </fl-bit>
      <fl-bit>
        <!-- MembersInviting Component-->
      </fl-bit>
      <fl-bit class="ButtonContainer">
        <fl-button
          *ngIf="formGroup.get(FormField.IS_TEAM_PAYMENT_ENABLED)?.value"
          flTrackingLabel="ResetFieldsButton"
          i18n="Team Payment Setting Modal Reset Fields Button"
          [color]="ButtonColor.TRANSPARENT_DARK"
          [size]="ButtonSize.SMALL"
          (click)="handleResetFields()"
        >
          Reset Fields
        </fl-button>
        <fl-bit class="ButtonContainer-right">
          <fl-button
            flTrackingLabel="CancelButton"
            i18n="Team Payment Setting Modal Cancel Button"
            [color]="ButtonColor.TRANSPARENT_DARK"
            [flMarginRight]="Margin.XSMALL"
            [size]="ButtonSize.SMALL"
            (click)="handleCancel()"
          >
            Cancel
          </fl-button>
          <fl-button
            flTrackingLabel="SaveButton"
            i18n="Team Payment Setting Modal Save Button"
            [color]="ButtonColor.SECONDARY"
            [size]="ButtonSize.SMALL"
            [busy]="isSaving$ | async"
            (click)="handleSave()"
          >
            Save
          </fl-button>
        </fl-bit>
      </fl-bit>
    </fl-bit>
    <ng-template #loading>
      <fl-spinner
        flTrackingLabel="PaymentShareModalSpinner"
        [overlay]="true"
      ></fl-spinner>
    </ng-template>
  `,
  styleUrls: ['./payment-share-modal.component.scss'],
})
export class PaymentShareModalComponent implements OnInit, OnDestroy {
  BannerAlertType = BannerAlertType;
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  FontWeight = FontWeight;
  HeadingType = HeadingType;
  isFormControl = isFormControl;
  Margin = Margin;
  TextSize = TextSize;
  ToggleSize = ToggleSize;
  FormField = FormField;

  @Input() billingAgreementId: number;
  // Determine whether the billing agreement has a payment share team
  @Input() isTeamExists: boolean;

  billingAgreement$: Rx.Observable<BillingAgreement>;
  currency$: Rx.Observable<Currency | undefined>;
  logo$: Rx.Observable<PictureImage | undefined>;
  showResetFieldButton$: Rx.Observable<boolean>;
  paymentShareTeam$: Rx.Observable<PaymentShareTeam | undefined>;
  paymentShareTeamsCollection: DatastoreCollection<PaymentShareTeamsCollection>;
  userId$: Rx.Observable<string>;

  private showErrorSubject$ = new Rx.BehaviorSubject<boolean>(false);
  showError$ = this.showErrorSubject$.asObservable();

  private isLoadingSubject$ = new Rx.BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject$.asObservable();

  private isSavingSubject$ = new Rx.BehaviorSubject<boolean>(false);
  isSaving$ = this.isSavingSubject$.asObservable();

  subscriptions = new Rx.Subscription();

  formGroup = this.fb.group({
    [FormField.IS_TEAM_PAYMENT_ENABLED]: [false],
    [FormField.PAYMENT_METHOD_NAME]: [
      { value: '', disabled: true },
      [
        required($localize`Please enter the payment method name`),
        maxLength(32, $localize`Please enter at most 32 characters.`),
      ],
    ],
    [FormField.IS_SPENDING_LIMIT_ACTIVE]: [
      {
        value: SpendLimitStatus.INACTIVE,
        disabled: true,
      },
    ],
    [FormField.SPENDING_LIMIT_DURATION]: [
      { value: PaymentShareSpendingLimitDurationApi.PER_MONTH, disabled: true },
    ],
    [FormField.MAXIMUM_SPEND_LIMIT]: {
      value: null,
      disabled: true,
    },
  });

  constructor(
    private auth: Auth,
    private fb: FormBuilder,
    private datastore: Datastore,
    private paymentsUtils: PaymentsUtils,
    private modalRef: ModalRef<PaymentShareModalComponent>,
  ) {}

  ngOnInit() {
    // If there is an existing team set isLoading to true
    this.isLoadingSubject$.next(this.isTeamExists);

    this.userId$ = this.auth.getUserId();
    this.billingAgreement$ = this.datastore
      .document<BillingAgreementsCollection>(
        'billingAgreements',
        this.billingAgreementId,
      )
      .valueChanges();

    const currencies$ = this.datastore
      .collection<CurrenciesIncludingExternalCollection>(
        'currenciesIncludingExternal',
      )
      .valueChanges();

    this.currency$ = Rx.combineLatest([
      this.billingAgreement$,
      currencies$,
    ]).pipe(
      map(([billingAgreement, currencies]) =>
        currencies.find(c => c.id === billingAgreement.currencyId),
      ),
    );

    this.paymentShareTeamsCollection = this.datastore.collection<
      PaymentShareTeamsCollection
    >('paymentShareTeams', query =>
      query.where('billingAgreementId', '==', this.billingAgreementId),
    );

    this.paymentShareTeam$ = this.paymentShareTeamsCollection
      .valueChanges()
      .pipe(
        map(paymentTeams =>
          paymentTeams.length > 0 ? paymentTeams[0] : undefined,
        ),
      );

    this.logo$ = this.billingAgreement$.pipe(
      map(billingAgreement => {
        switch (billingAgreement.depositMethod) {
          case DepositMethodApi.PAYPAL_REFERENCE:
            return {
              src: this.paymentsUtils.getMethodLogoPath(
                DepositMethodApi.PAYPAL,
              ),
              alt: 'Paypal logo',
            };

          case DepositMethodApi.FLN_BILLING:
            return billingAgreement.creditCard &&
              billingAgreement.creditCard.cardType
              ? {
                  src: this.paymentsUtils.getMethodLogoPath(
                    billingAgreement.creditCard.cardType,
                  ),
                  alt: `${billingAgreement.creditCard.cardType ||
                    'credit card'} logo`,
                }
              : {
                  src: this.paymentsUtils.getMethodLogoPath(
                    billingAgreement.depositMethod,
                  ),
                  alt: 'credit card logo',
                };
          default:
            // Use FLN_BILLING Image as default
            return {
              src: this.paymentsUtils.getMethodLogoPath(
                DepositMethodApi.FLN_BILLING,
              ),
              alt: 'Payment Method logo',
            };
        }
      }),
    );

    this.subscriptions.add(
      this.formGroup.controls[
        FormField.IS_TEAM_PAYMENT_ENABLED
      ].valueChanges.subscribe(isTeamPaymentEnabled => {
        if (!isTeamPaymentEnabled) {
          this.formGroup.controls[FormField.PAYMENT_METHOD_NAME].disable();
          this.formGroup.controls[FormField.IS_SPENDING_LIMIT_ACTIVE].disable();
          this.formGroup.controls[FormField.SPENDING_LIMIT_DURATION].disable();
          this.formGroup.controls[FormField.MAXIMUM_SPEND_LIMIT].disable();
        } else {
          this.formGroup.controls[FormField.PAYMENT_METHOD_NAME].enable();
          this.formGroup.controls[FormField.IS_SPENDING_LIMIT_ACTIVE].enable();
          this.formGroup.controls[FormField.SPENDING_LIMIT_DURATION].enable();
          this.formGroup.controls[FormField.MAXIMUM_SPEND_LIMIT].enable();
        }
      }),
    );

    this.subscriptions.add(
      this.formGroup.controls[
        FormField.IS_SPENDING_LIMIT_ACTIVE
      ].valueChanges.subscribe(isSpendingLimitActive => {
        this.formGroup.controls[FormField.MAXIMUM_SPEND_LIMIT].setValidators(
          isSpendingLimitActive === SpendLimitStatus.ACTIVE
            ? [required(`Please enter a spend limit.`)]
            : null,
        );
        this.formGroup.controls[
          FormField.MAXIMUM_SPEND_LIMIT
        ].updateValueAndValidity();
      }),
    );

    this.subscriptions.add(
      this.paymentShareTeam$.subscribe(paymentShareTeam => {
        if (paymentShareTeam) {
          this.setFormGroupValueFromPaymentTeam(paymentShareTeam);
          // Set isLoading to false after update the form group value
          this.isLoadingSubject$.next(false);
        }
      }),
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  handleResetFields() {
    this.paymentShareTeam$
      .pipe(take(1))
      .toPromise()
      .then(paymentShareTeam => {
        if (paymentShareTeam) {
          // Reset the form to the original team value
          this.setFormGroupValueFromPaymentTeam(paymentShareTeam);
        } else {
          // Reset the form to default value
          this.formGroup.patchValue(
            {
              [FormField.PAYMENT_METHOD_NAME]: '',
              [FormField.IS_SPENDING_LIMIT_ACTIVE]: SpendLimitStatus.INACTIVE,
              [FormField.SPENDING_LIMIT_DURATION]:
                PaymentShareSpendingLimitDurationApi.PER_MONTH,
              [FormField.MAXIMUM_SPEND_LIMIT]: FormField.MAXIMUM_SPEND_LIMIT,
            },
            {
              emitEvent: true,
            },
          );
        }
        this.formGroup.markAsPristine();
        this.formGroup.markAsUntouched();
      });
  }

  handleCancel() {
    this.modalRef.close();
  }

  handleSave() {
    dirtyAndValidate(this.formGroup);
    if (!this.formGroup.valid) {
      return;
    }

    if (this.isTeamExists) {
      this.updatePaymentShareTeam();
    } else {
      this.createPaymentShareTeam();
    }
  }

  createPaymentShareTeam() {
    const form = this.formGroup.value;
    if (!form[FormField.IS_TEAM_PAYMENT_ENABLED]) {
      // Close the modal if team payment is disabled
      this.modalRef.close();
      return;
    }
    this.isSavingSubject$.next(true);

    Rx.combineLatest([this.billingAgreement$, this.userId$])
      .pipe(take(1))
      .toPromise()
      .then(([billingAgreement, userId]) =>
        this.datastore.createDocument<PaymentShareTeamsCollection>(
          'paymentShareTeams',
          {
            ownerEntityId: toNumber(userId),
            ownerEntityType: PaymentShareEntityTypeApi.USER,
            paymentShareTeamName: form[FormField.PAYMENT_METHOD_NAME],
            status: form[FormField.IS_TEAM_PAYMENT_ENABLED]
              ? PaymentShareTeamStatusApi.ENABLED
              : PaymentShareTeamStatusApi.DISABLED,
            memberSpendingLimitDuration:
              form[FormField.SPENDING_LIMIT_DURATION],
            memberSpendingLimitAmount:
              form[FormField.IS_SPENDING_LIMIT_ACTIVE] ===
              SpendLimitStatus.ACTIVE
                ? toNumber(form[FormField.MAXIMUM_SPEND_LIMIT])
                : 0,
            isSpendingLimitActive:
              form[FormField.IS_SPENDING_LIMIT_ACTIVE] ===
              SpendLimitStatus.ACTIVE,
            billingAgreementId: this.billingAgreementId,
            depositMethod: billingAgreement.depositMethod,
            isTeamOwner: true,
          },
        ),
      )
      .then(response => {
        this.isSavingSubject$.next(false);
        if (response.status !== 'success') {
          this.showErrorSubject$.next(true);
          return;
        }
        this.modalRef.close(ModalResult.SETUP);
      });
  }

  updatePaymentShareTeam() {
    const form = this.formGroup.value;
    this.isSavingSubject$.next(true);

    Rx.combineLatest([
      this.billingAgreement$,
      this.userId$,
      this.paymentShareTeam$,
    ])
      .pipe(take(1))
      .toPromise()
      .then(([billingAgreement, userId, paymentShareTeam]) => {
        if (!paymentShareTeam) {
          return undefined;
        }
        return this.paymentShareTeamsCollection.update(paymentShareTeam.id, {
          id: paymentShareTeam.id,
          ownerEntityId: toNumber(userId),
          ownerEntityType: PaymentShareEntityTypeApi.USER,
          paymentShareTeamName: form[FormField.PAYMENT_METHOD_NAME],
          status: form[FormField.IS_TEAM_PAYMENT_ENABLED]
            ? PaymentShareTeamStatusApi.ENABLED
            : PaymentShareTeamStatusApi.DISABLED,
          memberSpendingLimitDuration: form[FormField.SPENDING_LIMIT_DURATION],
          memberSpendingLimitAmount:
            form[FormField.IS_SPENDING_LIMIT_ACTIVE] === SpendLimitStatus.ACTIVE
              ? toNumber(form[FormField.MAXIMUM_SPEND_LIMIT])
              : 0,
          isSpendingLimitActive:
            form[FormField.IS_SPENDING_LIMIT_ACTIVE] ===
            SpendLimitStatus.ACTIVE,
          billingAgreementId: this.billingAgreementId,
          depositMethod: billingAgreement.depositMethod,
          isTeamOwner: true,
        });
      })
      .then(response => {
        this.isSavingSubject$.next(false);
        if (!response || response.status !== 'success') {
          this.showErrorSubject$.next(true);
          return;
        }
        this.modalRef.close(ModalResult.UPDATE);
      });
  }

  setFormGroupValueFromPaymentTeam(team: PaymentShareTeam) {
    this.formGroup.patchValue(
      {
        [FormField.IS_TEAM_PAYMENT_ENABLED]:
          team.status === PaymentShareTeamStatusApi.ENABLED,
        [FormField.PAYMENT_METHOD_NAME]: team.paymentShareTeamName,
        [FormField.IS_SPENDING_LIMIT_ACTIVE]: team.isSpendingLimitActive
          ? SpendLimitStatus.ACTIVE
          : SpendLimitStatus.INACTIVE,
        [FormField.SPENDING_LIMIT_DURATION]: team.memberSpendingLimitDuration,
        [FormField.MAXIMUM_SPEND_LIMIT]: team.memberSpendingLimitAmount,
      },
      {
        emitEvent: true,
      },
    );
  }

  onErrorBannerClose() {
    this.showErrorSubject$.next(false);
  }
}
