import { Component, Input, OnInit } from '@angular/core';
import { Auth } from '@freelancer/auth';
import { BackendPushErrorResponse } from '@freelancer/datastore';
import {
  CartsCollection,
  UserFees,
  UsersSelf,
  UserStatus,
} from '@freelancer/datastore/collections';
import { PaymentsCart } from '@freelancer/payments-cart';
import { ContextTypeApi, DestinationApi } from 'api-typings/payments/payments';
import { FreelancerVerifiedUserStatusApi } from 'api-typings/users/users';
import * as Rx from 'rxjs';
import { map, take } from 'rxjs/operators';

export enum FreelancerVerifiedModalState {
  ACCEPTED = 'accepted',
  PENDING = 'pending',
  REJECTED = 'rejected',
  NOT_JOINED = 'not_joined',
}

@Component({
  template: `
    <fl-bit flTrackingSection="FreelancerVerifiedLandingPageModal">
      <ng-container
        *ngIf="
          freelancerVerifiedModalState$ | async as freelancerVerifiedModalState;
          else loading
        "
      >
        <ng-container [ngSwitch]="freelancerVerifiedModalState">
          <app-freelancer-verified-landing-status-modal-accepted
            *ngSwitchCase="FreelancerVerifiedModalState.ACCEPTED"
          ></app-freelancer-verified-landing-status-modal-accepted>
          <app-freelancer-verified-landing-status-modal-pending
            *ngSwitchCase="FreelancerVerifiedModalState.PENDING"
            [requirementStatuses$]="requirementStatuses$"
          ></app-freelancer-verified-landing-status-modal-pending>
          <app-freelancer-verified-landing-status-modal-rejected
            *ngSwitchCase="FreelancerVerifiedModalState.REJECTED"
          ></app-freelancer-verified-landing-status-modal-rejected>
          <app-freelancer-verified-landing-status-modal-not-joined
            *ngSwitchCase="FreelancerVerifiedModalState.NOT_JOINED"
            [cartError$]="cartError$"
            [requirementStatuses$]="requirementStatuses$"
            (verifiedCartClicked)="handleVerifiedCart()"
          ></app-freelancer-verified-landing-status-modal-not-joined>
        </ng-container>
      </ng-container>

      <ng-template #loading>
        <fl-spinner
          class="LoadingSpinner"
          flTrackingLabel="FreelancerVerifiedStatusSpinner"
        ></fl-spinner>
      </ng-template>
    </fl-bit>
  `,
  styleUrls: ['./freelancer-verified-landing-status-modal.component.scss'],
})
export class FreelancerVerifiedLandingStatusModalComponent implements OnInit {
  FreelancerVerifiedModalState = FreelancerVerifiedModalState;

  private cartErrorSubject$ = new Rx.Subject<
    BackendPushErrorResponse<CartsCollection>
  >();
  cartError$ = this.cartErrorSubject$.asObservable();

  freelancerVerifiedModalState$: Rx.Observable<FreelancerVerifiedModalState>;
  requirementStatuses$: Rx.Observable<UserStatus>;

  // T166392 - Force PENDING view when redirected from cart to ensure it doesn't flicker when the collection updates
  @Input() redirectedFromCart = false;
  @Input() userFees$: Rx.Observable<UserFees>;
  @Input() usersSelf$: Rx.Observable<UsersSelf>;

  constructor(private auth: Auth, private cart: PaymentsCart) {}

  ngOnInit(): void {
    this.freelancerVerifiedModalState$ = this.usersSelf$.pipe(
      map(user => {
        switch (user.freelancerVerifiedStatus) {
          case FreelancerVerifiedUserStatusApi.ACCEPTED:
            return FreelancerVerifiedModalState.ACCEPTED;
          case FreelancerVerifiedUserStatusApi.PENDING:
            return FreelancerVerifiedModalState.PENDING;
          case FreelancerVerifiedUserStatusApi.REJECTED:
          case FreelancerVerifiedUserStatusApi.REMOVED:
            return FreelancerVerifiedModalState.REJECTED;
          default:
            // freelancerVerifiedStatus may not be updated to PENDING yet after
            // returning from cart so force the modal state
            if (this.redirectedFromCart) {
              return FreelancerVerifiedModalState.PENDING;
            }
            return FreelancerVerifiedModalState.NOT_JOINED;
        }
      }),
    );

    this.requirementStatuses$ = this.usersSelf$.pipe(map(user => user.status));
  }

  handleVerifiedCart() {
    Rx.combineLatest([this.auth.getUserId(), this.userFees$])
      .pipe(take(1))
      .toPromise()
      .then(([userId, userFees]) => {
        this.cart
          .handle(
            'Freelancer Verified application fee',
            {
              destination: DestinationApi.FREELANCER_VERIFIED_LANDING_PAGE,
              payload: '',
            },
            [
              {
                amount: userFees.freelancerVerifiedPrice.with_tax,
                contextId: userId,
                contextType: ContextTypeApi.FREELANCER_VERIFIED,
                currencyId: userFees.currency.id,
                description: 'Freelancer Verified application fee',
                useBonus: true,
              },
            ],
          )
          .then(response => {
            if (response.status === 'error') {
              this.cartErrorSubject$.next(response);
            }
          });
      });
  }
}
