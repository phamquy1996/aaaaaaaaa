import { AgmCoreModule } from '@agm/core';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { GoogleMapsConfig } from './google-maps.interface';

@NgModule({
  exports: [AgmCoreModule, AgmSnazzyInfoWindowModule],
})
export class GoogleMapsModule {
  static forRoot(
    mapsConfig: GoogleMapsConfig,
  ): ModuleWithProviders<AgmCoreModule> {
    return AgmCoreModule.forRoot(mapsConfig);
  }
}
