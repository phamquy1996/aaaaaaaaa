import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PipesModule } from '@freelancer/pipes';
import { TrackingModule } from '@freelancer/tracking';
import { UiModule } from '@freelancer/ui';
import { NotificationTemplatesModule } from 'app/navigation/notification-templates';
import { FeedItemComponent } from './feed-item/feed-item.component';
import { MediaObjectContentComponent } from './media-object/media-object-content.component';
import { MediaObjectThumbnailComponent } from './media-object/media-object-thumbnail.component';
import { MediaObjectComponent } from './media-object/media-object.component';
import { MessageItemComponent } from './message-item/message-item.component';
import { NotificationItemComponent } from './notification-item/notification-item.component';
import { ProjectItemComponent } from './project-item/project-item.component';

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    PipesModule,
    NotificationTemplatesModule,
    TrackingModule,
  ],
  declarations: [
    FeedItemComponent,
    MessageItemComponent,
    NotificationItemComponent,
    ProjectItemComponent,
    MediaObjectComponent,
    MediaObjectContentComponent,
    MediaObjectThumbnailComponent,
  ],
  exports: [
    MessageItemComponent,
    NotificationItemComponent,
    ProjectItemComponent,
    MediaObjectComponent,
    MediaObjectContentComponent,
    MediaObjectThumbnailComponent,
  ],
})
export class FeedItemsModule {}
