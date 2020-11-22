import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TrackingModule } from '@freelancer/tracking';
import { UiModule } from '@freelancer/ui';
import { NavigationLoggedOutComponent } from './navigation-logged-out.component';

@NgModule({
  imports: [CommonModule, TrackingModule, UiModule],
  declarations: [NavigationLoggedOutComponent],
  exports: [NavigationLoggedOutComponent],
})
export class NavigationLoggedOutModule {}
