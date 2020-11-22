import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FeatureFlagsModule } from '@freelancer/feature-flags';
import { TrackingModule } from '@freelancer/tracking';
import { UiModule } from '@freelancer/ui';
import { NavigationSecondaryProfileComponent } from './navigation-secondary-profile.component';
import { NavigationSecondaryModule } from './navigation-secondary.module';

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    NavigationSecondaryModule,
    TrackingModule,
    FeatureFlagsModule,
  ],
  declarations: [NavigationSecondaryProfileComponent],
  exports: [NavigationSecondaryProfileComponent],
  // Exported to GAF
  entryComponents: [NavigationSecondaryProfileComponent],
})
export class NavigationSecondaryProfileModule {}
