import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Environment, ENVIRONMENT_NAME } from '@freelancer/config';
import { PendingTasks } from '@freelancer/pending-tasks';

// /!\ DO ADD ANYTHING IN THERE WITHOUT TALKING TO FRONTEND INFRA FIRST /!\
// Application-wide code should be avoided as much as possible; does your code
// needs:
// - to be loaded on ALL logged-in pages?
// - AND to be loaded on ALL logged-out pages?
// - AND to be loaded on the Admin?
// - ...
// Probably not.
@Component({
  selector: 'app-root',
  template: `
    <fl-seo></fl-seo>
    <fl-pwa></fl-pwa>
    <router-outlet></router-outlet>
    <fl-tracking *ngIf="isBrowser"></fl-tracking>
    <fl-location></fl-location>
    <fl-modal></fl-modal>
    <fl-abtest></fl-abtest>
    <fl-network-alert></fl-network-alert>
    <fl-notifications></fl-notifications>
  `,
})
export class AppComponent implements OnInit {
  isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(ENVIRONMENT_NAME) private environment: Environment,
    private pendingTasks: PendingTasks,
  ) {}

  ngOnInit() {
    this.isBrowser = isPlatformBrowser(this.platformId);

    // FIXME: detect Protractor env better
    if (this.isBrowser && this.environment !== 'prod') {
      this.pendingTasks.monitor();
    }
  }
}
