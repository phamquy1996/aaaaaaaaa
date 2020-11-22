import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TrackingModule } from '@freelancer/tracking';
import { UiModule } from '@freelancer/ui';
import { CorporateUpsellBannerComponent } from './corporate-upsell-banner/corporate-upsell-banner.component';
import { LoadingBannerComponent } from './loading-banner/loading-banner.component';

@NgModule({
  imports: [CommonModule, UiModule, TrackingModule],
  declarations: [CorporateUpsellBannerComponent, LoadingBannerComponent],
  exports: [CorporateUpsellBannerComponent, LoadingBannerComponent],
})
export class BannersModule {}
