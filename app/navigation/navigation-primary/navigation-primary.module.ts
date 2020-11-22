import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  DatastoreAccountProgressModule,
  DatastoreNotificationsModule,
  DatastoreNotificationsPreferencesModule,
  DatastoreOnlineOfflineModule,
  DatastoreProjectFeedFailingContestsModule,
  DatastoreProjectFeedFailingProjectsModule,
  DatastoreProjectFeedModule,
  DatastoreSearchActiveProjectsModule,
  DatastoreSearchFreelancersModule,
  DatastoreSearchKeywordProjectsModule,
  DatastoreUserBalancesModule,
  DatastoreUserBidLimitModule,
  DatastoreUserGiveGetDetailsModule,
  DatastoreUserInfoModule,
  DatastoreUserRecentProjectsAndContestsModule,
  DatastoreUsersModule,
} from '@freelancer/datastore/collections';
import { DirectivesModule } from '@freelancer/directives';
import { FeatureFlagsModule } from '@freelancer/feature-flags';
import { LanguageSwitcherModule } from '@freelancer/language-switcher';
import { PartnerDashboardAccessModule } from '@freelancer/partner-dashboard-access';
import { PipesModule } from '@freelancer/pipes';
import { PwaModule } from '@freelancer/pwa';
import { TrackingModule } from '@freelancer/tracking';
import { UiModule } from '@freelancer/ui';
import { ViewHeaderTemplateModule } from '@freelancer/view-header-template';
import { FeedItemsModule } from 'app/navigation/feed-items';
import { NotificationTemplatesModule } from 'app/navigation/notification-templates';
import { DashboardHomeMyProjectsModule } from '../../dashboard/dashboard-home-my-projects/dashboard-home-my-projects.module';
import { MessagingThreadsModule } from '../../messaging/messaging-threads/messaging-threads.module';
import { BrowseLinksComponent } from './browse/browse-links/browse-links.component';
import { BrowseComponent } from './browse/browse.component';
import { ContestSearchResultsComponent } from './browse/contest-search-results/contest-search-results.component';
import { ProjectSearchResultsComponent } from './browse/project-search-results/project-search-results.component';
import { UserSearchResultsComponent } from './browse/user-search-results/user-search-results.component';
import { MenuItemComponent } from './menu/menu-item.component';
import { MenuComponent } from './menu/menu.component';
import { MessagesComponent } from './messages/messages.component';
import { MyProjectsListComponent } from './my-projects/my-projects-list/my-projects-list.component';
import { MyProjectsComponent } from './my-projects/my-projects.component';
import { NavigationPrimaryRevampComponent } from './navigation-primary-revamp.component';
import { NavigationPrimaryComponent } from './navigation-primary.component';
import { BrowseLinksItemModule } from './shared/browse-link-item/browse-links-item.module';
import { ProjectSearchResultsItemModule } from './shared/project-search-results-item/project-search-results-item.module';
import { UserCardModule } from './shared/user-card/user-card.module';
import { UserSearchResultsItemModule } from './shared/user-search-results-item/user-search-results-item.module';
import { UpdatesListComponent } from './updates/updates-list/updates-list.component';
import { UpdatesPageComponent } from './updates/updates-page/updates-page.component';
import { UpdatesSettingsListComponent } from './updates/updates-settings/updates-settings-list/updates-settings-list.component';
import { UpdatesSettingsComponent } from './updates/updates-settings/updates-settings.component';
import { UpdatesComponent } from './updates/updates.component';
import { AccountListComponent } from './user-settings/account/account-list/account-list.component';
import { AccountComponent } from './user-settings/account/account.component';
import { FinancesListComponent } from './user-settings/finances/finances-list/finances-list.component';
import { FinancesComponent } from './user-settings/finances/finances.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';

@NgModule({
  imports: [
    CommonModule,
    BrowseLinksItemModule,
    DatastoreAccountProgressModule,
    DatastoreNotificationsModule,
    DatastoreNotificationsPreferencesModule,
    DatastoreOnlineOfflineModule,
    DatastoreProjectFeedFailingProjectsModule,
    DatastoreProjectFeedFailingContestsModule,
    DatastoreProjectFeedModule,
    DatastoreSearchFreelancersModule,
    DatastoreSearchActiveProjectsModule,
    DatastoreSearchKeywordProjectsModule,
    DatastoreUserBalancesModule,
    DatastoreUserBidLimitModule,
    DatastoreUserGiveGetDetailsModule,
    DatastoreUserInfoModule,
    DatastoreUsersModule,
    DatastoreUserRecentProjectsAndContestsModule,
    DirectivesModule,
    FeedItemsModule,
    LanguageSwitcherModule,
    MessagingThreadsModule,
    NotificationTemplatesModule,
    DashboardHomeMyProjectsModule,
    PipesModule,
    ProjectSearchResultsItemModule,
    PartnerDashboardAccessModule,
    PwaModule,
    TrackingModule,
    UiModule,
    UserCardModule,
    UserSearchResultsItemModule,
    FeatureFlagsModule,
    ViewHeaderTemplateModule,
  ],
  declarations: [
    AccountComponent,
    AccountListComponent,
    BrowseComponent,
    BrowseLinksComponent,
    ContestSearchResultsComponent,
    FinancesComponent,
    FinancesListComponent,
    NavigationPrimaryComponent,
    NavigationPrimaryRevampComponent,
    MenuComponent,
    MenuItemComponent,
    MessagesComponent,
    MyProjectsComponent,
    MyProjectsListComponent,
    ProjectSearchResultsComponent,
    UpdatesComponent,
    UpdatesPageComponent,
    UpdatesListComponent,
    UpdatesSettingsComponent,
    UpdatesSettingsListComponent,
    UserSearchResultsComponent,
    UserSettingsComponent,
  ],
  exports: [NavigationPrimaryComponent, NavigationPrimaryRevampComponent],
})
export class NavigationPrimaryModule {}
