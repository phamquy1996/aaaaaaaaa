import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { DepositPageVarsBanner } from '@freelancer/datastore/collections';
import {
  PaymentsResult,
  PaymentsResultStatus,
} from '@freelancer/payments-messaging';
import {
  ApplicationType,
  PaymentsTrackingService,
} from '@freelancer/payments-tracking';
import { ModalRef } from '@freelancer/ui';
import { IconSize } from '@freelancer/ui/icon';
import * as Rx from 'rxjs';
import { DepositContext, DepositModalItem } from '../../common/types';

@Component({
  template: `
    <app-payments
      class="PaymentsModalContainer"
      flTrackingSection="{{ section }}"
      [depositContext$]="depositContext$"
      (depositResult)="handleDepositResult($event)"
    ></app-payments>
    <fl-heartbeat-tracking name="webAppDepositModal"></fl-heartbeat-tracking>
  `,
  styleUrls: ['./payments-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentsModalComponent implements OnInit {
  IconSize = IconSize;
  section = ApplicationType.DEPOSIT_MODAL;

  depositContext$: Rx.Observable<DepositContext>;

  @Input() banner?: DepositPageVarsBanner;
  @Input() chargeAmount: number;
  @Input() chargeCurrencyId: number;
  @Input() items?: ReadonlyArray<DepositModalItem>;
  @Input() trackingToken?: string;
  @Input() checkBalance = true;

  constructor(
    private modalRef: ModalRef<PaymentsModalComponent>,
    private finopTracking: PaymentsTrackingService,
  ) {}

  ngOnInit() {
    this.finopTracking.initiate(this.section);
    this.depositContext$ = Rx.of({
      chargeAmount: this.chargeAmount,
      chargeCurrencyId: this.chargeCurrencyId,
      trackingToken: this.trackingToken,
      banner: this.banner || {},
      items: this.items || [],
      backUrl: undefined, // we can't really have a back url in modal
      applicationType: this.section,
      checkBalance: this.checkBalance,
      onSuccess: () =>
        this.close({ paymentsStatus: PaymentsResultStatus.SUCCESS }),
    });
  }

  close(
    depositResult: PaymentsResult = {
      paymentsStatus: PaymentsResultStatus.INTERRUPTED,
    },
  ) {
    // we can pass the whole object if we need to
    this.modalRef.close(depositResult.paymentsStatus);
  }

  handleDepositResult(depositResult: PaymentsResult) {
    this.close(depositResult);
  }
}
