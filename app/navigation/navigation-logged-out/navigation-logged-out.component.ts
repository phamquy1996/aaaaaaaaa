import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Location } from '@freelancer/location';
import { ModalService } from '@freelancer/ui';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { ContainerSize } from '@freelancer/ui/container';
import { IconColor } from '@freelancer/ui/icon';
import { LinkColor, LinkUnderline } from '@freelancer/ui/link';
import { BackgroundColor, LogoSize } from '@freelancer/ui/logo';
import { Margin } from '@freelancer/ui/margin';
import { ModalSize } from '@freelancer/ui/modal';
import { TextSize } from '@freelancer/ui/text';
import { LoginSignupModalComponent } from 'app/login-signup/login-signup-modal/login-signup-modal.component';
import { LoginOrSignup } from 'app/login-signup/login-signup-modal/login-signup-modal.model';
import * as Rx from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { NavigationAlternate } from '../navigation.component';

@Component({
  selector: 'app-navigation-logged-out',
  template: `
    <fl-bit
      class="NavigationRoot"
      flTrackingSection="NavigationLoggedOut"
      [attr.data-transparent]="transparent"
    >
      <fl-container class="NavigationContainer" [size]="size">
        <fl-button
          class="LogoButton"
          link="/"
          display="block"
          flTrackingLabel="Logo"
          [attr.data-long]="
            !!alternateNavigation && !!alternateNavigation.logo.mobileDefault
          "
        >
          <fl-logo
            *ngIf="!alternateNavigation"
            [backgroundColor]="BackgroundColor.LIGHT"
            [size]="LogoSize.SMALL"
          ></fl-logo>
          <ng-container *ngIf="alternateNavigation">
            <fl-picture
              *ngIf="alternateNavigation && transparent"
              [src]="alternateNavigation.logo.transparent"
              [flHideMobile]="!!alternateNavigation.logo.mobileDefault"
            ></fl-picture>
            <fl-picture
              *ngIf="alternateNavigation && !transparent"
              [src]="alternateNavigation.logo.default"
              [flHideMobile]="!!alternateNavigation.logo.mobileDefault"
            ></fl-picture>
            <ng-container *ngIf="alternateNavigation.logo.mobileDefault">
              <fl-picture
                *ngIf="transparent"
                [src]="alternateNavigation.logo.mobileTransparent"
                [flHideDesktop]="true"
                [flHideTablet]="true"
              ></fl-picture>
              <fl-picture
                *ngIf="!transparent"
                [src]="alternateNavigation.logo.mobileDefault"
                [flHideDesktop]="true"
                [flHideTablet]="true"
              ></fl-picture>
            </ng-container>
          </ng-container>
        </fl-button>
        <fl-link
          *ngIf="!alternateNavigation"
          class="NavigationItem"
          flTrackingLabel="HowItWorks"
          i18n="Navigation how it works label"
          [flHideMobile]="true"
          [link]="'/info/how-it-works/'"
          [size]="TextSize.SMALL"
          [flMarginRight]="Margin.SMALL"
          [color]="LinkColor.INHERIT"
          [underline]="LinkUnderline.NEVER"
        >
          How It Works
        </fl-link>
        <fl-link
          *ngIf="!alternateNavigation"
          class="NavigationItem"
          flTrackingLabel="BrowseJobs"
          i18n="Navigation browse jobs label"
          [flHideMobile]="true"
          [link]="'/jobs/'"
          [size]="TextSize.SMALL"
          [flMarginRight]="Margin.SMALL"
          [color]="LinkColor.INHERIT"
          [underline]="LinkUnderline.NEVER"
        >
          Browse Jobs
        </fl-link>
        <fl-bit class="NavigationSections">
          <fl-link
            *ngIf="!loginSignupModal"
            class="NavigationItem"
            flTrackingLabel="LoginPage"
            i18n="Navigation log in label"
            [link]="'/login'"
            [queryParams]="{ next: redirectUrl$ | async }"
            [size]="TextSize.SMALL"
            [flMarginRight]="Margin.SMALL"
            [color]="LinkColor.INHERIT"
            [underline]="LinkUnderline.NEVER"
          >
            Log In
          </fl-link>
          <fl-link
            *ngIf="loginSignupModal"
            class="NavigationItem"
            flTrackingLabel="LoginModal"
            i18n="Navigation log in label"
            [size]="TextSize.LARGE"
            [flMarginRight]="Margin.SMALL"
            [color]="LinkColor.INHERIT"
            [underline]="LinkUnderline.NEVER"
            (click)="handleLoginSignupModal(LoginOrSignup.LOGIN)"
          >
            Log In
          </fl-link>
          <fl-link
            *ngIf="!loginSignupModal"
            class="NavigationItem"
            flTrackingLabel="SignUp"
            i18n="Navigation sign up label"
            [size]="TextSize.SMALL"
            [link]="'/signup'"
            [queryParams]="{ next: redirectUrl$ | async }"
            [flMarginRight]="Margin.SMALL"
            [color]="LinkColor.INHERIT"
            [underline]="LinkUnderline.NEVER"
          >
            Sign Up
          </fl-link>
          <fl-link
            *ngIf="loginSignupModal"
            class="NavigationItem"
            flTrackingLabel="SignUp"
            i18n="Navigation sign up label"
            [size]="TextSize.LARGE"
            [flMarginRight]="
              disablePostProjectButton ? Margin.NONE : Margin.SMALL
            "
            [color]="LinkColor.INHERIT"
            [underline]="LinkUnderline.NEVER"
            (click)="handleLoginSignupModal(LoginOrSignup.SIGNUP)"
          >
            Sign Up
          </fl-link>
          <ng-container *ngIf="!disablePostProjectButton">
            <fl-bit
              *ngIf="!alternateNavigation"
              class="NavigationItem"
              [flHideMobile]="true"
            >
              <fl-button
                i18n="Navigation post project button"
                flTrackingLabel="PostProjectButton"
                [color]="ButtonColor.PRIMARY"
                [link]="'/post-project'"
              >
                Post a Project
              </fl-button>
            </fl-bit>
            <fl-bit
              *ngIf="alternateNavigation && alternateNavigation.contactLink"
              class="NavigationItem"
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
        </fl-bit>
      </fl-container>
    </fl-bit>
  `,
  styleUrls: ['./navigation-logged-out.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationLoggedOutComponent implements OnInit {
  BackgroundColor = BackgroundColor;
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  TextSize = TextSize;
  IconColor = IconColor;
  LinkColor = LinkColor;
  LinkUnderline = LinkUnderline;
  LoginOrSignup = LoginOrSignup;
  LogoSize = LogoSize;
  Margin = Margin;

  loginSignupModal: boolean;
  size: ContainerSize;
  alternateNavigation: NavigationAlternate;

  @Input() set containerSize(value: ContainerSize) {
    this.size = value || ContainerSize.DESKTOP_LARGE;
  }
  @Input() set useLoginSignupModal(value: boolean) {
    this.loginSignupModal = value || false;
  }
  @Input() set navigationAlternate(value: NavigationAlternate) {
    this.alternateNavigation = value || false;
  }

  @Input() disablePostProjectButton = false;

  @Input() transparent = false;

  redirectUrl$: Rx.Observable<string>;

  constructor(
    private modalService: ModalService,
    private router: Router,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.redirectUrl$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url),
      filter(url => new URL(`${this.location.origin}${url}`).pathname !== '/'),
    );
  }

  handleLoginSignupModal(loginOrSignup: LoginOrSignup) {
    if (this.loginSignupModal) {
      this.modalService.open(LoginSignupModalComponent, {
        inputs: {
          form: loginOrSignup,
        },
        size: ModalSize.XSMALL,
        edgeToEdge: true,
        closeable: true,
        mobileFullscreen: true,
      });
    }
  }
}
