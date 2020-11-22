import { Component, Input } from '@angular/core';
import { Currency } from '@freelancer/datastore/collections';
import { ModalRef } from '@freelancer/ui';
import { HireMeUser } from '../hire-me.component';

@Component({
  template: `
    <app-hourly-award-layout>
      <app-hire-me-hourly-confirmation-form
        HourlyAwardLayout="body"
        [hireMeUser]="hireMeUser"
        [currency]="currency"
        [weeklyLimit]="weeklyLimit"
        [hourlyRate]="hourlyRate"
        [maxWeeklyBill]="maxWeeklyBill"
        [paymentVerifyWhiteListed]="paymentVerifyWhiteListed"
        (confirm)="handleUserConfirmation($event)"
      ></app-hire-me-hourly-confirmation-form>
      <app-hourly-hourly-award-sidebar
        HourlyAwardLayout="sidebar"
      ></app-hourly-hourly-award-sidebar>
    </app-hourly-award-layout>
  `,
})
export class HireMeHourlyConfirmationModalComponent {
  @Input() hireMeUser: HireMeUser;
  @Input() currency: Currency;
  @Input() weeklyLimit: number;
  @Input() hourlyRate: number;
  @Input() paymentVerifyWhiteListed: boolean;
  @Input() maxWeeklyBill: number;

  constructor(
    private modalRef: ModalRef<HireMeHourlyConfirmationModalComponent>,
  ) {}

  handleUserConfirmation(hasConfirmed: boolean) {
    this.modalRef.close(hasConfirmed);
  }
}
