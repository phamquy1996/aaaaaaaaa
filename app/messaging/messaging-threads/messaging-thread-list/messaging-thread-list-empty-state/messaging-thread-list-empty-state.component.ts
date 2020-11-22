import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { FontWeight, TextAlign, TextSize } from '@freelancer/ui/text';
import * as Rx from 'rxjs';

@Component({
  selector: 'app-messaging-thread-list-empty-state',
  template: `
    <fl-bit
      flTrackingSection="MessagingThreadListEmptyState"
      class="MessagesThreadListEmptyState"
      [ngClass]="{ 'MessagesThreadListEmptyState--nav': isNav$ | async }"
    >
      <!-- Empty state when user has no existing threads and is not searching-->
      <ng-container
        *ngIf="
          !(hasExistingThreads$ | async) && !(isSearching$ | async);
          else filteredEmptyState
        "
      >
        <fl-picture
          alt="Messaging chat image"
          i18n-alt="Messaging chat image alt text"
          [flMarginBottom]="Margin.XXSMALL"
          [src]="'messaging/live-chat.svg'"
        ></fl-picture>
        <fl-heading
          *ngIf="!(isNav$ | async)"
          i18n="Welcome to your messages text title"
          [flMarginBottom]="Margin.XXSMALL"
          [headingType]="HeadingType.H1"
          [size]="TextSize.MID"
          [weight]="FontWeight.BOLD"
        >
          Welcome to your messages
        </fl-heading>
        <fl-text
          i18n="Start chatting description text"
          [size]="(isNav$ | async) ? TextSize.XXSMALL : TextSize.SMALL"
          [textAlign]="TextAlign.CENTER"
        >
          Start a chat through
          <fl-link
            flTrackingLabel="PostProject"
            [link]="'/post-project'"
            [queryParams]="{ newInboxWidget: true, new_chatbox: true }"
            [size]="TextSize.INHERIT"
          >
            posting a project
          </fl-link>
          ,
          <fl-link
            flTrackingLabel="SearchUsers"
            [link]="'/search/users'"
            [queryParams]="{ newInboxWidget: true, new_chatbox: true }"
            [size]="TextSize.INHERIT"
          >
            hiring a freelancer
          </fl-link>
          , or
          <fl-link
            flTrackingLabel="BrowseProjects"
            [link]="'/search/projects'"
            [queryParams]="{ newInboxWidget: true, new_chatbox: true }"
            [size]="TextSize.INHERIT"
          >
            browsing projects
          </fl-link>
          .
        </fl-text>
      </ng-container>

      <!-- Empty state when there are no messages in selected filter-->
      <ng-template #filteredEmptyState>
        <fl-picture
          alt="Sad emoticon image"
          i18n-alt="Sad emoticon image"
          [flMarginBottom]="Margin.XXSMALL"
          [src]="'messaging/thread-filters-no-results.svg'"
        ></fl-picture>

        <fl-text
          i18n="Filtered messages empty state description"
          [size]="TextSize.SMALL"
          [textAlign]="TextAlign.CENTER"
        >
          No messages match your filter
        </fl-text>
      </ng-template>
    </fl-bit>
  `,
  styleUrls: ['./messaging-thread-list-empty-state.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagingThreadListEmptyStateComponent {
  FontWeight = FontWeight;
  HeadingType = HeadingType;
  Margin = Margin;
  TextAlign = TextAlign;
  TextSize = TextSize;

  @Input() hasExistingThreads$: Rx.Observable<boolean>;
  @Input() isSearching$: Rx.Observable<boolean>;
  @Input() isNav$: Rx.Observable<boolean>;
}
