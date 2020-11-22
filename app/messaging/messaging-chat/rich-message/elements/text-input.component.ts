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
  RichMessagePayload,
  RichMessageTextInput,
  RichMessageValidatable,
} from '@freelancer/datastore/collections';

@Component({
  selector: 'app-text-input',
  template: `
    <fl-input
      flTrackingLabel="rich-message-text-input"
      [placeholder]="element.placeholder"
      [control]="control"
      (input)="handleInput()"
    ></fl-input>
    <fl-bit *ngIf="currErrText" class="Error">{{ currErrText }}</fl-bit>
  `,
  styleUrls: ['./text-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextInputComponent
  implements RichMessageValidatable, OnInit, OnChanges {
  control = new FormControl();
  @Input() element: RichMessageTextInput;
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
    this.richMessageValues[this.element.name] = '';
  }

  ngOnChanges() {
    if (this.disabled) {
      this.control.disable();
    } else {
      this.control.enable();
    }
  }

  handleInput() {
    this.currErrText = '';
    this.richMessageValues[this.element.name] = this.control.value;
    this.changeDetectorRef.markForCheck();
  }

  validate() {
    this.currErrText = '';
    this.changeDetectorRef.markForCheck();
    return true;
  }
}
