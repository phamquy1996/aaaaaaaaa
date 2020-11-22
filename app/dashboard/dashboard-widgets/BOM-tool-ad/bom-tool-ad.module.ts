import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TrackingModule } from '@freelancer/tracking';
import { UiModule } from '@freelancer/ui';
import { BomToolAdComponent } from './bom-tool-ad.component';

@NgModule({
  imports: [CommonModule, TrackingModule, UiModule],
  declarations: [BomToolAdComponent],
  exports: [BomToolAdComponent],
})
export class BomToolAdModule {}
