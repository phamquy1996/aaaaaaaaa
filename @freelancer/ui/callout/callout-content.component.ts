import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Output,
  ViewChild,
} from '@angular/core';
import { FreelancerBreakpointValues } from '@freelancer/ui/breakpoints';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { HeadingColor, HeadingType } from '@freelancer/ui/heading';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { LinkColor } from '@freelancer/ui/link';
import { Margin } from '@freelancer/ui/margin';
import { StickyBehaviour } from '@freelancer/ui/sticky';
import { TextSize } from '@freelancer/ui/text';
import { ViewHeaderType } from '@freelancer/ui/view-header';
import { CalloutColor } from './callout-color';
import { CalloutSize } from './callout-size';
import { CalloutPosition } from './callout.component';

// TODO: Need animations for fade-in-out.
// Ref: TODO
@Component({
  selector: 'fl-callout-content',
  template: `
    <div
      class="CalloutBody WebappCompatWrapper"
      #calloutBody
      (click)="handleCalloutBodyClick()"
      (mouseenter)="handleCalloutBodyMouseenter()"
      (mouseleave)="handleCalloutBodyMouseleave()"
      [style.zIndex]="zIndex"
      [attr.data-position]="placement"
      [attr.data-edge-to-edge]="edgeToEdge"
      [attr.data-size]="size"
      [attr.data-color]="color"
      [attr.data-hide-arrow]="!shouldShowArrow"
      [attr.data-mobile-fullscreen]="mobileFullscreen"
      [attr.data-mobile-close-button]="mobileCloseButton"
    >
      <fl-link
        class="CloseButton"
        *ngIf="shouldShowCloseButton"
        [color]="LinkColor.INHERIT"
        [flHideMobile]="true"
        (click)="handleCloseButtonClick()"
      >
        <fl-icon
          name="ui-close"
          [color]="IconColor.INHERIT"
          [size]="IconSize.SMALL"
        ></fl-icon>
      </fl-link>
      <fl-bit *ngIf="mobileFullscreen" [flShowMobile]="true">
        <fl-bit
          class="CalloutHeader"
          [flSticky]="true"
          [flStickyStatic]="true"
          [flStickyBehaviour]="StickyBehaviour.ALWAYS"
        >
          <fl-view-header
            [type]="ViewHeaderType.CLOSE"
            (close)="handleCloseButtonClick()"
          >
            <fl-heading
              [color]="HeadingColor.INHERIT"
              [headingType]="HeadingType.H1"
              [size]="TextSize.MID"
              [truncate]="true"
            >
              {{ mobileHeaderTitle }}
            </fl-heading>
          </fl-view-header>
          <fl-container>
            <fl-toast-alert-container></fl-toast-alert-container>
          </fl-container>
        </fl-bit>
      </fl-bit>
      <div class="CalloutContent">
        <ng-content></ng-content>
      </div>
      <fl-bit
        *ngIf="!mobileFullscreen && mobileCloseButton"
        class="WrapperCloseButtonMobile"
        [flShowMobile]="true"
      >
        <fl-button
          i18n="Close callout button"
          [color]="ButtonColor.DEFAULT"
          [size]="ButtonSize.SMALL"
          (click)="handleCloseButtonClick()"
        >
          Close
        </fl-button>
      </fl-bit>
    </div>
  `,
  styleUrls: ['./callout-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalloutContentComponent {
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  HeadingColor = HeadingColor;
  HeadingType = HeadingType;
  IconColor = IconColor;
  IconSize = IconSize;
  LinkColor = LinkColor;
  Margin = Margin;
  StickyBehaviour = StickyBehaviour;
  TextSize = TextSize;
  ViewHeaderType = ViewHeaderType;

  zIndex?: number;

  edgeToEdge: boolean;
  hideArrow: boolean;
  hideCloseButton: boolean;
  hover: boolean;
  mobileCloseButton: boolean;
  mobileHeaderTitle: string;
  placement: string;
  size?: CalloutSize;

  isMobile: boolean;
  shouldShowArrow: boolean;
  shouldShowCloseButton: boolean;

  @HostBinding('attr.data-color') color: CalloutColor;
  @HostBinding('attr.data-mobile-fullscreen') mobileFullscreen: boolean;

  @Output() bodyClick = new EventEmitter<void>();
  @Output() bodyMouseenter = new EventEmitter<void>();
  @Output() bodyMouseleave = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  @ViewChild('calloutBody') calloutBody: ElementRef<HTMLDivElement>;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  getElementBoundingRect() {
    return this.calloutBody.nativeElement.getBoundingClientRect();
  }

  handleCalloutBodyClick() {
    this.bodyClick.emit();
  }

  handleCalloutBodyMouseenter() {
    if (!this.isMobile) {
      this.bodyMouseenter.emit();
    }
  }

  handleCalloutBodyMouseleave() {
    if (!this.isMobile) {
      this.bodyMouseleave.emit();
    }
  }

  handleCloseButtonClick() {
    this.close.emit();
  }

  setOptions(options: {
    color: CalloutColor;
    edgeToEdge: boolean;
    mobileCloseButton: boolean;
    mobileFullscreen: boolean;
    mobileHeaderTitle: string;
    hideArrow: boolean;
    hideCloseButton: boolean;
    hover: boolean;
    size?: CalloutSize;
  }) {
    this.color = options.color;
    this.edgeToEdge = options.edgeToEdge;
    this.hideArrow = options.hideArrow;
    this.hideCloseButton = options.hideCloseButton;
    this.hover = options.hover;
    this.mobileCloseButton = options.mobileCloseButton;
    this.mobileFullscreen = options.mobileFullscreen;
    this.mobileHeaderTitle = options.mobileHeaderTitle;
    this.size = options.size;

    this.setMobileOptions();
  }

  setPlacement(placement: CalloutPosition) {
    const { anchor } = placement;
    const position = anchor === 'overlayX' ? 'overlayY' : 'overlayX';
    // convert into an `anchor-relative` string for css parsing
    this.placement = `${placement[anchor]}-${placement[position]}`;
    this.changeDetectorRef.detectChanges();
  }

  private setMobileOptions() {
    this.isMobile =
      window.innerWidth < parseInt(FreelancerBreakpointValues.TABLET, 10);

    this.shouldShowArrow = !this.hideArrow;
    this.shouldShowCloseButton = !this.hideCloseButton && !this.hover;

    // Mobile overrides to standardize dialog UIs
    if (this.isMobile) {
      this.shouldShowArrow = false;
      this.shouldShowCloseButton =
        this.mobileFullscreen || this.shouldShowCloseButton;
    }
  }
}
