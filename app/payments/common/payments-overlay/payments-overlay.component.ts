import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  OverlayTypes,
  PaymentsEventType,
  PaymentsMessagingService,
  PaymentsOverlay,
  PaymentsResultStatus,
} from '@freelancer/payments-messaging';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { TextSize } from '@freelancer/ui/text';
import { isDefined } from '@freelancer/utils';
import * as Rx from 'rxjs';
import { delay, filter, startWith, tap, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'app-payments-overlay-title',
  template: `
    <fl-heading
      [flHideDesktop]="true"
      [flHideTablet]="true"
      [size]="TextSize.LARGE"
      [headingType]="HeadingType.H3"
      [flMarginBottom]="Margin.XSMALL"
    >
      {{ title }}
    </fl-heading>
    <fl-heading
      [flHideMobile]="true"
      [size]="TextSize.XLARGE"
      [headingType]="HeadingType.H3"
      [flMarginBottom]="Margin.XSMALL"
    >
      {{ title }}
    </fl-heading>
  `,
})
export class PaymentsOverlayTitleComponent {
  Margin = Margin;
  TextSize = TextSize;
  HeadingType = HeadingType;

  @Input() title: string;
}

@Component({
  selector: 'app-payments-overlay-body',
  template: `
    <fl-text [flMarginBottom]="Margin.XSMALL"> {{ body }} </fl-text>
  `,
})
export class PaymentsOverlayBodyComponent {
  Margin = Margin;

  @Input() body: string;
}

// TODO remove the lint disable once the rule is deprecated
// tslint:disable:validate-tracking-legacy
@Component({
  selector: 'app-payments-overlay-button',
  template: `
    <fl-button [color]="ButtonColor.SECONDARY" [size]="ButtonSize.LARGE">
      {{ cta }}
    </fl-button>
  `,
})
export class PaymentsOverlayButtonComponent {
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;

  @Input() cta: string;
}
// tslint:enable:validate-tracking-legacy

@Component({
  selector: 'app-payments-overlay',
  template: `
    <fl-bit>
      <fl-bit class="OverlayContainer" *ngIf="overlay">
        <fl-icon
          *ngIf="overlay.onClose"
          class="CloseButton"
          flTrackingLabel="CloseOverlay"
          [name]="'ui-close'"
          [size]="IconSize.MID"
          (click)="closeOverlay()"
        ></fl-icon>

        <fl-bit class="OverlayCard">
          <fl-picture
            *ngIf="overlay.brand"
            [alt]="overlay.brand.alt"
            [src]="overlay.brand.src"
          ></fl-picture>
          <ng-container [ngSwitch]="overlay.overlayType">
            <ng-container *ngSwitchCase="OverlayTypes.BACKEND_ERROR">
              <app-payments-overlay-title
                i18n-title="Overlay title"
                title="Oops! Something went wrong!"
              ></app-payments-overlay-title>
              <app-payments-overlay-body
                i18n-body="Overlay body"
                body="Please try refreshing the page. Please contact support if the issue persists."
              ></app-payments-overlay-body>
              <app-payments-overlay-button
                flTrackingLabel="OverlayError.Refresh"
                i18n-cta="Overlay button cta"
                cta="Refresh"
                (click)="onAction()"
              ></app-payments-overlay-button>
            </ng-container>

            <ng-container *ngSwitchCase="OverlayTypes.CC_3DS">
              <app-payments-overlay-body
                i18n-body="Overlay body"
                body="Your bank requires additional verifications. You will be shown a new window to complete the transaction."
              ></app-payments-overlay-body>
              <app-payments-overlay-button
                flTrackingLabel="Overlay3DS.ShowWindow"
                i18n-cta="Overlay button cta"
                cta="Show the window"
                (click)="onAction()"
              ></app-payments-overlay-button>
            </ng-container>

            <ng-container *ngSwitchCase="OverlayTypes.CC_CAPTCHA">
              <app-payments-overlay-body
                i18n-body="Overlay body"
                body="Please resolve the security challenge for credit/debit card payments"
              ></app-payments-overlay-body>
              <app-payments-overlay-button
                flTrackingLabel="OverlayCaptcha.ShowWindow"
                i18n-cta="Overlay button cta"
                cta="Show the window"
                (click)="onAction()"
              ></app-payments-overlay-button>
            </ng-container>

            <ng-container *ngSwitchCase="OverlayTypes.DEPOSIT_SUCCESS">
              <app-payments-overlay-title
                i18n-title="Overlay title"
                title="Payment Successful!"
              ></app-payments-overlay-title>
              <app-payments-overlay-body
                i18n-body="Overlay body"
                body="You will be redirected in 5 seconds."
              ></app-payments-overlay-body>
              <app-payments-overlay-button
                flTrackingLabel="OverlaySuccess.Continue"
                i18n-cta="Overlay button cta"
                cta="Continue"
                (click)="onAction()"
              ></app-payments-overlay-button>
            </ng-container>

            <ng-container *ngSwitchCase="OverlayTypes.EXTERNAL_POPUP">
              <app-payments-overlay-body
                i18n-body="Overlay body"
                body="Can't see the secure payment window?"
              ></app-payments-overlay-body>
              <app-payments-overlay-button
                flTrackingLabel="OverlayExternal.ShowWindow"
                i18n-cta="Overlay button cta"
                cta="Show the window"
                (click)="onAction()"
              ></app-payments-overlay-button>
            </ng-container>

            <ng-container *ngSwitchCase="OverlayTypes.VERIFICATION_SUCCESS">
              <app-payments-overlay-title
                i18n-title="Overlay title"
                title="Verification Successful!"
              ></app-payments-overlay-title>
              <app-payments-overlay-body
                i18n-body="Overlay body"
                body="You will be redirected in 5 seconds."
              ></app-payments-overlay-body>
              <app-payments-overlay-button
                flTrackingLabel="OverlayVerification.Continue"
                i18n-cta="Overlay button cta"
                cta="Continue"
                (click)="onAction()"
              ></app-payments-overlay-button>
            </ng-container>
          </ng-container>
        </fl-bit>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./payments-overlay.component.scss'],
})
export class PaymentsOverlayComponent implements OnDestroy, OnInit {
  IconSize = IconSize;
  OverlayTypes = OverlayTypes;

  @Output() overlayOn = new EventEmitter<boolean>();

  private subscriptions: ReadonlyArray<Rx.Subscription> = [];
  overlay?: PaymentsOverlay;

  constructor(
    private paymentsMessaging: PaymentsMessagingService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    const result$ = this.paymentsMessaging
      .getResultStream()
      .pipe(startWith({ paymentsStatus: undefined }));
    const closeEvents$ = this.paymentsMessaging.getEventStream().pipe(
      withLatestFrom(result$),
      filter(
        ([closeEvent, result]) =>
          closeEvent.eventType === PaymentsEventType.CLOSE_OVERLAY &&
          result.paymentsStatus !== PaymentsResultStatus.SUCCESS,
      ),
      tap(() => this.closeOverlay()),
    );
    const overlay$ = this.paymentsMessaging
      .getOverlayStream()
      .pipe(filter(isDefined), delay(0));

    this.subscriptions = [
      closeEvents$.subscribe(),
      overlay$.subscribe(overlay => this.openOverlay(overlay)),
    ];
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private openOverlay(overlay: PaymentsOverlay) {
    this.overlay = overlay;
    this.cdr.detectChanges();
    this.overlayOn.emit(true);
  }

  closeOverlay() {
    if (this.overlay && this.overlay.onClose) {
      this.overlay.onClose();
    }
    this.overlay = undefined;
    this.cdr.detectChanges();
    this.overlayOn.emit(false);
  }

  onAction() {
    if (this.overlay) {
      this.overlay.ctaAction();
    }
  }
}
