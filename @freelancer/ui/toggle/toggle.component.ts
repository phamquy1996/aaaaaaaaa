import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';

export enum ToggleSize {
  SMALL = 'small',
  MID = 'mid',
  LARGE = 'large',
}

export enum ToggleColor {
  LIGHT = 'light',
  DARK = 'dark',
}

@Component({
  selector: 'fl-toggle',
  template: `
    <label
      class="ToggleLabel"
      for="{{ toggleId }}"
      [attr.data-size]="size"
      [attr.data-color]="color"
      [attr.disabled]="control.disabled || busy ? true : null"
    >
      <span class="ToggleInner" [ngClass]="{ NoMargin: forListItem }">
        <input
          #input
          class="NativeElement"
          type="checkbox"
          id="{{ toggleId }}"
          [formControl]="control"
          [checked]="control.value"
          [attr.disabled]="control.disabled || busy ? true : null"
          name="{{ toggleId }}"
          (click)="onClick($event)"
        />
        <span class="ToggleBackground"></span>
        <span class="ToggleHandle"></span>
      </span>
    </label>
  `,
  styleUrls: ['./toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleComponent implements OnInit {
  toggleId: string;

  @Input() control: FormControl;
  @Input() size = ToggleSize.SMALL;
  @Input() color = ToggleColor.DARK;
  @Input() forListItem = false;
  @Input() busy = false;

  @ViewChild('input') input: ElementRef<HTMLInputElement>;

  ngOnInit() {
    this.toggleId = generateRandomString();
  }

  onClick(event: Event) {
    event.stopPropagation();
  }
}

function generateRandomString() {
  let text = '';
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < 15; i++) {
    text += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return text;
}
