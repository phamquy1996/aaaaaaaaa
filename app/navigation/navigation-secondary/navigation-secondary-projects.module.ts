import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FeatureFlagsModule } from '@freelancer/feature-flags';
import { TrackingModule } from '@freelancer/tracking';
import { UiModule } from '@freelancer/ui';
import { NavigationSecondaryProjectsComponent } from './navigation-secondary-projects.component';
import { NavigationSecondaryModule } from './navigation-secondary.module';

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    NavigationSecondaryModule,
    TrackingModule,
    FeatureFlagsModule,
  ],
  declarations: [NavigationSecondaryProjectsComponent],
  exports: [NavigationSecondaryProjectsComponent],
  // Exported to GAF
  entryComponents: [NavigationSecondaryProjectsComponent],
})
export class NavigationSecondaryProjectsModule {}
