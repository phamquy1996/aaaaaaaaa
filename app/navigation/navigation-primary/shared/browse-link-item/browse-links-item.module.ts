import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TrackingModule } from '@freelancer/tracking';
import { UiModule } from '@freelancer/ui';
import { BrowseLinksItemComponent } from './browse-links-item.component';

@NgModule({
  imports: [CommonModule, TrackingModule, UiModule],
  declarations: [BrowseLinksItemComponent],
  exports: [BrowseLinksItemComponent],
})
export class BrowseLinksItemModule {}
