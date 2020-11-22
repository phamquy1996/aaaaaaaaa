import { isPlatformServer } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { FreelancerHttpABTestOverridesInterface } from '@freelancer/freelancer-http';
import { Location } from '@freelancer/location';
import * as Rx from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ABTestOverrides implements FreelancerHttpABTestOverridesInterface {
  constructor(
    private location: Location,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  getOverridesHeader(): Rx.Observable<HttpHeaders> {
    let headers = new HttpHeaders();
    if (isPlatformServer(this.platformId)) {
      return Rx.of(headers);
    }
    const overrides = new URL(this.location.href).searchParams.get('overrides');
    if (overrides) {
      headers = headers.set('freelancer-abtest-overrides', overrides);
    }
    return Rx.of(headers);
  }
}
