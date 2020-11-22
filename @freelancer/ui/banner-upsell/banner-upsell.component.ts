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
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { fadeOut } from '@freelancer/animations';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { VerticalAlignment } from '@freelancer/ui/grid';
import { HeadingColor, HeadingType } from '@freelancer/ui/heading';
import { IconColor } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, FontWeight, TextSize } from '@freelancer/ui/text';
import { UI_CONFIG } from '@freelancer/ui/ui.config';
import { UiConfig } from '@freelancer/ui/ui.interface';

export enum BannerUpsellColor {
  DARK = 'dark',
  LIGHT = 'light',
}

export enum BannerUpsellSize {
  SMALL = 'small',
  LARGE = 'large',
  LARGE_WITH_IMAGE = 'large-with-image',
}

@Component({
  selector: 'fl-banner-upsell-button',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannerUpsellButtonComponent {}

@Component({
  selector: 'fl-banner-upsell-title',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannerUpsellTitleComponent {}

@Component({
  selector: 'fl-banner-upsell-small-title',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannerUpsellSmallTitleComponent {}

@Component({
  selector: 'fl-banner-upsell-description',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannerUpsellDescriptionComponent {}

@Component({
  selector: 'fl-banner-upsell-disclaimer',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannerUpsellDisclaimerComponent {}

@Component({
  selector: 'fl-banner-upsell-picture',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannerUpsellPictureComponent {}

@Component({
  selector: 'fl-banner-upsell',
  template: `
    <fl-bit
      class="BannerUpsell"
      [attr.data-size]="size"
      [@hideElement]="state"
      (@hideElement.done)="animationDone($event)"
    >
      <fl-grid [vAlign]="VerticalAlignment.VERTICAL_CENTER">
        <fl-col
          class="BannerUpsell-content"
          [col]="12"
          [colTablet]="size === BannerUpsellSize.SMALL ? 10 : 8"
          [flMarginBottom]="
            bannerUpsellPicture && size !== BannerUpsellSize.SMALL
              ? Margin.XSMALL
              : Margin.NONE
          "
          [flMarginBottomTablet]="Margin.NONE"
        >
          <fl-heading
            *ngIf="size !== BannerUpsellSize.SMALL"
            [color]="
              color === BannerUpsellColor.DARK
                ? HeadingColor.DARK
                : HeadingColor.LIGHT
            "
            [headingType]="HeadingType.H2"
            [size]="TextSize.MID"
            [flMarginBottom]="Margin.XXSMALL"
          >
            <ng-content select="fl-banner-upsell-title"></ng-content>
          </fl-heading>
          <fl-text
            *ngIf="size === BannerUpsellSize.SMALL"
            [color]="
              color === BannerUpsellColor.DARK
                ? FontColor.DARK
                : FontColor.LIGHT
            "
            [size]="TextSize.XXSMALL"
            [flMarginBottom]="Margin.NONE"
            [weight]="FontWeight.BOLD"
          >
            <ng-content select="fl-banner-upsell-small-title"></ng-content>
          </fl-text>
          <fl-text
            [color]="
              color === BannerUpsellColor.DARK
                ? FontColor.DARK
                : FontColor.LIGHT
            "
            [size]="
              size === BannerUpsellSize.SMALL
                ? TextSize.XXSMALL
                : TextSize.SMALL
            "
            [flMarginBottom]="
              bannerUpsellButton || bannerUpsellDisclaimer
                ? Margin.XSMALL
                : Margin.NONE
            "
          >
            <ng-content select="fl-banner-upsell-description"></ng-content>
          </fl-text>
          <fl-text
            [color]="
              color === BannerUpsellColor.DARK
                ? FontColor.DARK
                : FontColor.LIGHT
            "
            [size]="
              size === BannerUpsellSize.SMALL
                ? TextSize.XXXSMALL
                : TextSize.XXSMALL
            "
          >
            <ng-content select="fl-banner-upsell-disclaimer"></ng-content>
          </fl-text>
          <ng-content select="fl-banner-upsell-button"></ng-content>
        </fl-col>
        <fl-col
          class="BannerUpsell-picture"
          *ngIf="bannerUpsellPicture"
          [col]="12"
          [colTablet]="size === BannerUpsellSize.SMALL ? 2 : 4"
          [flHideMobile]="size === BannerUpsellSize.SMALL"
        >
          <ng-content select="fl-banner-upsell-picture"></ng-content>
        </fl-col>
      </fl-grid>
      <fl-button
        *ngIf="closeable"
        class="BannerUpsell-closeButton"
        (click)="handleCloseEvent($event)"
      >
        <fl-icon name="ui-close" [color]="_closeButtonColor"></fl-icon>
      </fl-button>
    </fl-bit>
  `,
  styleUrls: ['./banner-upsell.component.scss'],
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
export class BannerUpsellComponent implements OnInit {
  BannerUpsellColor = BannerUpsellColor;
  BannerUpsellSize = BannerUpsellSize;
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  HeadingColor = HeadingColor;
  HeadingType = HeadingType;
  IconColor = IconColor;
  FontColor = FontColor;
  TextSize = TextSize;
  FontWeight = FontWeight;
  Margin = Margin;
  VerticalAlignment = VerticalAlignment;

  state = 'visible';

  @HostBinding('class.IsHidden') bannerHidden = false;

  @Input() color: BannerUpsellColor = BannerUpsellColor.LIGHT;
  @Input() closeButtonColor: IconColor;
  @Input() size: BannerUpsellSize = BannerUpsellSize.LARGE;
  @Input() closeable = true;
  @Output() closeEvent = new EventEmitter<void>();

  @ContentChild(BannerUpsellPictureComponent)
  bannerUpsellPicture: BannerUpsellPictureComponent;
  @ContentChild(BannerUpsellButtonComponent)
  bannerUpsellButton: BannerUpsellButtonComponent;
  @ContentChild(BannerUpsellDisclaimerComponent)
  bannerUpsellDisclaimer: BannerUpsellDisclaimerComponent;

  _closeButtonColor: IconColor;

  constructor(@Inject(UI_CONFIG) public uiConfig: UiConfig) {}

  ngOnInit() {
    if (this.closeButtonColor) {
      // If a close button color is given, overwrite the default color.
      this._closeButtonColor = this.closeButtonColor;
    } else {
      this._closeButtonColor =
        this.color === BannerUpsellColor.DARK ? IconColor.MID : IconColor.LIGHT;
    }
  }

  handleCloseEvent(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.state = 'hidden';
  }

  animationDone(event: AnimationEvent) {
    if (event.toState === 'hidden') {
      this.bannerHidden = true;
      this.closeEvent.emit();
    }
  }
}
