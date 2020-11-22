import {
  AnimationEvent,
  transition,
  trigger,
  useAnimation,
} from '@angular/animations';
import {
  ConnectedPosition,
  ConnectionPositionPair,
  FlexibleConnectedPositionStrategy,
  GlobalPositionStrategy,
  Overlay,
  OverlayConfig,
  OverlayConnectionPosition,
  OverlayRef,
  PositionStrategy,
  ScrollDispatcher,
} from '@angular/cdk/overlay';
import { CdkPortal, Portal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { slideIn, slideOut } from '@freelancer/animations';
import { TimeUtils } from '@freelancer/time-utils';
import { FreelancerBreakpointValues } from '@freelancer/ui/breakpoints';
import { assertNever, toNumber } from '@freelancer/utils';
import * as Rx from 'rxjs';
import { filter } from 'rxjs/operators';
import { CalloutColor } from './callout-color';
import { CalloutContentComponent } from './callout-content.component';
import { CalloutPlacement } from './callout-placement';
import { CalloutSize } from './callout-size';
import { CalloutTriggerComponent } from './callout-trigger.component';
import { CalloutService } from './callout.service';

/**
 * The current position of a callout.
 * Different to CalloutPlacement, which is the intended default position
 */
export type CalloutPosition = OverlayConnectionPosition & {
  anchor: 'overlayX' | 'overlayY';
};

@Component({
  selector: 'fl-callout',
  template: `
    <ng-content select="fl-callout-trigger"></ng-content>
    <ng-template cdk-portal>
      <div
        class="ContentContainer"
        @paneAnimation
        [@.disabled]="!isFullscreenMode"
        [attr.data-mobile-fullscreen]="mobileFullscreen"
        (@paneAnimation.done)="animationDone($event)"
      >
        <ng-content select="fl-callout-content"></ng-content>
      </div>
    </ng-template>
  `,
  styleUrls: ['./callout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('paneAnimation', [
      transition(':enter', [useAnimation(slideIn)]),
      transition(':leave', [useAnimation(slideOut)]),
    ]),
  ],
})
export class CalloutComponent implements OnInit, OnDestroy {
  @Input() color: CalloutColor = CalloutColor.LIGHT;
  @Input() edgeToEdge = false;
  @Input() hideArrow = false;
  @Input() hideCloseButton = false;
  @Input() hover = false;
  @Input() placement = CalloutPlacement.BOTTOM;
  @Input() size?: CalloutSize;
  @Input() mobileCloseButton = true;

  /** Use when content is scrollable for a better mobile experience. */
  @Input() mobileFullscreen = false;

  /**
   * Use when callout is hoverable and clicking on the trigger performs an action.
   * This allow mobile devices to trigger callout after pressing for 500ms.
   * It is important to note that callout will not be triggered on desktop with
   * mobile viewport as opening the dialog will break the flow of the trigger's
   * original action.
   */
  @Input() mobileLongPress = false;

  /**
   * Forces callout to open on tap/click. Useful when callout
   * trigger is a clickable element but is disabled. Use `mobileLongPress`
   * whenever possible.
   */
  @Input() mobileForceClick = false;

  /**
   * View header's title that shows up for mobileFullscreen
   */
  @Input() mobileHeaderTitle: string;

  @Output() calloutClose = new EventEmitter<void>();
  @Output() calloutOpen = new EventEmitter<void>();

  @ContentChild(CalloutTriggerComponent, { static: true })
  triggerComponent: CalloutTriggerComponent;
  @ContentChild(CalloutContentComponent, { static: true })
  contentComponent: CalloutContentComponent;
  @ViewChild(CdkPortal, { static: true }) portal: Portal<any>;

  private triggerComponentTrigger?: Rx.Subscription;
  private triggerComponentOpen?: Rx.Subscription;
  private triggerComponentClose?: Rx.Subscription;
  private contentComponentClose?: Rx.Subscription;
  private contentComponentBodyClick?: Rx.Subscription;
  private contentComponentBodyMouseenter?: Rx.Subscription;
  private contentComponentBodyMouseleave?: Rx.Subscription;
  private routeChangeSubscription?: Rx.Subscription;
  private positionChangeSubscription?: Rx.Subscription;
  private calloutIsOpen = false;
  private calloutNeedsToBeClosed = true;
  private documentClickEvent: () => void;
  private overlayRef: OverlayRef;

  private currentPlacement: CalloutPosition;
  private canRemoveOverflow = false;
  isFullscreenMode = false;

  constructor(
    private renderer: Renderer2,
    private changeDetectorRef: ChangeDetectorRef,
    private overlay: Overlay,
    private scrollDispatcher: ScrollDispatcher,
    private timeUtils: TimeUtils,
    private router: Router,
    private calloutService: CalloutService,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  // TODO: The way we handle states of when a callout needs to be
  // closed or opened during a hover transition from the trigger
  // to the callout content is pretty all over the place. When
  // somebody has time (and clarity to think) redo the logic again.
  // Ref: T37940.

  ngOnInit() {
    this.triggerComponent.setOptions({
      hover: this.hover,
      mobileForceClick: this.mobileForceClick,
      mobileLongPress: this.mobileLongPress,
    });

    this.documentClickEvent = this.renderer.listen('document', 'click', () => {
      if (this.calloutNeedsToBeClosed) {
        this.closeCallout();
      }

      this.calloutNeedsToBeClosed = true;
    });

    this.triggerComponentTrigger = this.triggerComponent.trigger.subscribe(
      () => {
        this.toggleCallout();
      },
    );

    if (this.hover) {
      this.triggerComponentOpen = this.triggerComponent.open.subscribe(() => {
        this.calloutNeedsToBeClosed = false;
        this.openCallout();
      });

      this.triggerComponentClose = this.triggerComponent.close.subscribe(() => {
        this.calloutNeedsToBeClosed = true;
        this.checkIfCalloutNeedsClosing();
      });
    }

    this.routeChangeSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe(() => {
        this.close();
      });

    // default placement is center
    this.currentPlacement =
      this.placement === 'top' || this.placement === 'bottom'
        ? {
            overlayX: 'center',
            // flip it because the `currentPlacement` is for the overlay
            // ie. if the callout is on top of the trigger,
            // the overlay connection is at the bottom of the overlay
            overlayY: this.placement === 'top' ? 'bottom' : 'top',
            anchor: 'overlayY',
          }
        : {
            overlayX: this.placement === 'start' ? 'end' : 'start',
            overlayY: 'center',
            anchor: 'overlayX',
          };
  }

  animationDone(event: AnimationEvent) {
    if (event.toState === 'void') {
      this.overlayRef.dispose();
    }
  }

  open() {
    if (!this.checkIfTriggerIsInView()) {
      this.triggerComponent.containerRef.element.nativeElement.scrollIntoView();
    }
    this.openCallout();
  }

  close() {
    this.closeCallout();
  }

  toggle() {
    this.toggleCallout();
  }

  /**
   * Use this only if you move the callout trigger around
   */
  updatePosition() {
    this.overlayRef.updatePosition();
  }

  private checkIfTriggerIsInView() {
    const triggerBoundingRect = this.triggerComponent.getElementBoundingRect();
    return (
      triggerBoundingRect.top >= 0 &&
      triggerBoundingRect.left >= 0 &&
      triggerBoundingRect.right <=
        (window.innerWidth || document.documentElement.clientWidth) &&
      triggerBoundingRect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight)
    );
  }

  private toggleCallout() {
    if (this.calloutIsOpen) {
      this.closeCallout();
    } else {
      this.openCallout();
    }
  }

  private openCallout() {
    if (this.calloutIsOpen) {
      return;
    }

    if (this.hover) {
      this.calloutService.activateHover(this);
    }

    this.isFullscreenMode = this.isMobileView() && this.mobileFullscreen;

    this.overlayRef = this.createOverlay();
    this.overlayRef.attach(this.portal);
    this.contentComponent.setOptions({
      color: this.color,
      edgeToEdge: this.edgeToEdge,
      hideArrow: this.hideArrow,
      hideCloseButton: this.hideCloseButton,
      hover: this.hover,
      mobileFullscreen: this.mobileFullscreen,
      mobileHeaderTitle: this.mobileHeaderTitle,
      size: this.size,
      mobileCloseButton: this.mobileCloseButton,
    });
    this.contentComponent.setPlacement(this.currentPlacement);

    this.setCalloutZIndex();
    this.calloutIsOpen = true;
    this.calloutNeedsToBeClosed = false;
    this.contentComponentClose = this.contentComponent.close.subscribe(() =>
      this.closeCallout(),
    );
    this.contentComponentBodyClick = this.contentComponent.bodyClick.subscribe(
      () => {
        this.calloutNeedsToBeClosed = false;
      },
    );

    if (this.hover) {
      this.contentComponentBodyMouseenter = this.contentComponent.bodyMouseenter.subscribe(
        () => {
          this.calloutNeedsToBeClosed = false;
        },
      );
      this.contentComponentBodyMouseleave = this.contentComponent.bodyMouseleave.subscribe(
        () => {
          this.calloutNeedsToBeClosed = true;
          this.checkIfCalloutNeedsClosing();
        },
      );
    }

    this.togglePageScrollState(this.calloutIsOpen);
    this.calloutOpen.emit();
  }

  private checkIfCalloutNeedsClosing() {
    this.timeUtils.setTimeout(() => {
      if (this.calloutNeedsToBeClosed) {
        this.closeCallout();
      }
    }, 100);
  }

  private closeCallout() {
    if (this.calloutIsOpen) {
      this.detachOverlay();
      if (!this.isFullscreenMode) {
        // don't dispose yet when fullscreen, to give animation time to play
        this.overlayRef.dispose();
      }

      this.calloutIsOpen = false;
      this.calloutNeedsToBeClosed = true;
      if (this.contentComponentClose) {
        this.contentComponentClose.unsubscribe();
      }
      if (this.contentComponentBodyClick) {
        this.contentComponentBodyClick.unsubscribe();
      }

      if (this.hover) {
        if (this.contentComponentBodyMouseenter) {
          this.contentComponentBodyMouseenter.unsubscribe();
        }
        if (this.contentComponentBodyMouseleave) {
          this.contentComponentBodyMouseleave.unsubscribe();
        }
      }

      this.togglePageScrollState(this.calloutIsOpen);
      this.calloutClose.emit();
    }
  }

  private detachOverlay() {
    if (!this.overlayRef.hasAttached()) {
      return;
    }

    // clean up zIndex hacking on the global callout parent
    // the `hostElement` itself is destroyed after detaching
    // so we don't need to worry about it
    if (this.overlayRef.hostElement.parentElement) {
      this.overlayRef.hostElement.parentElement.style.zIndex = '9001';
    }
    this.overlayRef.detach();

    if (this.positionChangeSubscription) {
      this.positionChangeSubscription.unsubscribe();
    }
  }

  /**
   * Calculates the effective z-index of the trigger component,
   * then sets the z-index of the content to be just above.
   */
  private setCalloutZIndex() {
    // don't do any z-index trickery in mobile view
    // as both dialogs and fullscreen callouts should always be on top
    if (this.isMobileView()) {
      return;
    }

    // loop through the parent elements until we find one with a defined z-index
    // it's a bit gross but there's no easy one-call function to get applied z-index
    let currElement: HTMLElement = this.triggerComponent.containerRef.element
      .nativeElement;
    let currZIndex: string | null = window.getComputedStyle(currElement).zIndex;
    while (
      currElement.parentElement &&
      (!currZIndex || currZIndex === 'auto')
    ) {
      currElement = currElement.parentElement;
      currZIndex = window.getComputedStyle(currElement).zIndex;
    }
    // convert to a number if we found one, default to 0 otherwise
    const effectiveZIndex = toNumber(currZIndex) || 0;
    this.contentComponent.zIndex = effectiveZIndex + 11;

    // set the parent zIndexes as well to override the Material styles
    // which by default would cause it to sit above nav/messaging/etc.
    if (this.overlayRef.hostElement.parentElement) {
      this.overlayRef.hostElement.style.zIndex = `${effectiveZIndex + 11}`;
      this.overlayRef.hostElement.parentElement.style.zIndex = `${effectiveZIndex +
        11}`;
      this.overlayRef.overlayElement.style.zIndex = `${effectiveZIndex + 11}`;
    }
  }

  /**
   * Prevents body from scrolling on mobile since
   * it becomes a dialog with overlay
   */
  togglePageScrollState(isCalloutOpen: boolean) {
    const target = this.document.body;
    const currentOverflow = target.style.overflow;

    // We only want to remove overflow when callout component is the
    // one that set it. For instance, when callout is placed within a modal
    // overflow is already set and we don't want to remove it
    // once callout is closed
    if (isCalloutOpen && !currentOverflow) {
      this.canRemoveOverflow = true;
    }

    if (isCalloutOpen && this.isMobileView()) {
      this.renderer.setStyle(target, 'overflow', 'hidden');
    } else if (!isCalloutOpen && this.canRemoveOverflow) {
      this.renderer.removeStyle(target, 'overflow');
      this.canRemoveOverflow = false;
    }
  }

  private isMobileView() {
    return window.innerWidth < parseInt(FreelancerBreakpointValues.TABLET, 10);
  }

  ngOnDestroy() {
    this.closeCallout();
    if (this.overlayRef) {
      this.detachOverlay();
      this.overlayRef.dispose();
    }

    if (this.documentClickEvent) {
      this.documentClickEvent();
    }

    if (this.triggerComponentTrigger) {
      this.triggerComponentTrigger.unsubscribe();
    }

    if (this.hover) {
      if (this.triggerComponentOpen) {
        this.triggerComponentOpen.unsubscribe();
      }
      if (this.triggerComponentClose) {
        this.triggerComponentClose.unsubscribe();
      }
    }

    if (this.routeChangeSubscription) {
      this.routeChangeSubscription.unsubscribe();
    }

    if (this.positionChangeSubscription) {
      this.positionChangeSubscription.unsubscribe();
    }
  }

  /**
   * Returns the connection offset for the callout.
   * We add a little bit of an offset to put a gap between the arrow and trigger.
   *
   * TODO: remove - I'm only adding this now to mantain legacy UI and make sure
   * that the screenshot tests pass properly.
   *
   * FIXME: not setting the offset causes the close button to be mispositioned
   * Even a `translate(0px)` somehow fixes it, but passing 0 does not set that,
   * so we have to have some offset gap.
   */
  private getOffset(): { offsetX: number; offsetY: number } {
    const anchor = this.currentPlacement[this.currentPlacement.anchor];

    return {
      offsetX: anchor === 'start' ? 4 : anchor === 'end' ? -4 : 0,
      offsetY: anchor === 'top' ? 4 : anchor === 'bottom' ? -4 : 0,
    };
  }

  private getPositions(): ConnectedPosition[] {
    const offset = this.getOffset();

    const topPositions: ConnectedPosition[] = [
      // defalt to top-center
      {
        originX: 'center',
        originY: 'top',
        overlayX: 'center',
        overlayY: 'bottom',
      },
      // fall back to start and end
      {
        originX: 'center',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'bottom',
        // tiny offset to center the arrow better
        offsetX: -8,
      },
      {
        originX: 'center',
        originY: 'top',
        overlayX: 'end',
        overlayY: 'bottom',
        offsetX: 8,
      },
    ];

    const bottomPositions: ConnectedPosition[] = [
      {
        originX: 'center',
        originY: 'bottom',
        overlayX: 'center',
        overlayY: 'top',
      },
      {
        originX: 'center',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top',
        offsetX: -8,
      },
      {
        originX: 'center',
        originY: 'bottom',
        overlayX: 'end',
        overlayY: 'top',
        offsetX: 8,
      },
    ];

    const leftPositions: ConnectedPosition[] = [
      {
        originX: 'start',
        originY: 'center',
        overlayX: 'end',
        overlayY: 'center',
      },
      {
        originX: 'start',
        originY: 'center',
        overlayX: 'end',
        overlayY: 'top',
        offsetY: -8,
      },
      {
        originX: 'start',
        originY: 'center',
        overlayX: 'end',
        overlayY: 'bottom',
        offsetY: 8,
      },
    ];

    const rightPositions: ConnectedPosition[] = [
      {
        originX: 'end',
        originY: 'center',
        overlayX: 'start',
        overlayY: 'center',
      },
      {
        originX: 'end',
        originY: 'center',
        overlayX: 'start',
        overlayY: 'top',
        offsetY: -8,
      },
      {
        originX: 'end',
        originY: 'center',
        overlayX: 'start',
        overlayY: 'bottom',
        offsetY: 8,
      },
    ];

    const bottomLeftPositions: ConnectedPosition[] = [
      {
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top',
        offsetY: 8,
      },
      {
        originX: 'start',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'bottom',
        offsetY: 8,
      },
      {
        originX: 'center',
        originY: 'bottom',
        overlayX: 'center',
        overlayY: 'top',
        offsetY: 8,
      },
    ];

    const bottomRightPositions: ConnectedPosition[] = [
      {
        originX: 'end',
        originY: 'bottom',
        overlayX: 'end',
        overlayY: 'top',
        offsetY: 8,
      },
      {
        originX: 'end',
        originY: 'top',
        overlayX: 'end',
        overlayY: 'bottom',
        offsetY: 8,
      },
    ];

    switch (this.placement) {
      case CalloutPlacement.TOP:
        return [...topPositions, ...bottomPositions].map(pos => ({
          ...pos,
          offsetY: offset.offsetY,
        }));
      case CalloutPlacement.BOTTOM:
        return [...bottomPositions, ...topPositions].map(pos => ({
          ...pos,
          offsetY: offset.offsetY,
        }));
      case CalloutPlacement.LEFT:
        return [...leftPositions, ...rightPositions].map(pos => ({
          ...pos,
          offsetX: offset.offsetX,
        }));
      case CalloutPlacement.RIGHT:
        return [...rightPositions, ...leftPositions].map(pos => ({
          ...pos,
          offsetX: offset.offsetX,
        }));
      case CalloutPlacement.BOTTOM_LEFT:
        return [...bottomLeftPositions, ...topPositions].map(pos => ({
          ...pos,
          offsetY: offset.offsetY,
        }));
      case CalloutPlacement.BOTTOM_RIGHT:
        return [...bottomRightPositions, ...topPositions].map(pos => ({
          ...pos,
          offsetY: offset.offsetY,
        }));
      default:
        assertNever(this.placement);
    }
  }

  private updateCalloutArrowPosition(connectionPair: ConnectionPositionPair) {
    const prevAnchorPosition = this.currentPlacement.anchor;
    this.currentPlacement = { ...connectionPair, anchor: prevAnchorPosition };
    this.contentComponent.setPlacement(this.currentPlacement);
    this.changeDetectorRef.detectChanges();
  }

  private createOverlay() {
    const positions = this.getPositions();
    this.currentPlacement = {
      ...positions[1],
      anchor: ['top', 'bottom', 'bottom-left', 'bottom-right'].includes(
        this.placement,
      )
        ? 'overlayY'
        : 'overlayX',
    };

    // Reposition callout when scrolled
    const scrollStrategy = this.overlay.scrollStrategies.reposition({
      scrollThrottle: 5,
    });

    let positionStrategy: PositionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.triggerComponent.containerRef.element)
      .withPositions(positions)
      // prevents callout from being pushed around when it doesn't fit on-screen
      // note: it will still take the best position from among the assigned `positions`.
      // if we let this be true, the callout can be pushed away from its trigger.
      .withPush(false)
      // prevents callout from being squished when it doesn't fit on-screen
      .withFlexibleDimensions(false)
      .withScrollableContainers(
        this.scrollDispatcher.getAncestorScrollContainers(
          this.triggerComponent.containerRef.element,
        ),
      );

    if (this.isMobileView()) {
      positionStrategy = this.overlay.position().global();
      if (this.mobileFullscreen) {
        positionStrategy = (positionStrategy as GlobalPositionStrategy)
          .left('0')
          .top('0');
      } else {
        positionStrategy = (positionStrategy as GlobalPositionStrategy)
          .centerHorizontally()
          .centerVertically();
      }
    }

    const width = this.isMobileView()
      ? this.mobileFullscreen
        ? // mobile and mobileFullscreen: fullscreen width
          '100%'
        : // mobile but not mobileFullscreen: dialog filling most of the screen
          '90%'
      : // non-mobile: set size if CalloutSize is set
      this.size === CalloutSize.LARGE
      ? 870
      : this.size === CalloutSize.MEDIUM
      ? 400
      : this.size === CalloutSize.SMALL
      ? 270
      : // default: undefined (determined by size of content)
        undefined;
    const height =
      this.isMobileView() && this.mobileFullscreen ? '100%' : undefined;

    const state = new OverlayConfig({
      hasBackdrop: this.isMobileView(),
      height,
      width,
      positionStrategy,
      scrollStrategy,
    });

    if (positionStrategy instanceof FlexibleConnectedPositionStrategy) {
      this.positionChangeSubscription = positionStrategy.positionChanges.subscribe(
        change => {
          this.updateCalloutArrowPosition(change.connectionPair);
        },
      );
    }

    return this.overlay.create(state);
  }
}
