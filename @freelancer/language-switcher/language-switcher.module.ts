import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  DatastoreDomainsModule,
  DatastoreLanguagesModule,
} from '@freelancer/datastore/collections';
import { TrackingModule } from '@freelancer/tracking';
import { UiModule } from '@freelancer/ui';
import { LanguageSwitcherArrowComponent } from './language-switcher-arrow.component';
import { LanguageSwitcherFreelancerComponent } from './language-switcher-freelancer.component';
import { LanguageSwitcherComponent } from './language-switcher.component';
import { LanguageSwitcher } from './language-switcher.service';

@NgModule({
  imports: [
    CommonModule,
    DatastoreDomainsModule,
    DatastoreLanguagesModule,
    TrackingModule,
    UiModule,
  ],
  providers: [LanguageSwitcher],
  declarations: [
    LanguageSwitcherComponent,
    LanguageSwitcherArrowComponent,
    LanguageSwitcherFreelancerComponent,
  ],
  exports: [
    LanguageSwitcherComponent,
    LanguageSwitcherArrowComponent,
    LanguageSwitcherFreelancerComponent,
  ],
})
export class LanguageSwitcherModule {}
