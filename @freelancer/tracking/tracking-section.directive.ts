import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[flTrackingSection]',
})
export class TrackingSectionDirective {
  @Input() flTrackingSection: string;
}
