import {
  AnimationEvent,
  transition,
  trigger,
  useAnimation,
} from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
import { fadeOut } from '@freelancer/animations';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, FontWeight, TextSize } from '@freelancer/ui/text';

export enum BannerAlertType {
  DEFAULT = 'default',
  ERROR = 'error',
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
}

export enum BannerAlertLevel {
  NONE = 'none',
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  TERTIARY = 'tertiary',
}

export interface BannerAlertButton {
  text: string;
  color?: ButtonColor;
  link?: string;
  fragment?: string;
  queryParams?: { [k: string]: string | number };
  linkActive?: string[] | string;
  linkActiveOptions?: { exact: boolean };
  busy?: boolean;
}

@Component({
  selector: 'fl-banner-alert',
  template: `
    <fl-bit
      #alertBox
      class="BannerAlertBox"
      [attr.data-type]="type"
      [attr.data-closeable]="closeable"
      [attr.data-level]="level"
      [@hideElement]="state"
      (@hideElement.done)="animationDone($event)"
    >
      <fl-bit class="BannerAlertBox-inner" [attr.data-compact]="compact">
        <fl-bit
          *ngIf="type !== BannerAlertType.DEFAULT && !compact"
          [ngSwitch]="type"
          [flHideMobile]="true"
          [flMarginRight]="Margin.XSMALL"
        >
          <fl-icon
            *ngSwitchCase="BannerAlertType.INFO"
            [name]="'ui-info-v2'"
            [color]="IconColor.PRIMARY"
          ></fl-icon>
          <fl-icon
            *ngSwitchCase="BannerAlertType.ERROR"
            [name]="'ui-warning-v2'"
            [color]="IconColor.ERROR"
          ></fl-icon>
          <fl-icon
            *ngSwitchCase="BannerAlertType.SUCCESS"
            [name]="'ui-check-in-circle-v2'"
            [color]="IconColor.SUCCESS"
          ></fl-icon>
          <fl-icon
            *ngSwitchCase="BannerAlertType.WARNING"
            [name]="'ui-warning-alt-v2'"
            [color]="IconColor.CONTEST"
          ></fl-icon>
        </fl-bit>
        <fl-bit
          class="BannerAlertBox-content"
          [flMarginRight]="Margin.SMALL"
          [flMarginRightTablet]="compact ? Margin.SMALL : Margin.LARGE"
        >
          <fl-text
            *ngIf="bannerTitle"
            [color]="FontColor.DARK"
            [size]="TextSize.XSMALL"
            [weight]="FontWeight.BOLD"
            [flMarginBottom]="Margin.XXXSMALL"
          >
            {{ bannerTitle }}
          </fl-text>
          <fl-text
            class="BannerAlertBox-desc"
            [size]="TextSize.XSMALL"
            [color]="FontColor.DARK"
            [flMarginBottom]="bannerAlertButton ? Margin.XXSMALL : Margin.NONE"
          >
            <ng-content></ng-content>
          </fl-text>
          <fl-button
            *ngIf="bannerAlertButton"
            [color]="
              bannerAlertButton.color
                ? bannerAlertButton.color
                : ButtonColor.DEFAULT
            "
            [size]="ButtonSize.SMALL"
            [link]="bannerAlertButton.link"
            [linkActive]="bannerAlertButton.linkActive"
            [fragment]="bannerAlertButton.fragment"
            [queryParams]="bannerAlertButton.queryParams"
            [busy]="bannerAlertButton.busy"
            [linkActiveOptions]="bannerAlertButton.linkActiveOptions"
            (click)="handleButtonClick()"
          >
            {{ bannerAlertButton.text }}
          </fl-button>
        </fl-bit>
        <fl-button
          *ngIf="closeable"
          class="BannerAlertBox-closeBtn"
          (click)="handleCloseEvent()"
        >
          <fl-icon
            [name]="'ui-close'"
            [color]="IconColor.MID"
            [size]="IconSize.SMALL"
          ></fl-icon>
        </fl-button>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./banner-alert.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('hideElement', [
      transition('visible => hidden', [
        useAnimation(fadeOut, {
          params: { time: '500ms ease-out' },
        }),
      ]),
    ]),
  ],
})
export class BannerAlertComponent {
  Margin = Margin;
  IconColor = IconColor;
  IconSize = IconSize;
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  FontColor = FontColor;
  TextSize = TextSize;
  FontWeight = FontWeight;
  BannerAlertType = BannerAlertType;
  state = 'visible';

  @HostBinding('class.IsHidden') bannerAlertHidden = false;
  @HostBinding('attr.role') role = 'alert';
  @Input() bannerAlertButton?: BannerAlertButton;
  @Input() type = BannerAlertType.DEFAULT;
  @Input() bannerTitle?: string;
  @Input() closeable = true;
  @Input() compact = false;
  @Input() level = BannerAlertLevel.NONE;

  @Output() buttonClicked = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  animationDone(event: AnimationEvent) {
    if (event.toState === 'hidden') {
      this.bannerAlertHidden = true;
    }
  }

  handleButtonClick() {
    this.buttonClicked.emit();
  }

  handleCloseEvent() {
    this.state = 'hidden';
    this.close.emit();
  }
}
