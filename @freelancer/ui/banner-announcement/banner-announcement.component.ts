import {
  AnimationEvent,
  transition,
  trigger,
  useAnimation,
} from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
import { fadeOut } from '@freelancer/animations';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { ContainerSize } from '@freelancer/ui/container';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, FontWeight, TextSize } from '@freelancer/ui/text';

export enum BannerAnnouncementType {
  INFO = 'info',
  SUCCESS = 'success',
  CRITICAL = 'critical',
}

@Component({
  selector: 'fl-banner-announcement-message',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannerAnnouncementMessageComponent {}

@Component({
  selector: 'fl-banner-announcement-buttons',
  template: `
    <ng-content select="fl-button"></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannerAnnouncementButtonsComponent {}

@Component({
  selector: 'fl-banner-announcement',
  template: `
    <fl-bit
      class="AnnouncementBackground"
      role="alert"
      [attr.data-type]="type"
      [@hideElement]="state"
      (@hideElement.done)="animationDone($event)"
    >
      <fl-container class="AnnouncementContentContainer" [size]="size">
        <fl-bit [flMarginRight]="Margin.XSMALL">
          <fl-icon [name]="icon" [color]="IconColor.LIGHT"></fl-icon>
        </fl-bit>
        <fl-bit class="AnnouncementWrap">
          <fl-bit class="AnnouncementContent" [flMarginRight]="Margin.LARGE">
            <fl-text
              *ngIf="bannerTitle"
              [color]="FontColor.LIGHT"
              [size]="TextSize.XSMALL"
              [weight]="FontWeight.BOLD"
              [flMarginBottom]="Margin.NONE"
            >
              {{ bannerTitle }}
            </fl-text>
            <fl-text
              [size]="TextSize.XSMALL"
              [color]="FontColor.LIGHT"
              [flMarginBottom]="injectedButtons ? Margin.XSMALL : Margin.NONE"
              [flMarginBottomTablet]="Margin.NONE"
            >
              <!-- only inject subcomponents if they're necessary for buttons -->
              <!-- this should make the interface nicer for non-button banners -->
              <ng-container *ngIf="injectedButtons; else allContent">
                <ng-content
                  select="fl-banner-announcement-message"
                ></ng-content>
              </ng-container>
              <ng-template #allContent>
                <ng-content></ng-content>
              </ng-template>
            </fl-text>
          </fl-bit>
          <fl-bit
            *ngIf="injectedButtons"
            class="AnnouncementButtons"
            [flMarginRight]="Margin.XSMALL"
          >
            <ng-content select="fl-banner-announcement-buttons"></ng-content>
          </fl-bit>
        </fl-bit>

        <fl-button
          *ngIf="closeable"
          class="AlertCloseButton"
          (click)="handleCloseEvent()"
        >
          <fl-icon
            [name]="'ui-close'"
            [color]="IconColor.LIGHT"
            [size]="IconSize.SMALL"
          ></fl-icon>
        </fl-button>
      </fl-container>
    </fl-bit>
  `,
  styleUrls: ['./banner-announcement.component.scss'],
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
export class BannerAnnouncementComponent {
  Margin = Margin;
  IconColor = IconColor;
  IconSize = IconSize;
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  FontColor = FontColor;
  TextSize = TextSize;
  FontWeight = FontWeight;
  BannerAnnouncementType = BannerAnnouncementType;
  state = 'visible';
  size: ContainerSize;

  @HostBinding('class.IsHidden') bannerAlertHidden = false;
  @Input() type = BannerAnnouncementType.INFO;
  @Input() bannerTitle?: string;
  @Input() closeable = true;
  @Input() icon: string;
  @Output() close = new EventEmitter<void>();
  @Input() set containerSize(value: ContainerSize) {
    this.size = value || ContainerSize.DESKTOP_LARGE;
  }

  @ContentChild(BannerAnnouncementButtonsComponent)
  injectedButtons: BannerAnnouncementButtonsComponent;

  animationDone(event: AnimationEvent) {
    if (event.toState === 'hidden') {
      this.bannerAlertHidden = true;
    }
  }

  handleCloseEvent() {
    this.state = 'hidden';
    this.close.emit();
  }
}
