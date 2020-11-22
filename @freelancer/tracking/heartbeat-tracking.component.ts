import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { HeartbeatTrackingCancellation, Tracking } from './tracking.service';

@Component({
  selector: `fl-heartbeat-tracking`,
  template: `
    <ng-container></ng-container>
  `,
})
export class HeartbeatTrackingComponent implements OnChanges, OnDestroy {
  @Input() name: string;
  @Input() referenceType?: string;
  @Input() referenceId?: string;

  cancel: HeartbeatTrackingCancellation;

  constructor(private tracking: Tracking) {}

  ngOnChanges() {
    if (this.cancel) {
      this.cancel();
    }

    this.cancel = this.tracking.trackHeartbeat(
      this.name,
      this.referenceType,
      this.referenceId,
    );
  }

  ngOnDestroy() {
    this.cancel();
  }
}
