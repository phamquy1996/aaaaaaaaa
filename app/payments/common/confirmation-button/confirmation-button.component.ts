import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Currency } from '@freelancer/datastore/collections';
import { PaymentsMessagingService } from '@freelancer/payments-messaging';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { dirtyAndValidate } from '@freelancer/ui/validators';
import * as Rx from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-confirmation-button',
  template: `
    <fl-button
      flTrackingLabel="confirmationButton"
      [display]="'block'"
      [color]="ButtonColor.SECONDARY"
      [size]="ButtonSize.XLARGE"
      [busy]="busy"
      [disabled]="buttonDisabled"
      (click)="click()"
    >
      {{ copy }}
      <ng-container *ngIf="currency && amount">
        {{ amount | flCurrency: currency.code }}
      </ng-container>
    </fl-button>
  `,
  styleUrls: ['./confirmation-button.component.scss'],
})
export class ConfirmationButtonComponent implements OnInit, OnDestroy {
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  @Input() amount?: number;
  @Input() copy: string;
  @Input() currency: Currency;
  @Input() depositFormGroup: FormGroup;
  @Input() buttonDisabled: boolean;
  @Output() confirmation = new EventEmitter<boolean>();

  private subscriptions: ReadonlyArray<Rx.Subscription> = [];
  busy = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private paymentsMessaging: PaymentsMessagingService,
  ) {}

  ngOnInit() {
    const events$ = this.paymentsMessaging.getMessageStream().pipe(
      tap(d => {
        this.busy = false;
        this.cdr.detectChanges();
      }),
    );

    this.subscriptions = [...this.subscriptions, events$.subscribe()];
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  click() {
    dirtyAndValidate(this.depositFormGroup);
    if (this.depositFormGroup.valid) {
      this.busy = true;
      this.confirmation.emit(true);
    }
  }
}
