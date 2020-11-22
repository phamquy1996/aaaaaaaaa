import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DatastoreUsersModule } from '@freelancer/datastore/collections';
import { FeatureFlagsDirective } from './feature-flags.directive';

@NgModule({
  imports: [CommonModule, DatastoreUsersModule],
  declarations: [FeatureFlagsDirective],
  exports: [FeatureFlagsDirective],
})
export class FeatureFlagsModule {}
