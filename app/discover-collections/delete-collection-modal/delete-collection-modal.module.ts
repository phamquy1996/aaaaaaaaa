import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DatastoreDiscoverCollectionsModule } from '@freelancer/datastore/collections';
import { TrackingModule } from '@freelancer/tracking';
import { UiModule } from '@freelancer/ui';
import { DeleteCollectionModalComponent } from './delete-collection-modal.component';

@NgModule({
  imports: [
    CommonModule,
    TrackingModule,
    UiModule,
    DatastoreDiscoverCollectionsModule,
  ],
  declarations: [DeleteCollectionModalComponent],
  entryComponents: [DeleteCollectionModalComponent],
})
export class DeleteCollectionModalModule {}
