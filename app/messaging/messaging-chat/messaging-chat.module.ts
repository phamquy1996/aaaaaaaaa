import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from '@freelancer/components';
import {
  DatastoreAgentSessionsModule,
  DatastoreAgentsModule,
  DatastoreBidsModule,
  DatastoreContactsModule,
  DatastoreContestsModule,
  DatastoreHourlyContractsModule,
  DatastoreInvoicesModule,
  DatastoreMessagesModule,
  DatastoreMilestoneRequestsModule,
  DatastoreMilestonesModule,
  DatastoreNotificationsPreferencesModule,
  DatastoreOnlineOfflineModule,
  DatastoreSearchThreadsModule,
  DatastoreTeamsModule,
  DatastoreThreadProjectsModule,
  DatastoreThreadsModule,
  DatastoreUsersModule,
} from '@freelancer/datastore/collections';
import { FeatureFlagsModule } from '@freelancer/feature-flags';
import { PipesModule } from '@freelancer/pipes';
import { TrackingModule } from '@freelancer/tracking';
import { UiModule } from '@freelancer/ui';
import { ViewHeaderTemplateModule } from '@freelancer/view-header-template';
import { ResizableModule } from 'angular-resizable-element';
import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG,
} from 'ngx-perfect-scrollbar';
import { MessagingInboxHeaderComponent } from '../messaging-inbox/messaging-inbox-header/messaging-inbox-header.component';
import { AttachmentListComponent } from './attachment-list/attachment-list.component';
import { AttachmentUploadComponent } from './attachment-upload/attachment-upload.component';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { ContextBoxComponent } from './context-box/context-box.component';
import { ErrorAlertComponent } from './error-alert/error-alert.component';
import { HeaderComponent } from './header/header.component';
import { MessageAttachmentComponent } from './message-attachment/message-attachment.component';
import { MessageItemComponent } from './message-item/message-item.component';
import { MessageListComponent } from './message-list/message-list.component';
import { MessagingChatBoxComponent } from './messaging-chat-box/messaging-chat-box.component';
import { MessagingChatComponent } from './messaging-chat.component';
import { MessagingHeaderControlsComponent } from './messaging-header/messaging-header-controls/messaging-header-controls.component';
import { MessagingHeaderComponent } from './messaging-header/messaging-header.component';
import { MessagingMessageAttachmentComponent } from './messaging-message-list/messaging-message-attachment/messaging-message-attachment.component';
import { MessagingMessageItemComponent } from './messaging-message-list/messaging-message-item/messaging-message-item.component';
import { MessagingMessageListComponent } from './messaging-message-list/messaging-message-list.component';
import { MessagingSidebarComponent } from './messaging-sidebar/messaging-sidebar.component';
import { SidebarAttachmentItemComponent } from './messaging-sidebar/sidebar-attachments/sidebar-attachment-item.component';
import { SidebarAttachmentsComponent } from './messaging-sidebar/sidebar-attachments/sidebar-attachments.component';
import { MessagingThreadViewComponent } from './messaging-thread-view/messaging-thread-view.component';
import { MessagingTypingBoxComponent } from './messaging-typing-box/messaging-typing-box.component';
import { MessagingTypingIndicatorComponent } from './messaging-typing-indicator/messaging-typing-indicator.component';
import { OnboardingOverlayComponent } from './onboarding-overlay/onboarding-overlay.component';
import { OverlayTemplateDiscussComponent } from './onboarding-overlay/overlay-template-discuss.component';
import { OverlayTemplateIntroComponent } from './onboarding-overlay/overlay-template-intro.component';
import { OverlayTemplateMilestoneComponent } from './onboarding-overlay/overlay-template-milestone.component';
import { OverlayTemplateOffsiteComponent } from './onboarding-overlay/overlay-template-offsite.component';
import { GroupchatOverlayComponent } from './overlays/groupchat-overlay/groupchat-overlay.component';
import { CandidateGroupListComponent } from './overlays/groupchat-overlay/management-view/candidate-group-list.component';
import { CandidateGroupComponent } from './overlays/groupchat-overlay/management-view/candidate-group.component';
import { ManagementViewComponent } from './overlays/groupchat-overlay/management-view/management-view.component';
import { SearchComponent } from './overlays/groupchat-overlay/management-view/search.component';
import { ConfirmUserLeaveViewComponent } from './overlays/groupchat-overlay/participants-view/confirm-user-leave-view.component';
import { ConfirmUserRemovalViewComponent } from './overlays/groupchat-overlay/participants-view/confirm-user-removal-view.component';
import { ParticipantsViewContentComponent } from './overlays/groupchat-overlay/participants-view/participants-view-content.component';
import { ParticipantsViewComponent } from './overlays/groupchat-overlay/participants-view/participants-view.component';
import { OverlayContentComponent } from './overlays/overlay-content/overlay-content.component';
import { OverlayControlsItemComponent } from './overlays/overlay-content/overlay-controls-item.component';
import { OverlayControlsComponent } from './overlays/overlay-content/overlay-controls.component';
import { OverlayHeaderComponent } from './overlays/overlay-content/overlay-header.component';
import { SettingsOverlayContentComponent } from './overlays/settings-overlay/settings-overlay-content.component';
import { SettingsOverlayComponent } from './overlays/settings-overlay/settings-overlay.component';
import { ReadMarkerComponent } from './read-marker/read-marker.component';
import { ShareJobComponent } from './rich-message/components/share-job/share-job.component';
import { RichMessageModule } from './rich-message/rich-message.module';
import { AutoGrowDirective } from './typing-box/auto-grow.directive';
import { TypingBoxComponent } from './typing-box/typing-box.component';

const CUSTOM_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

// tslint:disable-next-line:readonly-array
const components = [
  AutoGrowDirective,
  ChatBoxComponent,
  ContextBoxComponent,
  ErrorAlertComponent,
  HeaderComponent,
  MessageAttachmentComponent,
  MessageItemComponent,
  MessageListComponent,
  MessagingChatComponent,
  MessagingSidebarComponent,
  SidebarAttachmentsComponent,
  SidebarAttachmentItemComponent,
  OnboardingOverlayComponent,
  OverlayTemplateIntroComponent,
  OverlayTemplateOffsiteComponent,
  OverlayTemplateDiscussComponent,
  OverlayTemplateMilestoneComponent,
  ReadMarkerComponent,
  AttachmentListComponent,
  SearchComponent,
  TypingBoxComponent,
  AttachmentUploadComponent,
  OverlayControlsComponent,
  OverlayControlsItemComponent,
  OverlayContentComponent,
  OverlayHeaderComponent,
  ParticipantsViewComponent,
  ParticipantsViewContentComponent,
  GroupchatOverlayComponent,
  ManagementViewComponent,
  CandidateGroupListComponent,
  CandidateGroupComponent,
  ConfirmUserRemovalViewComponent,
  ConfirmUserLeaveViewComponent,
  SettingsOverlayComponent,
  SettingsOverlayContentComponent,
  MessagingInboxHeaderComponent,
  ShareJobComponent,
  // New chat box components
  MessagingChatBoxComponent,
  MessagingHeaderComponent,
  MessagingHeaderControlsComponent,
  MessagingMessageAttachmentComponent,
  MessagingMessageItemComponent,
  MessagingMessageListComponent,
  MessagingThreadViewComponent,
  MessagingTypingBoxComponent,
  MessagingTypingIndicatorComponent,
];

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    UiModule,
    PerfectScrollbarModule,
    RichMessageModule,
    TrackingModule,
    UiModule,
    ResizableModule,
    ComponentsModule,
    PipesModule,
    DatastoreBidsModule,
    DatastoreContactsModule,
    DatastoreHourlyContractsModule,
    DatastoreMessagesModule,
    DatastoreMilestoneRequestsModule,
    DatastoreInvoicesModule,
    DatastoreMilestonesModule,
    DatastoreNotificationsPreferencesModule,
    DatastoreOnlineOfflineModule,
    DatastoreTeamsModule,
    DatastoreThreadProjectsModule,
    DatastoreThreadsModule,
    DatastoreSearchThreadsModule,
    DatastoreAgentSessionsModule,
    DatastoreUsersModule,
    DatastoreContestsModule,
    DatastoreAgentsModule,
    FeatureFlagsModule,
    ViewHeaderTemplateModule,
  ],
  declarations: components,
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: CUSTOM_PERFECT_SCROLLBAR_CONFIG,
    },
  ],
  exports: components,
})
export class MessagingChatModule {}
