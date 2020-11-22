import { Inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { NotFound } from '@freelancer/404';
import { UI_CONFIG } from '@freelancer/ui/ui.config';
import { UiConfig } from '@freelancer/ui/ui.interface';
import * as Rx from 'rxjs';

/**
 * This guard is used to check any routes that are Freightlancer specific, for pages
 * that should only be accessed on the Freightlancer domain. If a page is requested
 * from a non-Arrow domain, we will try to redirect the user to the not-found
 * page.
 */
@Injectable()
export class FreightlancerPageGuard implements CanActivate {
  constructor(
    private notFound: NotFound,
    @Inject(UI_CONFIG) private uiConfig: UiConfig,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.uiConfig.theme === 'freightlancer') {
      return Rx.of(true);
    }

    return this.notFound.render();
  }
}
