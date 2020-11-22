import {
  Component,
  ErrorHandler,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ABTest } from '@freelancer/abtest';
import { Auth } from '@freelancer/auth';
import { Pwa } from '@freelancer/pwa';
import { UI_CONFIG } from '@freelancer/ui/ui.config';
import { UiConfig } from '@freelancer/ui/ui.interface';
import * as Rx from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { Notifications } from './notifications.service';

/**
 * Manage the push notifications registration, i.e. register/unregister on
 * login/logout
 */
@Component({
  selector: 'fl-notifications',
  template: '',
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notificationRegistrationSubscription?: Rx.Subscription;

  constructor(
    private abTest: ABTest,
    private auth: Auth,
    private errorHandler: ErrorHandler,
    private notifications: Notifications,
    private pwa: Pwa,
    @Inject(UI_CONFIG) private uiConfig: UiConfig,
  ) {}

  ngOnInit() {
    if (this.notifications.isSupported()) {
      // On logout, unregister push notifications
      this.auth.registerBeforeLogoutAction(() =>
        this.notifications.unregisterPushNotifications(),
      );

      this.notificationRegistrationSubscription = this.auth
        .isLoggedIn()
        .pipe(
          switchMap(async isLoggedIn => {
            // If logged-in, try registering for push notifications
            if (!isLoggedIn) {
              return;
            }

            // Permission has not been granted yet, do nothing,
            // registerPushNotifications() will be called from the push
            // notifications banner
            const hasGranted = await this.notifications.hasGrantedPermission();
            if (!hasGranted) {
              return;
            }

            // Register push notifications if eligible
            const shouldRegister = await this.shouldRegisterPushNotifications();
            if (shouldRegister) {
              const registrationResult = await this.notifications.registerPushNotifications();
              if (registrationResult.status === 'error') {
                // Log the error as this should not happen as we are checking
                // canShowNotification() first
                this.errorHandler.handleError(
                  new Error(
                    `registerPushNotifications failed with code ${registrationResult.errorCode}`,
                  ),
                );
              }
            }
          }),
        )
        .subscribe();
    }
  }

  ngOnDestroy() {
    if (this.notificationRegistrationSubscription) {
      this.notificationRegistrationSubscription.unsubscribe();
    }
  }

  async shouldRegisterPushNotifications(): Promise<boolean> {
    // Always register in the native apps
    if (this.pwa.isNative()) {
      return true;
    }

    // Don't register on Enterprise sites for now
    if (this.uiConfig.theme) {
      return false;
    }

    // TODO: remove that when the experiment has ended
    // Always enroll whitelisted users
    if (this.abTest.isWhitelistUser()) {
      return true;
    }

    const variant = await this.abTest
      // If changing the experiement ID, make sure to update the notifications
      // banner one
      .getUserExperimentVariation('T195472-web-push-notifications')
      .pipe(take(1))
      .toPromise();
    return variant === 'test';
  }
}
