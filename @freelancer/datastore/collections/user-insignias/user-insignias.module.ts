import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { userInsigniasBackend } from './user-insignias.backend';
import { userInsigniasReducer } from './user-insignias.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('userInsignias', userInsigniasReducer),
    BackendModule.forFeature('userInsignias', userInsigniasBackend),
  ],
})
export class DatastoreUserInsigniasModule {}
