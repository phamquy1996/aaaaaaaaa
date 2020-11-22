import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UiModule } from '@freelancer/ui';
import { ComponentsModule } from '../components.module';
import {
  CommentUiActionComponent,
  CommentUiActionsComponent,
  CommentUiComponent,
  CommentUiContentComponent,
  CommentUiCustomUserTitleComponent,
  CommentUiEditFormComponent,
  CommentUiOptionsComponent,
} from './comment-ui.component';

@NgModule({
  imports: [ComponentsModule, CommonModule, UiModule],
  declarations: [
    CommentUiActionComponent,
    CommentUiActionsComponent,
    CommentUiComponent,
    CommentUiCustomUserTitleComponent,
    CommentUiEditFormComponent,
    CommentUiOptionsComponent,
    CommentUiContentComponent,
  ],
  exports: [
    CommentUiActionComponent,
    CommentUiActionsComponent,
    CommentUiComponent,
    CommentUiEditFormComponent,
    CommentUiCustomUserTitleComponent,
    CommentUiOptionsComponent,
    CommentUiContentComponent,
  ],
})
export class CommentUiModule {}
