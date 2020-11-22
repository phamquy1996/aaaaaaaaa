import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TrackingModule } from '@freelancer/tracking';
import { UiModule } from '@freelancer/ui';
import { ViewHeaderTemplateModule } from '@freelancer/view-header-template';
import { NavigationChildComponent } from './navigation-child.component';

@NgModule({
  imports: [CommonModule, TrackingModule, UiModule, ViewHeaderTemplateModule],
  declarations: [NavigationChildComponent],
  exports: [NavigationChildComponent],
})
export class NavigationChildModule {}
