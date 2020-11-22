import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { LocationInputComponent } from '@freelancer/ui/location-input';
import { Margin } from '@freelancer/ui/margin';
import { Focus } from '../focus';
import { InputSize } from '../input';
import { FontColor, FontType } from '../text';

export type MultipleLocationInputSize = InputSize.MID | InputSize.LARGE;

@Component({
  selector: 'fl-multiple-location-input',
  template: `
    <fl-bit class="Location">
      <fl-bit class="Location-item" [attr.data-input-size]="inputSize">
        <fl-icon
          class="Location-icon"
          [attr.data-input-size]="inputSize"
          [color]="IconColor.PRIMARY"
          [name]="'ui-pin-location'"
          [flMarginRight]="Margin.XXSMALL"
          [size]="IconSize.SMALL"
        ></fl-icon>
        <fl-bit class="Location-address">
          <fl-location-input
            #firstLocation
            class="Location-input"
            flTrackingLabel="FirstLocation"
            [control]="firstLocationControl"
            [detectLocation]="true"
            [flMarginRight]="Margin.LARGE"
            [inputSize]="inputSize"
            [displayPostalCode]="true"
          ></fl-location-input>
        </fl-bit>
      </fl-bit>
      <fl-bit class="Location-item" [attr.data-input-size]="inputSize">
        <fl-icon
          *ngIf="!hasNewLocation"
          class="Location-icon LocationAddIcon"
          flTrackingLabel="SecondLocationIcon"
          label="Add second location"
          i18n-label="Add second location clickable icon"
          [attr.data-input-size]="inputSize"
          [clickable]="true"
          [flMarginRight]="Margin.XXSMALL"
          [name]="'ui-add-circle'"
          [size]="IconSize.SMALL"
          (click)="handleNewLocation()"
        ></fl-icon>
        <fl-icon
          *ngIf="hasNewLocation"
          class="Location-icon"
          [attr.data-input-size]="inputSize"
          [color]="IconColor.ERROR"
          [name]="'ui-pin-location'"
          [flMarginRight]="Margin.XXSMALL"
          [size]="IconSize.SMALL"
        ></fl-icon>
        <fl-bit class="Location-address">
          <fl-button
            *ngIf="!hasNewLocation"
            class="Location-fakeInput"
            flTrackingLabel="FakeLocationInput"
            i18n="Enter second location placeholder"
            label="Add second location"
            i18n-label="Add second location button"
            [attr.data-input-size]="inputSize"
            [flMarginRight]="Margin.LARGE"
            (click)="handleNewLocation()"
          >
            <fl-text
              [fontType]="FontType.CONTAINER"
              [color]="FontColor.INHERIT"
            >
              Enter a second location
            </fl-text>
          </fl-button>
          <fl-location-input
            #secondLocation
            *ngIf="hasNewLocation"
            class="Location-input"
            flTrackingLabel="SecondLocation"
            [control]="secondLocationControl"
            [detectLocation]="true"
            [inputSize]="inputSize"
            (clearLocation)="handleSecondClearLocation()"
          ></fl-location-input>
          <fl-icon
            *ngIf="hasNewLocation"
            class="Location-swapIcon"
            flTrackingLabel="SwapLocations"
            i18n-label="Clickable icon to swap the two locations"
            label="Swap the two locations"
            [attr.data-input-size]="inputSize"
            [clickable]="true"
            [name]="'ui-switch'"
            [ngStyle]="{ visibility: hasNewLocation ? 'visible' : 'hidden' }"
            [size]="IconSize.MID"
            (click)="handleSwapLocation()"
          ></fl-icon>
        </fl-bit>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./multiple-location-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultipleLocationInputComponent implements OnInit {
  FontColor = FontColor;
  FontType = FontType;
  IconColor = IconColor;
  IconSize = IconSize;
  InputSize = InputSize;
  Margin = Margin;

  @Input() firstLocationControl: FormControl;
  @Input() secondLocationControl: FormControl;
  /**
   * Currently only supports LARGE and MID values.
   * Additional sizes require scss modifications
   */
  @Input() inputSize: MultipleLocationInputSize = InputSize.MID;

  @ViewChild('firstLocation') firstLocation: LocationInputComponent;
  @ViewChild('secondLocation') secondLocation: LocationInputComponent;

  hasNewLocation = false;

  constructor(private cd: ChangeDetectorRef, private focus: Focus) {}

  ngOnInit() {
    this.hasNewLocation = !!this.secondLocationControl.value;
  }

  handleNewLocation() {
    this.hasNewLocation = true;
    // To re-render and display `secondLocation` once `hasNewLocation` === true
    this.cd.detectChanges();
    this.focus.focusElement(this.secondLocation.input.nativeElement);
  }

  handleSwapLocation() {
    const firstLocationValue = this.firstLocationControl.value;
    const secondLocationValue = this.secondLocationControl.value;
    if (
      secondLocationValue &&
      secondLocationValue.latitude &&
      secondLocationValue.longitude
    ) {
      this.firstLocation.nativeControl.setValue(
        secondLocationValue.location.fullAddress,
      );
      this.firstLocation.setLocationControl(secondLocationValue);
      this.firstLocation.nativeControl.setErrors(null);
      this.firstLocation.error = undefined;
    } else {
      this.firstLocation.nativeControl.reset();
    }

    if (
      firstLocationValue &&
      firstLocationValue.latitude &&
      firstLocationValue.longitude
    ) {
      this.secondLocation.nativeControl.setValue(
        firstLocationValue.location.fullAddress,
      );
      this.secondLocation.setLocationControl(firstLocationValue);
      this.secondLocation.nativeControl.setErrors(null);
      this.secondLocation.error = undefined;
    } else {
      this.secondLocation.nativeControl.reset();
    }
  }

  handleSecondClearLocation() {
    this.hasNewLocation = false;
  }
}
