import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { equipmentBackend } from './equipment.backend';
import { equipmentReducer } from './equipment.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('equipment', equipmentReducer),
    BackendModule.forFeature('equipment', equipmentBackend),
  ],
})
export class DatastoreEquipmentModule {}
