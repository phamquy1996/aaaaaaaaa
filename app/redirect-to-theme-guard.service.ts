import { Inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { UI_CONFIG } from '@freelancer/ui/ui.config';
import { UiConfig } from '@freelancer/ui/ui.interface';
import * as Rx from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RedirectToThemeGuard implements CanActivate {
  constructor(
    @Inject(UI_CONFIG) private uiConfig: UiConfig,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.uiConfig.theme) {
      this.router.navigate([`/${this.uiConfig.theme}/${route.url}`], {
        queryParams: route.queryParams,
      });
      return Rx.of(false);
    }
    return Rx.of(true);
  }
}
