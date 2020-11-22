import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Seo } from './seo.service';

@Component({
  selector: 'fl-seo',
  template: '',
})
export class SeoComponent implements OnInit {
  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private router: Router,
    private seo: Seo,
  ) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      // reset page tags to default values on navigation.
      if (event instanceof NavigationEnd) {
        this.seo.setDefaultPageTags();
      }
    });
  }
}
