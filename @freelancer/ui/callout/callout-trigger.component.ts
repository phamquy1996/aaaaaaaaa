import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  OnDestroy,
  Output,
  ViewContainerRef,
} from '@angular/core';
import { Timer, TimeUtils } from '@freelancer/time-utils';
import { FreelancerBreakpointValues } from '@freelancer/ui/breakpoints';

@Component({
  selector: 'fl-callout-trigger',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./callout-trigger.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalloutTriggerComponent implements OnDestroy {
  @Output() trigger = new EventEmitter<MouseEvent>();
  @Output() open = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  hover: boolean;
  mobileLongPress: boolean;

  @HostBinding('attr.data-mobile-force-click') mobileForceClick: boolean;

  private longPressTimeout: Timer;
  readonly LONG_PRESS_DELAY = 500;

  constructor(
    public containerRef: ViewContainerRef,
    private timeUtils: TimeUtils,
  ) {}

  @HostListener('click', ['$event'])
  handleTriggerClick(event: MouseEvent) {
    // Keep hoverable callout open on click
    if (!this.isMobileViewport() && this.hover) {
      this.open.emit();

      return;
    }

    if (
      this.isMobileViewport() &&
      this.mobileLongPress &&
      !this.mobileForceClick
    ) {
      return;
    }

    this.trigger.emit(event);
  }

  @HostListener('mouseenter')
  handleTriggerMouseover() {
    if (!this.isMobileViewport()) {
      this.open.emit();
    }
  }

  @HostListener('mouseleave')
  handleTriggerMouseout() {
    if (!this.isMobileViewport()) {
      this.close.emit();
    }
  }

  @HostListener('touchstart')
  handleTouchStart() {
    if (!this.mobileLongPress) {
      return;
    }

    if (this.longPressTimeout) {
      clearTimeout(this.longPressTimeout);
    }

    this.longPressTimeout = this.timeUtils.setTimeout(() => {
      this.open.emit();
    }, this.LONG_PRESS_DELAY);
  }

  @HostListener('touchend')
  handlleTouchEnd() {
    if (this.longPressTimeout) {
      clearTimeout(this.longPressTimeout);
    }
  }

  getElementBoundingRect() {
    return (this.containerRef.element
      .nativeElement as HTMLElement).getBoundingClientRect();
  }

  setOptions(options: {
    hover: boolean;
    mobileForceClick: boolean;
    mobileLongPress: boolean;
  }) {
    this.hover = options.hover;
    this.mobileForceClick = options.mobileForceClick;
    this.mobileLongPress = options.mobileLongPress;
  }

  ngOnDestroy() {
    if (this.longPressTimeout) {
      clearTimeout(this.longPressTimeout);
    }
  }

  private isMobileViewport() {
    return window.innerWidth < parseInt(FreelancerBreakpointValues.TABLET, 10);
  }
}
