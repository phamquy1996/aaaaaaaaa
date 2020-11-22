import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ErrorHandler,
  Inject,
  Injectable,
  Injector,
  Optional,
  PLATFORM_ID,
} from '@angular/core';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';
import { Request, Response } from 'express';
import { ErrorTracking } from './error-tracking.service';
import { TRACKING_CONFIG } from './tracking.config';
import { TrackingConfig } from './tracking.interface';

@Injectable()
export class CustomErrorHandler extends ErrorHandler {
  isBrowser: boolean;

  constructor(
    private injector: Injector,
    @Inject(TRACKING_CONFIG) private config: TrackingConfig,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional()
    @Inject(REQUEST)
    private request: Request,
    @Optional() @Inject(RESPONSE) private response: Response,
  ) {
    super();
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  handleError(value: any): void {
    // FIXME: We cannot directly inject ErrorTracking here as some of its
    // providers use `providedIn: 'root'` which - with Ivy - lead to "Cannot
    // instantiate cyclic dependency! ApplicationRef" errors
    const errorTracking = this.injector.get(ErrorTracking);

    // Backport of https://github.com/angular/angular/pull/31443 to unwrap
    // unhandled Promises
    // FIXME: remove when https://github.com/angular/angular/pull/31443 has
    // landed & we've upgraded.
    let error: any;
    if (
      value.rejection &&
      (value.rejection instanceof Error || value.rejection.message)
    ) {
      error = value.rejection;
    } else {
      error = value;
    }

    // When on the server, abort & return a 500
    if (isPlatformServer(this.platformId)) {
      // FIXME: Angular should throw a proper URLParsingError, until then we
      // have to rely on manual parsing here.
      // See https://github.com/angular/angular/issues/21032
      if (error.message.includes('Cannot match any routes. URL Segment: ')) {
        this.response.status(400);
      } else if (error.status === 429) {
        this.response.status(429);
      } else {
        this.response.status(500);
      }
      this.request._SSR_handleError(error);
      return;
    }
    // When on the browser, report to Sentry
    // We don't log backend errors in Sentry as there are already logged in
    // Kibana
    if (!(error instanceof HttpErrorResponse)) {
      if (error instanceof Error) {
        errorTracking.captureException(error);
      } else {
        errorTracking.captureMessage(error.message || error);
      }
    }
    if (
      error instanceof HttpErrorResponse &&
      error.error &&
      error.error.error &&
      error.error.error.code &&
      error.error.request_id &&
      this.config.kibanaBaseUrl
    ) {
      console.error(
        `${error.error.error.code}: ${this.config.kibanaBaseUrl}/app/kibana#/discover?_g=(time:(from:now-3d))&_a=(columns:!(role,message),query:(language:lucene,query:'${error.error.request_id}%20AND%20NOT%20level:NOTICE%20AND%20NOT%20level:INFO'))`
          .replace(/\(/g, '%28')
          .replace(/\)/g, '%29'),
      );
    }
    super.handleError(error);
  }
}
