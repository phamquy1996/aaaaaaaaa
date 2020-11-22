import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ENVIRONMENT_NAME } from '@freelancer/config';
import { CookieModule } from '@laurentgoudet/ngx-cookie';
import { environment } from 'environments/environment';
import { CoreWebVitalsTrackingComponent } from './core-web-vitals-tracking.component';
import { ErrorTracking } from './error-tracking.service';
import { FacebookPixelTracking } from './facebook-pixel-tracking.service';
import { GoogleTracking } from './google-tracking.service';
import { HeartbeatTrackingComponent } from './heartbeat-tracking.component';
import { HotjarComponent } from './hotjar.component';
import { Hotjar } from './hotjar.service';
import { MemoryLeakTrackingComponent } from './memory-leak-tracking.component';
import { NavigationPerformanceTrackingComponent } from './navigation-performance-tracking.component';
import { PageViewTrackingComponent } from './page-view-tracking.component';
import { PerformanceTracking } from './performance-tracking.service';
import { SpinnerHeartbeatDirective } from './spinner-heartbeat.directive';
import { SyntheticPerformanceTrackingComponent } from './synthetic-performance-tracking.component';
import { TrackingSectionDirective } from './tracking-section.directive';
import { TrackingComponent } from './tracking.component';
import { TRACKING_CONFIG } from './tracking.config';
import { TrackingDirective } from './tracking.directive';
import { TrackingConfig } from './tracking.interface';
import { Tracking } from './tracking.service';
import { UserTimingTrackingComponent } from './user-timing-tracking.component';

@NgModule({
  imports: [HttpClientModule, CookieModule],
  declarations: [
    CoreWebVitalsTrackingComponent,
    HeartbeatTrackingComponent,
    MemoryLeakTrackingComponent,
    NavigationPerformanceTrackingComponent,
    PageViewTrackingComponent,
    SyntheticPerformanceTrackingComponent,
    SpinnerHeartbeatDirective,
    TrackingComponent,
    TrackingDirective,
    TrackingSectionDirective,
    UserTimingTrackingComponent,
    HotjarComponent,
  ],
  exports: [
    TrackingComponent,
    SpinnerHeartbeatDirective,
    TrackingDirective,
    TrackingSectionDirective,
    HeartbeatTrackingComponent,
    HotjarComponent,
  ],
  providers: [
    ErrorTracking,
    PerformanceTracking,
    GoogleTracking,
    FacebookPixelTracking,
    Hotjar,
  ],
  // Exported to GAF
  entryComponents: [TrackingComponent],
})
export class TrackingModule {
  static initialize(
    config: TrackingConfig,
  ): ModuleWithProviders<TrackingModule> {
    return {
      ngModule: TrackingModule,
      providers: [
        Tracking,
        { provide: TRACKING_CONFIG, useValue: config },
        { provide: ENVIRONMENT_NAME, useValue: environment.environmentName },
      ],
    };
  }
}
