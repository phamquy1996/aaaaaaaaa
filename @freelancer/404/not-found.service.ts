import { isPlatformServer, Location as NgLocation } from '@angular/common';
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@freelancer/location';
import { RESPONSE } from '@nguniversal/express-engine/tokens';
import { Response } from 'express';

/*
 * Allows to render a standard 404 page
 *
 * In theory it should be as simple as 
 *
    return this.router.navigate(['/internal/404'], {
      skipLocationChange: true,
    });
 *
 * In practice the above code doesn't work due to
 * https://github.com/angular/angular/issues/17004
 *
 * TODO: cleanup that up when the above Angular issue is fixed
 */
@Injectable({
  providedIn: 'root',
})
export class NotFound {
  private previousUrl: string;

  constructor(
    private location: Location,
    private router: Router,
    private ngLocation: NgLocation,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject(RESPONSE) private response: Response,
  ) {}

  /*
   * Call that to render a 404 page when you need it
   */
  render() {
    this.previousUrl = this.location.url;
    return this.router.navigate(['/internal/404'], {
      // this doesn't really do what it should, hence the this.previousUrl +
      // ngLocation.replaceState hack
      skipLocationChange: true,
    });
  }

  /*
   * PRIVATE: only to be used by the 404 pages implementations
   */
  _onRender() {
    // set the status code if on the server
    if (isPlatformServer(this.platformId)) {
      this.response.status(404);
    } else if (this.previousUrl) {
      this.ngLocation.replaceState(this.previousUrl);
    }
  }
}
