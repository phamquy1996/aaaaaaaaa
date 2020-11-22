import { Component } from '@angular/core';
import { DirectoryItemAlignment } from '@freelancer/ui/directory-item';
import { HeadingType } from '@freelancer/ui/heading';
import { LinkColor } from '@freelancer/ui/link';
import { Margin } from '@freelancer/ui/margin';
import { TextSize } from '@freelancer/ui/text';

export interface JobCategory {
  value: string;
  link: string;
  qtsLabel: string;
}
@Component({
  selector: 'app-job-categories-card',
  template: `
    <fl-heading
      class="JobCategories-header"
      i18n="Top Job Categories header"
      [size]="TextSize.XLARGE"
      [headingType]="HeadingType.H2"
      [flMarginBottom]="Margin.XLARGE"
    >
      Browse top job categories
    </fl-heading>
    <fl-bit
      class="JobCategories-list"
      flTrackingSection="HomePage-DirectorySection"
    >
      <app-job-category-item
        qtsLabel="php_link"
        link="/php/"
        i18n-displayName="Category Display Name for PHP"
        displayName="PHP"
      ></app-job-category-item>
      <app-job-category-item
        qtsLabel="graphic-design_link"
        link="/graphic-design/"
        i18n-displayName="Category Display Name for Graphic Design"
        displayName="Graphic Design"
      ></app-job-category-item>
      <app-job-category-item
        qtsLabel="website-design_link"
        link="/website-design/"
        i18n-displayName="Category Display Name for Website Design"
        displayName="Website Design"
      ></app-job-category-item>
      <app-job-category-item
        qtsLabel="html_link"
        link="/html/"
        i18n-displayName="Category Display Name for HTML"
        displayName="HTML"
      ></app-job-category-item>
      <app-job-category-item
        qtsLabel="logo-design_link"
        link="/logo-design/"
        i18n-displayName="Category Display Name for Logo Design"
        displayName="Logo Design"
      ></app-job-category-item>
      <app-job-category-item
        qtsLabel="photoshop_link"
        link="/photoshop/"
        i18n-displayName="Category Display Name for Photoshop"
        displayName="Photoshop"
      ></app-job-category-item>
      <app-job-category-item
        qtsLabel="wordpress_link"
        link="/wordpress/"
        i18n-displayName="Category Display Name for WordPress"
        displayName="WordPress"
      ></app-job-category-item>
      <app-job-category-item
        qtsLabel="articles_link"
        link="/articles/"
        i18n-displayName="Category Display Name for Article Writing"
        displayName="Article Writing"
      ></app-job-category-item>
      <app-job-category-item
        qtsLabel="javascript_link"
        link="/javascript/"
        i18n-displayName="Category Display Name for Javascript"
        displayName="Javascript"
      ></app-job-category-item>
      <app-job-category-item
        qtsLabel="mobile-phone_link"
        link="/mobile-phone/"
        i18n-displayName="Category Display Name for Mobile App Development"
        displayName="Mobile App Development"
      ></app-job-category-item>
      <app-job-category-item
        qtsLabel="software-architecture_link"
        link="/software-architecture/"
        i18n-displayName="Category Display Name for Software Architecture"
        displayName="Software Architecture"
      ></app-job-category-item>
      <app-job-category-item
        qtsLabel="data-entry_link"
        link="/data-entry/"
        i18n-displayName="Category Display Name for Data Entry"
        displayName="Data Entry"
      ></app-job-category-item>
      <app-job-category-item
        qtsLabel="android_link"
        link="/android/"
        i18n-displayName="Category Display Name for Android"
        displayName="Android"
      ></app-job-category-item>
      <app-job-category-item
        qtsLabel="excel_link"
        link="/excel/"
        i18n-displayName="Category Display Name for Excel"
        displayName="Excel"
      ></app-job-category-item>
      <app-job-category-item
        qtsLabel="css_link"
        link="/css/"
        i18n-displayName="Category Display Name for CSS"
        displayName="CSS"
      ></app-job-category-item>
      <app-job-category-item
        qtsLabel="html-five_link"
        link="/html-five/"
        i18n-displayName="Category Display Name for HTML5"
        displayName="HTML5"
      ></app-job-category-item>
      <app-job-category-item
        qtsLabel="internet-marketing_link"
        link="/internet-marketing/"
        i18n-displayName="Category Display Name for Internet Marketing"
        displayName="Internet Marketing"
      ></app-job-category-item>
      <app-job-category-item
        qtsLabel="copywriting_link"
        link="/copywriting/"
        i18n-displayName="Category Display Name for Copywriting"
        displayName="Copywriting"
      ></app-job-category-item>
      <app-job-category-item
        qtsLabel="seo_link"
        link="/seo/"
        i18n-displayName="Category Display Name for SEO"
        displayName="SEO"
      ></app-job-category-item>
      <app-job-category-item
        qtsLabel="iphone_link"
        link="/iphone/"
        i18n-displayName="Category Display Name for iPhone"
        displayName="iPhone"
      ></app-job-category-item>
      <app-job-category-item
        qtsLabel="research-writing_link"
        link="/research-writing/"
        i18n-displayName="Category Display Name for Research Writing"
        displayName="Research Writing"
      ></app-job-category-item>
      <app-job-category-item
        qtsLabel="translation_link"
        link="/translation/"
        i18n-displayName="Category Display Name for Translation"
        displayName="Translation"
      ></app-job-category-item>
      <app-job-category-item
        qtsLabel="java_link"
        link="/java/"
        i18n-displayName="Category Display Name for Java"
        displayName="Java"
      ></app-job-category-item>
      <app-job-category-item
        qtsLabel="mysql_link"
        link="/mysql/"
        i18n-displayName="Category Display Name for MySQL"
        displayName="MySQL"
      ></app-job-category-item>
      <app-job-category-item
        qtsLabel="ghostwriting_link"
        link="/ghostwriting/"
        i18n-displayName="Category Display Name for Ghostwriting"
        displayName="Ghostwriting"
      ></app-job-category-item>
      <app-job-category-item
        qtsLabel="marketing_link"
        link="/marketing/"
        i18n-displayName="Category Display Name for Marketing"
        displayName="Marketing"
      ></app-job-category-item>
      <app-job-category-item
        qtsLabel="data-processing_link"
        link="/data-processing/"
        i18n-displayName="Category Display Name for Data Processing"
        displayName="Data Processing"
      ></app-job-category-item>
      <app-job-category-item
        qtsLabel="technical-writing_link"
        link="/technical-writing/"
        i18n-displayName="Category Display Name for Technical Writing"
        displayName="Technical Writing"
      ></app-job-category-item>
      <app-job-category-item
        qtsLabel="python_link"
        link="/python/"
        i18n-displayName="Category Display Name for Python"
        displayName="Python"
      ></app-job-category-item>
      <app-job-category-item
        qtsLabel="social-media-marketing_link"
        link="/social-media-marketing/"
        i18n-displayName="Category Display Name for Social Media Marketing"
        displayName="Social Media Marketing"
      ></app-job-category-item>
      <app-job-category-item
        qtsLabel="research_link"
        link="/research/"
        i18n-displayName="Category Display Name for Research"
        displayName="Research"
      ></app-job-category-item>
      <app-job-category-item
        qtsLabel="link-building_link"
        link="/link-building/"
        i18n-displayName="Category Display Name for Link Building"
        displayName="Link Building"
      ></app-job-category-item>
      <app-job-category-item
        qtsLabel="c-sharp-programming_link"
        link="/c-sharp-programming/"
        i18n-displayName="Category Display Name for C# Programming"
        displayName="C# Programming"
      ></app-job-category-item>
      <app-job-category-item
        qtsLabel="threed-modelling_link"
        link="/threed-modelling/"
        i18n-displayName="Category Display Name for 3D Modelling"
        displayName="3D Modelling"
      ></app-job-category-item>
      <app-job-category-item
        qtsLabel="web-search_link"
        link="/web-search/"
        i18n-displayName="Category Display Name for Web Search"
        displayName="Web Search"
      ></app-job-category-item>
      <app-job-category-item
        qtsLabel="web-scraping_link"
        link="/web-scraping/"
        i18n-displayName="Category Display Name for Web Scraping"
        displayName="Web Scraping"
      ></app-job-category-item>
      <app-job-category-item
        qtsLabel="rendering_link"
        link="/rendering/"
        i18n-displayName="Category Display Name for 3D Rendering"
        displayName="3D Rendering"
      ></app-job-category-item>
      <app-job-category-item
        qtsLabel="linux_link"
        link="/linux/"
        i18n-displayName="Category Display Name for Linux"
        displayName="Linux"
      ></app-job-category-item>
      <app-job-category-item
        qtsLabel="video-services_link"
        link="/video-services/"
        i18n-displayName="Category Display Name for Video Services"
        displayName="Video Services"
      ></app-job-category-item>
      <app-job-category-item
        qtsLabel="cplusplus-programming_link"
        link="/cplusplus-programming/"
        i18n-displayName="Category Display Name for C++ Programming"
        displayName="C++ Programming"
      ></app-job-category-item>
      <app-job-category-item
        qtsLabel="ecommerce_link"
        link="/ecommerce/"
        i18n-displayName="Category Display Name for eCommerce"
        displayName="eCommerce"
      ></app-job-category-item>
      <app-job-category-item
        qtsLabel="banner-design_link"
        link="/banner-design/"
        i18n-displayName="Category Display Name for Banner Design"
        displayName="Banner Design"
      ></app-job-category-item>
      <app-job-category-item
        qtsLabel="illustration_link"
        link="/illustration/"
        i18n-displayName="Category Display Name for Illustration"
        displayName="Illustration"
      ></app-job-category-item>
      <app-job-category-item
        qtsLabel="proofreading_link"
        link="/proofreading/"
        i18n-displayName="Category Display Name for Proofreading"
        displayName="Proofreading"
      ></app-job-category-item>
      <app-job-category-item
        qtsLabel="threed-animation_link"
        link="/threed-animation/"
        i18n-displayName="Category Display Name for 3D Animation"
        displayName="3D Animation"
      ></app-job-category-item>
      <app-job-category-item
        qtsLabel="content-writing_link"
        link="/content-writing/"
        i18n-displayName="Category Display Name for Content Writing"
        displayName="Content Writing"
      ></app-job-category-item>
      <app-job-category-item
        qtsLabel="allskils_link"
        link="/allskills/"
        i18n-displayName="Category Display Name for See All"
        displayName="See All"
      ></app-job-category-item>
    </fl-bit>
  `,
  styleUrls: ['./job-categories.component.scss'],
})
export class HomePageJobCategoriesComponent {
  DirectoryItemAlignment = DirectoryItemAlignment;
  HeadingType = HeadingType;
  LinkColor = LinkColor;
  Margin = Margin;
  TextSize = TextSize;

  jobCategories: ReadonlyArray<JobCategory> = [
    {
      value: 'PHP',
      link: '/php/',
      qtsLabel: 'php_link',
    },
    {
      value: 'Graphic Design',
      link: '/graphic-design/',
      qtsLabel: 'graphic-design_link',
    },
    {
      value: 'Website Design',
      link: '/website-design/',
      qtsLabel: 'website-design_link',
    },
    {
      value: 'HTML',
      link: '/html/',
      qtsLabel: 'html_link',
    },
    {
      value: 'Logo Design',
      link: '/logo-design/',
      qtsLabel: 'logo-design_link',
    },
    {
      value: 'Photoshop',
      link: '/photoshop/',
      qtsLabel: 'photoshop_link',
    },
    {
      value: 'WordPress',
      link: '/wordpress/',
      qtsLabel: 'wordpress_link',
    },
    {
      value: 'Article Writing',
      link: '/articles/',
      qtsLabel: 'articles_link',
    },
    {
      value: 'Javascript',
      link: '/javascript/',
      qtsLabel: 'javascript_link',
    },
    {
      value: 'Mobile App Development',
      link: '/mobile-phone/',
      qtsLabel: 'mobile-phone_link',
    },
    {
      value: 'Software Architecture',
      link: '/software-architecture/',
      qtsLabel: 'software-architecture_link',
    },
    {
      value: 'Data Entry',
      link: '/data-entry/',
      qtsLabel: 'data-entry_link',
    },
    {
      value: 'Android',
      link: '/android/',
      qtsLabel: 'android_link',
    },
    {
      value: 'Excel',
      link: '/excel/',
      qtsLabel: 'excel_link',
    },
    {
      value: 'CSS',
      link: '/css/',
      qtsLabel: 'css_link',
    },
    {
      value: 'HTML5',
      link: '/html-five/',
      qtsLabel: 'html-five_link',
    },
    {
      value: 'Internet Marketing',
      link: '/internet-marketing/',
      qtsLabel: 'internet-marketing_link',
    },
    {
      value: 'Copywriting',
      link: '/copywriting/',
      qtsLabel: 'copywriting_link',
    },
    {
      value: 'SEO',
      link: '/seo/',
      qtsLabel: 'seo_link',
    },
    {
      value: 'iPhone',
      link: '/iphone/',
      qtsLabel: 'iphone_link',
    },
    {
      value: 'Research Writing',
      link: '/research-writing/',
      qtsLabel: 'research-writing_link',
    },
    {
      value: 'Translation',
      link: '/translation/',
      qtsLabel: 'translation_link',
    },
    {
      value: 'Java',
      link: '/java/',
      qtsLabel: 'java_link',
    },
    {
      value: 'MySQL',
      link: '/mysql/',
      qtsLabel: 'mysql_link',
    },
    {
      value: 'Ghostwriting',
      link: '/ghostwriting/',
      qtsLabel: 'ghostwriting_link',
    },
    {
      value: 'Marketing',
      link: '/marketing/',
      qtsLabel: 'marketing_link',
    },
    {
      value: 'Data Processing',
      link: '/data-processing/',
      qtsLabel: 'data-processing_link',
    },
    {
      value: 'Technical Writing',
      link: '/technical-writing/',
      qtsLabel: 'technical-writing_link',
    },
    {
      value: 'Python',
      link: '/python/',
      qtsLabel: 'python_link',
    },
    {
      value: 'Social Media Marketing',
      link: '/social-media-marketing/',
      qtsLabel: 'social-media-marketing_link',
    },
    {
      value: 'Research',
      link: '/research/',
      qtsLabel: 'research_link',
    },
    {
      value: 'Link Building',
      link: '/link-building/',
      qtsLabel: 'link-building_link',
    },
    {
      value: 'C# Programming',
      link: '/c-sharp-programming/',
      qtsLabel: 'c-sharp-programming_link',
    },
    {
      value: '3D Modelling',
      link: '/threed-modelling/',
      qtsLabel: 'threed-modelling_link',
    },
    {
      value: 'Web Search',
      link: '/web-search/',
      qtsLabel: 'web-search_link',
    },
    {
      value: 'Web Scraping',
      link: '/web-scraping/',
      qtsLabel: 'web-scraping_link',
    },
    {
      value: '3D Rendering',
      link: '/rendering/',
      qtsLabel: 'rendering_link',
    },
    {
      value: 'Linux',
      link: '/linux/',
      qtsLabel: 'linux_link',
    },
    {
      value: 'Video Services',
      link: '/video-services/',
      qtsLabel: 'video-services_link',
    },
    {
      value: 'C++ Programming',
      link: '/cplusplus-programming/',
      qtsLabel: 'cplusplus-programming_link',
    },
    {
      value: 'eCommerce',
      link: '/ecommerce/',
      qtsLabel: 'ecommerce_link',
    },
    {
      value: 'Banner Design',
      link: '/banner-design/',
      qtsLabel: 'banner-design_link',
    },
    {
      value: 'Illustration',
      link: '/illustration/',
      qtsLabel: 'illustration_link',
    },
    {
      value: 'Proofreading',
      link: '/proofreading/',
      qtsLabel: 'proofreading_link',
    },
    {
      value: '3D Animation',
      link: '/threed-animation/',
      qtsLabel: 'threed-animation_link',
    },
    {
      value: 'Content Writing',
      link: '/content-writing/',
      qtsLabel: 'content-writing_link',
    },
    {
      value: 'See All',
      link: '/allskills/',
      qtsLabel: 'allskils_link',
    },
  ];

  trackByCategoryValue(index: number, job: JobCategory) {
    return job.value;
  }
}
