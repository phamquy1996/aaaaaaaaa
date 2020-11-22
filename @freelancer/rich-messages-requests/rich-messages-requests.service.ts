import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from '@freelancer/auth';
import {
  RichMessagePayload,
  RichMessageRequest,
} from '@freelancer/datastore/collections';
import { FreelancerHttp } from '@freelancer/freelancer-http';
import { ErrorCodeApi } from 'api-typings/errors/errors';
import * as Rx from 'rxjs';
import { catchError, map, mapTo, switchMap, take } from 'rxjs/operators';

export interface RichMessageSuccessResponse {
  readonly status: 'success';
}

export type RichMessageErrorCode = ErrorCodeApi | 'UNKNOWN_ERROR';

export interface RichMessageErrorResponse {
  readonly status: 'error';
  readonly errorCode: RichMessageErrorCode;
  readonly requestId?: string;
}

export type RichMessageResponse =
  | RichMessageSuccessResponse
  | RichMessageErrorResponse;

@Injectable({
  providedIn: 'root',
})
export class RichMessagesRequests {
  constructor(
    private auth: Auth,
    private http: HttpClient,
    private freelancerHttp: FreelancerHttp,
  ) {}

  request(
    request: RichMessageRequest,
    action: string,
    messageId: number,
  ): Rx.Observable<RichMessageResponse> {
    return this.auth.getAuthorizationHeader().pipe(
      map(authHeaders => {
        const contentType = request.contentType || 'application/json';
        const headers = authHeaders.set('Content-Type', contentType);
        const body = this.serialiseBody(contentType, request.payload);
        return {
          headers,
          body,
        };
      }),
      switchMap(({ headers, body }) =>
        this.http
          .request(action, request.url, {
            observe: 'response',
            body,
            headers,
            params: { webapp: '1', compact: 'true', new_errors: 'true' },
          })
          .pipe(
            switchMap(response =>
              this.savePayload(
                response.status,
                request.payload,
                messageId,
              ).pipe(
                mapTo({ status: 'success' } as RichMessageSuccessResponse),
              ),
            ),
            catchError(error =>
              Rx.of({
                status: 'error',
                errorCode: error.error.error.code,
              } as RichMessageErrorResponse),
            ),
          ),
      ),
      take(1),
    );
  }

  private serialiseBody(
    contentType: string,
    payload: RichMessagePayload,
  ): string {
    if (contentType.includes('urlencoded')) {
      return Object.keys(payload)
        .map(
          k =>
            `${encodeURIComponent(k)}=${encodeURIComponent(`${payload[k]}`)}`,
        )
        .join('&');
    }
    return JSON.stringify(payload);
  }

  // Save payload to our backend for tracking purposes.
  private savePayload(
    statusCode: number,
    payload: RichMessageRequest['payload'],
    messageId: number,
  ): Rx.Observable<undefined> {
    return Rx.combineLatest([
      this.auth.getAuthorizationHeader(),
      this.auth.getUserId(),
    ]).pipe(
      switchMap(([authHeader, userId]) =>
        this.http.post<undefined>(
          `${this.freelancerHttp.getBaseServiceUrl()}/messages/0.1/messages/${messageId}/?action=save_rich_message_payload`,
          {
            [userId]: {
              status_code: statusCode,
              payload,
            },
          },
          {
            headers: authHeader,
            params: { webapp: '1', compact: 'true', new_errors: 'true' },
          },
        ),
      ),
      mapTo(undefined),
    );
  }
}
