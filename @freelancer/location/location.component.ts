import { isPlatformServer } from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
  Optional,
  PLATFORM_ID,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { Request } from 'express';
import { Location } from './location.service';

@Component({
  selector: 'fl-location',
  template: `
    <ng-container></ng-container>
  `,
})
// This component pushes new locations to the Location service and must be
// imported by the root app component, as this can't be done from services in
// Angular
export class LocationComponent implements OnInit {
  constructor(
    private router: Router,
    private location: Location,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject(REQUEST) private request: Request,
  ) {}

  ngOnInit() {
    this.location._routeHasLoaded();
    this.router.events.subscribe(event => {
      // push new location to Location service
      if (event instanceof NavigationEnd) {
        // When on the server, send 302s on internal redirects
        if (
          isPlatformServer(this.platformId) &&
          event.url !== '/internal/404' &&
          event.url !== '/internal/blank' &&
          event.url !== this.request.url
        ) {
          this.location.navigateByUrl(event.url);
          return;
        }
        // When on the client, update the Location state
        // NOTE: the base is a dummy only to properly parse the url,
        // but we don't need it in the _setLocation call
        const url = new URL(event.url, 'https://freelancer.com');
        const { pathname, hash, search } = url;
        this.location._setLocation(pathname, hash, search);
      }
    });
  }
}
