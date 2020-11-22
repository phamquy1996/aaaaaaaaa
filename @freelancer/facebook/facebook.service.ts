import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
import { SSOInterface, SSOResponseData, SSOUser } from '@freelancer/auth';
import { ResponseData } from '@freelancer/datastore';
import { Pwa } from '@freelancer/pwa';
import { isDefined } from '@freelancer/utils';
import { Facebook as AppNativeFacebook } from '@laurentgoudet/ionic-native-facebook/ngx';
import { FACEBOOK_CONFIG } from './facebook.config';
import {
  FacebookAuthResponse,
  FacebookConfig,
  FacebookLoginResponse,
  FacebookSignInError,
} from './facebook.interface';

@Injectable({
  providedIn: 'root',
})
export class Facebook
  implements SSOInterface<'facebook', FacebookAuthResponse> {
  private readonly requiredPermissions = ['email', 'public_profile'];

  /**
   * An existing successful login state which we track
   * because the Facebook SDK complains if we call login multiple times
   */
  successfulLoginState: ResponseData<
    FacebookAuthResponse,
    FacebookSignInError
  > & {
    provider: 'facebook';
  };

  constructor(
    @Inject(FACEBOOK_CONFIG) private config: FacebookConfig,
    @Inject(PLATFORM_ID) private platformId: Object,
    private appNativeFacebook: AppNativeFacebook,
    private ngZone: NgZone,
    private pwa: Pwa,
  ) {}

  isEnabled(): boolean {
    return isPlatformBrowser(this.platformId) && isDefined(this.config.appId);
  }

  get appId() {
    return this.config.appId;
  }

  async getUserDetails(
    userAuthResponse: FacebookAuthResponse,
  ): Promise<SSOUser | undefined> {
    if (!this.isEnabled()) {
      return undefined;
    }

    const userPromise = this.callAPI(
      `/${userAuthResponse.userID}?fields=first_name,email`,
    );
    const picPromise = this.callAPI(
      `/${userAuthResponse.userID}/picture?redirect=false`,
    );
    const userResponse = await userPromise;
    const picResponse = await picPromise;

    if (
      userResponse &&
      !userResponse.error &&
      userResponse.email &&
      userResponse.first_name
    ) {
      return {
        email: userResponse.email,
        name: userResponse.first_name,
        // don't block on not being able to fetch the profile pic
        profileUrl:
          picResponse && !picResponse.error ? picResponse.data.url : undefined,
      };
    }
  }

  async login(): Promise<
    SSOResponseData<'facebook', FacebookAuthResponse, FacebookSignInError>
  > {
    if (!this.isEnabled()) {
      return {
        provider: 'facebook',
        status: 'error',
        errorCode: FacebookSignInError.UNKNOWN,
      };
    }

    if (this.successfulLoginState) {
      return this.successfulLoginState;
    }

    let fbResponse: FacebookLoginResponse;
    if (this.pwa.isNative()) {
      fbResponse = await this.appNativeFacebook
        .login(this.requiredPermissions)
        .then((response: any) => ({
          status: response.status,
          authResponse: {
            accessToken: response.authResponse?.accessToken,
            userID: response.authResponse?.userID,
          },
        }))
        .catch(status => ({
          status,
        }));
    } else {
      fbResponse = await new Promise((resolve, reject) => {
        this.ngZone.runOutsideAngular(() => {
          window.FB.login(
            (response: fb.StatusResponse) => {
              this.ngZone.run(() => {
                resolve(response);
              });
            },
            {
              scope: this.requiredPermissions.join(','),
            },
          );
        });
      });
    }

    if (fbResponse.status === 'connected' && fbResponse.authResponse) {
      this.successfulLoginState = {
        provider: 'facebook',
        status: 'success',
        result: fbResponse.authResponse,
      };
      return this.successfulLoginState;
    }

    // convert string union into enum
    let errorCode: FacebookSignInError;
    switch (fbResponse.status) {
      // desktop
      case 'authorization_expired':
        errorCode = FacebookSignInError.EXPIRED;
        break;
      // desktop
      case 'not_authorized':
        errorCode = FacebookSignInError.NOT_AUTHORIZED;
        break;
      // mobile
      case 'User cancelled.':
        errorCode = FacebookSignInError.CANCELED;
        break;
      default:
        errorCode = FacebookSignInError.UNKNOWN;
    }

    return {
      provider: 'facebook',
      status: 'error',
      errorCode,
    };
  }

  loadLoginStatus(): Promise<boolean> {
    if (this.pwa.isNative()) {
      // native apps have the SDK built in and don't need to load the JS one
      // we can immediately fetch the login status
      return this.appNativeFacebook.getLoginStatus().then((status: any) => {
        if (status.status === 'connected') {
          this.successfulLoginState = {
            provider: 'facebook',
            status: 'success',
            result: status.authResponse,
          };
        }
        // always resolve true
        return true;
      });
    }

    return new Promise((resolve, reject) => {
      const { appId } = this.config;
      if (!appId || !this.isEnabled()) {
        resolve(false);
        return;
      }
      const fbGetLoginStatus = () => {
        // fetch the login status before resolving initialisation
        // this prevents popups from being blocked when we call `login` later.
        this.ngZone.runOutsideAngular(() => {
          window.FB.getLoginStatus(status => {
            this.ngZone.run(() => {
              if (status.status === 'connected') {
                this.successfulLoginState = {
                  provider: 'facebook',
                  status: 'success',
                  result: status.authResponse,
                };
              }
              resolve(true);
            });
          });
        });
      };
      // We don't know yet if the FB SDK has been loaded here
      if ((window.FB as fb.FacebookStatic | undefined)?.getLoginStatus) {
        fbGetLoginStatus();
      } else {
        window.fbAsyncInit = () => {
          window.FB.init({
            appId,
            autoLogAppEvents: true,
            xfbml: false,
            cookie: false,
            status: true,
            version: 'v3.2',
          });
          fbGetLoginStatus();
        };
        if (document.getElementById('external-fb-sdk')) {
          return;
        }
        const e = document.createElement('script');
        e.src = 'https://connect.facebook.net/en_US/sdk.js';
        e.id = 'external-fb-sdk';
        e.onerror = reject;
        const s = document.getElementsByTagName('script')[0];
        (s.parentNode as Node).insertBefore(e, s);
      }
    });
  }

  /**
   * Make a facebook graph API call with the current auth state
   **/
  private async callAPI(endpoint: string): Promise<any> {
    const authResponse = this.successfulLoginState;
    if (authResponse.status === 'error') {
      return { error: true };
    }

    if (this.pwa.isNative()) {
      return this.appNativeFacebook
        .api(
          endpoint,
          [], // no extra permissions needed
        )
        .catch(() => ({ error: true }));
    }

    return new Promise<any>((resolve, reject) => {
      this.ngZone.runOutsideAngular(() => {
        window.FB.api(
          endpoint,
          {
            redirect: false,
            access_token: authResponse.result.accessToken,
          },
          response => {
            this.ngZone.run(() => {
              resolve(response);
            });
          },
        );
      });
    });
  }
}
