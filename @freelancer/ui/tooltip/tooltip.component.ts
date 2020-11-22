import {
  ConnectedPosition,
  ConnectionPositionPair,
  OriginConnectionPosition,
  Overlay,
  OverlayConfig,
  OverlayConnectionPosition,
  OverlayRef,
  ScrollDispatcher,
} from '@angular/cdk/overlay';
import { CdkPortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Timer, TimeUtils } from '@freelancer/time-utils';
import { Margin } from '@freelancer/ui/margin';
import * as Rx from 'rxjs';
import { IconSize } from '../icon/icon.component';

export enum TooltipPosition {
  TOP_START = 'top-start',
  TOP_CENTER = 'top-center',
  TOP_END = 'top-end',
  BOTTOM_START = 'bottom-start',
  BOTTOM_CENTER = 'bottom-center',
  BOTTOM_END = 'bottom-end',
  START_TOP = 'start-top',
  START_CENTER = 'start-center',
  START_BOTTOM = 'start-bottom',
  END_TOP = 'end-top',
  END_CENTER = 'end-center',
  END_BOTTOM = 'end-bottom',
}

export enum TooltipSize {
  MID = 'mid',
}

// TODO: More features.
// - Animations (T38383)
// - Hide delay (T38384)
// - light color
@Component({
  selector: 'fl-tooltip',
  template: `
    <fl-bit
      class="TooltipContainer"
      (touchstart)="onTouchStart()"
      (touchend)="onTouchEnd()"
    >
      <span class="IconWrapper">
        <fl-bit class="IconContainer IconContent" *ngIf="defaultIcon">
          <fl-icon [name]="'ui-help'" [size]="IconSize.SMALL"></fl-icon>
        </fl-bit>
        <span class="IconContent">
          <ng-content></ng-content>
        </span>
      </span>

      <ng-template cdk-portal>
        <fl-tooltip-content [position]="currentPosition" [size]="size">
          {{ message }}
        </fl-tooltip-content>
      </ng-template>
    </fl-bit>
  `,
  styleUrls: ['./tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipComponent implements OnDestroy {
  IconSize = IconSize;
  Margin = Margin;
  longPress: Timer;

  @Input() message: string;
  @Input() position: TooltipPosition;
  @Input() size = TooltipSize.MID;
  /** Use the default icon provided by this component */
  @Input() defaultIcon = false;

  currentPosition: TooltipPosition = TooltipPosition.BOTTOM_CENTER;
  private overlayRef?: OverlayRef;
  private positionChange$?: Rx.Subscription;

  @ViewChild(CdkPortal)
  portal: CdkPortal;

  constructor(
    private overlay: Overlay,
    private elementRef: ElementRef<HTMLElement>,
    private scrollDispatcher: ScrollDispatcher,
    private changeDetector: ChangeDetectorRef,
    private timeUtils: TimeUtils,
  ) {}

  @HostListener('mouseenter')
  onMouseenter() {
    this.show();
  }

  @HostListener('mouseleave')
  onMouseleave() {
    this.hide();
  }

  onTouchStart() {
    this.longPress = this.timeUtils.setTimeout(() => {
      this.show();
    }, 500);
  }

  onTouchEnd() {
    clearTimeout(this.longPress);
    this.timeUtils.setTimeout(() => {
      this.hide();
    }, 1500);
  }

  ngOnDestroy() {
    this.dispose();
  }

  show() {
    if (
      !this.message ||
      !this.message.trim() ||
      this.overlayRef !== undefined
    ) {
      return;
    }

    this.overlayRef = this.createOverlay();
    this.overlayRef.attach(this.portal);
  }

  hide() {
    this.dispose();
  }

  private dispose() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = undefined;
    }

    if (this.positionChange$) {
      this.positionChange$.unsubscribe();
    }
  }

  private getOverlayPosition(): OverlayConnectionPosition {
    const position = this.currentPosition.split('-');

    const anchor = position[0];
    const relativePosition = position[1];

    if (
      (anchor === 'top' || anchor === 'bottom') &&
      (relativePosition === 'start' ||
        relativePosition === 'center' ||
        relativePosition === 'end')
    ) {
      return {
        overlayX: relativePosition,
        overlayY: anchor === 'top' ? 'bottom' : 'top',
      };
    }

    if (
      (anchor === 'start' || anchor === 'end') &&
      (relativePosition === 'top' ||
        relativePosition === 'center' ||
        relativePosition === 'bottom')
    ) {
      return {
        overlayX: anchor === 'start' ? 'end' : 'start',
        overlayY: relativePosition,
      };
    }

    throw Error('No position for tooltip specified!');
  }

  private getOrigin(): OriginConnectionPosition {
    const position = this.currentPosition.split('-');

    const anchor = position[0];
    const relativePosition = position[1];

    if (
      (anchor === 'top' || anchor === 'bottom') &&
      (relativePosition === 'start' ||
        relativePosition === 'center' ||
        relativePosition === 'end')
    ) {
      return { originX: relativePosition, originY: anchor };
    }

    if (
      (anchor === 'start' || anchor === 'end') &&
      (relativePosition === 'top' ||
        relativePosition === 'center' ||
        relativePosition === 'bottom')
    ) {
      return {
        originX: anchor,
        originY: relativePosition,
      };
    }

    throw Error('No position for tooltip specified!');
  }

  private getPositions(position: ConnectedPosition): ConnectedPosition[] {
    return [
      position,
      {
        // Fallback position is the inverse of the original
        originX: position.overlayX,
        originY: position.overlayY,
        overlayX: position.originX,
        overlayY: position.originY,
      },
    ];
  }

  // Returns typed position
  private getTooltipPosition(anchor: string, relativePosition: string) {
    const position = `${anchor}-${relativePosition}`;

    return Object.values(TooltipPosition).filter(
      value => position === value,
    )[0];
  }

  private updateTooltipArrowPosition(connectionPair: ConnectionPositionPair) {
    const prevPosition = this.currentPosition;
    const prevAnchorPosition = prevPosition.split('-')[0];

    if (prevAnchorPosition === 'top' || prevAnchorPosition === 'bottom') {
      this.currentPosition = this.getTooltipPosition(
        connectionPair.originY,
        connectionPair.originX,
      );
    } else {
      this.currentPosition = this.getTooltipPosition(
        connectionPair.originX,
        connectionPair.originY,
      );
    }

    this.changeDetector.detectChanges();
  }

  private createOverlay() {
    if (this.position) {
      this.currentPosition = this.position;
    }

    const { originX, originY } = this.getOrigin();
    const { overlayX, overlayY } = this.getOverlayPosition();
    const positions = this.getPositions({
      originX,
      originY,
      overlayX,
      overlayY,
    });

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef)
      .withPositions(positions)
      .withScrollableContainers(
        this.scrollDispatcher.getAncestorScrollContainers(this.elementRef),
      );

    // Closes tooltip when scrolled
    const scrollStrategy = this.overlay.scrollStrategies.close();

    const state = new OverlayConfig({
      positionStrategy,
      scrollStrategy,
    });

    this.positionChange$ = positionStrategy.positionChanges.subscribe(
      change => {
        this.updateTooltipArrowPosition(change.connectionPair);
      },
    );

    return this.overlay.create(state);
  }
}
