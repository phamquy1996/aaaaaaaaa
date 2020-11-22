import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContainerSize } from '@freelancer/ui/container';
import * as Rx from 'rxjs';
import { NavigationAlternate } from '../navigation/navigation.component';
import { ShellConfig } from './shell-config.service';

export interface LoggedOutShellConfig {
  disableFooter?: boolean;
  disableNavigation?: boolean;
  containerSize?: ContainerSize;
  loginSignupModal?: boolean;
  disablePostProjectButton?: boolean;
  navigationAlternate?: NavigationAlternate;
  transparentNavigation?: boolean;
  /** Whether to bypass logout restricted for the given app/condition */
  bypassLoggedOutRestricted?: { [k in 'deloitte' | 'native']?: boolean };
}

// /!\ DO NOT ADD ANYTHING HERE WITHOUT ASKING FRONTEND INFRA FIRST /!\
// This code is loaded on ALL logged-out pages by default, and has to be manually disabled per page.
@Component({
  selector: 'app-logged-out-shell',
  template: `
    <app-navigation
      *ngIf="!(config$ | async)?.disableNavigation"
      [containerSize]="(config$ | async)?.containerSize"
      [useLoginSignupModal]="(config$ | async)?.loginSignupModal"
      [disablePostProjectButton]="(config$ | async)?.disablePostProjectButton"
      [navigationAlternate]="(config$ | async)?.navigationAlternate"
      [transparent]="(config$ | async)?.transparentNavigation"
    ></app-navigation>
    <app-toast-alerts></app-toast-alerts>
    <router-outlet></router-outlet>
    <app-footer
      *ngIf="!(config$ | async)?.disableFooter"
      [containerSize]="(config$ | async)?.containerSize"
    ></app-footer>
  `,
})
export class LoggedOutShellComponent implements OnInit {
  config$: Rx.Observable<LoggedOutShellConfig>;

  constructor(
    private shellConfig: ShellConfig,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.config$ = this.shellConfig.getConfig(this.activatedRoute);
  }
}
