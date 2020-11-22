import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  NavigationEnd,
  Router,
} from '@angular/router';
import { NotFoundRouteConfig } from '@freelancer/404';
import { Tracking } from './tracking.service';

@Component({
  selector: 'fl-page-view-tracking',
  template: `
    <ng-container></ng-container>
  `,
})
export class PageViewTrackingComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private tracking: Tracking,
    private router: Router,
  ) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      // track page views
      if (event instanceof NavigationEnd) {
        this.tracking.trackPageView(
          getRecursiveRouteData(this.activatedRoute.snapshot).is404,
        );
      }
    });
  }
}

/**
 * get config from nested child routes
 * TODO: we should enable paramsInheritanceStrategy instead
 */
export function getRecursiveRouteData(
  snapshot: ActivatedRouteSnapshot,
): NotFoundRouteConfig {
  let { data } = snapshot;
  snapshot.children.forEach(child => {
    data = { ...data, ...getRecursiveRouteData(child) };
  });
  return data;
}
