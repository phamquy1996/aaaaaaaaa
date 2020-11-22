import { Component } from '@angular/core';
import { ContainerSize } from '@freelancer/ui/container';
import { HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'app-landing-page-apply-section',
  template: `
    <fl-container [size]="ContainerSize.DESKTOP_LARGE">
      <fl-heading
        class="Apply-header"
        [headingType]="HeadingType.H1"
        [flMarginBottom]="Margin.XLARGE"
        [size]="TextSize.LARGE"
        [sizeDesktop]="TextSize.XLARGE"
      >
        <ng-content select="[apply-title]"></ng-content>
      </fl-heading>
      <fl-grid>
        <fl-col
          class="Apply-item"
          [col]="12"
          [colTablet]="6"
          [colDesktopSmall]="3"
          [flMarginBottom]="Margin.XLARGE"
        >
          <fl-bit class="Apply-icon" [flMarginBottom]="Margin.LARGE">
            <ng-content select="[first-card-picture]"></ng-content>
          </fl-bit>
          <fl-text class="Apply-cardDescription" [size]="TextSize.SMALL">
            <ng-content select="[first-card-description]"></ng-content>
          </fl-text>
        </fl-col>
        <fl-col
          class="Apply-item"
          [col]="12"
          [colTablet]="6"
          [colDesktopSmall]="3"
          [flMarginBottom]="Margin.XLARGE"
        >
          <fl-bit class="Apply-icon" [flMarginBottom]="Margin.LARGE">
            <ng-content select="[second-card-picture]"></ng-content>
          </fl-bit>
          <fl-text class="Apply-cardDescription" [size]="TextSize.SMALL">
            <ng-content select="[second-card-description]"></ng-content>
          </fl-text>
        </fl-col>
        <fl-col
          class="Apply-item"
          [col]="12"
          [colTablet]="6"
          [colDesktopSmall]="3"
          [flMarginBottom]="Margin.XLARGE"
        >
          <fl-bit class="Apply-icon" [flMarginBottom]="Margin.LARGE">
            <ng-content select="[third-card-picture]"></ng-content>
          </fl-bit>
          <fl-text class="Apply-cardDescription" [size]="TextSize.SMALL">
            <ng-content select="[third-card-description]"></ng-content>
          </fl-text>
        </fl-col>
        <fl-col
          class="Apply-item"
          [col]="12"
          [colTablet]="6"
          [colDesktopSmall]="3"
          [flMarginBottom]="Margin.XLARGE"
        >
          <fl-bit class="Apply-icon" [flMarginBottom]="Margin.LARGE">
            <ng-content select="[fourth-card-picture]"></ng-content>
          </fl-bit>
          <fl-text class="Apply-cardDescription" [size]="TextSize.SMALL">
            <ng-content select="[fourth-card-description]"></ng-content>
          </fl-text>
        </fl-col>
      </fl-grid>
    </fl-container>
  `,
  styleUrls: ['./landing-page-apply-section.component.scss'],
})
export class LandingPageApplySectionComponent {
  ContainerSize = ContainerSize;
  HeadingType = HeadingType;
  TextSize = TextSize;
  Margin = Margin;
}
