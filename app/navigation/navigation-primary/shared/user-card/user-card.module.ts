import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FeatureFlagsModule } from '@freelancer/feature-flags';
import { PipesModule } from '@freelancer/pipes';
import { TrackingModule } from '@freelancer/tracking';
import { UiModule } from '@freelancer/ui';
import { UserCardRevampComponent } from './user-card-revamp.component';
import { UserCardComponent } from './user-card.component';

@NgModule({
  imports: [
    CommonModule,
    PipesModule,
    TrackingModule,
    UiModule,
    FeatureFlagsModule,
  ],
  declarations: [UserCardComponent, UserCardRevampComponent],
  exports: [UserCardComponent, UserCardRevampComponent],
})
export class UserCardModule {}
