import { Component } from '@angular/core';
import { Location } from '@freelancer/location';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { PictureDisplay } from '@freelancer/ui/picture';
import { TextSize } from '@freelancer/ui/text';

export interface CrowdFavorite {
  image: string;
  qtsLabel: string;
  translatedDescription: {
    hi: string;
    en: string;
  };
  queryParams: {
    skill_category?: number;
    skill_subcategory?: number;
    repost_project_id?: number;
  };
}

@Component({
  selector: 'app-home-page-crowd-favorites',
  template: `
    <fl-bit class="CrowdFavorites" [flTrackingSection]="'HomePage'">
      <fl-bit class="CrowdFavorites-header">
        <fl-heading
          i18n="Crowd favorites header"
          [size]="TextSize.LARGE"
          [sizeTablet]="TextSize.XLARGE"
          [sizeDesktop]="TextSize.XXXLARGE"
          [headingType]="HeadingType.H2"
          [flMarginBottom]="Margin.MID"
        >
          Crowd favorites
        </fl-heading>
        <fl-heading
          i18n="Header for introducing the most popular projets"
          [size]="TextSize.MID"
          [sizeTablet]="TextSize.LARGE"
          [sizeDesktop]="TextSize.XXLARGE"
          [headingType]="HeadingType.H2"
          [flMarginBottom]="Margin.MID"
          [flMarginBottomTablet]="Margin.XLARGE"
          [flMarginBottomDesktop]="Margin.XXXXLARGE"
        >
          Here are some of our most popular projects:
        </fl-heading>
      </fl-bit>
      <fl-bit
        class="CrowdFavorites-mobileContainer"
        [flShowMobile]="true"
        [flHideTablet]="true"
        [flHideDesktop]="true"
        [flMarginBottom]="Margin.SMALL"
      >
        <fl-bit class="CrowdFavorites-cardContainer">
          <app-crowd-favorite-card
            i18n-title="Crowd favorite title for Website Development"
            title="Website Development"
            i18n-actionText="Crowd favorite action text"
            actionText="Post a project like this"
            dollarDescription="From $300 USD"
            i18n-dollarDescription="
               Crowd favorite card's description using USD as the currency
            "
            rupeeDescription="From ₹22,700"
            i18n-rupeeDescription="
               Crowd favorite card's description using rupee as the currency
            "
            [isIndia]="isIndia"
            [crowdFavorite]="crowdFavorites[0]"
          >
          </app-crowd-favorite-card>

          <app-crowd-favorite-card
            i18n-title="Crowd favorite title for Graphic Design"
            title="Graphic Design"
            i18n-actionText="Crowd favorite action text"
            actionText="Post a project like this"
            dollarDescription="From $100 USD"
            i18n-dollarDescription="
               Crowd favorite card's description using USD as the currency
            "
            rupeeDescription="From ₹7,500"
            i18n-rupeeDescription="
               Crowd favorite card's description using rupee as the currency
            "
            [isIndia]="isIndia"
            [crowdFavorite]="crowdFavorites[1]"
          >
          </app-crowd-favorite-card>

          <app-crowd-favorite-card
            i18n-title="Crowd favorite title for Logo Design"
            title="Logo Design"
            i18n-actionText="Crowd favorite action text"
            actionText="Post a contest like this"
            dollarDescription="From $50 USD"
            i18n-dollarDescription="
               Crowd favorite card's description using USD as the currency
            "
            rupeeDescription="From ₹3,800"
            i18n-rupeeDescription="
               Crowd favorite card's description using rupee as the currency
            "
            [isIndia]="isIndia"
            [crowdFavorite]="crowdFavorites[2]"
          >
          </app-crowd-favorite-card>

          <app-crowd-favorite-card
            i18n-title="Crowd favorite title for Marketing"
            title="Marketing"
            i18n-actionText="Crowd favorite action text"
            actionText="Post a project like this"
            dollarDescription="From $150 USD"
            i18n-dollarDescription="
               Crowd favorite card's description using USD as the currency
            "
            rupeeDescription="From ₹11,400"
            i18n-rupeeDescription="
               Crowd favorite card's description using rupee as the currency
            "
            [isIndia]="isIndia"
            [crowdFavorite]="crowdFavorites[3]"
          >
          </app-crowd-favorite-card>

          <app-crowd-favorite-card
            i18n-title="Crowd favorite title for Writing"
            title="Writing"
            i18n-actionText="Crowd favorite action text"
            actionText="Post a project like this"
            dollarDescription="From $50 USD"
            i18n-dollarDescription="
               Crowd favorite card's description using USD as the currency
            "
            rupeeDescription="From ₹3,800"
            i18n-rupeeDescription="
               Crowd favorite card's description using rupee as the currency
            "
            [isIndia]="isIndia"
            [crowdFavorite]="crowdFavorites[4]"
          >
          </app-crowd-favorite-card>

          <app-crowd-favorite-card
            i18n-title="Crowd favorite title for Mobile App"
            title="Mobile App"
            i18n-actionText="Crowd favorite action text"
            actionText="Post a project like this"
            dollarDescription="From $50 USD / hour"
            i18n-dollarDescription="
               Crowd favorite card's description using USD as the currency
            "
            rupeeDescription="From ₹3,800 / hour"
            i18n-rupeeDescription="
               Crowd favorite card's description using rupee as the currency
            "
            [isIndia]="isIndia"
            [crowdFavorite]="crowdFavorites[5]"
          >
          </app-crowd-favorite-card>
        </fl-bit>
      </fl-bit>

      <fl-grid [flHideMobile]="true" [flMarginBottom]="Margin.SMALL">
        <fl-col [colTablet]="6" [colDesktopSmall]="4">
          <app-crowd-favorite-card
            class="CrowdFavorites-cardContainer"
            i18n-title="Crowd favorite title for Website Development"
            title="Website Development"
            i18n-actionText="Crowd favorite action text"
            actionText="Post a project like this"
            dollarDescription="From $300 USD"
            i18n-dollarDescription="
               Crowd favorite card's description using USD as the currency
            "
            rupeeDescription="From ₹22,700"
            i18n-rupeeDescription="
               Crowd favorite card's description using rupee as the currency
            "
            [isIndia]="isIndia"
            [crowdFavorite]="crowdFavorites[0]"
          >
          </app-crowd-favorite-card>
        </fl-col>
        <fl-col [colTablet]="6" [colDesktopSmall]="4">
          <app-crowd-favorite-card
            class="CrowdFavorites-cardContainer"
            i18n-title="Crowd favorite title for Graphic Design"
            title="Graphic Design"
            i18n-actionText="Crowd favorite action text"
            actionText="Post a project like this"
            dollarDescription="From $100 USD"
            i18n-dollarDescription="
               Crowd favorite card's description using USD as the currency
            "
            rupeeDescription="From ₹7,500"
            i18n-rupeeDescription="
               Crowd favorite card's description using rupee as the currency
            "
            [isIndia]="isIndia"
            [crowdFavorite]="crowdFavorites[1]"
          >
          </app-crowd-favorite-card>
        </fl-col>
        <fl-col [colTablet]="6" [colDesktopSmall]="4">
          <app-crowd-favorite-card
            class="CrowdFavorites-cardContainer"
            i18n-title="Crowd favorite title for Logo Design"
            title="Logo Design"
            i18n-actionText="Crowd favorite action text"
            actionText="Post a contest like this"
            dollarDescription="From $50 USD"
            i18n-dollarDescription="
               Crowd favorite card's description using USD as the currency
            "
            rupeeDescription="From ₹3,800"
            i18n-rupeeDescription="
               Crowd favorite card's description using rupee as the currency
            "
            [isIndia]="isIndia"
            [crowdFavorite]="crowdFavorites[2]"
          >
          </app-crowd-favorite-card>
        </fl-col>
        <fl-col [colTablet]="6" [colDesktopSmall]="4">
          <app-crowd-favorite-card
            class="CrowdFavorites-cardContainer"
            i18n-title="Crowd favorite title for Marketing"
            title="Marketing"
            i18n-actionText="Crowd favorite action text"
            actionText="Post a project like this"
            dollarDescription="From $150 USD"
            i18n-dollarDescription="
               Crowd favorite card's description using USD as the currency
            "
            rupeeDescription="From ₹11,400"
            i18n-rupeeDescription="
               Crowd favorite card's description using rupee as the currency
            "
            [isIndia]="isIndia"
            [crowdFavorite]="crowdFavorites[3]"
          >
          </app-crowd-favorite-card>
        </fl-col>
        <fl-col [colTablet]="6" [colDesktopSmall]="4">
          <app-crowd-favorite-card
            class="CrowdFavorites-cardContainer"
            i18n-title="Crowd favorite title for Writing"
            title="Writing"
            i18n-actionText="Crowd favorite action text"
            actionText="Post a project like this"
            dollarDescription="From $50 USD"
            i18n-dollarDescription="
               Crowd favorite card's description using USD as the currency
            "
            rupeeDescription="From ₹3,800"
            i18n-rupeeDescription="
               Crowd favorite card's description using rupee as the currency
            "
            [isIndia]="isIndia"
            [crowdFavorite]="crowdFavorites[4]"
          >
          </app-crowd-favorite-card>
        </fl-col>
        <fl-col [colTablet]="6" [colDesktopSmall]="4">
          <app-crowd-favorite-card
            class="CrowdFavorites-cardContainer"
            i18n-title="Crowd favorite title for Mobile App"
            title="Mobile App"
            i18n-actionText="Crowd favorite action text"
            actionText="Post a project like this"
            dollarDescription="From $50 USD / hour"
            i18n-dollarDescription="
               Crowd favorite card's description using USD as the currency
            "
            rupeeDescription="From ₹3,800 / hour"
            i18n-rupeeDescription="
               Crowd favorite card's description using rupee as the currency
            "
            [isIndia]="isIndia"
            [crowdFavorite]="crowdFavorites[5]"
          >
          </app-crowd-favorite-card>
        </fl-col>
      </fl-grid>
      <fl-bit class="CrowdFavorites-button">
        <fl-button
          flTrackingLabel="CategoryPageButton"
          i18n="Link to the category page"
          [color]="ButtonColor.TRANSPARENT_DARK"
          [link]="'/discover/all'"
          [size]="ButtonSize.LARGE"
        >
          See more
        </fl-button>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./crowd-favorites.component.scss'],
})
export class HomePageCrowdFavoritesComponent {
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  HeadingType = HeadingType;
  Margin = Margin;
  PictureDisplay = PictureDisplay;
  TextSize = TextSize;

  crowdFavorites: ReadonlyArray<CrowdFavorite> = [
    {
      translatedDescription: {
        hi: 'From ₹22,700',
        en: 'From $300 USD',
      },
      image: 'home/showcase/website-development.png',
      qtsLabel: 'WebsiteDevelopment',
      queryParams: {
        skill_category: 1,
        skill_subcategory: 1,
      },
    },
    {
      translatedDescription: {
        hi: 'From ₹7,500',
        en: 'From $100 USD',
      },
      image: 'home/showcase/graphic-design.png',
      qtsLabel: 'GraphicDesign',
      queryParams: {
        skill_category: 4,
        skill_subcategory: 79,
      },
    },
    {
      translatedDescription: {
        hi: 'From ₹3,800',
        en: 'From $50 USD',
      },
      image: 'home/showcase/logo-design.png',
      qtsLabel: 'LogoDesign',
      queryParams: {
        skill_category: 4,
        skill_subcategory: 21,
      },
    },
    {
      translatedDescription: {
        hi: 'From ₹11,400',
        en: 'From $150 USD',
      },
      image: 'home/showcase/marketing.png',
      qtsLabel: 'Marketing',
      queryParams: {
        skill_category: 7,
        skill_subcategory: 46,
      },
    },
    {
      translatedDescription: {
        hi: 'From ₹3,800',
        en: 'From $50 USD',
      },
      image: 'home/showcase/writing.png',
      qtsLabel: 'Writing',
      queryParams: {
        repost_project_id: 4045988,
      },
    },
    {
      translatedDescription: {
        hi: 'From ₹3,800 / hour',
        en: 'From $50 USD / hour',
      },
      image: 'home/showcase/mobile-app.png',
      qtsLabel: 'MobileApp',
      queryParams: {
        repost_project_id: 3992787,
      },
    },
  ];
  isIndia: boolean = this.isIndiaDomain(this.location);

  constructor(private location: Location) {}

  isIndiaDomain(location: Location): boolean {
    const found = location.hostname.match(/freelancer.in/);
    return found ? found.length > 0 : false;
  }
}
