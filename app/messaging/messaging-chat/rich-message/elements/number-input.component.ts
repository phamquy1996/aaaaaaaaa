import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  RichMessageNumberInput,
  RichMessagePayload,
  RichMessageValidatable,
} from '@freelancer/datastore/collections';
import { InputType } from '@freelancer/ui/input';

// TODO T38029: Fix styling of number-input label.
@Component({
  selector: 'app-number-input',
  template: `
    <fl-bit class="Container">
      <!-- TODO add logic for currency sign -->
      <fl-input
        flTrackingLabel="rich-message-number-input"
        class="FieldInput"
        [beforeLabel]="element.label"
        [placeholder]="element.placeholder"
        [control]="control"
        [type]="InputType.NUMBER"
        (input)="handleInput()"
      ></fl-input>
    </fl-bit>
    <fl-bit *ngIf="currErrText" class="Error">{{ currErrText }}</fl-bit>
  `,
  styleUrls: ['./number-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NumberInputComponent
  implements RichMessageValidatable, OnInit, OnChanges {
  InputType = InputType;
  control = new FormControl();
  @Input() element: RichMessageNumberInput;
  @Input() disabled: boolean;
  currErrText: string;

  @Input() richMessageValues: RichMessagePayload;
  @Output() richMessageValuesChange = new EventEmitter<RichMessagePayload>();

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  @HostListener('click', ['$event'])
  handleClick(event: MouseEvent) {
    event.stopPropagation();
  }

  ngOnInit() {
    this.richMessageValues[this.element.name] = NaN;
  }

  ngOnChanges() {
    if (this.disabled) {
      this.control.disable();
    } else {
      this.control.enable();
    }
  }

  handleInput() {
    // There are some checks that should happen regardless if they're passed.
    // One is that the spec for number fields allows exponentials.
    // So make sure they aren't there.

    // fl-input is coming back with text, so we need to parse it.
    const inputValue = parseInt(this.control.value, 10);
    this.currErrText = '';
    this.richMessageValues[this.element.name] = inputValue;
    this.changeDetectorRef.markForCheck();
  }

  // TODO: Is this function needed, or does it need to be merged with handleInput?
  validate() {
    this.changeDetectorRef.markForCheck();
    if (Number.isNaN(this.richMessageValues[this.element.name] as number)) {
      this.currErrText = 'Please enter a value';
      return false;
    }
    this.currErrText = '';
    this.changeDetectorRef.markForCheck();
    return true;
  }
}
