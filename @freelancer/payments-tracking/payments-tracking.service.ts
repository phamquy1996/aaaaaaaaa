import { Injectable } from '@angular/core';
import { Tracking } from '@freelancer/tracking';
import { ApplicationType } from './payments-tracking.types';

interface TrackingData {
  action?: string;
  label?: string;
  name?: string;
  value?: string;
  reference?: string;
  referenceId?: number;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentsTrackingService {
  private section: ApplicationType;

  constructor(private tracking: Tracking) {}

  initiate(section: ApplicationType) {
    this.section = section;
  }

  pushTrackingData(trackingData: TrackingData) {
    this.handleTrackingEvent(trackingData);
  }

  private handleTrackingEvent(trackingData: TrackingData) {
    this.tracking.track('user_action', {
      section: this.section,
      action: trackingData.action,
      label: trackingData.label,
      extra_params: {
        name: trackingData.name,
        value: trackingData.value,
        reference: trackingData.reference,
        reference_id: trackingData.referenceId,
      },
    });
  }
}
