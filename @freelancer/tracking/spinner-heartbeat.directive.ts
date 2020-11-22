import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { HeartbeatTrackingCancellation, Tracking } from './tracking.service';

/**
 * This directive adds heartbeat tracking whenever we display an `fl-spinner` on the page.
 * Note that you do not need to do anything with this directive for it to work!
 * It will automatically track busy buttons and spinners if you provide a tracking label.
 *
 * It *is* a little hacky.
 *
 * This directive hooks into all `[busy]` inputs and `fl-spinner` elements on the page,
 * and turns on heartbeat tracking when `[busy]=true` or when the spinner is shown.
 * The tracking is stopped when `[busy]=false` again.
 *
 * The main rationale for doing it in this directive is so that we don't have to
 * couple Bits to Tracking . If we wanted to add an `fl-heartbeat-tracking`component
 * inside the `fl-spinner` component, we would need to import the `TrackingModule`,
 * which would require a bunch of setup and add a useless dependency.
 */
@Directive({
  selector: `
    fl-spinner,
    fl-button[busy]
  `,
})
export class SpinnerHeartbeatDirective
  implements AfterViewInit, OnChanges, OnDestroy {
  @Input() flTrackingLabel?: string;
  @Input() flTrackingReferenceType?: string;
  @Input() flTrackingReferenceId?: string | number;

  // hook onto a button's busy input
  @Input() busy: boolean;

  cancel?: HeartbeatTrackingCancellation;

  constructor(
    private element: ElementRef<HTMLElement>,
    private tracking: Tracking,
  ) {}

  ngAfterViewInit() {
    if (!this.flTrackingLabel) {
      return;
    }

    if (this.element.nativeElement.tagName === 'FL-SPINNER') {
      this.cancel = this.tracking.trackHeartbeat(
        `${this.flTrackingLabel}.Spinner`,
        this.flTrackingReferenceType,
        this.flTrackingReferenceId?.toString(),
      );
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.flTrackingLabel) {
      return;
    }

    // this is a button with a busy input
    if ('busy' in changes) {
      if (this.busy && !this.cancel) {
        // busy is true: start tracking if not already on
        this.cancel = this.tracking.trackHeartbeat(
          `${this.flTrackingLabel}.ButtonSpinner`,
          this.flTrackingReferenceType,
          this.flTrackingReferenceId?.toString(),
        );
      } else if (!this.busy && this.cancel) {
        // busy is false: disable tracking if started
        this.cancel();
        this.cancel = undefined;
      }
    }
  }

  ngOnDestroy() {
    if (this.cancel) {
      this.cancel();
      this.cancel = undefined;
    }
  }
}
