import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DatastoreUserInteractionsModule } from '@freelancer/datastore/collections';
import { TrackingModule } from '@freelancer/tracking';
import { UiModule } from '@freelancer/ui';
import { LandingPageAboutSectionComponent } from './about/landing-page-about-section.component';
import { LandingPageApplySectionComponent } from './apply/landing-page-apply-section.component';
import { LandingPageHeaderImageSectionComponent } from './header-image/landing-page-header-image-section.component';
import { LandingPageStickyHeaderComponent } from './sticky-header/landing-page-sticky-header.component';

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    DatastoreUserInteractionsModule,
    TrackingModule,
  ],
  declarations: [
    LandingPageHeaderImageSectionComponent,
    LandingPageStickyHeaderComponent,
    LandingPageAboutSectionComponent,
    LandingPageApplySectionComponent,
  ],
  exports: [
    LandingPageHeaderImageSectionComponent,
    LandingPageStickyHeaderComponent,
    LandingPageAboutSectionComponent,
    LandingPageApplySectionComponent,
  ],
})
export class LandingPageSectionsModule {}
