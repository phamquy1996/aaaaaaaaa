import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UiModule } from '@freelancer/ui';
import { ProjectStatusComponent } from './project-status.component';

@NgModule({
  imports: [CommonModule, UiModule],
  declarations: [ProjectStatusComponent],
  exports: [ProjectStatusComponent],
})
export class ProjectStatusModule {}
