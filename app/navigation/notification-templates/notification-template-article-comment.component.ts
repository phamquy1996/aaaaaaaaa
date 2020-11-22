import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotificationArticleComment } from '@freelancer/datastore/collections';

@Component({
  selector: 'app-notification-template-article-comment',
  template: `
    <ng-container
      *ngIf="
        event.data.articleAuthor &&
        event.data.commentBy &&
        event.data.articleAuthor !== event.data.commentBy
      "
      i18n="Notification template article comment"
    >
      <strong>{{ event.data.publicName || event.data.user }}</strong> has
      responded to your article {{ event.data.articleName }}.
    </ng-container>
    <ng-container
      *ngIf="
        !(
          event.data.articleAuthor &&
          event.data.commentBy &&
          event.data.articleAuthor !== event.data.commentBy
        )
      "
      i18n="Notification template article comment"
    >
      <strong>{{ event.data.publicName || event.data.user }}</strong> has
      responded to the article {{ event.data.articleName }}.
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateArticleCommentComponent {
  @Input() event: NotificationArticleComment;
}
