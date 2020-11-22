import { Component } from '@angular/core';

@Component({
  // We need the fl-bit here as we use the AppEmptyComponent in the test is
  // order to detect if this empty component is rendered (since there's nothing
  // on screen)
  template: '<div class="AppEmptyComponent"></div>',
})
export class AppEmptyComponent {}
