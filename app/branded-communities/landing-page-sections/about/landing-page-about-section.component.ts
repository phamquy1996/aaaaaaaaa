import { Component, Input } from '@angular/core';
import { ContainerSize } from '@freelancer/ui/container';
import { HeadingType, HeadingWeight } from '@freelancer/ui/heading';
import { LogoSize } from '@freelancer/ui/logo';
import { Margin } from '@freelancer/ui/margin';
import { FontType, FontWeight, TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'app-landing-page-about-section',
  template: `
    <fl-container [size]="ContainerSize.DESKTOP_LARGE">
      <fl-logo
        *ngIf="showFlLogo"
        class="About-logo"
        [size]="LogoSize.MID"
        [flMarginBottom]="Margin.LARGE"
      ></fl-logo>
      <fl-grid>
        <fl-col class="About-header" [col]="12">
          <fl-container [size]="ContainerSize.TABLET">
            <fl-heading
              [size]="TextSize.XLARGE"
              [headingType]="HeadingType.H2"
              [flMarginBottom]="Margin.LARGE"
            >
              <ng-content select="[about-title]"></ng-content>
            </fl-heading>
            <fl-text [flMarginBottom]="Margin.XXXLARGE">
              <ng-content select="[about-description]"></ng-content>
            </fl-text>
          </fl-container>
        </fl-col>
        <fl-col class="About-item" [col]="12" [colTablet]="4">
          <fl-bit class="About-icon">
            <ng-content select="[left-card-picture]"></ng-content>
          </fl-bit>
          <fl-text
            class="About-cardHeader"
            [fontType]="FontType.PARAGRAPH"
            [weight]="FontWeight.BOLD"
            [flMarginBottom]="Margin.SMALL"
          >
            <ng-content select="[left-card-header]"></ng-content>
          </fl-text>
          <fl-text
            class="About-cardDescription"
            [flMarginBottom]="Margin.LARGE"
          >
            <ng-content select="[left-card-description]"></ng-content>
          </fl-text>
        </fl-col>
        <fl-col class="About-item" [col]="12" [colTablet]="4">
          <fl-bit class="About-icon">
            <ng-content select="[middle-card-picture]"></ng-content>
          </fl-bit>
          <fl-text
            class="About-cardHeader"
            [fontType]="FontType.PARAGRAPH"
            [weight]="FontWeight.BOLD"
            [flMarginBottom]="Margin.SMALL"
          >
            <ng-content select="[middle-card-header]"></ng-content>
          </fl-text>
          <fl-text
            class="About-cardDescription"
            [flMarginBottom]="Margin.LARGE"
          >
            <ng-content select="[middle-card-description]"></ng-content>
          </fl-text>
        </fl-col>
        <fl-col class="About-item" [col]="12" [colTablet]="4">
          <fl-bit class="About-icon">
            <ng-content select="[right-card-picture]"></ng-content>
          </fl-bit>
          <fl-text
            class="About-cardHeader"
            [fontType]="FontType.PARAGRAPH"
            [weight]="FontWeight.BOLD"
            [flMarginBottom]="Margin.SMALL"
          >
            <ng-content
              select="[right-card-header]"
              [flMarginBottom]="Margin.LARGE"
            ></ng-content>
          </fl-text>
          <fl-text class="About-cardDescription">
            <ng-content select="[right-card-description]"></ng-content>
          </fl-text>
        </fl-col>
      </fl-grid>
      <fl-container> </fl-container
    ></fl-container>
  `,
  styleUrls: ['./landing-page-about-section.component.scss'],
})
export class LandingPageAboutSectionComponent {
  ContainerSize = ContainerSize;
  TextSize = TextSize;
  HeadingType = HeadingType;
  FontWeight = FontWeight;
  HeadingWeight = HeadingWeight;
  LogoSize = LogoSize;
  Margin = Margin;
  FontType = FontType;

  @Input() showFlLogo = false;
}
