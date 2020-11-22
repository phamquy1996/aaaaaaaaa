import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UiModule } from '@freelancer/ui';
import { ProjectLocationDetailsComponent } from './project-location-details.component';

@NgModule({
  imports: [CommonModule, UiModule],
  declarations: [ProjectLocationDetailsComponent],
  exports: [ProjectLocationDetailsComponent],
})
export class ProjectLocationDetailsModule {}
