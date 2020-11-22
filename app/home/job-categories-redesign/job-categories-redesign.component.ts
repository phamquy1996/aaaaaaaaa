import { Component } from '@angular/core';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { CarouselArrowPosition } from '@freelancer/ui/carousel';
import { DirectoryItemAlignment } from '@freelancer/ui/directory-item';
import { HeadingType } from '@freelancer/ui/heading';
import { IconSize } from '@freelancer/ui/icon';
import { LinkColor } from '@freelancer/ui/link';
import { Margin } from '@freelancer/ui/margin';
import { PictureDisplay } from '@freelancer/ui/picture';
import { TextSize } from '@freelancer/ui/text';

export interface JobCategory {
  value: string;
  link: string;
  qtsLabel: string;
}
@Component({
  selector: 'app-job-categories-redesign',
  template: `
    <fl-bit class="JobCategories" flTrackingSection="HomePage-DirectorySection"
      ><ng-template #mobileAndWeb>
        <fl-bit class="JobCategories-groups-group">
          <fl-picture
            class="JobCategories-groups-group-icon"
            alt="Mobile Icon"
            i18n-alt="Microsoft Icon Alternative Text"
            [src]="'home/redesign/job-categories/mobile.svg'"
            [flMarginBottom]="Margin.MID"
            [display]="PictureDisplay.BLOCK"
            [lazyLoad]="true"
          ></fl-picture>
          <fl-heading
            i18n="Mobile and Web heading"
            [size]="TextSize.SMALL"
            [sizeTablet]="TextSize.MID"
            [headingType]="HeadingType.H3"
            [flMarginBottom]="Margin.MID"
          >
            Mobile & Web
          </fl-heading>
          <fl-hr [flMarginBottom]="Margin.MID"></fl-hr>

          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="shopify_link"
              link="hire/shopify"
              i18n="Category Display Name for Shopify"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              Shopify
            </fl-link></fl-bit
          >
          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="wordpress_link"
              link="hire/wordpress"
              i18n="Category Display Name for WordPress"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              WordPress
            </fl-link></fl-bit
          >
          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="javascript_link"
              link="hire/javascript"
              i18n="Category Display Name for Javascript"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              Javascript
            </fl-link></fl-bit
          >
          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="html_link"
              link="hire/html"
              i18n="Category Display Name for HTML"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              HTML
            </fl-link></fl-bit
          >
          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="css_link"
              link="hire/css"
              i18n="Category Display Name for CSS"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              CSS
            </fl-link></fl-bit
          >
          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="website-design_link"
              link="hire/website-design"
              i18n="Category Display Name for Website Design"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              Website Design
            </fl-link></fl-bit
          >
          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="squarespace_link"
              link="hire/squarespace"
              i18n="Category Display Name for Squarespace"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              Squarespace
            </fl-link></fl-bit
          >
          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="mobile-phone_link"
              link="hire/mobile-phone"
              i18n="Category Display Name for Mobile App Development"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              Mobile App Development
            </fl-link></fl-bit
          >
        </fl-bit>
      </ng-template>
      <ng-template #development>
        <fl-bit class="JobCategories-groups-group">
          <fl-picture
            class="JobCategories-groups-group-icon"
            alt="Development Icon"
            i18n-alt="Microsoft Icon Alternative Text"
            [src]="'home/redesign/job-categories/development.svg'"
            [flMarginBottom]="Margin.MID"
            [display]="PictureDisplay.BLOCK"
            [lazyLoad]="true"
          ></fl-picture>
          <fl-heading
            i18n="Development"
            [size]="TextSize.SMALL"
            [sizeTablet]="TextSize.MID"
            [headingType]="HeadingType.H3"
            [flMarginBottom]="Margin.MID"
          >
            Development
          </fl-heading>
          <fl-hr [flMarginBottom]="Margin.MID"></fl-hr>

          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="roblox_link"
              link="hire/roblox"
              i18n="Category Display Name for Roblox"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              Roblox
            </fl-link></fl-bit
          >
          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="cms_link"
              link="hire/cms"
              i18n="Category Display Name for CMS"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              CMS
            </fl-link></fl-bit
          >
          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="java_link"
              link="hire/java"
              i18n="Category Display Name for Java"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              Java
            </fl-link></fl-bit
          >
          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="python_link"
              link="hire/python"
              i18n="Category Display Name for Python"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              Python
            </fl-link></fl-bit
          >
          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="software-architecture_link"
              link="hire/software-architecture"
              i18n="Category Display Name for Software Architecture"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              Architecture
            </fl-link></fl-bit
          >
          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="php_link"
              link="hire/php"
              i18n="Category Display Name for PHP"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              PHP
            </fl-link></fl-bit
          >
          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="mysql_link"
              link="hire/mysql"
              i18n="Category Display Name for MySQL"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              MySQL
            </fl-link></fl-bit
          >
          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="net_link"
              link="hire/dot-net"
              i18n="Category Display Name for .Net"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              .Net
            </fl-link></fl-bit
          >
        </fl-bit>
      </ng-template>
      <ng-template #internet>
        <fl-bit class="JobCategories-groups-group">
          <fl-picture
            class="JobCategories-groups-group-icon"
            alt="Internet Icon"
            i18n-alt="Microsoft Icon Alternative Text"
            [src]="'home/redesign/job-categories/internet.svg'"
            [flMarginBottom]="Margin.MID"
            [display]="PictureDisplay.BLOCK"
            [lazyLoad]="true"
          ></fl-picture>
          <fl-heading
            i18n="Internet"
            [size]="TextSize.SMALL"
            [sizeTablet]="TextSize.MID"
            [headingType]="HeadingType.H3"
            [flMarginBottom]="Margin.MID"
          >
            Internet
          </fl-heading>
          <fl-hr [flMarginBottom]="Margin.MID"></fl-hr>

          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="aws_link"
              link="hire/amazon-web-services"
              i18n="Category Display Name for AWS"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              AWS
            </fl-link></fl-bit
          >
          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="seo_link"
              link="hire/seo"
              i18n="Category Display Name for SEO"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              SEO
            </fl-link></fl-bit
          >
          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="internet-marketing_link"
              link="hire/linux"
              i18n="Category Display Name for Linux"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              Linux
            </fl-link></fl-bit
          >
          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="social-media-marketing_link"
              link="hire/social-media-marketing"
              i18n="Category Display Name for Social Media Marketing"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              Social Media
            </fl-link></fl-bit
          >
          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="analytics_link"
              link="hire/analytics"
              i18n="Category Display Name for Analytics"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              Analytics
            </fl-link></fl-bit
          >
          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="api_link"
              link="hire/API"
              i18n="Category Display Name for API"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              API
            </fl-link></fl-bit
          >
          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="google-tag-management_link"
              link="hire/google-tag-management"
              i18n="Category Display Name for Google Tag Management"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              Google Tag Management
            </fl-link></fl-bit
          >
          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="youtube_link"
              link="hire/youtube"
              i18n="Category Display Name for YouTube"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              YouTube
            </fl-link></fl-bit
          >
        </fl-bit>
      </ng-template>
      <ng-template #motionAndDesign>
        <fl-bit class="JobCategories-groups-group">
          <fl-picture
            class="JobCategories-groups-group-icon"
            alt="Design Icon"
            i18n-alt="Microsoft Icon Alternative Text"
            [src]="'home/redesign/job-categories/design.svg'"
            [flMarginBottom]="Margin.MID"
            [display]="PictureDisplay.BLOCK"
            [lazyLoad]="true"
          ></fl-picture>
          <fl-heading
            i18n="Motion & Design"
            [size]="TextSize.SMALL"
            [sizeTablet]="TextSize.MID"
            [headingType]="HeadingType.H3"
            [flMarginBottom]="Margin.MID"
          >
            Motion & Design
          </fl-heading>
          <fl-hr [flMarginBottom]="Margin.MID"></fl-hr>

          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="photoshop_link"
              link="hire/photoshop"
              i18n="Category Display Name for Photoshop"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              Photoshop
            </fl-link></fl-bit
          >
          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="graphic-design_link"
              link="hire/graphic-design"
              i18n="Category Display Name for Graphic Design"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              Graphic Design
            </fl-link></fl-bit
          >
          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="illustration_link"
              link="hire/illustration"
              i18n="Category Display Name for Illustration"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              Illustration
            </fl-link></fl-bit
          >
          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="logo-design_link"
              link="hire/logo-design"
              i18n="Category Display Name for Logo Design"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              Logo Design
            </fl-link></fl-bit
          >
          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="threed-modelling_link"
              link="hire/threed-modelling"
              i18n="Category Display Name for 3D Modelling"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              3D Modelling
            </fl-link></fl-bit
          >
          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="ux-ui-design_link"
              link="hire/user-experience-design"
              i18n="Category Display Name for UX/UI Design"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              UX/UI Design
            </fl-link></fl-bit
          >
          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="animation_link"
              link="hire/animation"
              i18n="Category Display Name for Animation"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              Animation
            </fl-link></fl-bit
          >
          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="cgi_link"
              link="hire/computer-generated-images"
              i18n="Category Display Name for CGI"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              CGI
            </fl-link></fl-bit
          >
        </fl-bit>
      </ng-template>
      <ng-template #backoffice>
        <fl-bit class="JobCategories-groups-group">
          <fl-picture
            class="JobCategories-groups-group-icon"
            alt="Backoffice Icon"
            i18n-alt="Microsoft Icon Alternative Text"
            [src]="'home/redesign/job-categories/backoffice.svg'"
            [flMarginBottom]="Margin.MID"
            [display]="PictureDisplay.BLOCK"
            [lazyLoad]="true"
          ></fl-picture>
          <fl-heading
            i18n="Backoffice"
            [size]="TextSize.SMALL"
            [sizeTablet]="TextSize.MID"
            [headingType]="HeadingType.H3"
            [flMarginBottom]="Margin.MID"
          >
            Backoffice
          </fl-heading>
          <fl-hr [flMarginBottom]="Margin.MID"></fl-hr>
          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="finance_link"
              link="hire/finance"
              i18n="Category Display Name for Finance"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              Finance
            </fl-link></fl-bit
          >
          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="excel_link"
              link="hire/excel"
              i18n="Category Display Name for Excel"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              Excel
            </fl-link></fl-bit
          >
          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="accounting_link"
              link="hire/accounting"
              i18n="Category Display Name for Accounting"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              Accounting
            </fl-link></fl-bit
          >
          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="logistics_link"
              link="hire/logistics-shipping"
              i18n="Category Display Name for Logistics"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              Logistics
            </fl-link></fl-bit
          >
          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="manufacturing_link"
              link="hire/manufacturing"
              i18n="Category Display Name for Manufacturing"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              Manufacturing
            </fl-link></fl-bit
          >
          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="research_link"
              link="hire/research"
              i18n="Category Display Name for Research"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              Research
            </fl-link></fl-bit
          >
          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="legal_link"
              link="hire/legal"
              i18n="Category Display Name for Legal"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              Legal
            </fl-link></fl-bit
          >
          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="data-entry_link"
              link="hire/data-entry"
              i18n="Category Display Name for Data Entry"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              Data Entry
            </fl-link></fl-bit
          >
        </fl-bit>
      </ng-template>
      <ng-template #content>
        <fl-bit class="JobCategories-groups-group">
          <fl-picture
            class="JobCategories-groups-group-icon"
            alt="Contest Icon"
            i18n-alt="Contest Icon Alternative Text"
            [src]="'home/redesign/job-categories/content.svg'"
            [flMarginBottom]="Margin.MID"
            [display]="PictureDisplay.BLOCK"
            [lazyLoad]="true"
          ></fl-picture>
          <fl-heading
            i18n="Backoffice"
            [size]="TextSize.SMALL"
            [sizeTablet]="TextSize.MID"
            [headingType]="HeadingType.H3"
            [flMarginBottom]="Margin.MID"
          >
            Content
          </fl-heading>
          <fl-hr [flMarginBottom]="Margin.MID"></fl-hr>
          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="translation_link"
              link="hire/translation"
              i18n="Category Display Name for Translation"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              Translation
            </fl-link></fl-bit
          >
          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="marketing_link"
              link="hire/marketing"
              i18n="Category Display Name for Marketing"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              Marketing
            </fl-link></fl-bit
          >
          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="blog_link"
              link="hire/blog"
              i18n="Category Display Name for Blog"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              Blog
            </fl-link></fl-bit
          >
          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="copywriting_link"
              link="hire/copywriting"
              i18n="Category Display Name for Copywriting"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              Copywriting
            </fl-link></fl-bit
          >
          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="proofreading_link"
              link="hire/proofreading"
              i18n="Category Display Name for Proofreading"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              Proofreading
            </fl-link></fl-bit
          >
          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="technical-writing_link"
              link="hire/technical-writing"
              i18n="Category Display Name for Technical Writing"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              Technical Writing
            </fl-link></fl-bit
          >
          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="communications_link"
              link="hire/communications"
              i18n="Category Display Name for Communications"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              Communications
            </fl-link></fl-bit
          >
          <fl-bit
            class="JobCategories-groups-group-item"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-link
              flTrackingLabel="creative-writing_link"
              link="hire/creative-writing"
              i18n="Category Display Name for Creative Writing"
              [size]="TextSize.SMALL"
              [color]="LinkColor.DARK"
            >
              Creative Writing
            </fl-link></fl-bit
          >
        </fl-bit>
      </ng-template>
      <fl-heading
        class="JobCategories-header"
        i18n="Top Job Categories header"
        [size]="TextSize.XLARGE"
        [sizeDesktop]="TextSize.XXXLARGE"
        [sizeTablet]="TextSize.XXXLARGE"
        [headingType]="HeadingType.H2"
        [flMarginBottom]="Margin.MID"
        [flMarginBottomTablet]="Margin.XXLARGE"
        [flMarginBottomDesktop]="Margin.XXXLARGE"
      >
        Over 1600 skills and growing
      </fl-heading>
      <fl-grid
        class="JobCategories-groups"
        [flShowDesktop]="true"
        [flMarginBottom]="Margin.XXXXLARGE"
      >
        <fl-col [col]="2">
          <ng-template [ngTemplateOutlet]="mobileAndWeb"></ng-template>
        </fl-col>
        <fl-col [col]="2">
          <ng-template [ngTemplateOutlet]="development"></ng-template>
        </fl-col>
        <fl-col [col]="2">
          <ng-template [ngTemplateOutlet]="internet"></ng-template>
        </fl-col>
        <fl-col [col]="2">
          <ng-template [ngTemplateOutlet]="motionAndDesign"></ng-template>
        </fl-col>
        <fl-col [col]="2">
          <ng-template [ngTemplateOutlet]="backoffice"></ng-template>
        </fl-col>
        <fl-col [col]="2">
          <ng-template [ngTemplateOutlet]="content"></ng-template>
        </fl-col>
      </fl-grid>
      <fl-bit class="JobCategories-groups" [flShowMobile]="true">
        <fl-icon
          class="JobCategories-groups-button JobCategories-groups-button--prev"
          flTrackingLabel="prevBtn"
          [flHide]="currentGroup == 0"
          [name]="'ui-arrow-left-alt'"
          (click)="
            currentGroup = currentGroup > 0 ? currentGroup - 1 : currentGroup
          "
        ></fl-icon>
        <fl-icon
          class="JobCategories-groups-button JobCategories-groups-button--next"
          flTrackingLabel="nextBtn"
          [flHide]="currentGroup == 2"
          [name]="'ui-arrow-right-alt'"
          (click)="
            currentGroup = currentGroup < 2 ? currentGroup + 1 : currentGroup
          "
        ></fl-icon>
        <fl-carousel
          class="JobCategories-groups-carousel"
          [arrowPosition]="CarouselArrowPosition.OUTSIDE"
          [slidesToShow]="2"
          [padding]="10"
          [currentIndex]="currentGroup"
          [flMarginBottom]="Margin.LARGE"
        >
          <fl-carousel-item>
            <ng-template [ngTemplateOutlet]="mobileAndWeb"></ng-template>
          </fl-carousel-item>
          <fl-carousel-item>
            <ng-template [ngTemplateOutlet]="development"></ng-template>
          </fl-carousel-item>

          <fl-carousel-item>
            <ng-template [ngTemplateOutlet]="internet"></ng-template>
          </fl-carousel-item>

          <fl-carousel-item>
            <ng-template [ngTemplateOutlet]="motionAndDesign"></ng-template>
          </fl-carousel-item>

          <fl-carousel-item>
            <ng-template [ngTemplateOutlet]="backoffice"></ng-template>
          </fl-carousel-item>

          <fl-carousel-item>
            <ng-template [ngTemplateOutlet]="content"></ng-template>
          </fl-carousel-item>
        </fl-carousel>
      </fl-bit>
      <fl-bit class="JobCategories-groups" [flShowTablet]="true">
        <fl-icon
          class="JobCategories-groups-button JobCategories-groups-button--prev"
          flTrackingLabel="prevBtn"
          [flHide]="currentGroup == 0"
          [name]="'ui-arrow-left-alt'"
          (click)="
            currentGroup = currentGroup > 0 ? currentGroup - 1 : currentGroup
          "
        ></fl-icon>
        <fl-icon
          class="JobCategories-groups-button JobCategories-groups-button--next"
          flTrackingLabel="nextBtn"
          [flHide]="currentGroup == 1"
          [name]="'ui-arrow-right-alt'"
          (click)="
            currentGroup = currentGroup < 1 ? currentGroup + 1 : currentGroup
          "
        ></fl-icon>
        <fl-carousel
          class="JobCategories-groups-carousel"
          [arrowPosition]="CarouselArrowPosition.OUTSIDE"
          [slidesToShow]="3"
          [padding]="20"
          [currentIndex]="currentGroup"
          [flMarginBottom]="Margin.LARGE"
        >
          <fl-carousel-item>
            <ng-template [ngTemplateOutlet]="mobileAndWeb"></ng-template>
          </fl-carousel-item>
          <fl-carousel-item>
            <ng-template [ngTemplateOutlet]="development"></ng-template>
          </fl-carousel-item>

          <fl-carousel-item>
            <ng-template [ngTemplateOutlet]="internet"></ng-template>
          </fl-carousel-item>

          <fl-carousel-item>
            <ng-template [ngTemplateOutlet]="motionAndDesign"></ng-template>
          </fl-carousel-item>

          <fl-carousel-item>
            <ng-template [ngTemplateOutlet]="backoffice"></ng-template>
          </fl-carousel-item>

          <fl-carousel-item>
            <ng-template [ngTemplateOutlet]="content"></ng-template>
          </fl-carousel-item>
        </fl-carousel>
      </fl-bit>
      <fl-bit class="JobCategories-viewAll">
        <fl-button
          class="JobCategories-viewAll-button"
          flTrackingLabel="allskils_link"
          link="hire/allskills"
          i18n="Category Display Name for See All"
          [color]="ButtonColor.TRANSPARENT_DARK"
          [size]="ButtonSize.XLARGE"
        >
          View All
        </fl-button>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./job-categories-redesign.component.scss'],
})
export class HomePageJobCategoriesRedesignComponent {
  DirectoryItemAlignment = DirectoryItemAlignment;
  HeadingType = HeadingType;
  LinkColor = LinkColor;
  Margin = Margin;
  TextSize = TextSize;
  CarouselArrowPosition = CarouselArrowPosition;
  PictureDisplay = PictureDisplay;
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  IconSize = IconSize;

  currentGroup = 0;
}
