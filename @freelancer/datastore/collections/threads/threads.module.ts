import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ThreadsInboxSwapEffect } from './threads-inbox-swap.effect';
import { threadsBackend } from './threads.backend';
import { threadsReducer } from './threads.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('threads', threadsReducer),
    EffectsModule.forFeature([ThreadsInboxSwapEffect]),
    BackendModule.forFeature('threads', threadsBackend),
  ],
})
export class DatastoreThreadsModule {}
