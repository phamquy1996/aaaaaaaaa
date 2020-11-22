import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Inject,
  Input,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { Datastore } from '@freelancer/datastore';
import { SiteStatsCollection } from '@freelancer/datastore/collections';
import { Feature } from '@freelancer/feature-flags';
import { LanguageSwitcherTheme } from '@freelancer/language-switcher';
import { Localization } from '@freelancer/localization';
import { TimeUtils } from '@freelancer/time-utils';
import { ContainerSize } from '@freelancer/ui/container';
import { HorizontalAlignment, VerticalAlignment } from '@freelancer/ui/grid';
import { IconColor } from '@freelancer/ui/icon';
import { LinkColor, LinkHoverColor } from '@freelancer/ui/link';
import { BackgroundColor, LogoSize } from '@freelancer/ui/logo';
import { Margin } from '@freelancer/ui/margin';
import { PictureDisplay } from '@freelancer/ui/picture';
import { SocialButtonColor } from '@freelancer/ui/social-buttons';
import { FontColor, FontType, FontWeight, TextSize } from '@freelancer/ui/text';
import * as Rx from 'rxjs';
import {
  map,
  mapTo,
  publishReplay,
  refCount,
  startWith,
  switchMap,
} from 'rxjs/operators';

@Component({
  selector: 'app-footer-freelancer',
  template: `
    <div class="FooterSection" flTrackingSection="Footer">
      <fl-container [size]="size">
        <fl-grid>
          <fl-col [colDesktopSmall]="4">
            <fl-bit
              class="FooterInfo"
              [flMarginBottom]="Margin.SMALL"
              [flMarginBottomTablet]="Margin.LARGE"
            >
              <fl-link [link]="'/'" [flTrackingLabel]="'flLogo'">
                <fl-logo
                  [size]="LogoSize.SMALL"
                  [backgroundColor]="BackgroundColor.DARK"
                >
                </fl-logo>
              </fl-link>
            </fl-bit>

            <fl-bit class="FooterInfo" [flMarginBottom]="Margin.SMALL">
              <fl-text>
                <fl-language-switcher
                  [color]="LanguageSwitcherTheme.LIGHT"
                ></fl-language-switcher>
              </fl-text>
            </fl-bit>
            <fl-bit class="FooterInfo" [flMarginBottom]="Margin.SMALL">
              <fl-icon
                class="FooterInfoIcon"
                [name]="'ui-help'"
                [color]="IconColor.LIGHT"
                [flMarginRight]="Margin.XSMALL"
              >
              </fl-icon>
              <fl-link
                i18n="Footer link label"
                [link]="'/support'"
                [color]="LinkColor.LIGHT"
                [hoverColor]="LinkHoverColor.LIGHT"
                [flTrackingLabel]="'goToSupport'"
              >
                Help & Support
              </fl-link>
            </fl-bit>
          </fl-col>

          <fl-col [colTablet]="3" [colDesktopSmall]="2">
            <fl-text
              class="FooterTitle"
              i18n="Footer column title"
              [fontType]="FontType.SPAN"
              [color]="FontColor.LIGHT"
              [size]="TextSize.SMALL"
              [weight]="FontWeight.BOLD"
              [flMarginBottom]="Margin.XSMALL"
            >
              Freelancer
            </fl-text>
            <fl-bit class="FooterNav" [flMarginBottom]="Margin.SMALL">
              <fl-bit [flMarginBottom]="Margin.XXXSMALL">
                <fl-link
                  *flFeature="Feature.DEPRECATED_SEARCH_PAGES"
                  link="/job"
                  i18n="Footer link label"
                  [color]="LinkColor.MID"
                  [hoverColor]="LinkHoverColor.LIGHT"
                  [flTrackingLabel]="'goToJob'"
                >
                  Categories
                </fl-link>
              </fl-bit>
              <fl-bit [flMarginBottom]="Margin.XXXSMALL">
                <fl-link
                  *flFeature="
                    Feature.DEPRECATED_SEARCH_PAGES;
                    else newSearchProjectsLink
                  "
                  link="/jobs"
                  i18n="Footer link label"
                  [color]="LinkColor.MID"
                  [hoverColor]="LinkHoverColor.LIGHT"
                  [flTrackingLabel]="'goToJobs'"
                >
                  Projects
                </fl-link>
                <ng-template #newSearchProjectsLink>
                  <fl-link
                    *flFeature="Feature.SEARCH"
                    i18n="Footer link label"
                    flTrackingLabel="goToJobs"
                    [color]="LinkColor.MID"
                    [hoverColor]="LinkHoverColor.LIGHT"
                    [link]="'/search/projects'"
                  >
                    Projects
                  </fl-link>
                </ng-template>
              </fl-bit>
              <fl-bit [flMarginBottom]="Margin.XXXSMALL">
                <fl-link
                  *flFeature="Feature.CONTESTS"
                  link="/contest"
                  i18n="Footer link label"
                  [color]="LinkColor.MID"
                  [hoverColor]="LinkHoverColor.LIGHT"
                  [flTrackingLabel]="'goToContest'"
                >
                  Contests
                </fl-link>
              </fl-bit>
              <fl-bit [flMarginBottom]="Margin.XXXSMALL">
                <fl-link
                  *flFeature="
                    Feature.DEPRECATED_SEARCH_PAGES;
                    else newSearchFreelancersLink
                  "
                  link="/freelancers"
                  i18n="Footer link label"
                  [color]="LinkColor.MID"
                  [hoverColor]="LinkHoverColor.LIGHT"
                  [flTrackingLabel]="'goToFreelancers'"
                >
                  Freelancers
                </fl-link>
                <ng-template #newSearchFreelancersLink>
                  <fl-link
                    *flFeature="Feature.SEARCH"
                    flTrackingLabel="goToJobs"
                    i18n="Footer link label"
                    [color]="LinkColor.MID"
                    [hoverColor]="LinkHoverColor.LIGHT"
                    [link]="'/search/users'"
                  >
                    Freelancers
                  </fl-link>
                </ng-template>
              </fl-bit>
              <fl-bit [flMarginBottom]="Margin.XXXSMALL">
                <fl-link
                  *flFeature="Feature.ENTERPRISE_PAGE"
                  link="/enterprise/"
                  i18n="Footer link label"
                  [color]="LinkColor.MID"
                  [hoverColor]="LinkHoverColor.LIGHT"
                  [flTrackingLabel]="'goToEnterprise'"
                >
                  Enterprise
                </fl-link>
              </fl-bit>
              <fl-bit [flMarginBottom]="Margin.XXXSMALL">
                <fl-link
                  *flFeature="Feature.PREFERRED_FREELANCER_PROGRAM"
                  link="/preferred-freelancer-program"
                  i18n="Footer link label"
                  [color]="LinkColor.MID"
                  [hoverColor]="LinkHoverColor.LIGHT"
                  [flTrackingLabel]="'goToPreferredFreelancerProgram'"
                >
                  Preferred Freelancer Program
                </fl-link>
              </fl-bit>
              <fl-bit [flMarginBottom]="Margin.XXXSMALL">
                <fl-link
                  *flFeature="Feature.PROJECT_MANAGEMENT_PAGE"
                  link="/project-management"
                  i18n="Footer link label"
                  [color]="LinkColor.MID"
                  [hoverColor]="LinkHoverColor.LIGHT"
                  [flTrackingLabel]="'goToProjectManager'"
                >
                  Project Management
                </fl-link>
              </fl-bit>
              <fl-bit [flMarginBottom]="Margin.XXXSMALL">
                <fl-link
                  *flFeature="Feature.LOCAL_JOBS"
                  link="/local"
                  i18n="Footer link label"
                  [color]="LinkColor.MID"
                  [hoverColor]="LinkHoverColor.LIGHT"
                  [flTrackingLabel]="'goToLocal'"
                >
                  Local Jobs
                </fl-link>
              </fl-bit>
              <fl-bit [flMarginBottom]="Margin.XXXSMALL">
                <fl-link
                  *flFeature="Feature.SHOWCASE"
                  link="/showcase"
                  i18n="Footer link label"
                  [color]="LinkColor.MID"
                  [hoverColor]="LinkHoverColor.LIGHT"
                  [flTrackingLabel]="'goToShowcase'"
                >
                  Showcase
                </fl-link>
              </fl-bit>
              <fl-bit [flMarginBottom]="Margin.XXXSMALL">
                <fl-link
                  link="https://developers.freelancer.com"
                  i18n="Footer link label"
                  [color]="LinkColor.MID"
                  [hoverColor]="LinkHoverColor.LIGHT"
                  [flTrackingLabel]="'goToApi'"
                >
                  API for Developers
                </fl-link>
              </fl-bit>
              <fl-bit [flMarginBottom]="Margin.XXXSMALL">
                <fl-link
                  link="/verified"
                  i18n="Footer link label"
                  [color]="LinkColor.MID"
                  [hoverColor]="LinkHoverColor.LIGHT"
                  [flTrackingLabel]="'goToVerified'"
                >
                  Get Verified
                </fl-link>
              </fl-bit>
            </fl-bit>
          </fl-col>

          <fl-col [colTablet]="3" [colDesktopSmall]="2">
            <fl-text
              class="FooterTitle"
              i18n="Footer column title"
              [fontType]="FontType.SPAN"
              [color]="FontColor.LIGHT"
              [size]="TextSize.SMALL"
              [weight]="FontWeight.BOLD"
              [flMarginBottom]="Margin.XSMALL"
            >
              About
            </fl-text>
            <fl-bit class="FooterNav" [flMarginBottom]="Margin.SMALL">
              <fl-bit [flMarginBottom]="Margin.XXXSMALL">
                <fl-link
                  link="/about"
                  i18n="Footer link label"
                  [color]="LinkColor.MID"
                  [hoverColor]="LinkHoverColor.LIGHT"
                  [flTrackingLabel]="'goToAbout'"
                >
                  About us
                </fl-link>
              </fl-bit>
              <fl-bit [flMarginBottom]="Margin.XXXSMALL">
                <fl-link
                  *flFeature="Feature.HOW_IT_WORKS_PAGE"
                  link="/info/how-it-works/"
                  i18n="Footer link label"
                  [color]="LinkColor.MID"
                  [hoverColor]="LinkHoverColor.LIGHT"
                  [flTrackingLabel]="'goToHowItWorks'"
                >
                  How it Works
                </fl-link>
              </fl-bit>
              <fl-bit [flMarginBottom]="Margin.XXXSMALL">
                <fl-link
                  link="/about/security"
                  i18n="Footer link label"
                  [color]="LinkColor.MID"
                  [hoverColor]="LinkHoverColor.LIGHT"
                  [flTrackingLabel]="'goToSecurity'"
                >
                  Security
                </fl-link>
              </fl-bit>
              <fl-bit [flMarginBottom]="Margin.XXXSMALL">
                <fl-link
                  link="/investor"
                  i18n="Footer link label"
                  [color]="LinkColor.MID"
                  [hoverColor]="LinkHoverColor.LIGHT"
                  [flTrackingLabel]="'goToInvestor'"
                >
                  Investor
                </fl-link>
              </fl-bit>
              <fl-bit [flMarginBottom]="Margin.XXXSMALL">
                <fl-link
                  *flFeature="Feature.SITE_MAP"
                  link="/sitemap"
                  i18n="Footer link label"
                  [color]="LinkColor.MID"
                  [hoverColor]="LinkHoverColor.LIGHT"
                  [flTrackingLabel]="'goToSitemap'"
                >
                  Sitemap
                </fl-link>
              </fl-bit>
              <fl-bit [flMarginBottom]="Margin.XXXSMALL">
                <fl-link
                  link="/about/quotes"
                  i18n="Footer link label"
                  [color]="LinkColor.MID"
                  [hoverColor]="LinkHoverColor.LIGHT"
                  [flTrackingLabel]="'goToQuotes'"
                >
                  Quotes
                </fl-link>
              </fl-bit>
              <fl-bit [flMarginBottom]="Margin.XXXSMALL">
                <fl-link
                  link="/about/media"
                  i18n="Footer link label"
                  [color]="LinkColor.MID"
                  [hoverColor]="LinkHoverColor.LIGHT"
                  [flTrackingLabel]="'goToInTheNews'"
                >
                  News
                </fl-link>
              </fl-bit>
            </fl-bit>
          </fl-col>
          <fl-col [colTablet]="3" [colDesktopSmall]="2">
            <fl-text
              class="FooterTitle"
              i18n="Footer column title"
              [fontType]="FontType.SPAN"
              [color]="FontColor.LIGHT"
              [size]="TextSize.SMALL"
              [weight]="FontWeight.BOLD"
              [flMarginBottom]="Margin.XSMALL"
            >
              Terms
            </fl-text>
            <fl-bit class="FooterNav" [flMarginBottom]="Margin.SMALL">
              <fl-bit [flMarginBottom]="Margin.XXXSMALL">
                <fl-link
                  link="/about/privacy"
                  i18n="Footer link label"
                  [color]="LinkColor.MID"
                  [hoverColor]="LinkHoverColor.LIGHT"
                  [flTrackingLabel]="'goToPrivacy'"
                >
                  Privacy Policy
                </fl-link>
              </fl-bit>
              <fl-bit [flMarginBottom]="Margin.XXXSMALL">
                <fl-link
                  link="/about/terms"
                  i18n="Footer link label"
                  [color]="LinkColor.MID"
                  [hoverColor]="LinkHoverColor.LIGHT"
                  [flTrackingLabel]="'goToTerms'"
                >
                  Terms and Conditions
                </fl-link>
              </fl-bit>
              <fl-bit [flMarginBottom]="Margin.XXXSMALL">
                <fl-link
                  link="/dmca"
                  i18n="Footer link label"
                  [color]="LinkColor.MID"
                  [hoverColor]="LinkHoverColor.LIGHT"
                  [flTrackingLabel]="'goToCopyright'"
                >
                  Copyright Policy
                </fl-link>
              </fl-bit>
              <fl-bit [flMarginBottom]="Margin.XXXSMALL">
                <fl-link
                  link="/info/codeofconduct"
                  i18n="Footer link label"
                  [color]="LinkColor.MID"
                  [hoverColor]="LinkHoverColor.LIGHT"
                  [flTrackingLabel]="'goToCodeOfConduct'"
                >
                  Code of Conduct
                </fl-link>
              </fl-bit>
              <fl-bit [flMarginBottom]="Margin.XXXSMALL">
                <fl-link
                  *flFeature="Feature.BILLING"
                  link="/feesandcharges"
                  i18n="Footer link label"
                  [color]="LinkColor.MID"
                  [hoverColor]="LinkHoverColor.LIGHT"
                  [flTrackingLabel]="'goToFeesAndCharges'"
                >
                  Fees and Charges
                </fl-link>
              </fl-bit>
            </fl-bit>
          </fl-col>
          <fl-col
            *flFeature="Feature.FREELANCER_APPS"
            [colTablet]="3"
            [colDesktopSmall]="2"
          >
            <fl-text
              class="FooterTitle"
              i18n="Footer column title"
              [fontType]="FontType.SPAN"
              [color]="FontColor.LIGHT"
              [size]="TextSize.SMALL"
              [weight]="FontWeight.BOLD"
              [flMarginBottom]="Margin.XSMALL"
            >
              Apps
            </fl-text>
            <fl-bit class="FooterAppStoreIcons">
              <fl-link
                class="FooterMobileLink"
                [link]="'https://bnc.lt/Ed5l/VcovUszaWr'"
                [flMarginBottom]="Margin.MID"
                [flMarginRight]="Margin.SMALL"
                [flMarginRightTablet]="Margin.NONE"
                [flTrackingLabel]="'goToIOsApp'"
              >
                <fl-picture
                  alt="Apple App Store logo"
                  i18n-alt="Footer App Install logo alt text"
                  [src]="'footer/app-store.svg'"
                  [display]="PictureDisplay.BLOCK"
                ></fl-picture>
              </fl-link>
              <fl-link
                class="FooterMobileLink"
                [link]="'https://bnc.lt/Ed5l/VcovUszaWr'"
                [flMarginBottom]="Margin.MID"
                [flTrackingLabel]="'goToIOsApp'"
              >
                <fl-picture
                  alt="Google Play logo"
                  i18n-alt="Footer App Install logo alt text"
                  [src]="'footer/google-play.svg'"
                  [display]="PictureDisplay.BLOCK"
                  class=""
                >
                </fl-picture>
              </fl-link>
            </fl-bit>
            <fl-bit class="FooterSocialIcons">
              <fl-social-buttons
                [color]="SocialButtonColor.LIGHT"
                [fluid]="true"
              ></fl-social-buttons>
            </fl-bit>
          </fl-col>
        </fl-grid>
      </fl-container>
    </div>
    <div class="FooterSection">
      <fl-container [size]="size">
        <fl-grid class="FooterBordered">
          <fl-col
            [col]="3"
            [colTablet]="6"
            [colDesktopSmall]="3"
            [flMarginBottomTablet]="Margin.SMALL"
            [flMarginBottomDesktop]="Margin.NONE"
          >
            <fl-text
              class="FooterStats"
              [color]="FontColor.LIGHT"
              [fontType]="FontType.SPAN"
              [weight]="FontWeight.BOLD"
              [flMarginRight]="Margin.XXSMALL"
            >
              {{ userCount$ | async | number }}
            </fl-text>
            <span class="FooterStatsCopy" i18n="Footer stats label">
              Registered Users
            </span>
          </fl-col>
          <fl-col
            [col]="3"
            [colTablet]="6"
            [colDesktopSmall]="3"
            [flMarginBottomTablet]="Margin.SMALL"
            [flMarginBottomDesktop]="Margin.NONE"
          >
            <fl-text
              class="FooterStats"
              [color]="FontColor.LIGHT"
              [fontType]="FontType.SPAN"
              [weight]="FontWeight.BOLD"
              [flMarginRight]="Margin.XXSMALL"
            >
              {{ projectCount$ | async | number }}
            </fl-text>
            <span class="FooterStatsCopy" i18n="Footer stats label">
              Total Jobs Posted
            </span>
          </fl-col>
          <fl-col [colTablet]="6">
            <!-- don't translate legal text -->
            <fl-text [color]="FontColor.LIGHT" [size]="TextSize.XXXSMALL">
              {{
                'Freelancer &reg; is a registered Trademark of Freelancer Technology Pty Limited (ACN 141 959 042)'
              }}
              {{
                showIndianEntityInfo
                  ? ' &#38; Freelancer Online India Private Limited (CIN U93000HR2011FTC043854)'
                  : ''
              }}
            </fl-text>
            <fl-text [color]="FontColor.LIGHT" [size]="TextSize.XXXSMALL">
              {{ 'Copyright &copy;' }} {{ currentTime | date: 'yyyy' }}
              {{ 'Freelancer Technology Pty Limited (ACN 141 959 042)' }}
            </fl-text>
          </fl-col>
        </fl-grid>
      </fl-container>
    </div>
  `,
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterFreelancerComponent implements OnInit {
  Margin = Margin;
  HorizontalAlignment = HorizontalAlignment;
  VerticalAlignment = VerticalAlignment;
  LogoSize = LogoSize;
  BackgroundColor = BackgroundColor;
  LanguageSwitcherTheme = LanguageSwitcherTheme;
  LinkColor = LinkColor;
  LinkHoverColor = LinkHoverColor;
  IconColor = IconColor;
  PictureDisplay = PictureDisplay;
  SocialButtonColor = SocialButtonColor;
  FontColor = FontColor;
  TextSize = TextSize;
  FontType = FontType;
  FontWeight = FontWeight;
  Feature = Feature;

  readonly currentTime: number = Date.now();
  userCount$: Rx.Observable<number>;
  projectCount$: Rx.Observable<number>;
  size: ContainerSize;
  showIndianEntityInfo: boolean;

  @HostBinding('attr.role')
  @Input()
  role = 'contentinfo';
  @Input() hideFooter: boolean;

  @Input() set containerSize(value: ContainerSize) {
    this.size = value || ContainerSize.DESKTOP_LARGE;
  }

  constructor(
    private datastore: Datastore,
    private timeUtils: TimeUtils,
    private localization: Localization,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit() {
    // Don't render the footer stats on the server
    const siteStats$ = isPlatformBrowser(this.platformId)
      ? this.datastore
          .document<SiteStatsCollection>('siteStats')
          .valueChanges()
          .pipe(publishReplay(1), refCount())
      : Rx.NEVER;

    // Incrementers take the number of user/project created within a day, map
    // it to an interval operator that adds x (mapTo value) to the number, but
    // start off with adding 0 so we get the counter to emit the latest value
    // first.
    const userIncrementer$ = siteStats$.pipe(
      map(counter => counter.userCountPerDay),
      map(countPerDay => 86400000 / countPerDay),
      switchMap(incrementSpeed => this.timeUtils.rxInterval(incrementSpeed)),
      mapTo(1),
      startWith(0),
    );

    const projectIncrementer$ = siteStats$.pipe(
      map(counter => counter.projectCountPerDay),
      map(countPerDay => 86400000 / countPerDay),
      switchMap(incrementSpeed => this.timeUtils.rxInterval(incrementSpeed)),
      mapTo(1),
      startWith(0),
    );

    this.userCount$ = Rx.combineLatest([
      siteStats$.pipe(map(({ userCount }) => userCount)),
      userIncrementer$,
    ]).pipe(map(([userCount, increment]) => userCount + increment));

    this.projectCount$ = Rx.combineLatest([
      siteStats$.pipe(map(({ projectCount }) => projectCount)),
      projectIncrementer$,
    ]).pipe(map(([projectCount, increment]) => projectCount + increment));

    this.showIndianEntityInfo =
      this.localization.countryCode?.toUpperCase() === 'IN';
  }
}
