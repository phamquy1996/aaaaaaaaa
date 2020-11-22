import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  template: `
    <fl-bit class="LoadingModal">
      <fl-spinner
        flTrackingLabel="TrialSubscriptionRequestSpinner"
        [overlay]="true"
      ></fl-spinner>
    </fl-bit>
  `,
  styleUrls: ['./loading-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingModalComponent {}
