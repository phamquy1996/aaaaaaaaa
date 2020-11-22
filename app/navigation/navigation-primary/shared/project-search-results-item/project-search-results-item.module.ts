import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PipesModule } from '@freelancer/pipes';
import { ProjectStatusModule } from '@freelancer/project-status';
import { TrackingModule } from '@freelancer/tracking';
import { UiModule } from '@freelancer/ui';
import { ProjectSearchResultsItemComponent } from './project-search-results-item.component';

@NgModule({
  imports: [
    CommonModule,
    PipesModule,
    ProjectStatusModule,
    TrackingModule,
    UiModule,
  ],
  declarations: [ProjectSearchResultsItemComponent],
  exports: [ProjectSearchResultsItemComponent],
})
export class ProjectSearchResultsItemModule {}
