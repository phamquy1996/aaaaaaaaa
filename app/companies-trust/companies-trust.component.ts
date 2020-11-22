import { Component } from '@angular/core';
import {
  CarouselArrowPosition,
  CarouselScrollBehaviour,
} from '@freelancer/ui/carousel';
import { IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { PictureObjectFit } from '@freelancer/ui/picture';
import { FontColor, TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'app-companies-trust-logo',
  template: `
    <fl-bit class="CompaniesTrust">
      <fl-text
        class="CompaniesTrust-text"
        i18n="As used by text"
        [size]="TextSize.SMALL"
        [sizeTablet]="TextSize.MID"
        [color]="FontColor.MID"
        [flMarginBottom]="Margin.SMALL"
        [flMarginBottomTablet]="Margin.NONE"
        [flMarginRightTablet]="Margin.MID"
        [flMarginRightDesktop]="Margin.XLARGE"
      >
        As used by
      </fl-text>
      <fl-bit class="CompaniesTrust-companies">
        <fl-bit
          class="CompaniesTrust-companies-list"
          [flMarginBottom]="Margin.SMALL"
          [flMarginBottomTablet]="Margin.NONE"
          [flHideMobile]="true"
        >
          <ng-container *ngTemplateOutlet="amazonImage"></ng-container>
          <ng-container *ngTemplateOutlet="facebookImage"></ng-container>
          <ng-container *ngTemplateOutlet="deloitteImage"></ng-container>
          <ng-container *ngTemplateOutlet="novoImage"></ng-container>
          <ng-container *ngTemplateOutlet="nasaImage"></ng-container>
          <ng-container *ngTemplateOutlet="ibmImage"></ng-container>
          <ng-container *ngTemplateOutlet="airbusImage"></ng-container>
        </fl-bit>
        <fl-carousel
          [currentIndex]="0"
          [slidesToShow]="3"
          [padding]="4"
          [arrowPosition]="CarouselArrowPosition.OUTSIDE"
          [scrollBehaviour]="CarouselScrollBehaviour.GROUP"
          [flShowMobile]="true"
        >
          <fl-carousel-prev-btn>
            <fl-icon
              class="CarouselArrow"
              [name]="'ui-arrow-left-alt'"
            ></fl-icon>
          </fl-carousel-prev-btn>
          <fl-carousel-item>
            <ng-container *ngTemplateOutlet="amazonImage"></ng-container>
          </fl-carousel-item>
          <fl-carousel-item>
            <ng-container *ngTemplateOutlet="facebookImage"></ng-container>
          </fl-carousel-item>
          <fl-carousel-item>
            <ng-container *ngTemplateOutlet="deloitteImage"></ng-container>
          </fl-carousel-item>
          <fl-carousel-item>
            <ng-container *ngTemplateOutlet="novoImage"></ng-container>
          </fl-carousel-item>
          <fl-carousel-item>
            <ng-container *ngTemplateOutlet="nasaImage"></ng-container>
          </fl-carousel-item>
          <fl-carousel-item>
            <ng-container *ngTemplateOutlet="ibmImage"></ng-container>
          </fl-carousel-item>
          <fl-carousel-item>
            <ng-container *ngTemplateOutlet="airbusImage"></ng-container>
          </fl-carousel-item>
          <fl-carousel-next-btn>
            <fl-icon
              class="CarouselArrow"
              [name]="'ui-arrow-right-alt'"
            ></fl-icon>
          </fl-carousel-next-btn>
        </fl-carousel>
      </fl-bit>
    </fl-bit>
    <ng-template #amazonImage>
      <fl-bit class="CompanyLogo" [flMarginRightDesktop]="Margin.LARGE">
        <fl-picture
          class="CompanyLogo-image"
          alt="Amazon Icon"
          i18n-alt="Amazon Icon Alternative Text"
          [src]="'home/redesign/companies/amazon_logo2.svg'"
          [lazyLoad]="true"
          [boundedWidth]="true"
          [boundedHeight]="true"
          [objectFit]="PictureObjectFit.SCALE_DOWN"
        ></fl-picture>
      </fl-bit>
    </ng-template>
    <ng-template #facebookImage>
      <fl-bit class="CompanyLogo" [flMarginRightDesktop]="Margin.LARGE">
        <fl-picture
          class="CompanyLogo-image"
          alt="Facebook Icon"
          i18n-alt="Facebook Icon Alternative Text"
          [src]="'home/redesign/companies/facebook-corporate-logo2.svg'"
          [lazyLoad]="true"
          [boundedWidth]="true"
          [boundedHeight]="true"
          [objectFit]="PictureObjectFit.SCALE_DOWN"
        ></fl-picture>
      </fl-bit>
    </ng-template>
    <ng-template #deloitteImage>
      <fl-bit class="CompanyLogo" [flMarginRightDesktop]="Margin.LARGE">
        <fl-picture
          class="CompanyLogo-image"
          alt="Deloitte Icon"
          i18n-alt="Deloitte Icon Alternative Text"
          [src]="'home/redesign/companies/deloitte-logo2.svg'"
          [boundedWidth]="true"
          [lazyLoad]="true"
          [boundedHeight]="true"
          [objectFit]="PictureObjectFit.SCALE_DOWN"
        ></fl-picture>
      </fl-bit>
    </ng-template>
    <ng-template #novoImage>
      <fl-bit class="CompanyLogo" [flMarginRightDesktop]="Margin.LARGE">
        <fl-picture
          class="CompanyLogo-image"
          alt="Novo Nordisk Icon"
          i18n-alt="Novo Nordisk Icon Alternative Text"
          [src]="'home/redesign/companies/novo-nordisk-logo2.svg'"
          [lazyLoad]="true"
          [boundedWidth]="true"
          [boundedHeight]="true"
          [objectFit]="PictureObjectFit.SCALE_DOWN"
        ></fl-picture>
      </fl-bit>
    </ng-template>
    <ng-template #nasaImage>
      <fl-bit class="CompanyLogo" [flMarginRightDesktop]="Margin.LARGE">
        <fl-picture
          class="CompanyLogo-image"
          alt="NASA Icon"
          i18n-alt="NASA Icon Alternative Text"
          [src]="'home/redesign/companies/nasa-logo2.svg'"
          [lazyLoad]="true"
          [boundedWidth]="true"
          [boundedHeight]="true"
          [objectFit]="PictureObjectFit.SCALE_DOWN"
        ></fl-picture>
      </fl-bit>
    </ng-template>
    <ng-template #ibmImage>
      <fl-bit class="CompanyLogo" [flMarginRightDesktop]="Margin.LARGE">
        <fl-picture
          class="CompanyLogo-image"
          alt="IBM Icon"
          i18n-alt="IBM Icon Alternative Text"
          [src]="'home/redesign/companies/ibm-logo2.svg'"
          [lazyLoad]="true"
          [boundedWidth]="true"
          [boundedHeight]="true"
          [objectFit]="PictureObjectFit.SCALE_DOWN"
        ></fl-picture>
      </fl-bit>
    </ng-template>
    <ng-template #airbusImage>
      <fl-bit class="CompanyLogo">
        <fl-picture
          class="CompanyLogo-image"
          alt="Facebook Icon"
          i18n-alt="Facebook Icon Alternative Text"
          [src]="'home/redesign/companies/airbus-logo2.svg'"
          [lazyLoad]="true"
          [boundedWidth]="true"
          [boundedHeight]="true"
          [objectFit]="PictureObjectFit.SCALE_DOWN"
        ></fl-picture>
      </fl-bit>
    </ng-template>
  `,
  styleUrls: ['./companies-trust.component.scss'],
})
export class CompaniesTrustComponent {
  CarouselArrowPosition = CarouselArrowPosition;
  CarouselScrollBehaviour = CarouselScrollBehaviour;
  FontColor = FontColor;
  IconSize = IconSize;
  Margin = Margin;
  TextSize = TextSize;
  PictureObjectFit = PictureObjectFit;
}
