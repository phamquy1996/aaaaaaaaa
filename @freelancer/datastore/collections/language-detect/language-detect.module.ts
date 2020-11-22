import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { languageDetectBackend } from './language-detect.backend';
import { languageDetectReducer } from './language-detect.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('languageDetect', languageDetectReducer),
    BackendModule.forFeature('languageDetect', languageDetectBackend),
  ],
})
export class DatastoreLanguageDetectModule {}
