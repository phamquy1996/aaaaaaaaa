import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  NotificationEntry,
  ProjectFeedEntry,
} from '@freelancer/datastore/collections';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import {
  LinkColor,
  LinkIconPosition,
  LinkUnderline,
} from '@freelancer/ui/link';
import { Margin } from '@freelancer/ui/margin';
import { PictureDisplay } from '@freelancer/ui/picture';
import {
  FontWeight,
  TextAlign,
  TextSize,
  TextTransform,
} from '@freelancer/ui/text';
import { NavigationUpdatesView } from '../updates.model';

@Component({
  selector: 'app-updates-list',
  template: `
    <fl-bit class="Heading" *ngIf="!hideHeading">
      <fl-text
        i18n="Updates heading"
        [flHideMobile]="true"
        [flMarginRight]="Margin.MID"
        [size]="TextSize.XXSMALL"
        [textTransform]="TextTransform.UPPERCASE"
        [weight]="FontWeight.BOLD"
      >
        Recent Updates
      </fl-text>
      <fl-text
        i18n="Updates heading"
        [flHideTablet]="true"
        [flHideDesktop]="true"
        [flMarginRight]="Margin.MID"
        [size]="TextSize.XXSMALL"
        [textTransform]="TextTransform.UPPERCASE"
        [weight]="FontWeight.BOLD"
      >
        Updates
      </fl-text>
      <fl-button
        *ngIf="hasPreferences"
        flTrackingLabel="Updates-Options"
        (click)="handleSettings()"
      >
        <fl-icon
          title="Notification Settings"
          i18n-title="Updates Notification Settings Title"
          [color]="IconColor.PRIMARY"
          [name]="'ui-cog-v2'"
          [size]="IconSize.SMALL"
        >
        </fl-icon>
      </fl-button>
    </fl-bit>
    <fl-bit class="Settings" [flShowMobile]="true">
      <fl-link
        i18n="Updates Notification Settings button"
        flTrackingLabel="Notification-settings"
        [iconName]="'ui-arrow-right'"
        [iconPosition]="LinkIconPosition.RIGHT"
        (click)="handleSettings()"
      >
        Notification settings
      </fl-link>
    </fl-bit>
    <fl-bit class="List" *ngIf="updates && updates.length > 0; else noUpdates">
      <ng-container *ngFor="let update of updates">
        <app-notification-item
          *ngIf="isNotificationEntry(update)"
          [event]="update"
        ></app-notification-item>
        <app-project-item
          *ngIf="!isNotificationEntry(update)"
          [entry]="update"
        ></app-project-item>
      </ng-container>
    </fl-bit>

    <ng-template #noUpdates>
      <fl-bit class="Empty">
        <fl-picture
          class="EmptyImg"
          alt="Empty Updates Image"
          i18n-alt="Updates empty updates image"
          [alignCenter]="true"
          [display]="PictureDisplay.BLOCK"
          [flMarginBottom]="Margin.SMALL"
          [src]="'navigation/updates/empty-updates.svg'"
        >
        </fl-picture>
        <fl-text
          i18n="Updates empty messages"
          [size]="TextSize.XXSMALL"
          [textAlign]="TextAlign.CENTER"
        >
          Sorry, you don't have any updates.
        </fl-text>
        <fl-text
          i18n="Updates check new projects"
          [size]="TextSize.XXSMALL"
          [textAlign]="TextAlign.CENTER"
        >
          Would you like to
          <fl-link
            flTrackingLabel="Updates-PostProject"
            [link]="'/post-project'"
            [size]="TextSize.XXSMALL"
          >
            post a project</fl-link
          >?
        </fl-text>
      </fl-bit>
    </ng-template>
  `,
  styleUrls: ['./updates-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatesListComponent {
  TextSize = TextSize;
  FontWeight = FontWeight;
  IconColor = IconColor;
  IconSize = IconSize;
  LinkColor = LinkColor;
  LinkIconPosition = LinkIconPosition;
  LinkUnderline = LinkUnderline;
  Margin = Margin;
  PictureDisplay = PictureDisplay;
  TextAlign = TextAlign;
  TextTransform = TextTransform;

  @Input() hasPreferences: boolean;
  @Input() updates: ReadonlyArray<NotificationEntry | ProjectFeedEntry>;
  @Input() hideHeading = false;

  @Output() clickSettings = new EventEmitter<NavigationUpdatesView>();

  isNotificationEntry(
    entry: NotificationEntry | ProjectFeedEntry,
  ): entry is NotificationEntry {
    return (
      entry && 'parent_type' in entry && entry.parent_type === 'notifications'
    );
  }

  handleSettings() {
    this.clickSettings.emit(NavigationUpdatesView.SETTINGS);
  }
}
