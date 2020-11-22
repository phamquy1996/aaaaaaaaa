import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { tagsBackend } from './tags.backend';
import { tagsReducer } from './tags.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('tags', tagsReducer),
    BackendModule.forFeature('tags', tagsBackend),
  ],
})
export class DatastoreTagsModule {}
