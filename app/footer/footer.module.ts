import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  DatastoreSiteStatsModule,
  DatastoreUsersSelfModule,
} from '@freelancer/datastore/collections';
import { FeatureFlagsModule } from '@freelancer/feature-flags';
import { LanguageSwitcherModule } from '@freelancer/language-switcher';
import { TrackingModule } from '@freelancer/tracking';
import { UiModule } from '@freelancer/ui';
import { FooterArrowComponent } from './footer-arrow.component';
import { FooterDeloitteComponent } from './footer-deloitte.component';
import { FooterFreelancerComponent } from './footer-freelancer.component';
import { FooterComponent } from './footer.component';

@NgModule({
  imports: [
    UiModule,
    CommonModule,
    TrackingModule,
    DatastoreSiteStatsModule,
    DatastoreUsersSelfModule,
    LanguageSwitcherModule,
    FeatureFlagsModule,
  ],
  declarations: [
    FooterArrowComponent,
    FooterDeloitteComponent,
    FooterFreelancerComponent,
    FooterComponent,
  ],
  exports: [
    FooterArrowComponent,
    FooterDeloitteComponent,
    FooterFreelancerComponent,
    FooterComponent,
  ],
})
export class FooterModule {}
