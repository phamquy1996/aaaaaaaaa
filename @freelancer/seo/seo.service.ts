import { DOCUMENT, isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import {
  Applications,
  AppsDomainsMap,
  APPS_DOMAINS_MAP,
  APP_NAME,
  Locale,
  SITE_NAME,
} from '@freelancer/config';
import { FacebookConfig, FACEBOOK_CONFIG } from '@freelancer/facebook';
import { Location } from '@freelancer/location';
import { Assets } from '@freelancer/ui/assets';
import { take } from 'rxjs/operators';
import { SEO_CONFIG } from './seo.config';
import { LinkTag, SeoConfig } from './seo.interface';

/**
 * A service that can be used to set the title, description, thumbnail image,
 * and other SEO metadata of the current HTML document.
 */
export interface SeoPageConfig {
  // Page title. Must be unique to the page & related to its content.
  // All pages should provide it.
  title: string;
  // Page description. Must be unique to the page & related to its content.
  // All logged-out pages should provide it.
  description?: string;
  // Page thumbnail image (png or jpg)
  // All logged-out content pages should provide it.
  // FB recommends 1:1 images (because mobile), 1200 x 1200 pixels
  // /!\ SVGs are not supported by the Open Graph standard.
  image?: string;
  // Allows to override the path used when generating the canonical URL.
  // By default the page canonical URL is generated from the lowercase version of the current path: set `canonicalPath` to a different path.
  canonicalPath?: string;
  // List of query params that are preserved when generating the canonical URL.
  // By default all the query params are scrapped.
  // Only provide this if you need to preserve some of the query params.
  canonicalQueryParams?: string[];
  // Prevents a page from being indexed & its links followed.
  // Only ever use if you don't want a page to be indexed, e.g. for search
  // pages that show no results.
  noIndex?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class Seo {
  constructor(
    @Inject(APPS_DOMAINS_MAP) private appsDomainsMap: AppsDomainsMap,
    @Inject(APP_NAME) private appName: Applications,
    private assets: Assets,
    @Inject(DOCUMENT) private doc: Document,
    private location: Location,
    private meta: Meta,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(SEO_CONFIG)
    private seoConfig: SeoConfig,
    @Inject(SITE_NAME) private siteName: string,
    private titleService: Title,
    @Inject(FACEBOOK_CONFIG) private facebookConfig: FacebookConfig,
  ) {}

  /**
   * Allows to set the page SEO tags
   */
  async setPageTags(config: SeoPageConfig) {
    // Page title
    this.titleService.setTitle(`${config.title} | ${this.siteName}`);

    // It only make sense to set meta tags on logged-out pages
    if (isPlatformServer(this.platformId)) {
      await this.location
        .valueChanges()
        .pipe(take(1))
        .toPromise()
        .then(location => {
          const defaultCanonicalUrl = this.location.pathname.toLowerCase();
          let canonicalUrl = `${location.origin}${
            config.canonicalPath
              ? `/${config.canonicalPath}`
              : defaultCanonicalUrl
          }`;

          if (config.canonicalPath) {
            this.addHrefTags(`/${config.canonicalPath}`);
          }

          // Override default canonical link if canonicalQueryParams is provided
          const { canonicalQueryParams } = config;
          if (canonicalQueryParams) {
            const { searchParams } = new URL(this.location.href);
            const filteredSearchParams = new URLSearchParams();
            let hasParam = false;
            searchParams.forEach((name, value) => {
              if (canonicalQueryParams.includes(name)) {
                hasParam = true;
                filteredSearchParams.append(name, value);
              }
            });
            filteredSearchParams.sort();
            if (hasParam) {
              canonicalUrl = `${canonicalUrl}?${filteredSearchParams.toString()}`;
              this.addHrefTags(canonicalUrl);
            }
          }

          if (config.description) {
            // This prevents devs from passing down say the full project
            // description as the meta description tag & having it bloating the
            // <head>.
            // Google will also strip down a meta description, however whilst
            // generally Google only displays under 160 characters they will
            // sometimes display over this, so we strip the description at 170
            // characters to be safe.
            const strippedDescription = config.description.substr(0, 170);
            // Meta description
            this.meta.updateTag({
              name: 'description',
              content: strippedDescription,
            });
            // Open Graph tags
            // The title should not have branding or extraneous information.
            this.meta.updateTag({
              property: 'og:title',
              content: config.title,
            });
            this.meta.updateTag({
              property: 'og:type',
              content: 'website',
            });
            this.meta.updateTag({
              property: 'og:description',
              content: strippedDescription,
            });
            this.meta.updateTag({
              property: 'og:url',
              content: canonicalUrl,
            });
            this.meta.updateTag({
              property: 'og:image',
              content: config.image
                ? config.image
                : this.assets.getUrl(this.seoConfig.defaultMetaImage),
            });
            if (this.facebookConfig.appId) {
              this.meta.updateTag({
                property: 'fb:app_id',
                content: this.facebookConfig.appId,
              });
            }
          }
          // Override default robots meta if noIndex is provided
          if (config.noIndex) {
            // If there's already a <meta name="robots"> tag, override it
            this.meta.updateTag({
              name: 'robots',
              content: 'noindex, nofollow',
            });
          }
        });
    }
  }

  /*
   * PRIVATE: only to be used by the Seo component
   * this allows the seo tags to be (re)set to their default values on
   * navigations
   */
  setDefaultPageTags() {
    // Reset title to default
    this.titleService.setTitle(this.siteName);

    // It only make sense to set meta tags on logged-out pages
    if (isPlatformServer(this.platformId)) {
      this.addHrefTags(this.location.pathname);

      // Add global link tags, e.g. RSS
      if (this.seoConfig.linkTags) {
        Object.values(this.seoConfig.linkTags).forEach(linkTag => {
          if (linkTag) {
            this.addLinkTag(linkTag);
          }
        });
      }

      // Add global meta tags, e.g. Robot
      if (this.seoConfig.metaTags) {
        Object.values(this.seoConfig.metaTags).forEach(metaTag => {
          if (metaTag) {
            this.meta.updateTag(metaTag);
          }
        });
      }
    }
  }

  /**
   * Adds canonical & alternate href tags to the HEAD
   */
  private addHrefTags(url: string) {
    // All canonical & alternate URLs must be lowercase
    const lowerCaseUrl = url.toLowerCase();
    this.location
      .valueChanges()
      .pipe(take(1))
      .toPromise()
      .then(location => {
        // Set canonical URL. This tells search engines that the specific url is
        // the master copy of that page.
        this.addLinkTag({
          rel: 'canonical',
          href: `${location.origin}${lowerCaseUrl}`,
        });

        // Set alternate URLs (hrefland tags)
        Object.entries(this.appsDomainsMap[this.appName]).forEach(
          ([locale, domain]) => {
            // en-US is our default locale
            if (locale === 'en') {
              this.addLinkTag({
                rel: 'alternate',
                hreflang: 'x-default',
                href: `https://${domain}${lowerCaseUrl}`,
              });
            }
            // FIXME: some locales do not have custom domains, i.e. aren't
            // crawlable, so including them here would result in dupplicate
            // content.
            // We need to either set up proper subdomains for them or switch to
            // another method, e.g. ?lang= query param.
            if (domain === this.appsDomainsMap[this.appName].en) {
              return;
            }

            // Add all link tags with just the language as the `locale`
            if (!locale.includes('-')) {
              this.addLinkTag({
                rel: 'alternate',
                hreflang: locale,
                href: `https://${domain}${lowerCaseUrl}`,
              });
              return;
            }

            // Need to be typecasted since it doesn't know if
            // that is `Locale` until runtime.
            const language = locale.split('-')[0] as Locale;

            // If a `language` like `en` or `fr` has a domain which matches
            // locales like `en-us` or `fr-fr`, remove the `en-us` and `fr-fr`
            // since they match with an existing domain.
            if (domain !== this.appsDomainsMap[this.appName][language]) {
              this.addLinkTag({
                rel: 'alternate',
                hreflang: locale,
                href: `https://${domain}${lowerCaseUrl}`,
              });
            }
          },
        );
      });
  }

  /**
   * Adds a link tag to the HEAD
   */
  private addLinkTag(tag: LinkTag): void {
    const link = this.doc.createElement('link');

    if (tag.rel) {
      if (tag.rel === 'canonical') {
        this.resetCanonicalUrl();
      }
      link.setAttribute('rel', tag.rel);
    }

    if (tag.href) {
      link.setAttribute(
        'href',
        // this allows link tags hrefs to be specified with root-relative URLs
        // and we'll automatically append the origin here
        tag.href.startsWith('/')
          ? `${this.location.origin}${tag.href}`
          : tag.href,
      );
    }

    if (tag.hreflang) {
      link.setAttribute('hreflang', tag.hreflang);
    }

    if (tag.itemprop) {
      link.setAttribute('itemprop', tag.itemprop);
    }

    if (tag.title) {
      link.setAttribute('title', tag.title);
    }

    if (tag.type) {
      link.setAttribute('type', tag.type);
    }

    this.doc.head.appendChild(link);
  }

  private resetCanonicalUrl() {
    Array.from(this.doc.getElementsByTagName('link'))
      .filter(element => element.rel === 'canonical')
      .map(link => {
        if (link) {
          link.remove();
        }
      });
  }
}
