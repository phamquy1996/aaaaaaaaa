import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { pjpAssistantEnqueueBackend } from './pjp-assistant-enqueue.backend';
import { pjpAssistantEnqueueReducer } from './pjp-assistant-enqueue.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('pjpAssistantEnqueue', pjpAssistantEnqueueReducer),
    BackendModule.forFeature('pjpAssistantEnqueue', pjpAssistantEnqueueBackend),
  ],
})
export class DatastorePjpAssistantEnqueueModule {}
