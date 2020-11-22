import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Testability,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Auth } from '@freelancer/auth';
import { Datastore } from '@freelancer/datastore';
import {
  UserBalance,
  UserBalancesCollection,
  UserInfo,
  UserInfoCollection,
} from '@freelancer/datastore/collections';
import { Feature } from '@freelancer/feature-flags';
import { PerformanceTracking } from '@freelancer/tracking';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { CalloutPlacement, CalloutSize } from '@freelancer/ui/callout';
import { ContainerSize } from '@freelancer/ui/container';
import { IconColor } from '@freelancer/ui/icon';
import { BackgroundColor, LogoSize } from '@freelancer/ui/logo';
import { Margin } from '@freelancer/ui/margin';
import { PictureDisplay } from '@freelancer/ui/picture';
import { FontColor, TextSize } from '@freelancer/ui/text';
import { UI_CONFIG } from '@freelancer/ui/ui.config';
import { UiConfig } from '@freelancer/ui/ui.interface';
import { AvatarSize } from '@freelancer/ui/user-avatar';
import { isDefined } from '@freelancer/utils';
import * as Rx from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { NavigationAlternate } from '../navigation.component';

export enum NavLink {
  DASHBOARD = '/dashboard',
  GIVE = '/give',
  POST_PROJECT = '/post-project',
  MENU = '/navigation/menu',
  MANAGE = '/manage',
  SEARCH = '/search',
}

@Component({
  selector: 'app-navigation-primary-revamp',
  template: `
    <fl-bit class="NavigationRoot" flTrackingSection="NavigationPrimary">
      <fl-container class="NavigationContainer" [size]="size">
        <fl-bit
          class="NavigationItem"
          [flMarginRightTablet]="Margin.XSMALL"
          [flMarginRightDesktop]="Margin.SMALL"
        >
          <fl-button
            class="NavigationItemBtn"
            flTrackingLabel="Logo"
            [ngClass]="{
              IsActive: activeTab === NavLink.DASHBOARD
            }"
            [display]="'flex'"
            [link]="'/'"
          >
            <fl-logo
              class="NavigationItemLogo"
              [size]="LogoSize.SMALL"
              [flHideMobile]="true"
              [backgroundColor]="
                darkMode ? BackgroundColor.DARK : BackgroundColor.LIGHT
              "
            ></fl-logo>
            <fl-icon
              [flShowMobile]="true"
              [color]="IconColor.INHERIT"
              [name]="'ui-home-outline'"
            ></fl-icon>
          </fl-button>
        </fl-bit>

        <fl-bit class="NavigationItem" [flShowMobile]="true">
          <fl-button
            class="NavigationItemBtn"
            flTrackingLabel="MyProjects"
            [ngClass]="{
              IsActive: activeTab === NavLink.MANAGE
            }"
            [display]="'flex'"
            [link]="NavLink.MANAGE"
          >
            <fl-icon
              [flShowMobile]="true"
              [color]="IconColor.INHERIT"
              [name]="'ui-suitcase-outline'"
            ></fl-icon>
          </fl-button>
        </fl-bit>

        <fl-callout
          class="NavigationItem NavigationItem--tab"
          [flHideMobile]="true"
          [edgeToEdge]="true"
          [hideCloseButton]="true"
          [hover]="true"
          [placement]="CalloutPlacement.BOTTOM"
          [hover]="true"
          [size]="CalloutSize.MEDIUM"
        >
          <fl-callout-trigger class="NavigationItemInner">
            <fl-button
              class="NavigationItemBtn"
              flTrackingLabel="MyProjects"
              [display]="'flex'"
            >
              <fl-bit class="NavigationItem-inner">
                <fl-icon
                  [color]="IconColor.INHERIT"
                  [name]="'ui-suitcase-outline'"
                  [flMarginRightDesktop]="Margin.XXSMALL"
                ></fl-icon>
                <fl-text
                  i18n="Navigation primary tab label"
                  [flHideTablet]="true"
                  [color]="FontColor.INHERIT"
                  [size]="TextSize.XXSMALL"
                >
                  My Projects
                </fl-text>
              </fl-bit>
            </fl-button>
          </fl-callout-trigger>

          <fl-callout-content>
            <app-my-projects></app-my-projects>
          </fl-callout-content>
        </fl-callout>

        <fl-callout
          class="NavigationItem NavigationItem--tab"
          [flHideMobile]="true"
          [edgeToEdge]="true"
          [hideCloseButton]="true"
          [hover]="true"
          [placement]="CalloutPlacement.BOTTOM"
          [size]="CalloutSize.LARGE"
        >
          <fl-callout-trigger class="NavigationItemInner">
            <fl-button
              class="NavigationItemBtn"
              flTrackingLabel="Browse"
              [display]="'flex'"
            >
              <fl-bit class="NavigationItem-inner">
                <fl-icon
                  [color]="IconColor.INHERIT"
                  [name]="'ui-browse-outline'"
                  [flMarginRightDesktop]="Margin.XXSMALL"
                ></fl-icon>
                <fl-text
                  i18n="Navigation primary tab label"
                  [flHideTablet]="true"
                  [color]="FontColor.INHERIT"
                  [size]="TextSize.XXSMALL"
                >
                  Browse
                </fl-text>
              </fl-bit>
            </fl-button>
          </fl-callout-trigger>

          <fl-callout-content> <app-browse></app-browse> </fl-callout-content>
        </fl-callout>

        <!-- Give button -->
        <!-- Not for tablet and mobile view. -->
        <ng-container *ngIf="showGiveButton$ | async">
          <fl-bit
            *flFeature="Feature.GIVE_GET"
            class="NavigationItem NavigationItem--tab"
            [flShowDesktop]="true"
          >
            <fl-button
              class="NavigationItemBtn"
              flTrackingLabel="GiveButton"
              [display]="'flex'"
              [link]="NavLink.GIVE"
            >
              <fl-bit class="NavigationItem-inner">
                <fl-bit
                  class="IconContainer"
                  [flMarginRightDesktop]="Margin.XXSMALL"
                >
                  <fl-icon
                    [color]="IconColor.INHERIT"
                    [name]="'ui-gift-card'"
                  ></fl-icon>
                </fl-bit>
                <fl-text
                  i18n="Navigation primary tab label"
                  [flHideTablet]="true"
                  [color]="FontColor.INHERIT"
                  [size]="TextSize.XXSMALL"
                >
                  Get $20
                </fl-text>
              </fl-bit>
            </fl-button>
          </fl-bit>
        </ng-container>

        <fl-bit class="NavigationItem" [flShowMobile]="true">
          <fl-button
            class="NavigationItemBtn"
            flTrackingLabel="Search"
            [ngClass]="{
              IsActive: activeTab === NavLink.SEARCH
            }"
            [display]="'flex'"
            [link]="NavLink.SEARCH"
          >
            <fl-icon
              [flShowMobile]="true"
              [color]="IconColor.INHERIT"
              [name]="'ui-browse-outline'"
            ></fl-icon>
          </fl-button>
        </fl-bit>

        <fl-bit
          class="NavigationItem NavigationItem--secondary"
          [flHideMobile]="true"
          [flMarginRightDesktop]="Margin.XSMALL"
        >
          <fl-callout
            class="NavigationItem NavigationItem--tab"
            [edgeToEdge]="true"
            [hideCloseButton]="true"
            [hover]="true"
            [placement]="CalloutPlacement.BOTTOM"
            [size]="CalloutSize.MEDIUM"
          >
            <fl-callout-trigger class="NavigationItemInner">
              <fl-button
                class="NavigationItemBtn"
                flTrackingLabel="Updates"
                [display]="'flex'"
                (click)="handleUpdatesClick()"
              >
                <fl-bit class="NavigationItem-inner">
                  <fl-bit class="IconContainer">
                    <fl-icon
                      [color]="IconColor.INHERIT"
                      [name]="'ui-bell-outline-v2'"
                    ></fl-icon>
                    <fl-unread-indicator
                      *ngIf="updatesUnreadCount > 0"
                      ariaLabel="Unread updates"
                      i18n-ariaLabel="Unread updates indicator label"
                      [counter]="updatesUnreadCount"
                    ></fl-unread-indicator>
                  </fl-bit>
                </fl-bit>
              </fl-button>
            </fl-callout-trigger>
            <fl-callout-content>
              <app-updates
                (unreadCount)="handleUpdatesUnread($event)"
              ></app-updates>
            </fl-callout-content>
          </fl-callout>

          <fl-callout
            class="NavigationItem NavigationItem--tab"
            [edgeToEdge]="true"
            [hideCloseButton]="true"
            [hover]="true"
            [placement]="CalloutPlacement.BOTTOM"
            [size]="CalloutSize.MEDIUM"
          >
            <fl-callout-trigger class="NavigationItemInner">
              <fl-button
                class="NavigationItemBtn"
                flTrackingLabel="Messages"
                [display]="'flex'"
              >
                <fl-bit class="NavigationItem-inner">
                  <fl-bit class="IconContainer">
                    <fl-icon
                      [color]="IconColor.INHERIT"
                      [name]="'ui-chat-square-outline'"
                    ></fl-icon>
                    <fl-unread-indicator
                      *ngIf="messagesUnreadCount > 0"
                      ariaLabel="Unread messages"
                      i18n-ariaLabel="Unread messages indicator label"
                      [counter]="messagesUnreadCount"
                    ></fl-unread-indicator>
                  </fl-bit>
                </fl-bit>
              </fl-button>
            </fl-callout-trigger>

            <fl-callout-content>
              <app-messages></app-messages>
            </fl-callout-content>
          </fl-callout>
        </fl-bit>

        <ng-container *ngIf="!disablePostProjectButton">
          <fl-bit
            *ngIf="!alternateNavigation"
            class="NavigationItem NavigationItem--primaryCTA"
          >
            <fl-button
              class="NavigationItemBtn"
              flTrackingLabel="PostProjectButton"
              [flShowMobile]="true"
              [display]="'flex'"
              [link]="NavLink.POST_PROJECT"
              [ngClass]="{ IsActive: activeTab === NavLink.POST_PROJECT }"
            >
              <fl-icon
                [color]="IconColor.INHERIT"
                [name]="'ui-plus-outline'"
              ></fl-icon>
            </fl-button>
            <fl-button
              i18n="Navigation primary post project button"
              flTrackingLabel="PostProjectButton"
              [flHideMobile]="true"
              [color]="
                isEnterprise === true
                  ? ButtonColor.PRIMARY
                  : ButtonColor.PRIMARY_PINK
              "
              [link]="NavLink.POST_PROJECT"
              [size]="ButtonSize.SMALL"
            >
              Post a Project
            </fl-button>
          </fl-bit>
          <fl-bit
            *ngIf="alternateNavigation"
            class="NavigationItem NavigationItem--primaryCTA"
            [flHideMobile]="true"
          >
            <fl-button
              i18n="Navigation request enterprise demo button"
              flTrackingLabel="RequestDemoButton"
              [color]="ButtonColor.PRIMARY_PINK"
              [link]="alternateNavigation.contactLink"
            >
              Request a Demo
            </fl-button>
          </fl-bit>
        </ng-container>

        <fl-callout
          class="NavigationItem"
          [ngClass]="{ NoButton: disablePostProjectButton }"
          [edgeToEdge]="true"
          [hideCloseButton]="true"
          [hover]="true"
          [placement]="CalloutPlacement.BOTTOM"
        >
          <fl-callout-trigger class="NavigationItemInner">
            <fl-button
              class="NavigationItemBtn"
              flTrackingLabel="UserSettings"
              [flShowMobile]="true"
              [display]="'flex'"
              [link]="NavLink.MENU"
              [ngClass]="{
                IsActive: activeTab === NavLink.MENU
              }"
              (click)="$event.stopPropagation()"
            >
              <fl-icon
                [color]="IconColor.INHERIT"
                [name]="'ui-bars-v2'"
              ></fl-icon>
            </fl-button>
            <fl-button
              class="NavigationItemBtn"
              flTrackingLabel="UserSettings"
              [flHideMobile]="true"
              [display]="'flex'"
            >
              <ng-container
                *ngTemplateOutlet="userSettingsButtonContent"
              ></ng-container>
            </fl-button>

            <ng-template #userSettingsButtonContent>
              <app-user-card-revamp
                [balance]="defaultBalance$ | async"
                [user]="userInfo$ | async"
              ></app-user-card-revamp>
            </ng-template>
          </fl-callout-trigger>

          <fl-callout-content>
            <app-user-settings></app-user-settings>
          </fl-callout-content>
        </fl-callout>
      </fl-container>
    </fl-bit>
  `,
  styleUrls: ['./navigation-primary-revamp.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationPrimaryRevampComponent
  implements OnInit, AfterViewInit, OnDestroy {
  AvatarSize = AvatarSize;
  BackgroundColor = BackgroundColor;
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  CalloutPlacement = CalloutPlacement;
  CalloutSize = CalloutSize;
  TextSize = TextSize;
  FontColor = FontColor;
  Feature = Feature;
  IconColor = IconColor;
  LogoSize = LogoSize;
  Margin = Margin;
  PictureDisplay = PictureDisplay;
  NavLink = NavLink;

  alternateNavigation: NavigationAlternate;
  size: ContainerSize;
  isEnterprise: boolean;

  @Input()
  showGiveButton$: Rx.Observable<boolean>;

  @Input()
  darkMode: boolean;

  @Input() set containerSize(value: ContainerSize) {
    this.size = value || ContainerSize.DESKTOP_LARGE;
  }
  @Input() set navigationAlternate(value: NavigationAlternate) {
    this.alternateNavigation = value || undefined;
  }

  @Input() disablePostProjectButton = false;
  @Input() messagesUnreadCount = 0;
  @Output() unreadUpdates = new EventEmitter<number>();

  defaultBalance$: Rx.Observable<UserBalance>;
  updatesClick$: Rx.Observable<void>;
  updatesUnreadCount: number;
  userBalances$: Rx.Observable<ReadonlyArray<UserBalance>>;
  userInfo$: Rx.Observable<UserInfo>;
  routeChangeSubscription?: Rx.Subscription;
  activeTab: NavLink;

  constructor(
    private auth: Auth,
    private datastore: Datastore,
    private testability: Testability,
    private performanceTracking: PerformanceTracking,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
    @Inject(UI_CONFIG) public uiConfig: UiConfig,
  ) {}

  ngOnInit() {
    const userId$ = this.auth.getUserId();

    this.userBalances$ = this.datastore
      .collection<UserBalancesCollection>('userBalances')
      .valueChanges()
      .pipe(
        map(balances =>
          // If the balance is 0 don't return the balance information
          // unless if the currency is the user's primary currency.
          balances.filter(balance => balance.amount !== 0 || balance.primary),
        ),
      );

    this.defaultBalance$ = this.userBalances$.pipe(
      map(userBalances => userBalances.find(balance => balance.primary)),
      filter(isDefined),
    );

    this.userInfo$ = this.datastore
      .document<UserInfoCollection>('userInfo', userId$)
      .valueChanges();

    this.testability.whenStable(() => {
      this.performanceTracking.mark('navigation_fully_loaded', true);
    });

    this.setActiveTab();

    this.routeChangeSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.setActiveTab();
      });

    this.isEnterprise = !!this.uiConfig.theme;
  }

  setActiveTab() {
    Object.values(NavLink).forEach(link => {
      if (this.router.url.includes(link)) {
        this.activeTab = link;
        this.changeDetector.detectChanges();
      }
    });
  }

  ngAfterViewInit() {
    this.performanceTracking.mark('navigation_rendered', true);
  }

  handleUpdatesClick(event?: Event) {
    this.updatesUnreadCount = 0;
    this.unreadUpdates.emit(this.updatesUnreadCount);

    if (event) {
      event.stopPropagation();
    }
  }

  handleUpdatesUnread(anyUnread: number) {
    this.updatesUnreadCount = anyUnread;
    this.unreadUpdates.emit(this.updatesUnreadCount);
  }

  ngOnDestroy() {
    if (this.routeChangeSubscription) {
      this.routeChangeSubscription.unsubscribe();
    }
  }
}
