import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommentUiModule } from '@freelancer/components';
import { DatastoreContestCommentsModule } from '@freelancer/datastore/collections';
import { DirectivesModule } from '@freelancer/directives';
import { TrackingModule } from '@freelancer/tracking';
import { UiModule } from '@freelancer/ui';
import { ContestCommentDeleteToastComponent } from './contest-comment-delete-toast/contest-comment-delete-toast.component';
import { ContestCommentFormMessagesComponent } from './contest-comment-form/contest-comment-form-messages/contest-comment-form-messages.component';
import { ContestCommentFormComponent } from './contest-comment-form/contest-comment-form.component';
import { ContestCommentListComponent } from './contest-comment-list/contest-comment-list.component';
import { ContestCommentItemComponent } from './contest-comment-list/contest-comment-thread/contest-comment-item/contest-comment-item.component';
import { ContestCommentThreadComponent } from './contest-comment-list/contest-comment-thread/contest-comment-thread.component';
import { ContestCommentsMobileComponent } from './contest-comments-mobile/contest-comments-mobile.component';

@NgModule({
  imports: [
    CommentUiModule,
    CommonModule,
    DatastoreContestCommentsModule,
    DirectivesModule,
    UiModule,
    TrackingModule,
  ],
  declarations: [
    ContestCommentDeleteToastComponent,
    ContestCommentFormComponent,
    ContestCommentFormMessagesComponent,
    ContestCommentItemComponent,
    ContestCommentListComponent,
    ContestCommentThreadComponent,
    ContestCommentsMobileComponent,
  ],
  exports: [
    ContestCommentDeleteToastComponent,
    ContestCommentFormComponent,
    ContestCommentFormMessagesComponent,
    ContestCommentItemComponent,
    ContestCommentListComponent,
    ContestCommentThreadComponent,
    ContestCommentsMobileComponent,
  ],
})
export class ContestCommentsModule {}
