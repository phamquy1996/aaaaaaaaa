import { Component } from '@angular/core';

@Component({
  selector: 'app-toast-alerts',
  template: `
    <fl-container>
      <fl-toast-alert-container
        [flSticky]="true"
        [flShowMobile]="true"
      ></fl-toast-alert-container>
      <fl-toast-alert-container
        [flSticky]="true"
        [flStickyStatic]="true"
        [flHideMobile]="true"
      ></fl-toast-alert-container>
    </fl-container>
  `,
})
export class ToastAlertsComponent {}
