import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, FontType, TextSize } from '@freelancer/ui/text';
import * as Rx from 'rxjs';
import { startWith } from 'rxjs/operators';

@Component({
  selector: 'fl-textarea',
  template: `
    <textarea
      class="TextArea"
      [attr.id]="id"
      [attr.placeholder]="placeholder"
      [attr.maxlength]="maxLength ? maxLength : null"
      [formControl]="control"
      [ngClass]="{
        Error: control.invalid && (control.touched || control.dirty)
      }"
      [attr.rows]="rows"
      [attr.disabled]="attrDisabled"
      [flMarginBottom]="
        control.invalid && (control.touched || control.dirty)
          ? Margin.XXXSMALL
          : null
      "
      (focus)="handleFocus()"
      (blur)="handleBlur()"
    ></textarea>
    <fl-bit
      *ngIf="
        maxCharacter !== undefined &&
        !(control.invalid && (control.touched || control.dirty))
      "
      class="CountCharacterWrapper"
    >
      <fl-text
        i18n="description character counter"
        class="Counter"
        [ngClass]="{
          IsFocus: textareaFocused === true
        }"
        [color]="
          maxCharacter - control.value?.length >= 0
            ? FontColor.DARK
            : FontColor.ERROR
        "
        [size]="TextSize.XSMALL"
        [fontType]="FontType.PARAGRAPH"
      >
        {{ maxCharacter - control.value?.length }}
      </fl-text>
    </fl-bit>

    <fl-text
      *ngIf="control.invalid && (control.touched || control.dirty)"
      [color]="FontColor.ERROR"
      [size]="TextSize.XXSMALL"
    >
      {{ error }}
    </fl-text>
  `,
  styleUrls: ['./textarea.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaComponent implements OnDestroy, OnInit {
  FontColor = FontColor;
  FontType = FontType;
  TextSize = TextSize;
  Margin = Margin;

  error: string;
  errorSubscription?: Rx.Subscription;

  attrDisabled?: boolean;
  textareaFocused = false;

  @Input() id: string;
  @Input() control: FormControl;
  @Input() placeholder = '';
  @Input() rows = 2;
  @Input() maxCharacter?: number;
  @Input() maxLength?: number;
  @Input()
  set disabled(value: boolean) {
    this.attrDisabled = value ? true : undefined;
  }

  @Output() inputBlur = new EventEmitter<void>();
  @Output() inputFocus = new EventEmitter<void>();

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.errorSubscription = this.control.statusChanges
      .pipe(startWith(this.control.status))
      .subscribe(() => {
        [this.error] = Object.values(this.control.errors || {});
        this.cd.markForCheck();
      });
  }

  ngOnDestroy() {
    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
    }
  }

  handleBlur() {
    this.textareaFocused = false;
    this.inputBlur.emit();
  }

  handleFocus() {
    this.textareaFocused = !this.textareaFocused;
    this.inputFocus.emit();
  }
}
