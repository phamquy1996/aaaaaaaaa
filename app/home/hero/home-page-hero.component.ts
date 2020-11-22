import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { ContainerSize } from '@freelancer/ui/container';
import { HeadingColor, HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, FontWeight, TextSize } from '@freelancer/ui/text';
import { UserAgent } from '@freelancer/user-agent';

export interface HeroData {
  id: number;
  alt: string;
  mobileImage: string;
  tabletImage: string;
  desktopSmallImage: string;
  desktopLargeImage: string;
  videoUrl: string;
}

@Component({
  selector: 'app-home-page-hero',
  template: `
    <fl-bit
      class="Hero"
      [ngClass]="{ 'Hero-redesign': isRedesign }"
      [flTrackingSection]="'HomepageSplash'"
    >
      <fl-bit class="Overlay">
        <app-hero-image-carousel
          [heroes]="heroes"
          [startPlaying]="errorDetected || isMobile"
          [isRedesign]="isRedesign"
          (indexChanged)="indexChangeImage($event)"
        >
        </app-hero-image-carousel>
        <ng-container *ngIf="!isMobile">
          <app-home-page-video-hero
            *ngIf="!errorDetected"
            [flHideMobile]="true"
            (errorDetected)="errorDetected = true"
            (indexChanged)="indexChangeVideo($event)"
          >
          </app-home-page-video-hero>
        </ng-container>
      </fl-bit>
      <fl-container class="Hero-content" [size]="ContainerSize.DESKTOP_LARGE">
        <fl-bit
          class="Hero-content-main"
          [ngClass]="{ 'Hero-content-main-redesign': isRedesign }"
        >
          <fl-bit class="Hero-content-text">
            <fl-heading
              i18n="Home Page Heading"
              [headingType]="HeadingType.H1"
              [color]="HeadingColor.LIGHT"
              [size]="isRedesign ? TextSize.XXLARGE : TextSize.XLARGE"
              [flShowMobile]="true"
              [flMarginBottom]="isRedesign ? Margin.XSMALL : Margin.MID"
            >
              Hire the best freelancers for any job, online.
            </fl-heading>
            <fl-heading
              i18n="Home Page Heading"
              [headingType]="HeadingType.H1"
              [color]="HeadingColor.LIGHT"
              [size]="TextSize.XXLARGE"
              [flHideMobile]="true"
              [flShowTablet]="true"
              [flHideDesktop]="true"
              [flMarginBottom]="Margin.MID"
            >
              Hire the best freelancers for any job, online.
            </fl-heading>
            <fl-heading
              i18n="Home Page Heading"
              [headingType]="HeadingType.H1"
              [color]="HeadingColor.LIGHT"
              [size]="TextSize.XXLARGE"
              [flShowDesktop]="true"
              [flHideDesktopLarge]="true"
              [flMarginBottom]="Margin.MID"
            >
              Hire the best freelancers for any job, online.
            </fl-heading>
            <fl-heading
              i18n="Home Page Heading"
              [headingType]="HeadingType.H1"
              [color]="HeadingColor.LIGHT"
              [size]="TextSize.XXXLARGE"
              [flShowDesktopLarge]="true"
              [flMarginBottom]="Margin.MID"
            >
              Hire the best freelancers for any job, online.
            </fl-heading>
            <fl-text
              i18n="Home Page subheading"
              [color]="FontColor.LIGHT"
              [size]="TextSize.MID"
              [flMarginBottom]="isRedesign ? Margin.SMALL : Margin.MID"
              [flMarginBottomTablet]="Margin.MID"
            >
              Millions of people use freelancer.com to turn their ideas into
              reality.
            </fl-text>
            <fl-bit class="Hero-content-description-container">
              <fl-text
                class="Hero-content-description"
                i18n="NASA hero description"
                [ngClass]="{ IsShown: currentIndex === 0 }"
                [color]="FontColor.LIGHT"
                [size]="TextSize.SMALL"
                [flHideMobileSmall]="true"
                [flShowMobile]="true"
              >
                This radiation shield design for NASA cost $500 USD and took 15
                days
              </fl-text>
              <fl-text
                class="Hero-content-description"
                i18n="Mobile App hero description"
                [ngClass]="{ IsShown: currentIndex === 1 }"
                [color]="FontColor.LIGHT"
                [size]="TextSize.SMALL"
                [flHideMobileSmall]="true"
                [flShowMobile]="true"
              >
                This mobile app design cost $1500 USD and took 20 days
              </fl-text>
              <fl-text
                class="Hero-content-description"
                i18n="House hero description"
                [ngClass]="{ IsShown: currentIndex === 2 }"
                [color]="FontColor.LIGHT"
                [size]="TextSize.SMALL"
                [flHideMobileSmall]="true"
                [flShowMobile]="true"
              >
                This architectural design cost $500 USD and took 15 days
              </fl-text>
              <fl-text
                class="Hero-content-description"
                i18n="Illustration hero description"
                [ngClass]="{ IsShown: currentIndex === 3 }"
                [color]="FontColor.LIGHT"
                [size]="TextSize.SMALL"
                [flHideMobileSmall]="true"
                [flShowMobile]="true"
              >
                This illustration cost $100 USD and took 5 days
              </fl-text>
            </fl-bit>
          </fl-bit>
          <fl-bit [flShowMobile]="true">
            <fl-button
              i18n="Hire a Freelancer button text"
              [size]="ButtonSize.XLARGE"
              [color]="ButtonColor.PRIMARY_PINK"
              [link]="'/post-project'"
              [flMarginRightTablet]="Margin.SMALL"
              [flMarginRightDesktop]="Margin.SMALL"
              [flMarginBottom]="Margin.SMALL"
              [flMarginBottomTablet]="Margin.NONE"
              [flMarginBottomDesktop]="Margin.NONE"
              [flTrackingLabel]="'RedirectToPPP'"
              [display]="'block'"
            >
              Hire a Freelancer
            </fl-button>
            <fl-button
              i18n="Earn Money Freelancing button text"
              [size]="ButtonSize.XLARGE"
              [color]="ButtonColor.TRANSPARENT_LIGHT"
              [link]="'/signup'"
              [flTrackingLabel]="'RedirectToSignup'"
              [display]="'block'"
            >
              Earn Money Freelancing
            </fl-button>
          </fl-bit>
          <fl-bit [flHideMobile]="true" class="CallToActionButtons">
            <fl-bit
              [flMarginRightTablet]="Margin.SMALL"
              [flMarginRightDesktop]="Margin.SMALL"
            >
              <fl-button
                class="Ctas-button"
                i18n="Hire a Freelancer button text"
                [size]="ButtonSize.XLARGE"
                [color]="ButtonColor.PRIMARY_PINK"
                [link]="'/post-project'"
                [flTrackingLabel]="'RedirectToPPP'"
                [display]="'inline'"
              >
                Hire a Freelancer
              </fl-button>
            </fl-bit>
            <fl-button
              class="Ctas-button"
              i18n="Earn Money Freelancing button text"
              [size]="ButtonSize.XLARGE"
              [color]="ButtonColor.TRANSPARENT_LIGHT"
              [link]="'/signup'"
              [flTrackingLabel]="'RedirectToSignup'"
              [display]="'inline'"
            >
              Earn Money Freelancing
            </fl-button>
          </fl-bit>
        </fl-bit>
      </fl-container>
      <fl-text
        class="Hero-content-description"
        i18n="NASA hero description"
        [ngClass]="{ IsShown: currentIndex === 0 }"
        [color]="FontColor.LIGHT"
        [size]="TextSize.MID"
        [weight]="FontWeight.BOLD"
        [flShowDesktop]="true"
      >
        This radiation shield design for NASA cost $500 USD and took 15 days
      </fl-text>
      <fl-text
        class="Hero-content-description"
        i18n="Mobile App hero description"
        [ngClass]="{ IsShown: currentIndex === 1 }"
        [color]="FontColor.LIGHT"
        [size]="TextSize.MID"
        [weight]="FontWeight.BOLD"
        [flShowDesktop]="true"
      >
        This mobile app design cost $1500 USD and took 20 days
      </fl-text>
      <fl-text
        class="Hero-content-description"
        i18n="House hero description"
        [ngClass]="{ IsShown: currentIndex === 2 }"
        [color]="FontColor.LIGHT"
        [size]="TextSize.MID"
        [weight]="FontWeight.BOLD"
        [flShowDesktop]="true"
      >
        This architectural design cost $500 USD and took 15 days
      </fl-text>
      <fl-text
        class="Hero-content-description"
        i18n="Illustration hero description"
        [ngClass]="{ IsShown: currentIndex === 3 }"
        [color]="FontColor.LIGHT"
        [size]="TextSize.MID"
        [weight]="FontWeight.BOLD"
        [flShowDesktop]="true"
      >
        This illustration cost $100 USD and took 5 days
      </fl-text>
    </fl-bit>
  `,
  styleUrls: ['./home-page-hero.component.scss'],
})
export class HomePageHeroComponent implements OnInit {
  ContainerSize = ContainerSize;
  FontColor = FontColor;
  Margin = Margin;
  TextSize = TextSize;
  FontWeight = FontWeight;
  HeadingType = HeadingType;
  HeadingColor = HeadingColor;
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;

  heroes: ReadonlyArray<HeroData>;
  currentIndex = 0;
  errorDetected = false;
  isMobile = true;

  @Input() isRedesign: boolean;

  constructor(
    private userAgent: UserAgent,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = this.userAgent.isMobileDevice();
    }
    this.heroes = [
      {
        id: 0,
        alt: 'Radiation Shield Design for NASA',
        mobileImage: 'home/hero/nasa-mobile.jpg',
        tabletImage: 'home/hero/nasa-675.jpg',
        desktopSmallImage: 'home/hero/nasa-850.jpg',
        desktopLargeImage: 'home/hero/nasa-1080.jpg',
        videoUrl: '',
      },
      {
        id: 1,
        alt: 'Mobile App Design',
        mobileImage: 'home/hero/mobile-phone-mobile.jpg',
        tabletImage: 'home/hero/mobile-phone-675.jpg',
        desktopSmallImage: 'home/hero/mobile-phone-850.jpg',
        desktopLargeImage: 'home/hero/mobile-phone-1080.jpg',
        videoUrl: '',
      },
      {
        id: 2,
        alt: 'Architectural Design',
        mobileImage: 'home/hero/house-mobile.jpg',
        tabletImage: 'home/hero/house-675.jpg',
        desktopSmallImage: 'home/hero/house-850.jpg',
        desktopLargeImage: 'home/hero/house-1080.jpg',
        videoUrl: '',
      },
      {
        id: 3,
        alt: 'Magazine Illustration',
        mobileImage: 'home/hero/magazine-mobile.jpg',
        tabletImage: 'home/hero/magazine-675.jpg',
        desktopSmallImage: 'home/hero/magazine-850.jpg',
        desktopLargeImage: 'home/hero/magazine-1080.jpg',
        videoUrl: '',
      },
    ];
  }

  indexChangeVideo($event: number) {
    if (!this.errorDetected) {
      this.currentIndex = $event;
    }
  }
  indexChangeImage($event: number) {
    if (this.errorDetected || this.isMobile) {
      this.currentIndex = $event;
    }
  }
}
