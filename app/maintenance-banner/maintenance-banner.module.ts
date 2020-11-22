import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DatastoreUserInteractionsModule } from '@freelancer/datastore/collections';
import { UiModule } from '@freelancer/ui';
import { MaintenanceBannerComponent } from './maintenance-banner.component';

@NgModule({
  imports: [CommonModule, UiModule, DatastoreUserInteractionsModule],
  declarations: [MaintenanceBannerComponent],
  exports: [MaintenanceBannerComponent],
})
export class MaintenanceBannerModule {}
