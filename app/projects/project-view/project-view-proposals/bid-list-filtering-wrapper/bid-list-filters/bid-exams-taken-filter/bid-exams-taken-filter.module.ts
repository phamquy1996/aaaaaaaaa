import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from '@freelancer/components';
import { UiModule } from '@freelancer/ui/ui.module';
import { BidExamsTakenFilterComponent } from './bid-exams-taken-filter.component';
import { ExamsTakenFilterListItemComponent } from './exams-taken-filter-list-item/exams-taken-filter-list-item.component';

@NgModule({
  imports: [CommonModule, UiModule, ComponentsModule],
  declarations: [
    BidExamsTakenFilterComponent,
    ExamsTakenFilterListItemComponent,
  ],
  exports: [BidExamsTakenFilterComponent, ExamsTakenFilterListItemComponent],
})
export class BidExamsTakenFilterModule {}
