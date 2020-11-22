import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PipesModule } from '@freelancer/pipes';
import { TrackingModule } from '@freelancer/tracking';
import { UiModule } from '@freelancer/ui';
import { CompaniesTrustComponent } from './companies-trust.component';

@NgModule({
  imports: [CommonModule, PipesModule, TrackingModule, UiModule],
  declarations: [CompaniesTrustComponent],
  exports: [CompaniesTrustComponent],
})
export class CompaniesTrustModule {}
