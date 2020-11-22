import { Component, Inject, Input, OnInit } from '@angular/core';
import { ABTest } from '@freelancer/abtest';
import { LocalStorage } from '@freelancer/local-storage';
import { Notifications } from '@freelancer/notifications';
import { Pwa } from '@freelancer/pwa';
import { Tracking } from '@freelancer/tracking';
import { BannerAnnouncementType } from '@freelancer/ui/banner-announcement';
import { ButtonColor } from '@freelancer/ui/button';
import { ContainerSize } from '@freelancer/ui/container';
import { UI_CONFIG } from '@freelancer/ui/ui.config';
import { UiConfig } from '@freelancer/ui/ui.interface';
import * as Rx from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'app-notifications-banner',
  template: `
    <fl-banner-announcement
      *ngIf="isBannerOpen$ | async"
      i18n="Verification banner message"
      bannerTitle="Stay up to date"
      i18n-bannerTitle="Enable notifications banner"
      [icon]="'ui-info-v2'"
      [type]="BannerAnnouncementType.INFO"
      [containerSize]="containerSize"
      (close)="handleClose()"
    >
      <fl-banner-announcement-message>
        Turn on notifications to never miss an important message or update on
        your projects.
      </fl-banner-announcement-message>
      <fl-banner-announcement-buttons>
        <fl-button
          flTrackingLabel="enablePushNotifications"
          [color]="ButtonColor.TRANSPARENT_LIGHT"
          [busy]="isBusyEnablingNotifications"
          (click)="enableNotifications()"
        >
          Turn on notifications
        </fl-button>
      </fl-banner-announcement-buttons>
    </fl-banner-announcement>
  `,
})
export class NotificationsBannerComponent implements OnInit {
  BannerAnnouncementType = BannerAnnouncementType;
  ButtonColor = ButtonColor;

  /** If the user hasn't closed the banner yet */
  isBannerOpen$: Rx.Observable<boolean>;
  hasNotificationsBeenEnabledSubject$ = new Rx.BehaviorSubject<boolean>(false);
  isBusyEnablingNotifications = false;

  @Input() containerSize: ContainerSize;

  constructor(
    private abTest: ABTest,
    private localStorage: LocalStorage,
    private notifications: Notifications,
    private pwa: Pwa,
    private tracking: Tracking,
    @Inject(UI_CONFIG) private uiConfig: UiConfig,
  ) {}

  ngOnInit() {
    this.isBannerOpen$ = Rx.from(
      this.shouldRequestNotificationsPermission(),
    ).pipe(
      switchMap(showNotificationsBanner => {
        if (!showNotificationsBanner) {
          return Rx.of(false);
        }
        return Rx.combineLatest([
          this.localStorage.get('hideEnablePushNotificationsBanner'),
          this.hasNotificationsBeenEnabledSubject$.asObservable(),
        ]).pipe(
          map(
            ([isBannerHidden, hasRequestedPermission]) =>
              !isBannerHidden && !hasRequestedPermission,
          ),
        );
      }),
    );
  }

  handleClose() {
    this.localStorage.set('hideEnablePushNotificationsBanner', true);
  }

  async enableNotifications() {
    this.isBusyEnablingNotifications = true;
    this.tracking.trackCustomEvent(
      'EnablePushNotificationsRequest',
      'EnablePushNotficationsBanner',
    );
    const result = await this.notifications.registerPushNotifications();
    if (result.status === 'success') {
      this.tracking.trackCustomEvent(
        'EnablePushNotificationsSuccess',
        'EnablePushNotficationsBanner',
      );
    } else {
      this.tracking.trackCustomEvent(
        'EnablePushNotificationsError',
        'EnablePushNotficationsBanner',
      );
    }
    // we ignore the errors here, e.g. if users as denied permission
    // TODO: if the users has blocked permission by mistake, we could have
    // logic to try to recover him/her, e.g. explaining how to unblock the
    // notifications (e.g. a button popping an explaination modal)
    this.hasNotificationsBeenEnabledSubject$.next(true);
    this.isBusyEnablingNotifications = false;
  }

  async shouldRequestNotificationsPermission(): Promise<boolean> {
    // Only show the banner when permission has not been denied or granted
    const canRequest = await this.notifications.canRequestPermission();
    if (!canRequest) {
      return false;
    }

    // Always show in the installed apps
    if (this.pwa.isInstalled()) {
      return true;
    }

    // Don't show on Enterprise sites for now
    if (this.uiConfig.theme) {
      return false;
    }

    // Always enroll whitelisted users
    if (this.abTest.isWhitelistUser()) {
      return true;
    }

    const variant = await this.abTest
      // If changing the experiement ID, make sure to update the notifications
      // component one
      .getUserExperimentVariation('T195472-web-push-notifications')
      .pipe(take(1))
      .toPromise();
    return variant === 'test';
  }
}
