import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { NotificationsPreferenceEntry } from '@freelancer/datastore/collections';
import { HeadingType } from '@freelancer/ui/heading';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { LinkColor, LinkHoverColor } from '@freelancer/ui/link';
import { FontColor, FontWeight, TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'app-messaging-inbox-widget-header',
  template: `
    <ng-container flTrackingSection="MessagingInboxWidgetHeader">
      <fl-heading
        i18n="Floating inbox header title"
        [color]="FontColor.LIGHT"
        [headingType]="HeadingType.H1"
        [size]="TextSize.SMALL"
        [weight]="FontWeight.BOLD"
      >
        <fl-link
          flTrackingLabel="GoToMessages"
          link="/messages"
          [color]="LinkColor.LIGHT"
          [hoverColor]="LinkHoverColor.LIGHT"
        >
          Messages
        </fl-link>
      </fl-heading>
      <fl-bit>
        <ng-container *ngIf="chatSoundSetting">
          <fl-icon
            *ngIf="chatSoundSetting?.enabled; else disabledChatSound"
            flTrackingLabel="DisableChatSound"
            [name]="'ui-bell-v2'"
            [clickable]="true"
            [color]="IconColor.LIGHT"
            [size]="IconSize.SMALL"
            (click)="onChatSoundToggle(chatSoundSetting)"
          ></fl-icon>
          <ng-template #disabledChatSound>
            <fl-icon
              flTrackingLabel="EnableChatSound"
              [name]="'ui-bell-silent-v2'"
              [clickable]="true"
              [color]="IconColor.LIGHT"
              [size]="IconSize.SMALL"
              (click)="onChatSoundToggle(chatSoundSetting)"
            ></fl-icon>
          </ng-template>
        </ng-container>
        <ng-container *ngIf="!isMinimised; else minimised">
          <fl-icon
            flTrackingLabel="MinimizeInbox"
            [name]="'ui-chevron-down'"
            [clickable]="true"
            [color]="IconColor.LIGHT"
            [size]="IconSize.SMALL"
            (click)="toggleMinimise()"
          ></fl-icon>
        </ng-container>
        <ng-template #minimised>
          <fl-icon
            flTrackingLabel="MaximizeInbox"
            [name]="'ui-chevron-up'"
            [clickable]="true"
            [color]="IconColor.LIGHT"
            [size]="IconSize.SMALL"
            (click)="toggleMinimise()"
          ></fl-icon>
        </ng-template>
      </fl-bit>
    </ng-container>
  `,
  styleUrls: ['./messaging-inbox-widget-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagingInboxWidgetHeaderComponent {
  HeadingType = HeadingType;
  IconColor = IconColor;
  IconSize = IconSize;
  FontColor = FontColor;
  FontWeight = FontWeight;
  LinkColor = LinkColor;
  LinkHoverColor = LinkHoverColor;
  TextSize = TextSize;

  @Input() chatSoundSetting?: NotificationsPreferenceEntry;
  @Input() isMinimised = false;
  @Output() shouldMinimise = new EventEmitter<boolean>();
  @Output() toggleChatSound = new EventEmitter<NotificationsPreferenceEntry>();

  toggleMinimise() {
    this.shouldMinimise.emit(!this.isMinimised);
  }
  onChatSoundToggle(chatSoundSetting: NotificationsPreferenceEntry) {
    this.toggleChatSound.emit({
      ...chatSoundSetting,
      enabled: !chatSoundSetting.enabled,
    });
  }
}
