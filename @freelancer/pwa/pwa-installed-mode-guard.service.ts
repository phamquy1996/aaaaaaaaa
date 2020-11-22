import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { Pwa } from './pwa.service';

@Injectable({
  providedIn: 'root',
})
export class PwaInstalledModeGuard implements CanActivate {
  constructor(private pwa: Pwa) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // Using the `pwa_installed` query param allows to force the installed
    // mode even when the app is not running in a standalone view
    if (route.queryParams.pwa_installed !== undefined) {
      this.pwa.activateInstalledMode();
    }
    return true;
  }
}
