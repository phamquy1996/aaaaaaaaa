import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  DatastoreNotificationsModule,
  DatastoreNotificationsPreferencesModule,
  DatastoreProjectFeedFailingContestsModule,
  DatastoreProjectFeedFailingProjectsModule,
  DatastoreProjectFeedModule,
  DatastoreTeamMembersModule,
  DatastoreTeamsModule,
  DatastoreThreadProjectsModule,
  DatastoreThreadsModule,
  DatastoreUsersModule,
} from '@freelancer/datastore/collections';
import { PipesModule } from '@freelancer/pipes';
import { TrackingModule } from '@freelancer/tracking';
import { UiModule } from '@freelancer/ui';
import { FeedItemsModule } from 'app/navigation/feed-items';
import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG,
} from 'ngx-perfect-scrollbar';
import { FilterSwitchComponent } from './filter-switch/filter-switch.component';
import { HeaderComponent } from './header/header.component';
import { MessagingContactsComponent } from './messaging-contacts.component';
import { RecruiterChatSearchResultComponent } from './recruiter-chat-search-result/recruiter-chat-search-result.component';
import { SearchComponent } from './search/search.component';
import { ThreadListComponent } from './thread-list/thread-list.component';
import { ThreadSetComponent } from './thread-list/thread-set.component';
import { TickerComponent } from './ticker/ticker.component';
import { UserSearchResultComponent } from './user-search-result/user-search-result.component';

const CUSTOM_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

@NgModule({
  imports: [
    UiModule,
    CommonModule,
    ReactiveFormsModule,
    TrackingModule,
    FeedItemsModule,
    PerfectScrollbarModule,
    PipesModule,
    DatastoreNotificationsModule,
    DatastoreProjectFeedModule,
    DatastoreProjectFeedFailingContestsModule,
    DatastoreProjectFeedFailingProjectsModule,
    DatastoreNotificationsPreferencesModule,
    DatastoreTeamMembersModule,
    DatastoreTeamsModule,
    DatastoreThreadProjectsModule,
    DatastoreThreadsModule,
    DatastoreUsersModule,
  ],
  declarations: [
    FilterSwitchComponent,
    HeaderComponent,
    MessagingContactsComponent,
    RecruiterChatSearchResultComponent,
    TickerComponent,
    SearchComponent,
    ThreadListComponent,
    ThreadSetComponent,
    UserSearchResultComponent,
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: CUSTOM_PERFECT_SCROLLBAR_CONFIG,
    },
  ],
  exports: [MessagingContactsComponent],
})
export class MessagingContactsModule {}
