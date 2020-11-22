import { Directive, HostBinding, Input } from '@angular/core';
import { Pwa } from './pwa.service';

/**
 * This allows to hide certain UI elements in PWA installed mode, e.g. app
 * store badges for instance (since, well, you're already inside an app -_-).
 */
@Directive({
  selector: `[flPwaHideInstalled]`,
})
export class PwaHideInstalledDirective {
  @HostBinding('attr.data-pwa-hide-installed')
  hideInstalled: boolean;

  @Input()
  set flPwaHideInstalled(hide: boolean) {
    this.hideInstalled = hide && this.pwa.isInstalled();
  }

  constructor(private pwa: Pwa) {}
}
