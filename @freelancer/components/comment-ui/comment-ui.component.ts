import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { FontWeight, TextSize } from '@freelancer/ui/text';
import { TooltipPosition } from '@freelancer/ui/tooltip';
import { AvatarSize } from '@freelancer/ui/user-avatar';
import { UsernameBadges } from '@freelancer/ui/username';

@Component({
  selector: 'fl-comment-ui-content',
  template: `
    <fl-bit class="CommentText" [flMarginBottom]="Margin.XXSMALL">
      <ng-content></ng-content>
    </fl-bit>
  `,
  styleUrls: ['comment-ui.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentUiContentComponent {
  Margin = Margin;
}

@Component({
  selector: 'fl-comment-ui-custom-user-title',
  template: `
    <fl-text
      [flMarginRight]="Margin.XXSMALL"
      [size]="TextSize.XSMALL"
      [weight]="FontWeight.MEDIUM"
    >
      <ng-content></ng-content>
    </fl-text>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentUiCustomUserTitleComponent {
  FontWeight = FontWeight;
  TextSize = TextSize;
  Margin = Margin;
}

@Component({
  selector: 'fl-comment-ui-options',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentUiOptionsComponent {}

@Component({
  selector: 'fl-comment-ui-edit-form',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentUiEditFormComponent {}

@Component({
  selector: 'fl-comment-ui-action',
  template: `
    <fl-button
      class="CommentAction"
      flTrackingLabel="flTrackingLabel"
      (click)="handleAction()"
    >
      <fl-icon
        class="CommentAction-icon"
        *ngIf="icon"
        [flMarginRight]="Margin.XXXSMALL"
        [color]="IconColor.PRIMARY"
        [name]="icon"
        [size]="IconSize.SMALL"
      ></fl-icon>
      <fl-text
        class="CommentAction-text"
        i18n="FeedItemComment"
        [size]="TextSize.XXSMALL"
        [weight]="FontWeight.MEDIUM"
      >
        <ng-content></ng-content>
      </fl-text>
    </fl-button>
  `,
  styleUrls: ['comment-ui.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentUiActionComponent {
  IconSize = IconSize;
  IconColor = IconColor;
  Margin = Margin;
  TextSize = TextSize;
  FontWeight = FontWeight;

  @Input() icon?: string;
  @Input() flTrackingLabel: string;
  @Output() action = new EventEmitter<void>();

  handleAction() {
    this.action.emit();
  }
}

@Component({
  selector: 'fl-comment-ui-actions',
  template: `
    <fl-bit class="ActionsContainer">
      <ng-content select="fl-comment-ui-action"></ng-content>
    </fl-bit>
  `,
  styleUrls: ['comment-ui.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentUiActionsComponent {}

@Component({
  selector: 'fl-comment-ui',
  template: `
    <fl-bit class="CommentItem">
      <fl-user-avatar
        [flHideDesktop]="true"
        [flMarginRight]="Margin.XXSMALL"
        [size]="AvatarSize.SMALL"
        [users]="[{ avatar: avatar, username: username }]"
      ></fl-user-avatar>
      <fl-user-avatar
        [flMarginRight]="Margin.XXSMALL"
        [flShowDesktop]="true"
        [size]="AvatarSize.MID"
        [users]="[{ avatar: avatar, username: username }]"
      ></fl-user-avatar>
      <fl-bit class="CommentItem-content">
        <fl-bit
          class="CommentItem-header"
          [flMarginBottom]="
            isCompact || isEditMode ? Margin.XXSMALL : Margin.XXXSMALL
          "
        >
          <fl-bit
            class="CommentItem-header-details"
            [ngClass]="{ IsStacked: isCompact }"
          >
            <ng-content
              *ngIf="useCustomUserTitle; else showUsername"
              select="fl-comment-ui-custom-user-title"
            ></ng-content>
            <ng-template #showUsername>
              <fl-username
                flTrackingLabel="CommentUsername"
                [badges]="badges"
                [displayName]="displayName"
                [flMarginRight]="Margin.XXSMALL"
                [link]="'/u/' + username"
                [username]="username"
              ></fl-username>
            </ng-template>
            <fl-text
              *ngIf="!isCompact"
              i18n="Text interpunct"
              [flMarginRight]="Margin.XXSMALL"
              [size]="TextSize.XSMALL"
              [weight]="FontWeight.BOLD"
            >
              ·
            </fl-text>

            <fl-tooltip
              i18n-message="Time the comment was created"
              message="{{ timeCreated | date: 'EEEE, MMM d, y' }} at {{
                timeCreated | date: 'HH:mm a'
              }}"
              [position]="TooltipPosition.TOP_CENTER"
            >
              <fl-relative-time
                [date]="timeCreated"
                [includeSeconds]="false"
                [strict]="true"
              ></fl-relative-time>
            </fl-tooltip>
          </fl-bit>
          <fl-bit class="CommentItem-header-options">
            <ng-content select="fl-comment-ui-options"></ng-content>
          </fl-bit>
        </fl-bit>
        <ng-content
          *ngIf="!isEditMode; else editMode"
          select="fl-comment-ui-content"
        ></ng-content>
        <ng-template #editMode>
          <ng-content select="fl-comment-ui-edit-form"></ng-content>
        </ng-template>
        <ng-content select="fl-comment-ui-actions"></ng-content>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['comment-ui.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentUiComponent {
  AvatarSize = AvatarSize;
  FontWeight = FontWeight;
  Margin = Margin;
  TextSize = TextSize;
  TooltipPosition = TooltipPosition;

  @Input() avatar?: string;
  @Input() displayName: string;
  @Input() isCompact = false;
  @Input() isEditMode = false;
  @Input() timeCreated: number | string | Date;
  @Input() username: string;
  @Input() useCustomUserTitle = false;
  @Input() badges: UsernameBadges;
}
