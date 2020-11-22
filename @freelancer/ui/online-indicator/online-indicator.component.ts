import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChange,
} from '@angular/core';

export enum OnlineIndicatorSize {
  SMALL = 'small',
  MID = 'mid',
  LARGE = 'large',
  XLARGE = 'xlarge',
}

@Component({
  selector: 'fl-online-indicator',
  template: `
    <div
      class="Indicator"
      [attr.aria-label]="ariaLabel"
      [attr.data-is-online]="isOnline"
      [attr.data-border]="border"
      [attr.data-size]="size"
    ></div>
  `,
  styleUrls: ['./online-indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnlineIndicatorComponent implements OnChanges {
  ariaLabel: string;

  @Input() username: string;
  @Input() isOnline: boolean;
  @Input() size = OnlineIndicatorSize.SMALL;
  @Input() border = false;

  private updateAriaLabel() {
    this.ariaLabel = `${this.username || 'User'} is ${
      this.isOnline ? 'online' : 'offline'
    }.`;
  }

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    if ('username' in changes || 'isOnline' in changes) {
      this.updateAriaLabel();
    }
  }
}
