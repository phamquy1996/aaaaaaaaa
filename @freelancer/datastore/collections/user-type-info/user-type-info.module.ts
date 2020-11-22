import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { userTypeInfoBackend } from './user-type-info.backend';
import { userTypeInfoReducer } from './user-type-info.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('userTypeInfo', userTypeInfoReducer),
    BackendModule.forFeature('userTypeInfo', userTypeInfoBackend),
  ],
})
export class DatastoreUserTypeInfoModule {}

type UserType = 'seller' | 'buyer';

export const USER_TYPE_INFO_MAP: { readonly [key in UserType]: string } = {
  seller: 'Worker',
  buyer: 'Employer',
};
