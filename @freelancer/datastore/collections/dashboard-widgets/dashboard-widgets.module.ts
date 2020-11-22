import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { dashboardWidgetsBackend } from './dashboard-widgets.backend';
import { dashboardWidgetsReducer } from './dashboard-widgets.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('dashboardWidgets', dashboardWidgetsReducer),
    BackendModule.forFeature('dashboardWidgets', dashboardWidgetsBackend),
  ],
})
export class DatastoreDashboardWidgetsModule {}
