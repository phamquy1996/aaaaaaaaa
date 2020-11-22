import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TrackingModule } from '@freelancer/tracking';
import { UiModule } from '@freelancer/ui';
import { PreferenceToggleComponent } from './preference-toggle.component';

@NgModule({
  imports: [CommonModule, UiModule, TrackingModule],
  declarations: [PreferenceToggleComponent],
  exports: [PreferenceToggleComponent],
})
export class PreferenceToggleModule {}
