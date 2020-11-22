import { ResponseData } from '@freelancer/datastore';
import { TotpMethod } from '@freelancer/datastore/collections';
import { UserCreateResultApi } from 'api-typings/users/users';
import {
  AuthResponseAjax,
  AuthSuccessResponseAjax,
  TwoFactorResponseAjax,
} from './login-signup.backend-model';
import { AuthResponse, TwoFactorResponse } from './login-signup.model';

interface PreLoginToken {
  user_id: number;
  '2fa_methods': TotpMethod[];
  // plus some other fields but we don't need them
  /**
   *   "iss": "freelancer.com/auth",
   *   "exp": 1540190368,
   *   "iat": 1540188568,
   *   "type": "pre-login-token",
   *   "device_id": "07YVnaQ8zHFxQUSNR6ub//fXySuH2MOh"
   */
}

export function transformResponseData<T, U, E>(
  responseData: ResponseData<T, E>,
  transform: (obj: T) => U,
): ResponseData<U, E> {
  if (responseData.status === 'error') {
    return responseData;
  }
  return {
    ...responseData,
    result: transform(responseData.result),
  };
}

export function transformAuthResponse(
  response: AuthResponseAjax,
): AuthResponse {
  if ('pre_login_token' in response) {
    return transformTwoFactorResponse(response);
  }
  return response;
}

export function transformTwoFactorResponse(
  response: TwoFactorResponseAjax,
): TwoFactorResponse {
  // decode the pre_login_token to get the method
  let method: TotpMethod | undefined;
  try {
    const twoFATokenDecoded = decodePreLoginToken(response.pre_login_token);
    [method] = twoFATokenDecoded['2fa_methods'];
  } catch (e) {
    console.log(e);
    method = undefined;
  }

  return {
    preLoginToken: response.pre_login_token,
    message: response.message,
    method,
  };
}

export function transformUserCreateResonse(
  response: UserCreateResultApi,
): AuthSuccessResponseAjax {
  return {
    user: response.user.id,
    token: response.auth_hash,
  };
}

/**
 * Returns the decoded JWT token used for 2FA
 */
function decodePreLoginToken(preLoginToken: string): PreLoginToken {
  return JSON.parse(atob(preLoginToken.split('.')[1]));
}
