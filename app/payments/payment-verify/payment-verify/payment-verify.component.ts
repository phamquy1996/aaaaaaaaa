import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  OverlayTypes,
  PaymentsErrorType,
  PaymentsEventType,
  PaymentsMessagingService,
  PaymentsResultStatus,
} from '@freelancer/payments-messaging';
import { ApplicationType } from '@freelancer/payments-tracking';
import { SpinnerBackgroundColor, SpinnerSize } from '@freelancer/ui/spinner';
import * as Rx from 'rxjs';
import {
  delay,
  filter,
  map,
  mapTo,
  startWith,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { DepositContext } from '../../common/types';

@Component({
  selector: 'app-payment-verify',
  template: `
    <fl-spinner
      class="VerifyPageSpinner"
      *ngIf="!(initialized$ | async)"
      flTrackingLabel="VerifyPageInitialisationSpinner"
      [overlay]="true"
      [size]="SpinnerSize.LARGE"
      [backgroundColor]="SpinnerBackgroundColor.DARK"
    ></fl-spinner>
    <app-payments-overlay
      (overlayOn)="handleOverlayOn($event)"
    ></app-payments-overlay>
    <fl-bit class="VerifyPageContainer">
      <fl-bit [ngClass]="{ IsHidden: hidePageContent$ | async }">
        <app-payments-banners
          [depositContext$]="depositContext$"
        ></app-payments-banners>
        <fl-grid>
          <fl-col
            [colDesktopSmall]="6"
            [colOrder]="2"
            [colDesktopSmallOrder]="1"
          >
            <app-payment-verify-form> </app-payment-verify-form>
            <app-payments-secure-logo
              class="MobileSecureIcon"
            ></app-payments-secure-logo>
          </fl-col>
          <fl-col
            [colDesktopSmall]="6"
            [colOrder]="1"
            [colDesktopSmallOrder]="2"
          >
            <app-payment-verify-hourly-explainer
              *ngIf="showHourlyExplainer$ | async"
            ></app-payment-verify-hourly-explainer>
            <app-payment-verify-benefits
              *ngIf="(showHourlyExplainer$ | async) === false"
              [expandable]="false"
              [flShowDesktop]="true"
            >
            </app-payment-verify-benefits>
            <app-payment-verify-benefits
              *ngIf="(showHourlyExplainer$ | async) === false"
              [expandable]="true"
              [flHideDesktop]="true"
            >
            </app-payment-verify-benefits>
            <app-payments-secure-logo
              class="DesktopSecureIcon"
            ></app-payments-secure-logo>
          </fl-col>
        </fl-grid>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./payment-verify.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentVerifyComponent implements OnInit, OnDestroy {
  SpinnerSize = SpinnerSize;
  SpinnerBackgroundColor = SpinnerBackgroundColor;

  @Input() depositContext$: Rx.Observable<DepositContext>;

  datastoreErrorsSubscription?: Rx.Subscription;
  hidePageContent$: Rx.Observable<boolean>;
  initialized$: Rx.Observable<boolean>;
  successfulDepositSubscription?: Rx.Subscription;

  showHourlyExplainer$: Rx.Observable<boolean>;

  private overlayOnSubject$ = new Rx.Subject<boolean>();
  overlayOn$ = this.overlayOnSubject$.asObservable();

  constructor(
    private cdr: ChangeDetectorRef,
    private paymentsMessaging: PaymentsMessagingService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.initialized$ = this.paymentsMessaging.getEventStream().pipe(
      filter(
        depositResult =>
          depositResult.eventType === PaymentsEventType.INITIALIZED,
      ),
      mapTo(true),
    );

    this.hidePageContent$ = Rx.merge(
      this.overlayOn$,
      this.initialized$.pipe(map(initialized => !initialized)),
    ).pipe(
      // FIXME: Copy of the behaviour in deposit page
      delay(0),
      tap(m => this.cdr.detectChanges()),
      startWith(true),
    );

    this.datastoreErrorsSubscription = this.paymentsMessaging
      .getErrorStream()
      .subscribe(err => {
        if (err.errorType === PaymentsErrorType.ERROR_DATASTORE) {
          this.paymentsMessaging.pushOverlay({
            ctaAction: () => {
              this.paymentsMessaging.pushEvent({
                eventType: PaymentsEventType.CLOSE_OVERLAY,
              });
              err.retry();
            },
            overlayType: OverlayTypes.BACKEND_ERROR,
          });
        }
      });

    this.showHourlyExplainer$ = this.route.queryParams.pipe(
      map(param => param.ref === 'hourly'),
    );

    const results$ = this.paymentsMessaging.getResultStream();

    const success$ = results$.pipe(
      filter(result => result.paymentsStatus === PaymentsResultStatus.SUCCESS),
      withLatestFrom(this.depositContext$),
      tap(([_, depositContext]) =>
        this.router.navigate(['/verify/success'], {
          queryParams: {
            result: ApplicationType.VERIFICATION_PAGE,
            backUrl: depositContext.backUrl,
          },
        }),
      ),
    );
    this.successfulDepositSubscription = success$.subscribe();
  }

  ngOnDestroy() {
    if (this.datastoreErrorsSubscription) {
      this.datastoreErrorsSubscription.unsubscribe();
    }
    if (this.successfulDepositSubscription) {
      this.successfulDepositSubscription.unsubscribe();
    }
  }

  handleOverlayOn(overlayOn: boolean) {
    this.overlayOnSubject$.next(overlayOn);
  }
}
