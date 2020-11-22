import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Pwa } from '@freelancer/pwa';
import {
  AppleSignInErrorResponse,
  AppleSignInResponse,
  ASAuthorizationAppleIDRequest,
  SignInWithApple,
} from '@laurentgoudet/ionic-native-sign-in-with-apple/ngx';
import { AppleSignInError } from './apple-sso.interface';
import { SSOInterface, SSOResponseData, SSOUser } from './sso.interface';

@Injectable({
  providedIn: 'root',
})
export class AppleSSO implements SSOInterface<'apple', AppleSignInResponse> {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private pwa: Pwa,
    private signInWithApple: SignInWithApple,
  ) {}

  isEnabled(): boolean {
    return (
      isPlatformBrowser(this.platformId) &&
      this.pwa.isNative() &&
      this.pwa.getPlatform() === 'ios'
    );
  }

  async getUserDetails(
    response: AppleSignInResponse,
  ): Promise<SSOUser | undefined> {
    return Promise.resolve({
      email: response.email ?? '',
      name: response.fullName?.givenName ?? '',
    });
  }

  async login(): Promise<
    SSOResponseData<'apple', AppleSignInResponse, AppleSignInError>
  > {
    if (!this.isEnabled()) {
      throw new Error(
        `Cannot use apple login on invalid platform ${this.pwa.getPlatform()} `,
      );
    }

    const response = await this.signInWithApple
      .signin({
        requestedScopes: [
          ASAuthorizationAppleIDRequest.ASAuthorizationScopeFullName,
          ASAuthorizationAppleIDRequest.ASAuthorizationScopeEmail,
        ],
      })
      .then(
        (result: AppleSignInResponse) =>
          ({
            provider: 'apple',
            status: 'success',
            result,
          } as const),
      )
      .catch((errorResponse: AppleSignInErrorResponse) => {
        let errorCode: AppleSignInError;
        // the type in the library says "number" but it's actually a string...
        switch ((errorResponse.code as any) ?? undefined) {
          case '1001':
            errorCode = AppleSignInError.CANCELED;
            break;
          case '1002':
            errorCode = AppleSignInError.INVALID;
            break;
          case '1003':
            errorCode = AppleSignInError.NOT_HANDLED;
            break;
          case '1004':
            errorCode = AppleSignInError.FAILED;
            break;
          default:
            errorCode = AppleSignInError.UNKNOWN;
        }

        return {
          provider: 'apple',
          status: 'error',
          errorCode,
        } as const;
      });
    return response;
  }

  loadLoginStatus(): Promise<boolean> {
    if (this.pwa.isNative()) {
      return Promise.resolve(true);
    }

    // TODO: implement JS SDK
    return Promise.resolve(false);
  }
}
