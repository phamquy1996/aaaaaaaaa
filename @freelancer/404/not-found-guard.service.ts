import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { NotFound } from './not-found.service';

@Injectable({
  providedIn: 'root',
})
export class NotFoundGuard implements CanActivate {
  constructor(private notFound: NotFound) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.notFound.render();
  }
}
