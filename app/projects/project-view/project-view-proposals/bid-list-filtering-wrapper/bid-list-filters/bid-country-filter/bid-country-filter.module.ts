import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from '@freelancer/components';
import { UiModule } from '@freelancer/ui/ui.module';
import { BidCountryFilterComponent } from './bid-country-filter.component';
import { CountryFilterListItemComponent } from './country-filter-list-item/country-filter-list-item.component';

@NgModule({
  imports: [CommonModule, UiModule, ComponentsModule],
  declarations: [BidCountryFilterComponent, CountryFilterListItemComponent],
  exports: [BidCountryFilterComponent, CountryFilterListItemComponent],
})
export class BidCountryFilterModule {}
