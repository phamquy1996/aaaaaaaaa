import {
  ChangeDetectorRef,
  Component,
  HostBinding,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArrowCookieRefresher } from '@freelancer/arrow-cookie-refresher';
import { DeloitteLoginSessionRefresher } from '@freelancer/deloitte-login-session-refresher';
import { KeyboardService } from '@freelancer/keyboard';
import { ContainerSize } from '@freelancer/ui/container';
import * as Rx from 'rxjs';
import { NavigationAlternate } from '../navigation/navigation.component';
import { ShellConfig } from './shell-config.service';

export interface LoggedInShellConfig {
  disableFooter?: boolean;
  disableMessaging?: boolean;
  /** hides messaging but leave admin chats open */
  adminOnlyMessaging?: boolean;
  disableChildNavigationActions?: boolean;
  disableNavigation?: boolean;
  disableNavigationChild?: boolean;
  disableToastNotifications?: boolean;
  disableVerificationBanner?: boolean;
  disablePostProjectButton?: boolean;
  enableMobileVerificationBanner?: boolean;
  containerSize?: ContainerSize;
  isMobilePrimaryView?: boolean;
  navigationAlternate?: NavigationAlternate;
  isLogoutPage?: boolean;
  fixedHeight?: boolean;
  /** Whether to bypass logout restricted for the given app/condition */
  bypassLoggedOutRestricted?: { [k in 'deloitte' | 'native']?: boolean };
  /** For pages that have a progress bar, e.g. onboarding */
  progress?: number;
}

// /!\ DO NOT ADD ANYTHING HERE WITHOUT ASKING FRONTEND INFRA FIRST /!\
// This code is loaded on ALL logged-in pages by default, and has to be manually disabled per page.
@Component({
  selector: 'app-logged-in-shell',
  template: `
    <!--
      Use verification banner to determine whether to show maintenance banner
      because there are pages that we can't show any banners on (eg. inbox).

      TODO: make this its own config so it can be displayed on KYC pages
    -->
    <div
      *ngIf="config$ | async as config"
      [ngClass]="{
        IsStickyNav: config?.isMobilePrimaryView && !isKeyboardOpen,
        FixedHeight: config?.fixedHeight
      }"
    >
      <div class="PageHeader">
        <app-maintenance-banner
          *ngIf="!config?.disableVerificationBanner"
          [flHideMobile]="!config?.enableMobileVerificationBanner"
          [containerSize]="config?.containerSize"
        ></app-maintenance-banner>
        <app-verification-banner
          *ngIf="!config?.disableVerificationBanner"
          [flHideMobile]="!config?.enableMobileVerificationBanner"
          [containerSize]="config?.containerSize"
        ></app-verification-banner>
        <app-notifications-banner
          *ngIf="!config?.disableVerificationBanner"
          [flHideMobile]="!config?.enableMobileVerificationBanner"
          [containerSize]="config?.containerSize"
        ></app-notifications-banner>
        <div>
          <app-navigation
            *ngIf="!config?.isLogoutPage"
            [containerSize]="config?.containerSize"
            [disableNavigationChild]="config?.disableNavigationChild"
            [disableChildNavigationActions]="
              config?.disableChildNavigationActions
            "
            [disablePostProjectButton]="config?.disablePostProjectButton"
            [navigationAlternate]="config?.navigationAlternate"
            [flHideTablet]="config?.disableNavigation"
            [flHideDesktop]="config?.disableNavigation"
            [flHideDesktopLarge]="config?.disableNavigation"
            [primary]="config?.isMobilePrimaryView"
            [isMobileSticky]="true"
          ></app-navigation>
          <app-toast-alerts></app-toast-alerts>
        </div>
      </div>
      <div class="MainContent">
        <router-outlet></router-outlet>
      </div>
      <app-messaging
        *ngIf="!config?.disableMessaging"
        [hideMessaging]="config?.adminOnlyMessaging"
      ></app-messaging>
      <app-toast-notifications
        *ngIf="!config?.disableToastNotifications"
      ></app-toast-notifications>
      <app-footer
        *ngIf="!config?.disableFooter"
        [flHideMobile]="true"
        [containerSize]="config?.containerSize"
      ></app-footer>
    </div>
  `,
  styleUrls: ['./logged-in-shell.component.scss'],
})
export class LoggedInShellComponent implements OnInit, OnDestroy {
  config$: Rx.Observable<LoggedInShellConfig>;
  configSubscription?: Rx.Subscription;
  keyboardSubscription?: Rx.Subscription;
  isKeyboardOpen = false;

  @HostBinding('class.FixedHeightScroll') fixedHeight? = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private arrowCookieRefresherService: ArrowCookieRefresher,
    private deloitteLoginSessionRefresher: DeloitteLoginSessionRefresher,
    private shellConfig: ShellConfig,
    private keyboardService: KeyboardService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.config$ = this.shellConfig.getConfig(this.activatedRoute);
    this.arrowCookieRefresherService.init();
    this.deloitteLoginSessionRefresher.init();
    this.configSubscription = this.config$.subscribe(x => {
      this.fixedHeight = x.fixedHeight;
    });
    this.keyboardSubscription = this.keyboardService.isOpen().subscribe(val => {
      this.isKeyboardOpen = val;
      this.changeDetectorRef.detectChanges();
    });
  }

  ngOnDestroy() {
    if (this.configSubscription) {
      this.configSubscription.unsubscribe();
    }

    if (this.keyboardSubscription) {
      this.keyboardSubscription.unsubscribe();
    }
  }
}
