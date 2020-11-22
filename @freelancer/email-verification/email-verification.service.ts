import { Injectable } from '@angular/core';
import { Auth } from '@freelancer/auth';
import {
  BackendErrorResponse,
  BackendSuccessResponse,
} from '@freelancer/datastore';
import {
  UserEmailRequestAjax,
  UserEmailRequestGetResultAjax,
  _transformUserStatus,
} from '@freelancer/datastore/collections';
import { FreelancerHttp } from '@freelancer/freelancer-http';
import { BackendErrorTypes } from 'api-typings/error-distribution';
import { ErrorCodeApi } from 'api-typings/errors/errors';
import { UserApi } from 'api-typings/users/users';
import { switchMap, take } from 'rxjs/operators';
import {
  EmailChangeRequestGetResult,
  EmailChangeRequestUpdateResult,
} from './email-verification.model';
import { transformEmailChangeRequest } from './email-verification.transformers';

interface EmailVerifiedResponse {
  readonly status: 'success';
  readonly isEmailVerified: boolean;
}

type EmailVerificationResponse =
  | EmailVerifiedResponse
  | BackendErrorResponse<
      BackendErrorTypes['user_get_self'] | ErrorCodeApi.NOT_FOUND
    >;

@Injectable({
  providedIn: 'root',
})
export class EmailVerification {
  constructor(private auth: Auth, private freelancerHttp: FreelancerHttp) {}

  // sends a verification email,
  // returns an error response if any error occurred or
  // the user is already verified
  send(): Promise<
    | BackendSuccessResponse
    | BackendErrorResponse<
        | BackendErrorTypes['user_action_email_verify']
        | ErrorCodeApi.USER_ACCOUNT_CLOSED_OR_SUSPENDED
        | 'UNKNOWN_ERROR'
      >
  > {
    return this.auth
      .isLoggedIn()
      .pipe(
        take(1),
        switchMap(loggedIn => {
          if (!loggedIn) {
            throw new Error('No user to send verification email to!');
          }
          return this.freelancerHttp.put<
            | BackendSuccessResponse
            | BackendErrorResponse<
                BackendErrorTypes['user_action_email_verify']
              >
          >(
            'users/0.1/self?action=email_verify',
            null, // api is weird, no put data required
          );
        }),
      )
      .toPromise();
  }

  check(): Promise<EmailVerificationResponse> {
    return this.auth
      .isLoggedIn()
      .pipe(
        take(1),
        switchMap(isloggedIn => {
          if (!isloggedIn) {
            throw new Error(
              'User must be logged in to check email verification',
            );
          }
          return this.freelancerHttp.get<UserApi>('users/0.1/self?status=true');
        }),
      )
      .toPromise()
      .then(response => {
        if (response.status !== 'success') {
          return response;
        }
        if (response.result.status === undefined) {
          return {
            status: 'error',
            errorCode: ErrorCodeApi.NOT_FOUND,
            requestId: response.requestId,
          } as EmailVerificationResponse;
        }
        const status = _transformUserStatus(response.result.status);
        return {
          status: 'success',
          isEmailVerified: status.emailVerified,
        };
      });
  }

  /**
   * Submits a request to change user's email.
   *
   * This involves creating an email change request and
   * sending a verification email to the user.
   */
  changeEmail(
    email: string,
    password?: string,
  ): Promise<EmailChangeRequestUpdateResult> {
    const formData = new FormData();
    formData.append('email', email);

    if (password) {
      formData.append('password', password);
    }

    return this.freelancerHttp
      .post<UserEmailRequestAjax>('user/settings/email.php', formData, {
        isGaf: true,
      })
      .toPromise()
      .then(response => {
        if (response.status !== 'success') {
          return response;
        }

        return {
          status: 'success',
          emailChangeRequest: transformEmailChangeRequest(response.result),
        };
      });
  }

  /**
   * Gets all the pending email change requests of the user.
   */
  getEmailChangeRequest(): Promise<EmailChangeRequestGetResult> {
    return this.freelancerHttp
      .get<UserEmailRequestGetResultAjax>('user/settings/email.php', {
        isGaf: true,
      })
      .pipe(take(1))
      .toPromise()
      .then(response => {
        if (response.status !== 'success') {
          return response;
        }

        const changeRequests = response.result.email_requests.map(request =>
          transformEmailChangeRequest(request),
        );

        return {
          status: 'success',
          emailChangeRequests: changeRequests,
          allowPasswordlessChange: response.result.allow_passwordless_change,
        };
      });
  }
}
