import { NgModule } from '@angular/core';
import { PwaHideInstalledDirective } from './pwa-hide-installed.directive';
import { PwaComponent } from './pwa.component';

@NgModule({
  declarations: [PwaComponent, PwaHideInstalledDirective],
  exports: [PwaComponent, PwaHideInstalledDirective],
})
export class PwaModule {}
