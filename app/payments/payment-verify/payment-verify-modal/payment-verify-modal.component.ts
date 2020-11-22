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
import * as Rx from 'rxjs';
import { DepositContext, DepositModalItem } from '../../common/types';

@Component({
  template: `
    <app-payment-verify
      class="PaymentVerifyModalContainer"
      flTrackingSection="{{ section }}"
      [depositContext$]="depositContext$"
    ></app-payment-verify>
    <fl-heartbeat-tracking
      name="webAppVerificationModal"
    ></fl-heartbeat-tracking>
  `,
  styleUrls: ['./payment-verify-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentVerifyModalComponent implements OnInit {
  depositContext$: Rx.Observable<DepositContext>;
  section = ApplicationType.VERIFICATION_MODAL;

  @Input() backUrl?: string;
  @Input() banner?: DepositPageVarsBanner;
  @Input() items?: ReadonlyArray<DepositModalItem>;
  @Input() trackingToken?: string;

  constructor(
    private modalRef: ModalRef<PaymentVerifyModalComponent>,
    private paymentsTracking: PaymentsTrackingService,
  ) {}

  ngOnInit() {
    this.paymentsTracking.initiate(this.section);
    this.depositContext$ = Rx.of({
      trackingToken: this.trackingToken,
      banner: this.banner || {},
      items: this.items || [],
      backUrl: this.backUrl,
      applicationType: this.section,
      checkBalance: false,
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
}
