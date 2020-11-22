import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TrackingModule } from '@freelancer/tracking';
import { UiModule } from '@freelancer/ui';
import { DiscoverPortfolioItemCardComponent } from './discover-portfolio-item-card.component';

@NgModule({
  imports: [CommonModule, TrackingModule, UiModule],
  declarations: [DiscoverPortfolioItemCardComponent],
  exports: [DiscoverPortfolioItemCardComponent],
})
export class DiscoverPortfolioItemCardModule {}
