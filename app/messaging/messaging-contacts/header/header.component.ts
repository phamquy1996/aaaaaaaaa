import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { NotificationsPreferenceEntry } from '@freelancer/datastore/collections';
import { HoverColor, IconColor, IconSize } from '@freelancer/ui/icon';
import { LinkUnderline } from '@freelancer/ui/link';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, FontType, FontWeight } from '@freelancer/ui/text';

@Component({
  selector: 'app-header',
  template: `
    <fl-bit>
      <ng-container *ngIf="isMinimised && unreadCount > 0">
        <fl-text class="DotAlert" [fontType]="FontType.SPAN"></fl-text>
      </ng-container>
      <fl-text
        *ngIf="!isCompact"
        [color]="FontColor.DARK"
        [weight]="FontWeight.BOLD"
        [flMarginRight]="Margin.XXSMALL"
        i18n="Contact list header"
      >
        Notifications
      </fl-text>
      <fl-text
        *ngIf="isCompact"
        [color]="FontColor.LIGHT"
        [weight]="FontWeight.BOLD"
        [fontType]="FontType.SPAN"
        i18n="Contact list header"
      >
        Chats
      </fl-text>
      <ng-container *ngIf="isMinimised && unreadCount > 0">
        <fl-text [fontType]="FontType.SPAN" [color]="FontColor.LIGHT">
          ({{ unreadCount }})
        </fl-text>
      </ng-container>
    </fl-bit>
    <!-- Stop event propagation here so clicking the icons doesn't also minimise the chatbox -->
    <fl-bit
      flTrackingSection="contact-list-header"
      (click)="$event.stopPropagation()"
    >
      <fl-link
        [underline]="LinkUnderline.NEVER"
        flTrackingLabel="GoToMessages"
        link="/messages"
      >
        <fl-icon
          class="Icon"
          [color]="isCompact ? IconColor.LIGHT : IconColor.DARK"
          [size]="IconSize.SMALL"
          name="ui-inbox"
          [hoverColor]="HoverColor.PRIMARY"
          i18n-label="Contact list header icon label"
          label="Go to inbox"
          data-uitest-target="contactlist-inbox-button"
        ></fl-icon>
      </fl-link>
      <fl-icon
        *ngIf="soundSetting?.enabled"
        flTrackingLabel="DisableSounds"
        class="Icon"
        [color]="isCompact ? IconColor.LIGHT : IconColor.DARK"
        [size]="IconSize.SMALL"
        name="ui-bell-v2"
        [hoverColor]="HoverColor.PRIMARY"
        i18n-label="Contact list header icon label"
        label="Disable sounds"
        (click)="toggleSounds()"
      ></fl-icon>
      <fl-icon
        *ngIf="!soundSetting?.enabled"
        flTrackingLabel="EnableSounds"
        class="Icon"
        [color]="isCompact ? IconColor.LIGHT : IconColor.PRIMARY"
        [size]="IconSize.SMALL"
        name="ui-bell-silent-v2"
        [hoverColor]="HoverColor.PRIMARY"
        i18n-label="Contact list header icon label"
        label="Enable sounds"
        (click)="toggleSounds()"
      ></fl-icon>
      <fl-icon
        *ngIf="isCompact && !isMinimised"
        flTrackingLabel="Minimise"
        class="Icon"
        [color]="IconColor.LIGHT"
        [size]="IconSize.SMALL"
        name="ui-minimise"
        [hoverColor]="HoverColor.PRIMARY"
        i18n-label="Contact list header icon label"
        label="Minimise contact list"
        data-uitest-target="contactlist-minimise-button"
        (click)="toggleMinimise()"
      ></fl-icon>
      <fl-icon
        *ngIf="isCompact && isMinimised"
        flTrackingLabel="Maximise"
        class="Icon"
        [color]="IconColor.LIGHT"
        [size]="IconSize.SMALL"
        name="ui-maximise"
        [hoverColor]="HoverColor.PRIMARY"
        i18n-label="Contact list header icon label"
        label="Un-minimise contact list"
        (click)="toggleMinimise()"
      ></fl-icon>
    </fl-bit>
  `,
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  Margin = Margin;
  FontType = FontType;
  FontColor = FontColor;
  FontWeight = FontWeight;
  IconColor = IconColor;
  IconSize = IconSize;
  HoverColor = HoverColor;
  LinkUnderline = LinkUnderline;

  @HostBinding('class.IsCompact')
  @Input()
  isCompact: boolean;
  @HostBinding('class.IsMinimised')
  @Input()
  isMinimised: boolean;
  @Input() soundSetting: NotificationsPreferenceEntry;
  @Input() unreadCount: number;

  @Output() minimise = new EventEmitter();
  @Output()
  setChatSoundSetting = new EventEmitter<{
    setting: NotificationsPreferenceEntry;
    enabled: boolean;
  }>();

  @HostListener('click')
  handleClick() {
    if (this.isCompact || this.isMinimised) {
      this.toggleMinimise();
    }
  }

  toggleMinimise() {
    this.minimise.emit();
  }

  toggleSounds() {
    const soundsEnabled = this.soundSetting ? this.soundSetting.enabled : false;
    this.setChatSoundSetting.emit({
      setting: this.soundSetting,
      enabled: !soundsEnabled,
    });
  }
}
