import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  RichMessagePayload,
  RichMessageSelectInput,
} from '@freelancer/datastore/collections';
import { Margin } from '@freelancer/ui/margin';
import { isFormControl } from '@freelancer/utils';
import * as Rx from 'rxjs';

@Component({
  selector: 'app-select-input',
  template: `
    <fl-bit *ngIf="formGroup.get('select') as control" class="Container">
      <fl-select
        *ngIf="isFormControl(control)"
        flTrackingLabel="rich-message-select"
        [disabled]="disabled"
        [control]="control"
        [options]="options"
        [flMarginBottom]="Margin.XSMALL"
      ></fl-select>
    </fl-bit>
    <fl-bit *ngIf="currErrText" class="Error">{{ currErrText }}</fl-bit>
  `,
  styleUrls: ['./select-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectInputComponent implements OnDestroy, OnInit {
  isFormControl = isFormControl;

  @Input() element: RichMessageSelectInput;
  @Input() disabled: boolean;

  @Input() richMessageValues: RichMessagePayload;
  @Output() richMessageValuesChange = new EventEmitter<RichMessagePayload>();

  currErrText: string;
  options: ReadonlyArray<string>;
  Margin = Margin;
  formGroup = new FormGroup({
    select: new FormControl(),
  });
  formSubscription?: Rx.Subscription;

  @HostListener('click', ['$event'])
  handleClick(event: MouseEvent) {
    event.stopPropagation();
  }

  ngOnInit() {
    this.options = this.element.values.map(v => v.text);

    if (this.element.default) {
      this.richMessageValues[this.element.name] = this.element.default;
    }

    // TODO: Improve how we set rich message values. Ref T72661
    this.formSubscription = this.formGroup.valueChanges.subscribe(
      formValues => {
        // elements.values is of type RichMessageValue but fl-select only takes in string[]
        // we have to match the text we display and the value we send in the payload
        // TODO: fix if/when fl-select gets separate text and value
        const values = this.element.values.filter(
          v => v.text === formValues.select,
        );
        if (values.length === 1) {
          this.richMessageValues[this.element.name] = values[0].value;
        }
      },
    );
  }

  ngOnDestroy() {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }
}
