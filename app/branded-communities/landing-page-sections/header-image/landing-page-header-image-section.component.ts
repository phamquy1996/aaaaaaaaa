import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Assets } from '@freelancer/ui/assets';
import { ButtonSize } from '@freelancer/ui/button';
import {
  HeadingColor,
  HeadingType,
  HeadingWeight,
} from '@freelancer/ui/heading';
import { BackgroundColor, LogoSize } from '@freelancer/ui/logo';
import { Margin } from '@freelancer/ui/margin';
import {
  SectionHeroAlignment,
  SectionHeroContentWidth,
  SectionHeroHeight,
} from '@freelancer/ui/section-hero';
import { TextSize } from '@freelancer/ui/text';

export enum LandingPageHeroImages {
  LANDING = 'hero-landing',
  FIND_TALENT = 'hero-find-talent',
  BECOME_CERTIFIED = 'hero-become-certified',
}

export enum Company {
  FACEBOOK = 'facebook',
  GOOGLE = 'google',
}

@Component({
  selector: 'app-landing-page-header-image-section',
  template: `
    <fl-section-hero
      class="Hero"
      [alignment]="SectionHeroAlignment.CENTER"
      [contentWidth]="SectionHeroContentWidth.LARGE"
      [height]="SectionHeroHeight.SMALL"
      [flHideDesktop]="true"
      [flHideTablet]="true"
      [ngStyle]="{
        backgroundImage: ' url(' + backgroundImage + ')'
      }"
    >
      <fl-section-hero-detail-text>
        <fl-bit class="Hero-logoWrapper" [flMarginBottom]="Margin.MID">
          <fl-logo
            *ngIf="!hideFlnLogo"
            [backgroundColor]="BackgroundColor.DARK"
            [flMarginRight]="Margin.XSMALL"
            [size]="LogoSize.SMALL"
          ></fl-logo>
          <ng-content select="[mobile-header-image]"></ng-content>
        </fl-bit>
      </fl-section-hero-detail-text>
      <fl-heading
        [color]="HeadingColor.LIGHT"
        [headingType]="HeadingType.H2"
        [flMarginBottom]="Margin.MID"
        [size]="TextSize.XXLARGE"
      >
        <ng-content select="[mobile-header-title]"></ng-content>
      </fl-heading>
      <fl-heading
        [color]="HeadingColor.LIGHT"
        [headingType]="HeadingType.H3"
        [flMarginBottom]="Margin.MID"
        [size]="TextSize.MID"
        [weight]="HeadingWeight.NORMAL"
      >
        <ng-content select="[mobile-header-description]"></ng-content>
      </fl-heading>
      <ng-content select="[header-button]"></ng-content>
    </fl-section-hero>

    <fl-section-hero
      class="Hero"
      [alignment]="SectionHeroAlignment.CENTER"
      [contentWidth]="SectionHeroContentWidth.LARGE"
      [height]="SectionHeroHeight.MEDIUM"
      [flHideMobile]="true"
      [ngStyle]="{
        backgroundImage: ' url(' + backgroundImage + ')'
      }"
    >
      <fl-section-hero-detail-text>
        <fl-bit class="Hero-logoWrapper" [flMarginBottom]="Margin.MID">
          <fl-logo
            *ngIf="!hideFlnLogo"
            [backgroundColor]="BackgroundColor.DARK"
            [flMarginRight]="Margin.XSMALL"
            [size]="LogoSize.MID"
          ></fl-logo>
          <ng-content select="[desktop-header-image]"></ng-content>
        </fl-bit>
      </fl-section-hero-detail-text>
      <fl-heading
        [color]="HeadingColor.LIGHT"
        [headingType]="HeadingType.H1"
        [flMarginBottom]="Margin.LARGE"
        [size]="TextSize.XXXLARGE"
      >
        <ng-content select="[desktop-header-title]"></ng-content>
      </fl-heading>
      <fl-heading
        [color]="HeadingColor.LIGHT"
        [headingType]="HeadingType.H2"
        [flMarginBottom]="Margin.LARGE"
        [size]="TextSize.LARGE"
        [weight]="HeadingWeight.NORMAL"
      >
        <ng-content select="[desktop-header-description]"></ng-content>
      </fl-heading>
    </fl-section-hero>
  `,
  styleUrls: ['./landing-page-header-image-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPageHeaderImageSectionComponent implements OnChanges {
  BackgroundColor = BackgroundColor;
  ButtonSize = ButtonSize;
  HeadingColor = HeadingColor;
  HeadingType = HeadingType;
  TextSize = TextSize;
  HeadingWeight = HeadingWeight;
  LogoSize = LogoSize;
  Margin = Margin;
  SectionHeroAlignment = SectionHeroAlignment;
  SectionHeroHeight = SectionHeroHeight;
  SectionHeroContentWidth = SectionHeroContentWidth;

  @Input() company: Company;
  @Input() image: LandingPageHeroImages;
  @Input() hideFlnLogo = false;

  backgroundImage: string;

  constructor(private assets: Assets) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.backgroundImage = this.assets.getUrl(
      `branded-communities/${this.company}-landing/header/${this.image}.jpg`,
    );
  }
}
