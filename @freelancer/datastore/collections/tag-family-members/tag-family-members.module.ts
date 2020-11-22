import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { tagFamilyMembersBackend } from './tag-family-members.backend';
import { tagFamilyMembersReducer } from './tag-family-members.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('tagFamilyMembers', tagFamilyMembersReducer),
    BackendModule.forFeature('tagFamilyMembers', tagFamilyMembersBackend),
  ],
})
export class DatastoreTagFamilyMembersModule {}
