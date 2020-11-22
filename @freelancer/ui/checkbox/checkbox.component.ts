import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, TextSize } from '@freelancer/ui/text';
import * as Rx from 'rxjs';

export enum CheckboxSize {
  SMALL = 'small',
  LARGE = 'large',
}

@Component({
  selector: 'fl-checkbox',
  template: `
    <fl-bit
      class="CheckboxContainer"
      [ngClass]="{
        IsInvalid: control.invalid && control.dirty,
        IsDisabled: control.disabled
      }"
      [attr.disabled]="control.disabled ? true : null"
      [flMarginBottom]="
        control.invalid && control.dirty ? Margin.XXXSMALL : null
      "
    >
      <input
        class="NativeElement"
        type="checkbox"
        [id]="id"
        [checked]="control.value"
        [formControl]="control"
        [attr.disabled]="control.disabled ? true : null"
      />
      <label
        class="CheckboxLabel"
        [attr.data-size]="size"
        [ngClass]="{
          InputOnly: forListItem,
          'CheckboxLabel-error': control.invalid && control.dirty
        }"
        [for]="id"
        (click)="$event.stopPropagation()"
      >
        <span class="CheckboxEffect"></span>
        <ng-container *ngIf="!forListItem"> {{ label }} </ng-container>
      </label>
    </fl-bit>
    <fl-validation-error
      *ngIf="!forListItem"
      [control]="control"
      (click)="$event.stopPropagation()"
    ></fl-validation-error>
  `,
  styleUrls: ['./checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxComponent implements OnChanges, OnDestroy {
  Margin = Margin;
  TextSize = TextSize;
  FontColor = FontColor;

  private statusChangeSubscription?: Rx.Subscription;

  checkboxGroupId: string;

  @HostBinding('class.NoMargin')
  @Input()
  forListItem = false;

  @Input() control: FormControl;
  @Input() label = '';
  @Input() size = CheckboxSize.SMALL;
  /** id for the checkbox element */
  @Input() id = `${generateRandomId()}--${stripSpaces(this.label)}`;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if ('control' in changes) {
      if (this.statusChangeSubscription) {
        this.statusChangeSubscription.unsubscribe();
      }
      this.statusChangeSubscription = this.control.statusChanges.subscribe(
        () => {
          // we still need this for the CheckboxContainer directives
          this.cd.markForCheck();
        },
      );
    }
  }

  ngOnDestroy() {
    if (this.statusChangeSubscription) {
      this.statusChangeSubscription.unsubscribe();
    }
  }
}

function stripSpaces(key: string) {
  return key.split(' ').join('');
}

function generateRandomId() {
  let text = '';
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < 15; i++) {
    text += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return text;
}
