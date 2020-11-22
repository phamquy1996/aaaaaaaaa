import {
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ABTest } from '@freelancer/abtest';
import { Auth } from '@freelancer/auth';
import { Datastore } from '@freelancer/datastore';
import {
  ReferralInvitationCheckCollection,
  ThreadsCollection,
  UsersSelfCollection,
} from '@freelancer/datastore/collections';
import { Feature, FeatureFlagsService } from '@freelancer/feature-flags';
import { KeyboardService } from '@freelancer/keyboard';
import { LocalStorage } from '@freelancer/local-storage';
import { Localization } from '@freelancer/localization';
import { ContainerSize } from '@freelancer/ui/container';
import { StickyBehaviour } from '@freelancer/ui/sticky';
import { UI_CONFIG } from '@freelancer/ui/ui.config';
import { UiConfig } from '@freelancer/ui/ui.interface';
import { isDefined } from '@freelancer/utils';
import * as Rx from 'rxjs';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';

const hideMobileNewMessageToastKey = 'hideMobileNewMessageToast';

export interface NavigationAlternate {
  readonly contactLink: string;
  readonly logo: {
    readonly default: string;
    readonly transparent: string;
    readonly mobileDefault?: string;
    readonly mobileTransparent?: string;
  };
}

@Component({
  selector: 'app-navigation',
  template: `
    <ng-container *ngIf="isLoggedIn$ | async; else loggedOutNavigation">
      <app-navigation-primary
        *ngIf="(showRevamp$ | async) === false"
        class="PrimaryNav"
        [ngClass]="{
          IsMobileSticky: isMobileSticky,
          IsKeyboardOpen: isKeyboardOpen
        }"
        [flHideMobile]="!primary"
        [containerSize]="containerSize"
        [darkMode]="darkMode"
        [disablePostProjectButton]="disablePostProjectButton"
        [showGiveButton$]="showGiveButton$"
        [messagesUnreadCount]="messagesUnreadCount$ | async"
        [navigationAlternate]="navigationAlternate"
        (unreadUpdates)="handleUnreadUpdates($event)"
      ></app-navigation-primary>
      <!-- shadow revamp nav ref T215322 -->
      <app-navigation-primary-revamp
        *ngIf="(showRevamp$ | async) === true"
        class="PrimaryNav"
        [ngClass]="{
          IsMobileSticky: isMobileSticky,
          IsKeyboardOpen: isKeyboardOpen
        }"
        [flHideMobile]="!primary"
        [containerSize]="containerSize"
        [darkMode]="darkMode"
        [disablePostProjectButton]="disablePostProjectButton"
        [showGiveButton$]="showGiveButton$"
        [messagesUnreadCount]="messagesUnreadCount$ | async"
        [navigationAlternate]="navigationAlternate"
        (unreadUpdates)="handleUnreadUpdates($event)"
      ></app-navigation-primary-revamp>
      <fl-bit
        *ngIf="!disableNavigationChild"
        [flShowMobile]="true"
        [flSticky]="isMobileSticky"
        [flStickyOrder]="0"
        [flStickyBehaviour]="StickyBehaviour.ALWAYS"
      >
        <app-navigation-child
          [messagesUnreadCount]="messagesUnreadCount$ | async"
          [updatesUnreadCount]="updatesUnreadCount"
          [hideMobileNewMessageToast]="hideMobileNewMessageToast$ | async"
          [disableActions]="disableChildNavigationActions"
          [primary]="primary"
        ></app-navigation-child>
      </fl-bit>
    </ng-container>

    <ng-template #loggedOutNavigation>
      <app-navigation-logged-out
        [containerSize]="containerSize"
        [disablePostProjectButton]="disablePostProjectButton"
        [useLoginSignupModal]="useLoginSignupModal"
        [navigationAlternate]="navigationAlternate"
        [transparent]="transparent"
      ></app-navigation-logged-out>
    </ng-template>
  `,
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit, OnDestroy {
  StickyBehaviour = StickyBehaviour;

  @Input() containerSize: ContainerSize;
  @Input() disableChildNavigationActions: boolean;
  @Input() disablePostProjectButton = false;
  @Input() isMobileSticky: boolean;
  @Input() transparent?: boolean;
  @Input() useLoginSignupModal: boolean;
  @Input() navigationAlternate?: NavigationAlternate;
  @Input() disableNavigationChild = false;

  /**
   * Whether this is a primary view (ie. accessible in the nav)
   * Primary views show a full bottom nav on mobile,
   * while child views hide the nav and show a view header.
   */
  @Input() primary?: boolean;

  isLoggedIn$: Rx.Observable<boolean>;
  darkMode: boolean;
  updatesUnreadCount = 0;
  isKeyboardOpen = false;

  isGiveGetEligible$: Rx.Observable<boolean>;
  userCountry$: Rx.Observable<string>;
  // Whether to show the give button in the primary navbar.
  showGiveButton$: Rx.Observable<boolean>;
  messagesUnreadCount$: Rx.Observable<number>;
  hideMobileNewMessageToast$: Rx.Observable<boolean>;
  /** Whether to show the nav revamp ref T215322 */
  showRevamp$: Rx.Observable<boolean>;
  keyboardSubscription?: Rx.Subscription;

  constructor(
    @Inject(UI_CONFIG) private uiConfig: UiConfig,
    private localization: Localization,
    private auth: Auth,
    private abtest: ABTest,
    private datastore: Datastore,
    private featureFlagService: FeatureFlagsService,
    private localStorage: LocalStorage,
    private keyboardService: KeyboardService,
    private changeDetectorRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.isLoggedIn$ = this.auth.isLoggedIn();
    this.darkMode =
      this.uiConfig.theme === 'arrow' || this.uiConfig.theme === 'deloitte';

    this.showRevamp$ = this.activatedRoute.queryParamMap.pipe(
      map(params => isDefined(params.get('navRevamp')) ?? false),
    );

    this.isGiveGetEligible$ = this.datastore
      .document<ReferralInvitationCheckCollection>(
        'referralInvitationCheck',
        this.auth.getUserId(),
      )
      .valueChanges()
      .pipe(map(result => result.isEligible));

    this.userCountry$ = this.datastore
      .document<UsersSelfCollection>('usersSelf', this.auth.getUserId())
      .valueChanges()
      .pipe(
        map(result =>
          result.address !== undefined && result.address.country !== undefined
            ? result.address.country
            : '',
        ),
      );

    this.showGiveButton$ = Rx.combineLatest([
      this.isGiveGetEligible$,
      this.userCountry$,
      this.featureFlagService.getFlag(Feature.GIVE_GET),
    ]).pipe(
      switchMap(([isGiveGetEligible, userCountry, featureFlag]) => {
        // Show give button on navbar when the whitelist cookie is set.
        if (this.abtest.isWhitelistUser()) {
          return Rx.of(true);
        }

        return Rx.of(
          // User who is in the US.
          userCountry === 'United States' &&
            // English user.
            this.localization.isEnglish() &&
            // Have give get feature flag enabled.
            featureFlag &&
            // Eligible to the give get program.
            isGiveGetEligible,
        );
      }),
    );

    this.messagesUnreadCount$ = this.datastore
      .collection<ThreadsCollection>('threads', query =>
        query.where('isRead', '==', false).limit(100),
      )
      .valueChanges()
      .pipe(
        map(threads =>
          threads
            .map(thread => thread.messageUnreadCount)
            .reduce((a, b) => a + b, 0),
        ),
        distinctUntilChanged(),
      );

    this.hideMobileNewMessageToast$ = this.localStorage
      .get(hideMobileNewMessageToastKey)
      .pipe(map(state => !!state));

    this.keyboardSubscription = this.keyboardService.isOpen().subscribe(val => {
      this.isKeyboardOpen = val;
      this.changeDetectorRef.detectChanges();
    });
  }

  handleUnreadUpdates(updatesUnreadCount: number) {
    this.updatesUnreadCount = updatesUnreadCount;
  }

  ngOnDestroy() {
    if (this.keyboardSubscription) {
      this.keyboardSubscription.unsubscribe();
    }
  }
}
