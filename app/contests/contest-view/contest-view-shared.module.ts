import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TrackingModule } from '@freelancer/tracking';
import { UiModule } from '@freelancer/ui';
import { EntryUpdateErrorComponent } from './contest-entries-tab/entry-update-error/entry-update-error.component';

@NgModule({
  imports: [CommonModule, TrackingModule, UiModule],
  declarations: [EntryUpdateErrorComponent],
  exports: [EntryUpdateErrorComponent],
})
export class ContestViewSharedModule {}
