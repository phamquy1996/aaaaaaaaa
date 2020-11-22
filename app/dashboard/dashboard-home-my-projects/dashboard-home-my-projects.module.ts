import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FeatureFlagsModule } from '@freelancer/feature-flags';
import { PipesModule } from '@freelancer/pipes';
import { ProjectStatusModule } from '@freelancer/project-status';
import { TrackingModule } from '@freelancer/tracking';
import { UiModule } from '@freelancer/ui';
import { ArrowMyProjectsEmptyStateComponent } from './arrow/arrow-my-projects-empty-state.component';
import { DashboardHomeMyProjectsComponent } from './dashboard-home-my-projects.component';
import { MyProjectsEmptyStateComponent } from './my-projects-empty-state/my-projects-empty-state.component';
import { MyProjectsErrorStateComponent } from './my-projects-error-state/my-projects-error-state.component';
import { MyProjectsLoadingStateComponent } from './my-projects-loading-state/my-projects-loading-state.component';
import { MyProjectsRightHeaderComponent } from './my-projects-right-header/my-projects-right-header.component';
import { MyProjectsCellComponent } from './my-projects-table/my-projects-cell.component';
import { MyProjectsTableComponent } from './my-projects-table/my-projects-table.component';
import { MyProjectsTableEmployerComponent } from './my-projects-table/tables-by-type/table-employer.component';
import { MyProjectsTableFreelancerComponent } from './my-projects-table/tables-by-type/table-freelancer.component';
import { MyProjectsViewAllComponent } from './my-projects-view-all/my-projects-view-all.component';

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    PipesModule,
    TrackingModule,
    ProjectStatusModule,
    FeatureFlagsModule,
  ],
  declarations: [
    DashboardHomeMyProjectsComponent,
    MyProjectsTableFreelancerComponent,
    MyProjectsTableEmployerComponent,
    MyProjectsEmptyStateComponent,
    MyProjectsErrorStateComponent,
    MyProjectsLoadingStateComponent,
    MyProjectsTableComponent,
    MyProjectsCellComponent,
    ArrowMyProjectsEmptyStateComponent,
    MyProjectsViewAllComponent,
    MyProjectsRightHeaderComponent,
  ],
  exports: [DashboardHomeMyProjectsComponent, MyProjectsViewAllComponent],
})
export class DashboardHomeMyProjectsModule {}
