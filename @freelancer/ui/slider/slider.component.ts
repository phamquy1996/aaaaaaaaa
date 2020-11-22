import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Margin } from '@freelancer/ui/margin';
import { toNumber } from '@freelancer/utils';
import * as Rx from 'rxjs';

export enum SliderLabelPosition {
  CENTER = 'center',
  SPACE_BETWEEN = 'space-between',
  NONE = 'none',
}

@Component({
  selector: 'fl-slider',
  template: `
    <fl-bit class="SliderContainer">
      <fl-bit
        class="SliderRailBackground"
        #railBackground
        (click)="railClicked($event)"
        (touchend)="railClicked($event)"
      ></fl-bit>
      <fl-bit
        class="SliderRailHighlight"
        #railHighlight
        (click)="railClicked($event)"
        (touchend)="railClicked($event)"
      ></fl-bit>

      <fl-bit
        class="SliderHandle"
        *ngIf="showMinHandle"
        #minHandle
        role="slider"
        tabindex="0"
        [attr.title]="minAriaLabel"
        [attr.aria-label]="minAriaLabel"
        [attr.aria-valuemin]="minValue"
        [attr.aria-valuemax]="maxValue"
        [attr.aria-valuenow]="minControl.value"
        (keydown)="minHandleKey($event)"
        (mousedown)="minHandleClicked($event)"
        (touchstart)="minHandleTouched($event)"
      >
      </fl-bit>
      <fl-bit
        class="SliderHandle"
        *ngIf="showMaxHandle"
        #maxHandle
        role="slider"
        tabindex="0"
        [attr.title]="maxAriaLabel"
        [attr.aria-label]="maxAriaLabel"
        [attr.aria-valuemin]="minValue"
        [attr.aria-valuemax]="maxValue"
        [attr.aria-valuenow]="maxControl.value"
        (keydown)="maxHandleKey($event)"
        (mousedown)="maxHandleClicked($event)"
        (touchstart)="maxHandleTouched($event)"
      >
      </fl-bit>
    </fl-bit>
    <fl-bit
      class="SliderLabel"
      *ngIf="labelPosition !== SliderLabelPosition.NONE"
      [attr.data-label-position]="labelPosition"
    >
      <ng-container *ngIf="currencyCode; else noCurrency">
        <fl-text *ngIf="labelPosition === SliderLabelPosition.CENTER">
          {{
            {
              minimum: minControl.value,
              maximum: maxControl.value
            } | flCurrency: currencyCode
          }}
        </fl-text>

        <ng-container
          *ngIf="labelPosition === SliderLabelPosition.SPACE_BETWEEN"
        >
          <fl-text>
            {{ minControl.value | flCurrency: currencyCode }}
          </fl-text>
          <fl-text>
            {{ maxControl.value | flCurrency: currencyCode }}
          </fl-text>
        </ng-container>
      </ng-container>

      <ng-template #noCurrency>
        <fl-text *ngIf="showMinHandle">
          {{ minControl.value }}
        </fl-text>
        <fl-text
          class="SliderLabel-divider"
          *ngIf="
            showMinHandle &&
            showMaxHandle &&
            labelPosition === SliderLabelPosition.CENTER
          "
        >
          -
        </fl-text>
        <fl-text *ngIf="showMaxHandle">
          {{ maxControl.value }}
        </fl-text>
      </ng-template>
    </fl-bit>
  `,
  styleUrls: ['./slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderComponent implements OnInit, OnDestroy, OnChanges {
  Margin = Margin;
  SliderLabelPosition = SliderLabelPosition;

  showMinHandle = true;
  showMaxHandle = true;
  minHandleActive = false;
  maxHandleActive = false;
  barLeft = 0;
  barRight = 0;
  activeListener: any;

  @Input() minValue: number;
  @Input() maxValue: number;
  @Input() minControl: FormControl;
  @Input() maxControl: FormControl;
  @Input() currencyCode: string;
  @Input() units = '';
  @Input() labelPosition = SliderLabelPosition.CENTER;

  @Input() minAriaLabel = 'Minimum value';
  @Input() maxAriaLabel = 'Maximum value';

  @ViewChild('railHighlight', { read: ElementRef, static: true })
  railHighlight: ElementRef<HTMLDivElement>;
  @ViewChild('railBackground', { read: ElementRef, static: true })
  railBackground: ElementRef<HTMLDivElement>;

  @ViewChild('minHandle', { read: ElementRef })
  minHandleEl?: ElementRef<HTMLDivElement>;
  @ViewChild('maxHandle', { read: ElementRef })
  maxHandleEl?: ElementRef<HTMLDivElement>;

  minControlSubscription?: Rx.Subscription;
  maxControlSubscription?: Rx.Subscription;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    if (!this.minControl) {
      this.minControl = new FormControl(this.minValue);
      this.showMinHandle = false;
    }
    if (!this.maxControl) {
      this.maxControl = new FormControl(this.maxValue);
      this.showMaxHandle = false;
    }

    if (this.minControl && this.minControl.value === null) {
      this.minControl.setValue(this.minValue);
    }
    if (this.maxControl && this.maxControl.value === null) {
      this.maxControl.setValue(this.maxValue);
    }
    setTimeout(() => this.updateView(), 0);

    this.minControlSubscription = this.minControl.valueChanges.subscribe(() =>
      this.updateView(),
    );
    this.maxControlSubscription = this.maxControl.valueChanges.subscribe(() =>
      this.updateView(),
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    // Manually set the value of `minControl` if it is not bound to an input
    if (!this.showMinHandle && changes.minValue && this.minControl) {
      this.minControl.setValue(changes.minValue.currentValue);
    }

    // Manually set the value of `maxControl` if it is not bound to an input
    if (!this.showMaxHandle && changes.maxValue && this.maxControl) {
      this.maxControl.setValue(changes.maxValue.currentValue);
    }
  }

  ngOnDestroy() {
    if (this.minControlSubscription) {
      this.minControlSubscription.unsubscribe();
    }
    if (this.maxControlSubscription) {
      this.maxControlSubscription.unsubscribe();
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseLeave(event: MouseEvent) {
    this.minHandleActive = false;
    this.maxHandleActive = false;
    document.removeEventListener('mousemove', this.activeListener);
    document.removeEventListener('selectstart', disableSelect);
  }

  /*
   * `any` is needed to prevent `ReferenceError: TouchEvent is not defined.`
   *  in desktop Firefox
   */
  @HostListener('touchend', ['$event'])
  ontouchend(event: TouchEvent | any) {
    if (event instanceof TouchEvent) {
      this.minHandleActive = false;
      this.maxHandleActive = false;
      document.removeEventListener('touchmove', this.activeListener);

      // Prevents mouse events from being dispatched
      if (event.cancelable) {
        event.preventDefault();
      }
    }
  }

  minHandleClicked(e: MouseEvent) {
    if (this.minControl) {
      this.handleClicked(e, this.minControl);
    }
  }

  maxHandleClicked(e: MouseEvent) {
    if (this.maxControl) {
      this.handleClicked(e, this.maxControl);
    }
  }

  minHandleTouched(event: TouchEvent) {
    if (this.minControl) {
      this.handleTouched(event, this.minControl);
    }
  }

  maxHandleTouched(event: TouchEvent) {
    if (this.maxControl) {
      this.handleTouched(event, this.maxControl);
    }
  }

  minHandleKey(event: KeyboardEvent) {
    if (this.minControl) {
      this.handleKeyEvent(event, this.minControl);
    }
  }

  maxHandleKey(event: KeyboardEvent) {
    if (this.maxControl) {
      this.handleKeyEvent(event, this.maxControl);
    }
  }

  railClicked(e: MouseEvent | TouchEvent) {
    this.setUpBarLimits();
    let control: FormControl | undefined;
    if (this.showMinHandle && !this.showMaxHandle) {
      control = this.minControl;
    } else if (!this.showMinHandle && this.showMaxHandle) {
      control = this.maxControl;
    }
    if (control) {
      control.setValue(this.getValue(e, control));
    }
  }

  setUpBarLimits() {
    const rect = this.railBackground.nativeElement.getBoundingClientRect();
    this.barLeft = rect.left;
    this.barRight = rect.right;
  }

  handleClicked(e: MouseEvent, control: FormControl) {
    this.setUpBarLimits();
    this.minHandleActive = true;
    document.addEventListener('selectstart', disableSelect);
    this.activeListener = this.onMouseMove(control);
    document.addEventListener('mousemove', this.activeListener);
  }

  handleTouched(e: TouchEvent, control: FormControl) {
    this.setUpBarLimits();
    this.minHandleActive = true;

    this.activeListener = this.onTouchMove(control);
    document.addEventListener('touchmove', this.activeListener);

    // Prevents window from scrolling
    e.preventDefault();
  }

  handleKeyEvent(e: KeyboardEvent, control: FormControl) {
    this.setUpBarLimits();
    const minBound = this.getMinBound(control);
    const maxBound = this.getMaxBound(control);

    const k = e.key?.toLowerCase();
    // needs casting because inferred type is just string
    switch (k) {
      case 'arrowdown':
      case 'arrowleft':
      case 'down': // IE name
      case 'left':
        control.setValue(Math.max(toNumber(control.value) - 1, minBound));
        // prevent defaults like scrolling on up/down
        e.preventDefault();
        break;
      case 'arrowup':
      case 'arrowright':
      case 'up':
      case 'right':
        control.setValue(Math.min(toNumber(control.value) + 1, maxBound));
        e.preventDefault();
        break;
      case 'pagedown':
        control.setValue(Math.max(toNumber(control.value) - 10, minBound));
        e.preventDefault();
        break;
      case 'pageup':
        control.setValue(Math.max(toNumber(control.value) + 10, minBound));
        e.preventDefault();
        break;
      default:
    }
  }

  getValue(event: MouseEvent | TouchEvent, control: FormControl) {
    let xCoord;

    if (event instanceof MouseEvent) {
      xCoord = event.x;
    } else if (event instanceof TouchEvent) {
      const touchPoint = event.changedTouches.item(0);

      if (touchPoint) {
        xCoord = touchPoint.clientX;
      }
    }

    if (!xCoord) {
      return;
    }

    let progress = (xCoord - this.barLeft) / (this.barRight - this.barLeft);
    progress = Math.min(Math.max(progress, 0), 1);
    const value = this.minValue + (this.maxValue - this.minValue) * progress;
    const minBound = this.getMinBound(control);
    const maxBound = this.getMaxBound(control);

    return Math.min(Math.max(Math.round(value), minBound), maxBound);
  }

  /** Returns the maximum value for a control */
  getMaxBound(control: FormControl) {
    return this.maxControl && this.maxControl !== control
      ? // dual slider and this is the min control: value is the max control value
        this.maxControl.value
      : // otherwise, value is the global max
        this.maxValue;
  }

  /** Returns the minimum value for a control */
  getMinBound(control: FormControl) {
    return this.minControl && this.minControl !== control
      ? // dual slider and this is the max control: value is the min control value
        this.minControl.value
      : // otherwise, value is the global min
        this.minValue;
  }

  onMouseMove(control: FormControl) {
    return (e: MouseEvent) => {
      control.setValue(this.getValue(e, control));
      control.markAsDirty();
    };
  }

  onTouchMove(control: FormControl) {
    return (event: TouchEvent) => {
      control.setValue(this.getValue(event, control));
      control.markAsDirty();
    };
  }

  updateView() {
    let leftPos = 0;
    let rightPos = 100;
    const range = this.maxValue - this.minValue;
    if (this.minControl && this.minHandleEl) {
      // always leave at full width if values are the same.
      if (range !== 0) {
        leftPos = (100 * (this.minControl.value - this.minValue)) / range;
      }
      // shift handle so it covers bar
      this.minHandleEl.nativeElement.style.left =
        this.minValue <= this.minControl.value
          ? `calc(${leftPos}% - 18px)`
          : '-6px';
    }
    if (this.maxControl && this.maxHandleEl) {
      // always leave at full width if values are the same.
      if (range !== 0) {
        rightPos = (100 * (this.maxControl.value - this.minValue)) / range;
      }
      // different offset to left so close values don't collide
      this.maxHandleEl.nativeElement.style.left =
        this.maxValue >= this.maxControl.value
          ? `calc(${rightPos}% - 6px)`
          : 'calc(100% - 6px)';
    }
    this.railHighlight.nativeElement.style.right =
      this.maxValue >= this.maxControl.value ? `${100 - rightPos}%` : '0%';
    this.railHighlight.nativeElement.style.left =
      this.minValue <= this.minControl.value ? `${leftPos}%` : '0%';

    this.changeDetectorRef.markForCheck();
  }
}

function disableSelect(e: Event) {
  e.preventDefault();
}
