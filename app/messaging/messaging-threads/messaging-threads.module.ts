import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DirectivesModule } from '@freelancer/directives';
import { TrackingModule } from '@freelancer/tracking';
import { UiModule } from '@freelancer/ui';
import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG,
} from 'ngx-perfect-scrollbar';
import { MessagingThreadListEmptyStateComponent } from './messaging-thread-list/messaging-thread-list-empty-state/messaging-thread-list-empty-state.component';
import { MessagingThreadListItemSubtitleComponent } from './messaging-thread-list/messaging-thread-list-item/messaging-thread-list-item-subtitle/messaging-thread-list-item-subtitle.component';
import { MessagingThreadListItemComponent } from './messaging-thread-list/messaging-thread-list-item/messaging-thread-list-item.component';
import { MessagingThreadListComponent } from './messaging-thread-list/messaging-thread-list.component';
import { MessagingThreadRecruiterSearchComponent } from './messaging-thread-recruiter-search/messaging-thread-recruiter-search.component';
import { MessagingThreadsFiltersComponent } from './messaging-threads-filters/messaging-threads-filters.component';
import { MessagingThreadsComponent } from './messaging-threads.component';

const CUSTOM_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

@NgModule({
  imports: [
    CommonModule,
    DirectivesModule,
    PerfectScrollbarModule,
    TrackingModule,
    UiModule,
  ],
  declarations: [
    MessagingThreadListItemComponent,
    MessagingThreadListItemSubtitleComponent,
    MessagingThreadListComponent,
    MessagingThreadListEmptyStateComponent,
    MessagingThreadRecruiterSearchComponent,
    MessagingThreadsComponent,
    MessagingThreadsFiltersComponent,
  ],
  exports: [
    MessagingThreadListItemComponent,
    MessagingThreadListItemSubtitleComponent,
    MessagingThreadListComponent,
    MessagingThreadListEmptyStateComponent,
    MessagingThreadRecruiterSearchComponent,
    MessagingThreadsComponent,
    MessagingThreadsFiltersComponent,
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: CUSTOM_PERFECT_SCROLLBAR_CONFIG,
    },
  ],
})
export class MessagingThreadsModule {}
