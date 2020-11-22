import { Component, OnInit, Renderer2 } from '@angular/core';
import { CookieService } from '@laurentgoudet/ngx-cookie';

@Component({
  selector: 'fl-synthetic-performance-tracking',
  template: `
    <ng-container></ng-container>
  `,
})
export class SyntheticPerformanceTrackingComponent implements OnInit {
  constructor(private cookies: CookieService, private renderer: Renderer2) {}

  ngOnInit() {
    /**
     * Adds a 'sc-no-animation' class on the root element ('html') when a
     * 'no_animation' cookie is present. This can then be used to disable CSS
     * animations / transitions as they don't play nice with synthetics monitoring
     * & visual completness score (a.k.a. Speed Index).
     */
    if (this.cookies.get('no_animation')) {
      this.renderer.addClass(document.documentElement, 'sc-no-animation');
    }
  }
}
