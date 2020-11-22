import { HttpClient } from '@angular/common/http';
import { ErrorHandler, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Location } from '@freelancer/location';
import { UserAgent } from '@freelancer/user-agent';
import { Keychain } from '@laurentgoudet/ionic-native-keychain/ngx';
import { CookieService } from '@laurentgoudet/ngx-cookie';
import { ADMIN_AUTH_CONFIG } from './auth.config';
import { AuthConfig } from './auth.interface';
import { Auth } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminAuth extends Auth {
  constructor(
    @Inject(ADMIN_AUTH_CONFIG) authConfig: AuthConfig,
    @Inject(PLATFORM_ID) platformId: Object,
    cookies: CookieService,
    http: HttpClient,
    location: Location,
    userAgent: UserAgent,
    iosKeychain: Keychain,
    errorHandler: ErrorHandler,
  ) {
    super(
      authConfig,
      platformId,
      cookies,
      http,
      location,
      userAgent,
      iosKeychain,
      errorHandler,
    );
  }
}
