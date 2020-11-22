import {
  AnimationEvent,
  transition,
  trigger,
  useAnimation,
} from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  HostBinding,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  TemplateRef,
} from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { fadeOut, slideIn, slideOut } from '@freelancer/animations';
import { Location } from '@freelancer/location';
import { HeadingColor, HeadingType } from '@freelancer/ui/heading';
import { IconSize } from '@freelancer/ui/icon';
import { StickyBehaviour } from '@freelancer/ui/sticky';
import { TextSize } from '@freelancer/ui/text';
import { ViewHeaderType } from '@freelancer/ui/view-header';
import * as Rx from 'rxjs';
import { filter } from 'rxjs/operators';

export enum DrawerPosition {
  LEFT = 'left',
  RIGHT = 'right',
}

@Component({
  selector: 'fl-drawer',
  template: `
    <div
      class="DrawerContainer"
      cdkScrollable
      [attr.data-position]="drawerPosition"
    >
      <div
        class="DrawerDialog"
        [attr.data-full-width]="fullWidth"
        [@paneAnimation]="{
          value: state,
          params: { distance: hideStatePosition }
        }"
        (@paneAnimation.done)="animationDone($event)"
      >
        <div
          class="DrawerContent"
          [attr.data-edge-to-edge]="edgeToEdge"
          [attr.data-full-width]="fullWidth"
        >
          <fl-icon
            class="DrawerCloseButton"
            *ngIf="!hideCloseButton"
            [flHideMobile]="fullWidth"
            [name]="'ui-close'"
            [size]="IconSize.SMALL"
            (click)="handleEscape()"
          ></fl-icon>
          <fl-bit *ngIf="fullWidth" [flShowMobile]="true">
            <fl-view-header
              class="DrawerHeader"
              [flSticky]="true"
              [flStickyStatic]="true"
              [flStickyBehaviour]="StickyBehaviour.ALWAYS"
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
          </fl-bit>
          <fl-bit
            *ngIf="isOpen"
            class="DrawerContent-inner"
            [attr.data-edge-to-edge]="edgeToEdge"
          >
            <ng-template [ngTemplateOutlet]="drawerTemplate"></ng-template>
          </fl-bit>
        </div>
      </div>

      <div
        class="DrawerBackdrop"
        [attr.data-backdrop]="isOpen"
        [attr.data-full-width]="fullWidth"
        [@backdropAnimation]="state"
        (click)="handleBackdropClick()"
      ></div>
    </div>
  `,
  styleUrls: ['./drawer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('paneAnimation', [
      transition('* => visible', [
        useAnimation(slideIn, {
          params: { time: '200ms', translateX: '{{ distance }}' },
        }),
      ]),
      transition('* => hidden', [
        useAnimation(slideOut, {
          params: { time: '200ms', translateX: '{{ distance }}' },
        }),
      ]),
    ]),
    trigger('backdropAnimation', [
      transition('visible => hidden', [useAnimation(fadeOut)]),
    ]),
  ],
})
export class DrawerComponent implements OnDestroy, OnInit {
  HeadingColor = HeadingColor;
  HeadingType = HeadingType;
  IconSize = IconSize;
  StickyBehaviour = StickyBehaviour;
  TextSize = TextSize;
  ViewHeaderType = ViewHeaderType;

  state = 'hidden';
  hideStatePosition = 'translateX(10%)';
  drawerPosition = DrawerPosition.RIGHT;

  @Input() closeOnBackdropClick = true;
  @Input() edgeToEdge = false;
  @Input() hideCloseButton = false;
  @Input() mobileHeaderTitle: string;
  @Input() set position(value: DrawerPosition) {
    this.drawerPosition = value;
    this.setHidePosition();
  }

  // Shows backdrop regardless of viewport width when set to false
  @Input() fullWidth = true;

  @Output() closeDrawer = new EventEmitter<void>();
  @Output() openDrawer = new EventEmitter<void>();

  @ContentChild('drawerTemplate')
  drawerTemplate: TemplateRef<any>;

  @HostBinding('class.IsActive') isOpen = false;

  private routeChangeSubscription?: Rx.Subscription;
  private drawerPopCloseSubscription?: Rx.SubscriptionLike;

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private location: Location,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  @HostListener('document:keydown.escape')
  handleEscape() {
    this.close();
  }

  ngOnInit() {
    this.routeChangeSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe(() => {
        this._close({ fromRouteChange: true });
      });
  }

  close() {
    this._close();
  }

  private _close({
    fromRouteChange = false,
  }: { fromRouteChange?: boolean } = {}) {
    if (this.isOpen) {
      this.state = 'hidden';
      this.setHidePosition();
      this.changeDetectorRef.markForCheck();
      if (this.drawerPopCloseSubscription) {
        this.drawerPopCloseSubscription.unsubscribe();
      }
      if (!fromRouteChange) {
        this.location.back();
      }
    }
  }

  setHidePosition() {
    this.hideStatePosition =
      this.drawerPosition === DrawerPosition.RIGHT
        ? 'translateX(10%)'
        : 'translateX(-10%)';
  }

  handleBackdropClick() {
    if (this.closeOnBackdropClick) {
      this.close();
    }
  }

  open() {
    if (!this.isOpen) {
      this.isOpen = true;
      this.state = 'visible';
      this.openDrawer.emit();
      this.togglePageScrollState();
      this.drawerPopCloseSubscription = this.location._createBackButtonState({
        onPop: () => this._close({ fromRouteChange: true }),
      });
      this.changeDetectorRef.detectChanges();
    }
  }

  togglePageScrollState() {
    if (this.isOpen) {
      this.disableBodyScroll();
    } else {
      this.enableBodyScroll();
    }
  }

  disableBodyScroll() {
    this.renderer.setStyle(this.document.body, 'overflow', 'hidden');
  }

  enableBodyScroll() {
    this.renderer.removeStyle(this.document.body, 'overflow');
  }

  animationDone(event: AnimationEvent) {
    if (event.toState === 'hidden') {
      this.isOpen = false;
      this.closeDrawer.emit();
      this.togglePageScrollState();
    }
  }

  ngOnDestroy() {
    this.enableBodyScroll();

    if (this.routeChangeSubscription) {
      this.routeChangeSubscription.unsubscribe();
    }
  }
}
