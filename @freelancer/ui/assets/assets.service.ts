// tslint:disable:no-assets-base-url
import { Inject, Injectable } from '@angular/core';
import { Location } from '@freelancer/location';
import { UI_CONFIG } from '../ui.config';
import { UiConfig } from '../ui.interface';

@Injectable({
  providedIn: 'root',
})
export class Assets {
  constructor(
    private location: Location,
    @Inject(UI_CONFIG) private uiConfig: UiConfig,
  ) {}

  getUrl(assetName: string): string {
    // if the assets base url is relative, prepend with the current origin for
    // SSR to work
    return this.uiConfig.assetsBaseUrl.startsWith('/')
      ? `${this.location.origin}${this.uiConfig.assetsBaseUrl}/${assetName}`
      : `${this.uiConfig.assetsBaseUrl}/${assetName}`;
  }

  // PRIVATE API only used for SSR
  isAssetUrl(url: string): boolean {
    return this.uiConfig.assetsBaseUrl.startsWith('/')
      ? url.startsWith(`${this.location.origin}${this.uiConfig.assetsBaseUrl}/`)
      : url.startsWith(`${this.uiConfig.assetsBaseUrl}/`);
  }

  // PRIVATE API only used for SSR
  getAssetPath(url: string): string {
    return url.replace(/^.*?(?=\/assets\/)\/assets\//, '');
  }
}
