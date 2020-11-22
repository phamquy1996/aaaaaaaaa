import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FeatureFlagsModule } from '@freelancer/feature-flags';
import { PipesModule } from '@freelancer/pipes';
import { TrackingModule } from '@freelancer/tracking';
import { UiModule } from '@freelancer/ui';
import { ManageBidsEmptyTableSkillItemComponent } from './manage-bids-empty-table/manage-bids-empty-table-skill-item/manage-bids-empty-table-skill-item.component';
import { ManageBidsEmptyTableComponent } from './manage-bids-empty-table/manage-bids-empty-table.component';
import { ManageCurrencyComponent } from './manage-currency/manage-currency.component';
import { ManageCurrentWorkEmptyTableComponent } from './manage-current-work-empty-table/manage-current-work-empty-table.component';
import { ManageEmptyTableComponent } from './manage-empty-table/manage-empty-table.component';
import { ManageErrorTableComponent } from './manage-error-table/manage-error-table.component';
import { ManageErrorToastComponent } from './manage-error-toast/manage-error-toast.component';
import { ManageLoadingTableComponent } from './manage-loading-table/manage-loading-table.component';
import { ManageMilestoneComponent } from './manage-milestone/manage-milestone.component';
import { ManageProjectTitleComponent } from './manage-project-title/manage-project-title.component';
import { ManageTopNavComponent } from './manage-top-nav/manage-top-nav.component';
import { ManageUsernameComponent } from './manage-username/manage-username.component';
import { ManageViewToggleComponent } from './manage-view-toggle/manage-view-toggle.component';

@NgModule({
  exports: [
    ManageBidsEmptyTableComponent,
    ManageCurrencyComponent,
    ManageCurrentWorkEmptyTableComponent,
    ManageEmptyTableComponent,
    ManageErrorTableComponent,
    ManageErrorToastComponent,
    ManageLoadingTableComponent,
    ManageMilestoneComponent,
    ManageProjectTitleComponent,
    ManageTopNavComponent,
    ManageUsernameComponent,
    ManageViewToggleComponent,
  ],
  declarations: [
    ManageBidsEmptyTableComponent,
    ManageBidsEmptyTableSkillItemComponent,
    ManageCurrencyComponent,
    ManageCurrentWorkEmptyTableComponent,
    ManageEmptyTableComponent,
    ManageErrorTableComponent,
    ManageErrorToastComponent,
    ManageLoadingTableComponent,
    ManageMilestoneComponent,
    ManageProjectTitleComponent,
    ManageTopNavComponent,
    ManageUsernameComponent,
    ManageViewToggleComponent,
  ],
  imports: [
    CommonModule,
    FeatureFlagsModule,
    PipesModule,
    TrackingModule,
    UiModule,
  ],
})
export class SharedModule {}
