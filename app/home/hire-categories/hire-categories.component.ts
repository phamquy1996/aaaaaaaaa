import { Component } from '@angular/core';
import { HeadingType, HeadingWeight } from '@freelancer/ui/heading';
import { LinkHoverColor } from '@freelancer/ui/link';
import { Margin } from '@freelancer/ui/margin';
import { TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'app-home-page-hire-categories',
  template: `
    <fl-bit flTrackingSection="HomePage">
      <fl-heading
        class="HireCategoriesHeading"
        i18n="Hire categories blade heading"
        [flMarginBottom]="Margin.MID"
        [flMarginBottomTablet]="Margin.LARGE"
        [headingType]="HeadingType.H2"
        [size]="TextSize.LARGE"
        [sizeTablet]="TextSize.XLARGE"
        [weight]="HeadingWeight.BOLD"
      >
        Get work done in over 1350 different categories
      </fl-heading>
      <fl-bit [flShowMobile]="true">
        <fl-grid>
          <fl-col [col]="4">
            <app-home-page-hire-category-item
              i18n-displayName="Display name for category item for PHP"
              displayName="PHP"
              seoUrl="php"
              assetPath="hire-php"
              qtsLabel="PHP"
            >
            </app-home-page-hire-category-item>
          </fl-col>
          <fl-col [col]="4">
            <app-home-page-hire-category-item
              i18n-displayName="
                 Display name for category item for Website Design
              "
              displayName="Website Design"
              seoUrl="website-design"
              assetPath="hire-website-design"
              qtsLabel="WebsiteDesign"
            >
            </app-home-page-hire-category-item>
          </fl-col>
          <fl-col [col]="4">
            <app-home-page-hire-category-item
              i18n-displayName="
                 Display name for category item for Graphic Design
              "
              displayName="Graphic Design"
              seoUrl="graphic-design"
              assetPath="hire-graphic-design"
              qtsLabel="GraphicDesign"
            >
            </app-home-page-hire-category-item>
          </fl-col>
          <fl-col [col]="4">
            <app-home-page-hire-category-item
              i18n-displayName="Display name for category item for Mobile Apps"
              displayName="Mobile Apps"
              seoUrl="mobile-phone"
              assetPath="hire-mobile-apps"
              qtsLabel="MobilePhone"
            >
            </app-home-page-hire-category-item>
          </fl-col>
          <fl-col [col]="4">
            <app-home-page-hire-category-item
              i18n-displayName="Display name for category item for Android Apps"
              displayName="Android Apps"
              seoUrl="android"
              assetPath="hire-android"
              qtsLabel="Android"
            >
            </app-home-page-hire-category-item>
          </fl-col>
          <fl-col [col]="4">
            <app-home-page-hire-category-item
              i18n-displayName="Display name for category item for iPhone Apps"
              displayName="iPhone Apps"
              seoUrl="iphone"
              assetPath="hire-iphone-apps"
              qtsLabel="Iphone"
            >
            </app-home-page-hire-category-item>
          </fl-col>
          <fl-col [col]="4">
            <app-home-page-hire-category-item
              i18n-displayName="Display name for category item for Photoshop"
              displayName="Photoshop"
              seoUrl="photoshop"
              assetPath="hire-photoshop"
              qtsLabel="Photoshop"
            >
            </app-home-page-hire-category-item>
          </fl-col>
          <fl-col [col]="4">
            <app-home-page-hire-category-item
              i18n-displayName="Display name for category item for Logo Design"
              displayName="Logo Design"
              seoUrl="logo-design"
              assetPath="hire-logo-design"
              qtsLabel="LogoDesign"
            >
            </app-home-page-hire-category-item>
          </fl-col>

          <fl-col [col]="4">
            <app-home-page-hire-category-item
              [displayName]="'More'"
              [seoUrl]="'allskills'"
              [assetPath]="'hire-more'"
              [qtsLabel]="'more'"
            ></app-home-page-hire-category-item>
          </fl-col>
        </fl-grid>
      </fl-bit>
      <fl-bit [flShowTablet]="true">
        <fl-grid>
          <fl-col [col]="3">
            <app-home-page-hire-category-item
              i18n-displayName="Display name for category item for PHP"
              displayName="PHP"
              seoUrl="php"
              assetPath="hire-php"
              qtsLabel="PHP"
            >
            </app-home-page-hire-category-item>
          </fl-col>
          <fl-col [col]="3">
            <app-home-page-hire-category-item
              i18n-displayName="
                 Display name for category item for Website Design
              "
              displayName="Website Design"
              seoUrl="website-design"
              assetPath="hire-website-design"
              qtsLabel="WebsiteDesign"
            >
            </app-home-page-hire-category-item>
          </fl-col>
          <fl-col [col]="3">
            <app-home-page-hire-category-item
              i18n-displayName="
                 Display name for category item for Graphic Design
              "
              displayName="Graphic Design"
              seoUrl="graphic-design"
              assetPath="hire-graphic-design"
              qtsLabel="GraphicDesign"
            >
            </app-home-page-hire-category-item>
          </fl-col>
          <fl-col [col]="3">
            <app-home-page-hire-category-item
              i18n-displayName="Display name for category item for Mobile Apps"
              displayName="Mobile Apps"
              seoUrl="mobile-phone"
              assetPath="hire-mobile-apps"
              qtsLabel="MobilePhone"
            >
            </app-home-page-hire-category-item>
          </fl-col>
          <fl-col [col]="3">
            <app-home-page-hire-category-item
              i18n-displayName="Display name for category item for Android Apps"
              displayName="Android Apps"
              seoUrl="android"
              assetPath="hire-android"
              qtsLabel="Android"
            >
            </app-home-page-hire-category-item>
          </fl-col>
          <fl-col [col]="3">
            <app-home-page-hire-category-item
              i18n-displayName="Display name for category item for iPhone Apps"
              displayName="iPhone Apps"
              seoUrl="iphone"
              assetPath="hire-iphone-apps"
              qtsLabel="Iphone"
            >
            </app-home-page-hire-category-item>
          </fl-col>
          <fl-col [col]="3">
            <app-home-page-hire-category-item
              i18n-displayName="Display name for category item for Photoshop"
              displayName="Photoshop"
              seoUrl="photoshop"
              assetPath="hire-photoshop"
              qtsLabel="Photoshop"
            >
            </app-home-page-hire-category-item>
          </fl-col>
          <fl-col [col]="3">
            <app-home-page-hire-category-item
              i18n-displayName="Display name for category item for Logo Design"
              displayName="Logo Design"
              seoUrl="logo-design"
              assetPath="hire-logo-design"
              qtsLabel="LogoDesign"
            >
            </app-home-page-hire-category-item>
          </fl-col>
          <fl-col [col]="3">
            <app-home-page-hire-category-item
              i18n-displayName="
                 Display name for category item for Article Writing
              "
              displayName="Article Writing"
              seoUrl="articles"
              assetPath="hire-article-writing"
              qtsLabel="Articles"
            >
            </app-home-page-hire-category-item>
          </fl-col>
          <fl-col [col]="3">
            <app-home-page-hire-category-item
              i18n-displayName="Display name for category item for Data Entry"
              displayName="Data Entry"
              seoUrl="data-entry"
              assetPath="hire-data-entry"
              qtsLabel="DataEntry"
            >
            </app-home-page-hire-category-item>
          </fl-col>
          <fl-col [col]="3">
            <app-home-page-hire-category-item
              i18n-displayName="
                 Display name for category item for Internet Marketing
              "
              displayName="Internet Marketing"
              seoUrl="internet-marketing"
              assetPath="hire-internet-marketing"
              qtsLabel="InternetMarketing"
            >
            </app-home-page-hire-category-item>
          </fl-col>

          <fl-col [col]="3">
            <app-home-page-hire-category-item
              [displayName]="'More'"
              [seoUrl]="'allskills'"
              [assetPath]="'hire-more'"
              [qtsLabel]="'more'"
            ></app-home-page-hire-category-item>
          </fl-col>
        </fl-grid>
      </fl-bit>
      <fl-bit [flShowDesktop]="true">
        <fl-grid class="Grid">
          <fl-col [col]="1">
            <app-home-page-hire-category-item
              i18n-displayName="Display name for category item for PHP"
              displayName="PHP"
              seoUrl="php"
              assetPath="hire-php"
              qtsLabel="PHP"
            >
            </app-home-page-hire-category-item>
          </fl-col>
          <fl-col [col]="1">
            <app-home-page-hire-category-item
              i18n-displayName="
                 Display name for category item for Website Design
              "
              displayName="Website Design"
              seoUrl="website-design"
              assetPath="hire-website-design"
              qtsLabel="WebsiteDesign"
            >
            </app-home-page-hire-category-item>
          </fl-col>
          <fl-col [col]="1">
            <app-home-page-hire-category-item
              i18n-displayName="
                 Display name for category item for Graphic Design
              "
              displayName="Graphic Design"
              seoUrl="graphic-design"
              assetPath="hire-graphic-design"
              qtsLabel="GraphicDesign"
            >
            </app-home-page-hire-category-item>
          </fl-col>
          <fl-col [col]="1">
            <app-home-page-hire-category-item
              i18n-displayName="Display name for category item for Mobile Apps"
              displayName="Mobile Apps"
              seoUrl="mobile-phone"
              assetPath="hire-mobile-apps"
              qtsLabel="MobilePhone"
            >
            </app-home-page-hire-category-item>
          </fl-col>
          <fl-col [col]="1">
            <app-home-page-hire-category-item
              i18n-displayName="Display name for category item for Android Apps"
              displayName="Android Apps"
              seoUrl="android"
              assetPath="hire-android"
              qtsLabel="Android"
            >
            </app-home-page-hire-category-item>
          </fl-col>
          <fl-col [col]="1">
            <app-home-page-hire-category-item
              i18n-displayName="Display name for category item for iPhone Apps"
              displayName="iPhone Apps"
              seoUrl="iphone"
              assetPath="hire-iphone-apps"
              qtsLabel="Iphone"
            >
            </app-home-page-hire-category-item>
          </fl-col>
          <fl-col [col]="1">
            <app-home-page-hire-category-item
              i18n-displayName="Display name for category item for Photoshop"
              displayName="Photoshop"
              seoUrl="photoshop"
              assetPath="hire-photoshop"
              qtsLabel="Photoshop"
            >
            </app-home-page-hire-category-item>
          </fl-col>
          <fl-col [col]="1">
            <app-home-page-hire-category-item
              i18n-displayName="Display name for category item for Logo Design"
              displayName="Logo Design"
              seoUrl="logo-design"
              assetPath="hire-logo-design"
              qtsLabel="LogoDesign"
            >
            </app-home-page-hire-category-item>
          </fl-col>
          <fl-col [col]="1">
            <app-home-page-hire-category-item
              i18n-displayName="
                 Display name for category item for Article Writing
              "
              displayName="Article Writing"
              seoUrl="articles"
              assetPath="hire-article-writing"
              qtsLabel="Articles"
            >
            </app-home-page-hire-category-item>
          </fl-col>
          <fl-col [col]="1">
            <app-home-page-hire-category-item
              i18n-displayName="Display name for category item for Data Entry"
              displayName="Data Entry"
              seoUrl="data-entry"
              assetPath="hire-data-entry"
              qtsLabel="DataEntry"
            >
            </app-home-page-hire-category-item>
          </fl-col>
          <fl-col [col]="1">
            <app-home-page-hire-category-item
              i18n-displayName="
                 Display name for category item for Internet Marketing
              "
              displayName="Internet Marketing"
              seoUrl="internet-marketing"
              assetPath="hire-internet-marketing"
              qtsLabel="InternetMarketing"
            >
            </app-home-page-hire-category-item>
          </fl-col>
          <fl-col [col]="1">
            <app-home-page-hire-category-item
              i18n-displayName="Display name for category item for SEO"
              displayName="SEO"
              seoUrl="seo"
              assetPath="hire-seo"
              qtsLabel="SEO"
            >
            </app-home-page-hire-category-item>
          </fl-col>
          <fl-col [col]="1">
            <app-home-page-hire-category-item
              i18n-displayName="Display name for category item for 3D Modelling"
              displayName="3D Modelling"
              seoUrl="threed-modelling"
              assetPath="hire-3d-modeling"
              qtsLabel="ThreedModelling"
            >
            </app-home-page-hire-category-item>
          </fl-col>
          <fl-col [col]="1">
            <app-home-page-hire-category-item
              i18n-displayName="Display name for category item for Copywriting"
              displayName="Copywriting"
              seoUrl="copywriting"
              assetPath="hire-copy-writing"
              qtsLabel="Copywriting"
            >
            </app-home-page-hire-category-item>
          </fl-col>
          <fl-col [col]="1">
            <app-home-page-hire-category-item
              i18n-displayName="Display name for category item for Ghostwriting"
              displayName="Ghostwriting"
              seoUrl="ghostwriting"
              assetPath="hire-ghost-writing"
              qtsLabel="Ghostwriting"
            >
            </app-home-page-hire-category-item>
          </fl-col>
          <fl-col [col]="1">
            <app-home-page-hire-category-item
              i18n-displayName="Display name for category item for Linux"
              displayName="Linux"
              seoUrl="linux"
              assetPath="hire-linux"
              qtsLabel="Linux"
            >
            </app-home-page-hire-category-item>
          </fl-col>
          <fl-col [col]="1">
            <app-home-page-hire-category-item
              i18n-displayName="
                 Display name for category item for Amazon Web Services
              "
              displayName="Amazon Web Services"
              seoUrl="amazon-web-services"
              assetPath="hire-aws"
              qtsLabel="AmazonWebServices"
            >
            </app-home-page-hire-category-item>
          </fl-col>
          <fl-col [col]="1">
            <app-home-page-hire-category-item
              i18n-displayName="
                 Display name for category item for Banner Design
              "
              displayName="Banner Design"
              seoUrl="banner-design"
              assetPath="hire-banner-design"
              qtsLabel="BannerDesign"
            >
            </app-home-page-hire-category-item>
          </fl-col>
          <fl-col [col]="1">
            <app-home-page-hire-category-item
              i18n-displayName="
                 Display name for category item for Software Development
              "
              displayName="Software Development"
              seoUrl="software-development"
              assetPath="hire-software-dev"
              qtsLabel="SoftwareDevelopment"
            >
            </app-home-page-hire-category-item>
          </fl-col>
          <fl-col [col]="1">
            <app-home-page-hire-category-item
              i18n-displayName="Display name for category item for Accounting"
              displayName="Accounting"
              seoUrl="accounting"
              assetPath="hire-accounting"
              qtsLabel="Accounting"
            >
            </app-home-page-hire-category-item>
          </fl-col>
          <fl-col [col]="1">
            <app-home-page-hire-category-item
              i18n-displayName="Display name for category item for Finance"
              displayName="Finance"
              seoUrl="finance"
              assetPath="hire-finance"
              qtsLabel="Finance"
            >
            </app-home-page-hire-category-item>
          </fl-col>
          <fl-col [col]="1">
            <app-home-page-hire-category-item
              i18n-displayName="Display name for category item for Legal"
              displayName="Legal"
              seoUrl="legal"
              assetPath="hire-legal"
              qtsLabel="Legal"
            >
            </app-home-page-hire-category-item>
          </fl-col>
          <fl-col [col]="1">
            <app-home-page-hire-category-item
              i18n-displayName="
                 Display name for category item for Manufacturing
              "
              displayName="Manufacturing"
              seoUrl="manufacturing"
              assetPath="hire-manufacturing"
              qtsLabel="Manufacturing"
            >
            </app-home-page-hire-category-item>
          </fl-col>
          <fl-col [col]="1">
            <app-home-page-hire-category-item
              i18n-displayName="Display name for category item for Logistics"
              displayName="Logistics"
              seoUrl="logistics-shipping"
              assetPath="hire-logistics"
              qtsLabel="LogisticsShipping"
            >
            </app-home-page-hire-category-item>
          </fl-col>
        </fl-grid>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./hire-categories.component.scss'],
})
export class HomePageHireCategoriesComponent {
  HeadingType = HeadingType;
  HeadingWeight = HeadingWeight;
  LinkHoverColor = LinkHoverColor;
  Margin = Margin;
  TextSize = TextSize;
}
