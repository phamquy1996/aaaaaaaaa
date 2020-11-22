import { Inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { RedirectToPhp } from '@freelancer/redirect-to-php';
import { UI_CONFIG } from '@freelancer/ui/ui.config';
import { UiConfig } from '@freelancer/ui/ui.interface';
import * as Rx from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomePageGuard implements CanActivate {
  constructor(
    @Inject(UI_CONFIG) private uiConfig: UiConfig,
    private redirectToPhp: RedirectToPhp,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.uiConfig.theme === 'arrow') {
      return this.redirectToPhp.doRedirect(state.url);
    }

    if (route.queryParams.w === 't') {
      return Rx.of(true);
    }

    if (route.queryParams.w === 'f') {
      return this.redirectToPhp.doRedirect(state.url);
    }

    return Rx.of(true);
  }
}
