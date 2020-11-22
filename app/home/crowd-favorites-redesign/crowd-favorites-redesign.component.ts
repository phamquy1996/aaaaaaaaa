import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { CarouselScrollBehaviour } from '@freelancer/ui/carousel';
import { HeadingType } from '@freelancer/ui/heading';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { TextSize } from '@freelancer/ui/text';
import { CrowdFavoriteImageQTS } from './crowd-favorite-carousel/crowd-favorites-carousel.types';

export interface CrowdFavorite {
  image: string;
  qtsLabel: string;
  queryParams: {
    skill_category?: number;
    skill_subcategory?: number;
    repost_project_id?: number;
  };
}

@Component({
  selector: 'app-home-page-crowd-favorites-redesign',
  template: `
    <fl-bit class="CrowdFavorites" [flTrackingSection]="'HomePage'">
      <fl-hr [flMarginBottom]="Margin.XXXXLARGE"></fl-hr>
      <fl-bit
        class="CrowdFavorites-header"
        [flMarginBottom]="Margin.LARGE"
        [flMarginBottomTablet]="Margin.MID"
        [flMarginBottomDesktop]="Margin.XXXLARGE"
      >
        <fl-heading
          i18n="Crowd favorites header"
          class="CrowdFavorites-header-text"
          [size]="TextSize.XLARGE"
          [sizeTablet]="TextSize.XXXLARGE"
          [headingType]="HeadingType.H2"
          [flMarginBottom]="Margin.MID"
        >
          Make it real with Freelancer
        </fl-heading>
        <fl-text
          class="CrowdFavorites-description"
          i18n="Header for introducing the most popular projets"
          [size]="TextSize.INHERIT"
          [sizeTablet]="TextSize.LARGE"
        >
          Some inspirations from our most popular categories
        </fl-text>
      </fl-bit>
      <fl-bit [flMarginBottom]="Margin.XXLARGE">
        <app-crowd-favorites-carousel
          [flShowMobile]="true"
          [itemsToShow]="1"
          [imageSources]="imageSources"
          [link]="'/post-project'"
        ></app-crowd-favorites-carousel>
        <app-crowd-favorites-carousel
          [flHideMobile]="true"
          [imageSources]="imageSources"
          [link]="'/post-project'"
        ></app-crowd-favorites-carousel>
      </fl-bit>
      <fl-bit class="ViewMoreProjects">
        <fl-button
          i18n="See More"
          flTrackingLabel="SeeMore"
          [size]="ButtonSize.XLARGE"
          [flMarginBottom]="Margin.XXXXLARGE"
          [color]="ButtonColor.PRIMARY_PINK"
          [link]="'/discover/all'"
        >
          See More
        </fl-button>
      </fl-bit>
      <fl-hr></fl-hr>
    </fl-bit>
  `,
  styleUrls: ['./crowd-favorites-redesign.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageCrowdFavoritesRedesignComponent {
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  CarouselScrollBehaviour = CarouselScrollBehaviour;
  HeadingType = HeadingType;
  IconColor = IconColor;
  IconSize = IconSize;
  Margin = Margin;
  TextSize = TextSize;

  imageSources: ReadonlyArray<CrowdFavoriteImageQTS> = [
    {
      src: '/home/crowd-favorite/tshirt.jpg',
      qtsLabel: 'ProjectShowcase-TShirtDesign',
    },
    {
      src: '/home/crowd-favorite/ui.jpg',
      qtsLabel: 'ProjectShowcase-UIDesign',
    },
    {
      src: '/home/crowd-favorite/logo.jpg',
      qtsLabel: 'ProjectShowcase-LogoDesign-FlatRock',
    },
    {
      src: '/home/crowd-favorite/hotel.jpg',
      qtsLabel: 'ProjectShowcase-HotelDesign',
    },
    {
      src: '/home/crowd-favorite/bluetooth.jpg',
      qtsLabel: 'ProjectShowcase-SpeakerDesign',
    },
    {
      src: '/home/crowd-favorite/glaciar.jpg',
      qtsLabel: 'ProjectShowcase-LogoDesign-Glaciar',
    },
    {
      src: '/home/crowd-favorite/website.jpg',
      qtsLabel: 'ProjectShowcase-WebsiteDesign-House',
    },
    {
      src: '/home/crowd-favorite/website2.jpg',
      qtsLabel: 'ProjectShowcase-WebsiteDesign-Exercise',
    },
    {
      src: '/home/crowd-favorite/interior.jpg',
      qtsLabel: 'ProjectShowcase-InteriorDesign',
    },
    {
      src: '/home/crowd-favorite/cleverpen-article.jpg',
      qtsLabel: 'ProjectShowcase-ArticleDesign-CleaverPen',
    },
    {
      src: '/home/crowd-favorite/organic-article.jpg',
      qtsLabel: 'ProjectShowcase-ArticleDesign-Organic',
    },
  ];
}
