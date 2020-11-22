import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { TRACKING_CONFIG } from './tracking.config';
import { TrackingConfig } from './tracking.interface';
import { Tracking } from './tracking.service';

export enum NavigationPerformanceCategory {
  INITIAL_PAGE_LOAD = 0,
  ROUTE_CHANGE = 1,
}

export interface NavigationPerformanceEventData {
  category: NavigationPerformanceCategory;
  totalTime: number; // in ms
  backendTime: number; // in ms
  frontendTime: number; // in ms
  previousUrl: string;
  resourceTimings: string; // See https://soasta.github.io/boomerang/doc/api/restiming.html
}

@Component({
  selector: 'fl-navigation-performance-tracking',
  template: `
    <ng-container></ng-container>
  `,
})
export class NavigationPerformanceTrackingComponent implements OnInit {
  constructor(
    private t: Tracking,
    @Inject(TRACKING_CONFIG) private config: TrackingConfig,
    private ngZone: NgZone,
  ) {}

  ngOnInit() {
    this.ngZone.runOutsideAngular(async () => {
      if (Math.random() > this.config.navigationPerformanceSamplingRate) {
        return;
      }
      await import('boomerang/build/boomerang-1.0.0.js');

      // Whenever Boomerang intercepts an XHR request, it will check if that
      // request matches anything in the exclude list, and if it does, Boomerang
      // will not instrument, time, or beacon that request
      BOOMR.xhr_excludes = {
        't.freelancer.com': true,
        'googleads.g.doubleclick.net': true,
        'static.doubleclick.net': true,
        'www.googletagmanager.com': true,
        'www.google.com': true,
        'connect.facebook.net': true,
      };

      BOOMR.init({
        log: (message: string, level: string, source: string) => {
          if (level === 'error') {
            console.error(message, source);
          }
        },
        autorun: false,
        History: {
          auto: true,
          enabled: true,
        },
        RT: {
          cookie: '',
        },
      });
      // boomerang as its own error handling thing
      BOOMR.plugins.Errors = {
        is_supported() {
          return true;
        },
        is_complete() {
          return true;
        },
        send(err: Error) {
          throw err;
        },
      };

      let previousUrl: string;
      // eslint-disable-next-line rxjs/prefer-observer
      BOOMR.subscribe('before_beacon', (e: any) => {
        if (
          e['http.initiator'] !== 'spa_hard' &&
          e['http.initiator'] !== 'spa'
        ) {
          return;
        }

        // Previous URL
        if (!previousUrl) {
          previousUrl = e.r as string;
        }

        const data: NavigationPerformanceEventData = {
          category:
            e['http.initiator'] !== 'spa'
              ? NavigationPerformanceCategory.INITIAL_PAGE_LOAD
              : NavigationPerformanceCategory.ROUTE_CHANGE,
          totalTime: e.t_done as number,
          backendTime: e.t_resp as number,
          frontendTime: e.t_page as number,
          previousUrl,
          resourceTimings: e.restiming as string,
        };

        // NavigationTimings
        if (e.nt_nav_st) {
          Object.assign(data, {
            // PerformanceNavigation
            redirectCount: e.nt_red_cnt,
            navigationType: e.nt_nav_type,
            // PerformanceTiming
            navigationStart: e.nt_nav_st,
            redirectStart: e.nt_red_st,
            redirectEnd: e.nt_red_end,
            fetchStart: e.nt_fet_st,
            domainLookupStart: e.nt_dns_st,
            domainLookupEnd: e.nt_dns_end,
            connectStart: e.nt_con_st,
            connectEnd: e.nt_con_end,
            requestStart: e.nt_req_st,
            responseStart: e.nt_res_st,
            responseEnd: e.nt_res_end,
            domLoading: e.nt_domloading,
            domInteractive: e.nt_domint,
            domContentLoadedEventStart: e.nt_domcontloaded_st,
            domContentLoadedEventEnd: e.nt_domcontloaded_end,
            domComplete: e.nt_domcomp,
            loadEventStart: e.nt_load_st,
            loadEventEnd: e.nt_load_end,
            unloadEventStart: e.nt_unload_st,
            unloadEventEnd: e.nt_unload_end,
          });
          if (e.nt_first_paint) {
            // First paint
            Object.assign(data, {
              firstPaint: e.nt_first_paint * 1000,
            });
          }
        }
        // Fire the event
        this.t.track('page_performance_timings', data);
        // Clear the Resource Timings Buffer
        if (window.performance && window.performance.clearResourceTimings) {
          window.performance.clearResourceTimings();
        }
        previousUrl = window.location.href;
        // Notify boomerang that we've fired the beacon
        BOOMR.fireEvent('onbeacon', data);
      });
    });
  }
}
