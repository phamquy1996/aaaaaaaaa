import {
  AfterViewInit,
  Directive,
  ElementRef,
  ErrorHandler,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Renderer2,
} from '@angular/core';
import { Location } from '@freelancer/location';
import { TrackingSectionDirective } from './tracking-section.directive';
import { Tracking } from './tracking.service';

@Directive({
  selector: `
    [flTrackingLabel]
  `,
})
export class TrackingDirective implements AfterViewInit, OnInit, OnDestroy {
  @Input() flTrackingLabel: string;
  @Input() flTrackingExtraParams: { [k: string]: string | number | string[] };
  @Input() flTrackingReferenceType: string;
  @Input() flTrackingReferenceId: string | number;
  // Name of the custom event for conversion tracking.
  @Input() flTrackingConversion: string;
  private currentUrl: string;
  private urlBeforeDestroy: string;

  constructor(
    private element: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    private t: Tracking,
    private location: Location,
    private errorHandler: ErrorHandler,
    @Optional() private trackingSection: TrackingSectionDirective,
  ) {}

  ngOnInit() {
    // when the user action triggers a navigation, this.renderer.listen doesn't
    // necessary gets called before said navigation as rendering the new page
    // matters more than sending tracking beacons.
    // for that reason we track the last location before that ngOnDestroy is
    // called (if it is), and sent it alongside the event
    this.location.valueChanges().subscribe(event => {
      this.currentUrl = event.href;
    });
  }

  ngAfterViewInit() {
    const eventsToTrack = this.tagToEvents(this.element.nativeElement.tagName);
    if (eventsToTrack.length > 0 && !this.trackingSection) {
      // display element to dev
      this.errorHandler.handleError(
        new Error(
          `Please provide an flTrackingSection for "${this.flTrackingLabel}"`,
        ),
      );
      return;
    }
    eventsToTrack.forEach(eventName => {
      this.renderer.listen(this.element.nativeElement, eventName, e => {
        this.t.track('user_action', {
          label: this.flTrackingLabel,
          section: this.trackingSection.flTrackingSection,
          action: e.type, // e.g., 'click'
          location: this.urlBeforeDestroy || this.currentUrl,
          extra_params: this.flTrackingExtraParams,
          reference: this.flTrackingReferenceType,
          reference_id: this.flTrackingReferenceId,
        });

        // Send a custom tracking event for conversion tracking.
        if (this.flTrackingConversion) {
          this.t.track('custom_event', {
            label: this.flTrackingLabel,
            name: this.flTrackingConversion,
            section: this.trackingSection.flTrackingSection,
            location: this.urlBeforeDestroy || this.currentUrl,
            extra_params: this.flTrackingExtraParams,
          });
        }
      });
    });
  }

  ngOnDestroy() {
    this.urlBeforeDestroy = this.currentUrl;
  }

  private tagToEvents(tagName: string): string[] {
    // spinner tracking is done in a separate directive
    if (tagName === 'FL-SPINNER') {
      return [];
    }

    if (tagName && ['FL-INPUT', 'FL-TEXTAREA'].includes(tagName)) {
      return ['focusin', 'focusout'];
    }
    return ['click'];
  }
}
