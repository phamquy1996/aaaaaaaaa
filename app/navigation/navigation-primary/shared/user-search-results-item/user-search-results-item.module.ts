import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FeatureFlagsModule } from '@freelancer/feature-flags';
import { TrackingModule } from '@freelancer/tracking';
import { UiModule } from '@freelancer/ui';
import { UserSearchResultsItemComponent } from './user-search-results-item.component';

@NgModule({
  imports: [CommonModule, TrackingModule, UiModule, FeatureFlagsModule],
  declarations: [UserSearchResultsItemComponent],
  exports: [UserSearchResultsItemComponent],
})
export class UserSearchResultsItemModule {}
