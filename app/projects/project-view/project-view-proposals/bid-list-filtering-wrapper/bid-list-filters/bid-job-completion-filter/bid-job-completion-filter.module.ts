import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from '@freelancer/components';
import { UiModule } from '@freelancer/ui/ui.module';
import { BidJobCompletionFilterComponent } from './bid-job-completion-filter.component';

@NgModule({
  imports: [CommonModule, UiModule, ComponentsModule],
  declarations: [BidJobCompletionFilterComponent],
  exports: [BidJobCompletionFilterComponent],
})
export class BidJobCompletionFilterModule {}
