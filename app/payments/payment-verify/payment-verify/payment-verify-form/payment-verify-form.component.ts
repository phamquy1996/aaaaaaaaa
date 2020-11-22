import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Auth } from '@freelancer/auth';
import { Datastore } from '@freelancer/datastore';
import {
  UserDepositMethod,
  UserDepositMethodsCollection,
} from '@freelancer/datastore/collections';
import {
  PaymentsErrorType,
  PaymentsMessagingService,
} from '@freelancer/payments-messaging';
import { toNumber } from '@freelancer/utils';
import { DepositMethodApi } from 'api-typings/payments/payments';
import * as Rx from 'rxjs';
import { map } from 'rxjs/operators';

export enum VerificationFormControls {
  CURRENCY_SELECT = 'currencySelect',
  METHOD_RADIO = 'methodSelectionFormGroup',
  METHOD_SELECT = 'RadioControl', // FIXME: !!! Nasty hack, this value has to be the same as `methodSelectionFormGroup` const
  METHOD_FORM = 'methodsFormGroup', // kill me
}

@Component({
  selector: 'app-payment-verify-form',
  template: `
    <app-payment-verify-card
      [depositMethods$]="depositMethods$"
      [verificationFormGroup]="verificationFormGroup"
    ></app-payment-verify-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentVerifyFormComponent implements OnInit, OnDestroy {
  datastoreErrorSubscription?: Rx.Subscription;
  depositMethods$: Rx.Observable<ReadonlyArray<UserDepositMethod>>;
  verificationFormGroup: FormGroup;

  constructor(
    private auth: Auth,
    private datastore: Datastore,
    private paymentsMessaging: PaymentsMessagingService,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    // FIXME: This whole form group structure is cooked, it needs to reflect the deposit one :(
    this.verificationFormGroup = this.fb.group({});
    const radioSelectControl = this.fb.group({
      [VerificationFormControls.METHOD_SELECT]: DepositMethodApi.FLN_BILLING,
    });
    this.verificationFormGroup.setControl(
      VerificationFormControls.METHOD_RADIO,
      radioSelectControl,
    );
    const methodsFormGroup = this.fb.group({});
    this.verificationFormGroup.setControl(
      VerificationFormControls.METHOD_FORM,
      methodsFormGroup,
    );
    const allDepositMethodsCollection = this.datastore.collection<
      UserDepositMethodsCollection
    >('userDepositMethods', query =>
      query.where(
        'userId',
        '==',
        this.auth.getUserId().pipe(map(id => toNumber(id))),
      ),
    );

    this.datastoreErrorSubscription = allDepositMethodsCollection.status$.subscribe(
      status => {
        if (status.error) {
          this.paymentsMessaging.pushError({
            errorType: PaymentsErrorType.ERROR_DATASTORE,
            errorCode: status.error.errorCode,
            retry: status.error.retry,
          });
        }
      },
    );

    // TODO: this requires API fix to enable filtering
    this.depositMethods$ = allDepositMethodsCollection.valueChanges().pipe(
      map(depositMethods =>
        depositMethods.filter(
          dm =>
            [
              DepositMethodApi.PAYPAL_REFERENCE,
              DepositMethodApi.FLN_BILLING,
            ].includes(dm.id as DepositMethodApi), // :(
        ),
      ),
    );
  }

  ngOnDestroy() {
    if (this.datastoreErrorSubscription) {
      this.datastoreErrorSubscription.unsubscribe();
    }
  }
}
