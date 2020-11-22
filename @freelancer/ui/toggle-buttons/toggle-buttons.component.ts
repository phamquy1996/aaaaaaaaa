import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Input,
  OnDestroy,
  QueryList,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import * as Rx from 'rxjs';

export enum ToggleButtonsColor {
  SECONDARY = 'secondary',
  TRANSPARENT_SECONDARY = 'transparent-secondary',
}

@Component({
  selector: 'fl-toggle-buttons-option',
  template: `
    <fl-button
      [buttonGroupFirst]="buttonGroupFirst"
      [buttonGroupLast]="buttonGroupLast"
      [buttonGroupMiddle]="buttonGroupMiddle"
      [color]="buttonColor"
      [size]="ButtonSize.SMALL"
      (click)="changeValue()"
    >
      <ng-content></ng-content>
    </fl-button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleButtonsOptionComponent implements OnDestroy {
  ButtonSize = ButtonSize;
  ButtonColor = ButtonColor;

  buttonColor: ButtonColor;
  defaultButtonColor = ToggleButtonsColor.SECONDARY;
  formControl: FormControl;
  controlSubscription?: Rx.Subscription;

  @Input() value: string;
  @Input() buttonGroupFirst: boolean;
  @Input() buttonGroupLast: boolean;
  @Input() buttonGroupMiddle: boolean;

  @Input() set color(value: ToggleButtonsColor) {
    this.defaultButtonColor = value;
    this.updateButton();
  }

  @Input() set control(value: FormControl) {
    this.formControl = value;

    this.unsubscribeControl();
    this.controlSubscription = this.formControl.valueChanges.subscribe(() => {
      this.updateButton();
      this.changeDetectorRef.detectChanges();
    });
  }

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  updateButton() {
    this.buttonColor =
      this.formControl && this.formControl.value === this.value
        ? ButtonColor.SECONDARY
        : this.getUnselectedButtonColor();
  }

  changeValue() {
    this.formControl.setValue(this.value);
  }

  private getUnselectedButtonColor() {
    switch (this.defaultButtonColor) {
      case ToggleButtonsColor.TRANSPARENT_SECONDARY:
        return ButtonColor.TRANSPARENT_SECONDARY;

      default:
      case ToggleButtonsColor.SECONDARY:
        return ButtonColor.DEFAULT;
    }
  }

  private unsubscribeControl() {
    if (this.controlSubscription) {
      this.controlSubscription.unsubscribe();
    }
  }

  ngOnDestroy() {
    this.unsubscribeControl();
  }
}

@Component({
  selector: 'fl-toggle-buttons',
  template: `
    <ng-content select="fl-toggle-buttons-option"></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleButtonsComponent implements AfterContentInit, OnDestroy {
  @Input() color = ToggleButtonsColor.SECONDARY;
  @Input() control: FormControl;

  @ContentChildren(ToggleButtonsOptionComponent)
  options: QueryList<ToggleButtonsOptionComponent>;

  private optionsSubscription?: Rx.Subscription;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngAfterContentInit() {
    this.initOptions();
    this.optionsSubscription = this.options.changes.subscribe(() => {
      this.initOptions();
      this.changeDetectorRef.detectChanges();
    });
  }

  initOptions(): void {
    this.options.forEach((option, index) => {
      option.buttonGroupFirst = this.options.length > 1 && index === 0;
      option.buttonGroupLast =
        this.options.length > 1 && index === this.options.length - 1;
      option.buttonGroupMiddle =
        this.options.length > 2 &&
        !option.buttonGroupFirst &&
        !option.buttonGroupLast;
      option.control = this.control;
      option.color = this.color;
    });
  }

  ngOnDestroy() {
    if (this.optionsSubscription) {
      this.optionsSubscription.unsubscribe();
    }
  }
}
