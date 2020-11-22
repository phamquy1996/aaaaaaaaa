import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  RichMessagePayload,
  RichMessageRadioInput,
} from '@freelancer/datastore/collections';
import { isFormControl } from '@freelancer/utils';
import * as Rx from 'rxjs';

@Component({
  selector: 'app-radio-input',
  template: `
    <ng-container *ngIf="formGroup.get('radio') as control">
      <fl-radio
        *ngIf="isFormControl(control)"
        flTrackingLabel="rich-message-radio-input"
        [control]="control"
        [options]="options"
      ></fl-radio>
    </ng-container>
    <fl-bit *ngIf="currErrText" class="Error">{{ currErrText }}</fl-bit>
  `,
  styleUrls: ['./radio-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioInputComponent implements OnInit, OnDestroy {
  isFormControl = isFormControl;

  @Input() element: RichMessageRadioInput;
  @Input() disabled: boolean;
  currErrText: string;

  @Input() richMessageValues: RichMessagePayload;
  @Output() richMessageValuesChange = new EventEmitter<RichMessagePayload>();

  formGroup = new FormGroup({
    radio: new FormControl(),
  });

  formSubscription?: Rx.Subscription;
  options: ReadonlyArray<string>;

  ngOnInit() {
    this.options = this.element.values.map(v => v.text);
    this.formSubscription = this.formGroup.valueChanges.subscribe(
      formValues => {
        // elements.values is of type RichMessageValue but fl-radio only takes in string[]
        // we have to match the text we display and the value we send in the payload
        // TODO: fix if/when fl-radio gets separate text and value
        const values = this.element.values.filter(
          v => v.text === formValues.radio,
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
