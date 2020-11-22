import { Injectable } from '@angular/core';
import { Interface } from '@freelancer/types';
import { ErrorTracking } from '../error-tracking.service';

@Injectable()
export class ErrorTrackingTesting implements Interface<ErrorTracking> {
  captureMessage(msg: string, extras?: unknown): void {
    // Do nothing
  }

  captureException(error: Error, extras?: unknown): void {
    // Do nothing
  }
}
