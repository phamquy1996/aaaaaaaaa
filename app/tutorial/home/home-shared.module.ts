import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TrackingModule } from '@freelancer/tracking';
import { UiModule } from '@freelancer/ui';
import { DynamicFormsComponent } from './exercise-g-dynamic-forms/dynamic-forms.component';

@NgModule({
  imports: [CommonModule, TrackingModule, UiModule],
  declarations: [DynamicFormsComponent],
  exports: [DynamicFormsComponent],
})
export class HomeSharedModule {}
