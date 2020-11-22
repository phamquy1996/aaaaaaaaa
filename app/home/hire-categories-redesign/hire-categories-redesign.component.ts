import { Component } from '@angular/core';
import { HeadingType, HeadingWeight } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { TextSize } from '@freelancer/ui/text';
import { HireCategoryItemIconSize } from './hire-category-item-redesign.component';

@Component({
  selector: 'app-home-page-hire-categories-redesign',
  template: `
    <fl-bit>
      <fl-heading
        class="HireCategories-heading"
        i18n="Hire categories blade heading"
        [headingType]="HeadingType.H2"
        [size]="TextSize.LARGE"
        [sizeTablet]="TextSize.XLARGE"
        [sizeDesktop]="TextSize.XXXLARGE"
        [weight]="HeadingWeight.BOLD"
        [flMarginBottom]="Margin.MID"
        [flMarginBottomTablet]="Margin.XLARGE"
        [flMarginBottomDesktop]="Margin.XXXXLARGE"
      >
        Get work done in over 1800 different categories
      </fl-heading>
    </fl-bit>
    <fl-bit [flHideDesktop]="true" flTrackingSection="HomePage">
      <fl-grid class="HireCategories-grid">
        <fl-col
          class="HireCategories-grid-col"
          [col]="4"
          [colTablet]="3"
          [flMarginBottom]="Margin.XXSMALL"
        >
          <fl-bit class="HireCategories-item-container">
            <app-home-page-hire-category-item-redesign
              class="HireCategories-item"
              displayName="PHP"
              i18n-displayName="Display name for category item for PHP"
              [seoUrl]="'php'"
              [assetPath]="'redesign/hire-php-v2'"
              [qtsLabel]="'PHP'"
            >
            </app-home-page-hire-category-item-redesign>
          </fl-bit>
        </fl-col>
        <fl-col
          class="HireCategories-grid-col"
          [col]="4"
          [colTablet]="3"
          [flMarginBottom]="Margin.XXSMALL"
        >
          <fl-bit class="HireCategories-item-container">
            <app-home-page-hire-category-item-redesign
              class="HireCategories-item"
              displayName="Website Design"
              i18n-displayName="
                 Display name for category item for Website Design
              "
              [seoUrl]="'website-design'"
              [assetPath]="'redesign/hire-website-design-v2'"
              [qtsLabel]="'WebsiteDesign'"
            >
            </app-home-page-hire-category-item-redesign>
          </fl-bit>
        </fl-col>
        <fl-col
          class="HireCategories-grid-col"
          [col]="4"
          [colTablet]="3"
          [flMarginBottom]="Margin.XXSMALL"
        >
          <fl-bit class="HireCategories-item-container">
            <app-home-page-hire-category-item-redesign
              class="HireCategories-item"
              displayName="Graphic Design"
              i18n-displayName="
                 Display name for category item for Graphic Design
              "
              [seoUrl]="'graphic-design'"
              [assetPath]="'redesign/hire-graphic-design-v2'"
              [qtsLabel]="'GraphicDesign'"
            >
            </app-home-page-hire-category-item-redesign>
          </fl-bit>
        </fl-col>
        <fl-col
          class="HireCategories-grid-col"
          [col]="4"
          [colTablet]="3"
          [flMarginBottom]="Margin.XXSMALL"
        >
          <fl-bit class="HireCategories-item-container">
            <app-home-page-hire-category-item-redesign
              class="HireCategories-item"
              displayName="Mobile Apps"
              i18n-displayName="Display name for category item for Mobile Apps"
              [seoUrl]="'mobile-phone'"
              [assetPath]="'redesign/hire-mobile-apps-v2'"
              [qtsLabel]="'MobilePhone'"
            >
            </app-home-page-hire-category-item-redesign>
          </fl-bit>
        </fl-col>
        <fl-col
          class="HireCategories-grid-col"
          [col]="4"
          [colTablet]="3"
          [flMarginBottom]="Margin.XXSMALL"
        >
          <fl-bit class="HireCategories-item-container">
            <app-home-page-hire-category-item-redesign
              class="HireCategories-item"
              displayName="Android Apps"
              i18n-displayName="Display name for category item for Android Apps"
              [seoUrl]="'android'"
              [assetPath]="'redesign/hire-android-v2'"
              [qtsLabel]="'Android'"
            >
            </app-home-page-hire-category-item-redesign>
          </fl-bit>
        </fl-col>
        <fl-col
          class="HireCategories-grid-col"
          [col]="4"
          [colTablet]="3"
          [flMarginBottom]="Margin.XXSMALL"
        >
          <fl-bit class="HireCategories-item-container">
            <app-home-page-hire-category-item-redesign
              class="HireCategories-item"
              displayName="iPhone Apps"
              i18n-displayName="Display name for category item for iPhone Apps"
              [seoUrl]="'iphone'"
              [assetPath]="'redesign/hire-iphone-apps-v2'"
              [qtsLabel]="'Iphone'"
            >
            </app-home-page-hire-category-item-redesign>
          </fl-bit>
        </fl-col>
        <fl-col
          class="HireCategories-grid-col"
          [col]="4"
          [colTablet]="3"
          [flMarginBottom]="Margin.XXSMALL"
        >
          <fl-bit class="HireCategories-item-container">
            <app-home-page-hire-category-item-redesign
              class="HireCategories-item"
              displayName="Photoshop"
              i18n-displayName=" Display name for category item for Photoshop"
              [seoUrl]="'photoshop'"
              [assetPath]="'redesign/hire-photoshop-v2'"
              [qtsLabel]="'Photoshop'"
            >
            </app-home-page-hire-category-item-redesign>
          </fl-bit>
        </fl-col>
        <fl-col
          class="HireCategories-grid-col"
          [col]="4"
          [colTablet]="3"
          [flMarginBottom]="Margin.XXSMALL"
        >
          <fl-bit class="HireCategories-item-container">
            <app-home-page-hire-category-item-redesign
              class="HireCategories-item"
              displayName="Logo Design"
              i18n-displayName=" Display name for category item for Logo Design"
              [seoUrl]="'logo-design'"
              [assetPath]="'redesign/hire-logo-design-v2'"
              [qtsLabel]="'LogoDesign'"
            >
            </app-home-page-hire-category-item-redesign>
          </fl-bit>
        </fl-col>
        <fl-col
          class="HireCategories-grid-col"
          [flShowTablet]="true"
          [col]="3"
          [flMarginBottom]="Margin.XXSMALL"
        >
          <fl-bit class="HireCategories-item-container">
            <app-home-page-hire-category-item-redesign
              class="HireCategories-item"
              displayName="Article Writing"
              i18n-displayName="
                 Display name for category item for Article Writing
              "
              [seoUrl]="'articles'"
              [assetPath]="'redesign/hire-article-writing-v2'"
              [qtsLabel]="'Articles'"
            >
            </app-home-page-hire-category-item-redesign>
          </fl-bit>
        </fl-col>
        <fl-col
          class="HireCategories-grid-col"
          [flShowTablet]="true"
          [col]="3"
          [flMarginBottom]="Margin.XXSMALL"
        >
          <fl-bit class="HireCategories-item-container">
            <app-home-page-hire-category-item-redesign
              class="HireCategories-item"
              displayName="Data Entry"
              i18n-displayName="Display name for category item for Data Entry"
              [seoUrl]="'data-entry'"
              [assetPath]="'redesign/hire-data-entry-v2'"
              [qtsLabel]="'DataEntry'"
            >
            </app-home-page-hire-category-item-redesign>
          </fl-bit>
        </fl-col>
        <fl-col
          class="HireCategories-grid-col"
          [flShowTablet]="true"
          [col]="3"
          [flMarginBottom]="Margin.XXSMALL"
        >
          <fl-bit class="HireCategories-item-container">
            <app-home-page-hire-category-item-redesign
              class="HireCategories-item"
              displayName="Internet Marketing"
              i18n-displayName="
                 Display name for category item for Internet Marketing
              "
              [seoUrl]="'internet-marketing'"
              [assetPath]="'redesign/hire-internet-marketing-v2'"
              [qtsLabel]="'InternetMarketing'"
            >
            </app-home-page-hire-category-item-redesign>
          </fl-bit>
        </fl-col>
        <fl-col
          class="HireCategories-grid-col"
          [col]="4"
          [colTablet]="3"
          [flMarginBottom]="Margin.XXSMALL"
        >
          <fl-bit class="HireCategories-item-container">
            <app-home-page-hire-category-item-redesign
              class="HireCategories-item"
              displayName="More"
              i18n-displayName="Display name for category item for More"
              [seoUrl]="'allskills'"
              [assetPath]="'hire-more'"
              [qtsLabel]="'more'"
            >
            </app-home-page-hire-category-item-redesign>
          </fl-bit>
        </fl-col>
      </fl-grid>
    </fl-bit>

    <fl-bit
      [flShowDesktop]="true"
      class="HireCategories-list"
      flTrackingSection="HomePage"
    >
      <fl-bit class="HireCategories-list-sublist">
        <app-home-page-hire-category-item-redesign
          displayName="Website Design"
          i18n-displayName="Display name for category item for Website Design"
          [seoUrl]="'website-design'"
          [assetPath]="'redesign/hire-website-design-v2'"
          [qtsLabel]="'WebsiteDesign'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>
        <app-home-page-hire-category-item-redesign
          displayName="Mobile Apps"
          i18n-displayName="Display name for category item for Mobile Apps"
          [seoUrl]="'mobile-phone'"
          [assetPath]="'redesign/hire-mobile-apps-v2'"
          [qtsLabel]="'MobilePhone'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>
        <app-home-page-hire-category-item-redesign
          displayName="Android Apps"
          i18n-displayName="Display name for category item for Android Apps"
          [seoUrl]="'android'"
          [assetPath]="'redesign/hire-android-v2'"
          [qtsLabel]="'Android'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>
        <app-home-page-hire-category-item-redesign
          displayName="iPhone Apps"
          i18n-displayName="Display name for category item for iPhone Apps"
          [seoUrl]="'iphone'"
          [assetPath]="'redesign/hire-iphone-apps-v2'"
          [qtsLabel]="'Iphone'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>
        <app-home-page-hire-category-item-redesign
          displayName="Software Architecture"
          i18n-displayName="
             Display name for category item for Software Architecture
          "
          [seoUrl]="'software-architecture'"
          [assetPath]="'redesign/hire-software-architecture'"
          [qtsLabel]="'SoftwareArchitecture'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>
        <app-home-page-hire-category-item-redesign
          displayName="Graphic Design"
          i18n-displayName=" Display name for category item for Graphic Design"
          [seoUrl]="'graphic-design'"
          [assetPath]="'redesign/hire-graphic-design-v2'"
          [qtsLabel]="'GraphicDesign'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>
        <app-home-page-hire-category-item-redesign
          displayName="Logo Design"
          i18n-displayName=" Display name for category item for Logo Design"
          [seoUrl]="'logo-design'"
          [assetPath]="'redesign/hire-logo-design-v2'"
          [qtsLabel]="'LogoDesign'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>
        <app-home-page-hire-category-item-redesign
          displayName="Photoshop"
          i18n-displayName=" Display name for category item for Photoshop"
          [seoUrl]="'photoshop'"
          [assetPath]="'redesign/hire-photoshop-v2'"
          [qtsLabel]="'Photoshop'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>
        <app-home-page-hire-category-item-redesign
          displayName="Banner Design"
          i18n-displayName=" Display name for category item for Banner Design"
          [seoUrl]="'banner-design'"
          [assetPath]="'redesign/hire-banner-design-v2'"
          [qtsLabel]="'BannerDesign'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>
        <app-home-page-hire-category-item-redesign
          displayName="Illustration"
          i18n-displayName=" Display name for category item for Illustration"
          [seoUrl]="'illustration'"
          [assetPath]="'redesign/hire-illustration'"
          [qtsLabel]="'Illustration'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>
      </fl-bit>

      <fl-bit class="HireCategories-list-sublist">
        <app-home-page-hire-category-item-redesign
          displayName="Public Relations"
          i18n-displayName="Display name for category item for Public Relations"
          [seoUrl]="'public-relations'"
          [assetPath]="'redesign/hire-pr'"
          [qtsLabel]="'PublicRelations'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>

        <app-home-page-hire-category-item-redesign
          displayName="Logistics"
          i18n-displayName="Display name for category item for Logistics"
          [seoUrl]="'logistics-shipping'"
          [assetPath]="'redesign/hire-logistics-v2'"
          [qtsLabel]="'LogisticsShipping'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>

        <app-home-page-hire-category-item-redesign
          displayName="Proofreading"
          i18n-displayName="Display name for category item for Proofreading"
          [seoUrl]="'proofreading'"
          [assetPath]="'redesign/hire-proofreading'"
          [qtsLabel]="'Proofreading'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>

        <app-home-page-hire-category-item-redesign
          displayName="Translation"
          i18n-displayName="Display name for category item for Translation"
          [seoUrl]="'translation'"
          [assetPath]="'redesign/hire-translation'"
          [qtsLabel]="'Translation'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>

        <app-home-page-hire-category-item-redesign
          displayName="Research"
          i18n-displayName="Display name for category item for Research"
          [seoUrl]="'research'"
          [assetPath]="'redesign/hire-research'"
          [qtsLabel]="'Research'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>

        <app-home-page-hire-category-item-redesign
          displayName="Research Writing"
          i18n-displayName="Display name for category item for Research Writing"
          [seoUrl]="'research-writing'"
          [assetPath]="'redesign/hire-research-writing'"
          [qtsLabel]="'ResearchWriting'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>

        <app-home-page-hire-category-item-redesign
          displayName="Article Writing"
          i18n-displayName="Display name for category item for Article Writing"
          [seoUrl]="'articles'"
          [assetPath]="'redesign/hire-article-writing-v2'"
          [qtsLabel]="'Articles'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>

        <app-home-page-hire-category-item-redesign
          displayName="Technical Writing"
          i18n-displayName="
             Display name for category item for Technical Writing
          "
          [seoUrl]="'technical-writing'"
          [assetPath]="'redesign/hire-technical-writing-v2'"
          [qtsLabel]="'TechnicalWriting'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>

        <app-home-page-hire-category-item-redesign
          displayName="Blogging"
          i18n-displayName="Display name for category item for Blogging"
          [seoUrl]="'blog'"
          [assetPath]="'redesign/hire-blogging'"
          [qtsLabel]="'Blogging'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>

        <app-home-page-hire-category-item-redesign
          displayName="Internet Marketing"
          i18n-displayName="
             Display name for category item for Internet Marketing
          "
          [seoUrl]="'internet-marketing'"
          [assetPath]="'redesign/hire-internet-marketing-v2'"
          [qtsLabel]="'InternetMarketing'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>
      </fl-bit>

      <fl-bit class="HireCategories-list-sublist">
        <app-home-page-hire-category-item-redesign
          displayName="Web Scraping"
          i18n-displayName="Display name for category item for Web Scraping"
          [seoUrl]="'web-scraping'"
          [assetPath]="'redesign/hire-web-scraping'"
          [qtsLabel]="'WebScraping'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>

        <app-home-page-hire-category-item-redesign
          displayName="HTML"
          i18n-displayName="Display name for category item for HTML"
          [seoUrl]="'html'"
          [assetPath]="'redesign/hire-html'"
          [qtsLabel]="'HTML'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>

        <app-home-page-hire-category-item-redesign
          i18n-displayName="Display name for category item for CSS"
          displayName="CSS"
          [seoUrl]="'css'"
          [assetPath]="'redesign/hire-css'"
          [qtsLabel]="'CSS'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>

        <app-home-page-hire-category-item-redesign
          displayName="HTML 5"
          i18n-displayName="Display name for category item for HTML 5"
          [seoUrl]="'html-five'"
          [assetPath]="'redesign/hire-html-5'"
          [qtsLabel]="'HTMLFive'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>

        <app-home-page-hire-category-item-redesign
          displayName="Javascript"
          i18n-displayName="Display name for category item for Javascript"
          [seoUrl]="'javascript'"
          [assetPath]="'redesign/hire-javascript'"
          [qtsLabel]="'Javascript'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>

        <app-home-page-hire-category-item-redesign
          displayName="Data Processing"
          i18n-displayName="Display name for category item for Data Processing"
          [seoUrl]="'data-processing'"
          [assetPath]="'redesign/hire-data-processing'"
          [qtsLabel]="'DataProcessing'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>

        <app-home-page-hire-category-item-redesign
          displayName="Python"
          i18n-displayName="Display name for category item for Python"
          [seoUrl]="'python'"
          [assetPath]="'redesign/hire-python'"
          [qtsLabel]="'Python'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>

        <app-home-page-hire-category-item-redesign
          displayName="C# Programming"
          i18n-displayName="Display name for category item for C# Programming"
          [seoUrl]="'c-sharp-programming'"
          [assetPath]="'redesign/hire-csharp'"
          [qtsLabel]="'CSharpProgramming'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>

        <app-home-page-hire-category-item-redesign
          displayName="Software Development"
          i18n-displayName="
             Display name for category item for Software Development
          "
          [seoUrl]="'software-development'"
          [assetPath]="'redesign/hire-software-dev-v2'"
          [qtsLabel]="'SoftwareDevelopment'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>

        <app-home-page-hire-category-item-redesign
          displayName="PHP"
          i18n-displayName="Display name for category item for PHP"
          [seoUrl]="'php'"
          [assetPath]="'redesign/hire-php-v2'"
          [qtsLabel]="'PHP'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>
      </fl-bit>

      <fl-bit class="HireCategories-list-sublist">
        <app-home-page-hire-category-item-redesign
          displayName="Wordpress"
          i18n-displayName="Display name for category item for Wordpress"
          [seoUrl]="'wordpress'"
          [assetPath]="'redesign/hire-wordpress'"
          [qtsLabel]="'Wordpress'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>

        <app-home-page-hire-category-item-redesign
          displayName="Web Search"
          i18n-displayName="Display name for category item for Web Search"
          [seoUrl]="'web-search'"
          [assetPath]="'redesign/hire-web-search'"
          [qtsLabel]="'WebSearch'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>

        <app-home-page-hire-category-item-redesign
          displayName="Finance"
          i18n-displayName="Display name for category item for Finance"
          [seoUrl]="'finance'"
          [assetPath]="'redesign/hire-finance-v2'"
          [qtsLabel]="'Finance'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>

        <app-home-page-hire-category-item-redesign
          displayName="Legal"
          i18n-displayName="Display name for category item for Legal"
          [seoUrl]="'legal'"
          [assetPath]="'redesign/hire-legal-v2'"
          [qtsLabel]="'Legal'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>

        <app-home-page-hire-category-item-redesign
          displayName="Linux"
          i18n-displayName="Display name for category item for Linux"
          [seoUrl]="'linux'"
          [assetPath]="'redesign/hire-linux-v2'"
          [qtsLabel]="'Linux'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>

        <app-home-page-hire-category-item-redesign
          displayName="Manufacturing"
          i18n-displayName="Display name for category item for Manufacturing"
          [seoUrl]="'manufacturing'"
          [assetPath]="'redesign/hire-manufacturing-v2'"
          [qtsLabel]="'Manufacturing'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>

        <app-home-page-hire-category-item-redesign
          displayName="Amazon Web Services"
          i18n-displayName="
             Display name for category item for Amazon Web Services
          "
          [seoUrl]="'amazon-web-services'"
          [assetPath]="'redesign/hire-aws-v2'"
          [qtsLabel]="'AmazonWebServices'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>

        <app-home-page-hire-category-item-redesign
          displayName="Link Building"
          i18n-displayName="Display name for category item for Link Building"
          [seoUrl]="'link-building'"
          [assetPath]="'redesign/hire-link-building'"
          [qtsLabel]="'LinkBuilding'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>

        <app-home-page-hire-category-item-redesign
          displayName="eCommerce"
          i18n-displayName="Display name for category item for eCommerce"
          [seoUrl]="'ecommerce'"
          [assetPath]="'redesign/hire-ecommerce'"
          [qtsLabel]="'eCommerce'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>

        <app-home-page-hire-category-item-redesign
          displayName="Data Entry"
          i18n-displayName="Display name for category item for Data Entry"
          [seoUrl]="'data-entry'"
          [assetPath]="'redesign/hire-data-entry-v2'"
          [qtsLabel]="'DataEntry'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>
      </fl-bit>

      <fl-bit class="HireCategories-list-sublist">
        <app-home-page-hire-category-item-redesign
          displayName="Content Writing"
          i18n-displayName="Display name for category item for Content Writing"
          [seoUrl]="'content-writing'"
          [assetPath]="'redesign/hire-content-writing'"
          [qtsLabel]="'ContentWriting'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>

        <app-home-page-hire-category-item-redesign
          displayName="Marketing"
          i18n-displayName="Display name for category item for Marketing"
          [seoUrl]="'marketing'"
          [assetPath]="'redesign/hire-marketing'"
          [qtsLabel]="'Marketing'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>

        <app-home-page-hire-category-item-redesign
          displayName="Excel"
          i18n-displayName="Display name for category item for Excel"
          [seoUrl]="'excel'"
          [assetPath]="'redesign/hire-excel'"
          [qtsLabel]="'Excel'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>

        <app-home-page-hire-category-item-redesign
          displayName="Ghostwriting"
          i18n-displayName="Display name for category item for Ghostwriting"
          [seoUrl]="'ghostwriting'"
          [assetPath]="'redesign/hire-ghost-writing-v2'"
          [qtsLabel]="'Ghostwriting'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>

        <app-home-page-hire-category-item-redesign
          i18n-displayName="Display name for category item for Copywriting"
          displayName="Copywriting"
          [seoUrl]="'copywriting'"
          [assetPath]="'redesign/hire-copy-writing-v2'"
          [qtsLabel]="'Copywriting'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>

        <app-home-page-hire-category-item-redesign
          displayName="Accounting"
          i18n-displayName="Display name for category item for Accounting"
          [seoUrl]="'accounting'"
          [assetPath]="'redesign/hire-accounting-v2'"
          [qtsLabel]="'Accounting'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>

        <app-home-page-hire-category-item-redesign
          displayName="MySQL"
          i18n-displayName="Display name for category item for MySQL"
          [seoUrl]="'mysql'"
          [assetPath]="'redesign/hire-mysql'"
          [qtsLabel]="'MySQL'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>

        <app-home-page-hire-category-item-redesign
          displayName="C++ Programming"
          i18n-displayName="Display name for category item for C++ Programming"
          [seoUrl]="'cplusplus-programming'"
          [assetPath]="'redesign/hire-cplusplus'"
          [qtsLabel]="'CPlusPlusProgramming'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>

        <app-home-page-hire-category-item-redesign
          displayName="3D Modelling"
          i18n-displayName="Display name for category item for 3D Modelling"
          [seoUrl]="'threed-modelling'"
          [assetPath]="'redesign/hire-3d-modelling-v2'"
          [qtsLabel]="'ThreedModelling'"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>

        <app-home-page-hire-category-item-redesign
          displayName="See All"
          i18n-displayName="Display name for category item for See All"
          [seoUrl]="'allskills'"
          [assetPath]="'redesign/see-all'"
          [qtsLabel]="'more'"
          [iconSize]="HireCategoryItemIconSize.SMALL"
          [flMarginBottom]="Margin.MID"
        >
        </app-home-page-hire-category-item-redesign>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./hire-categories-redesign.component.scss'],
})
export class HomePageHireCategoriesRedesignComponent {
  HeadingType = HeadingType;
  HeadingWeight = HeadingWeight;
  HireCategoryItemIconSize = HireCategoryItemIconSize;
  Margin = Margin;
  TextSize = TextSize;
}
