import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { HeadingColor, HeadingType } from '@freelancer/ui/heading';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, TextSize } from '@freelancer/ui/text';
import { ModalColor } from './modal-color';

@Component({
  selector: 'fl-modal-error',
  template: `
    <fl-bit class="ModalError" [attr.data-edge-to-edge]="edgeToEdge">
      <fl-heading
        i18n="Modal load error title"
        [color]="
          color === ModalColor.LIGHT ? HeadingColor.DARK : HeadingColor.LIGHT
        "
        [headingType]="HeadingType.H3"
        [size]="TextSize.MID"
        [flMarginBottom]="Margin.MID"
      >
        Aw, snap!
      </fl-heading>

      <fl-text
        i18n="Modal load error description"
        [color]="color === ModalColor.LIGHT ? FontColor.DARK : FontColor.LIGHT"
        [flMarginBottom]="Margin.SMALL"
      >
        Something went wrong while fetching the content. Please check your
        Internet connectivity and then retry.
      </fl-text>

      <fl-bit [flMarginBottom]="Margin.MID">
        <fl-text
          [color]="
            color === ModalColor.LIGHT ? FontColor.DARK : FontColor.LIGHT
          "
          [flMarginBottom]="Margin.XXSMALL"
        >
          <fl-button (click)="toggleError()">
            <ng-container
              *ngIf="!isErrorDisplayed"
              i18n="Modal load error details show more link"
            >
              Show more information
            </ng-container>
            <ng-container
              *ngIf="isErrorDisplayed"
              i18n="Modal load error details hide more link"
            >
              Hide more information
            </ng-container>
            <fl-icon
              class="ModalError-icon"
              [ngClass]="{ IsActive: isErrorDisplayed }"
              [color]="
                color === ModalColor.LIGHT ? IconColor.DARK : IconColor.LIGHT
              "
              [name]="'ui-chevron-down'"
              [size]="IconSize.SMALL"
              (click)="toggleError()"
            ></fl-icon>
          </fl-button>
        </fl-text>

        <fl-text class="ModalError-details" *ngIf="isErrorDisplayed">
          {{ errorMessage }}
        </fl-text>
      </fl-bit>

      <fl-bit class="ModalError-actions">
        <fl-button
          class="ModalError-retryBtn"
          i18n="Modal load error retry button"
          [color]="ButtonColor.SECONDARY"
          [size]="ButtonSize.SMALL"
          (click)="handleRetryClick()"
        >
          Retry
        </fl-button>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./modal-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalErrorComponent {
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  FontColor = FontColor;
  HeadingColor = HeadingColor;
  TextSize = TextSize;
  HeadingType = HeadingType;
  IconColor = IconColor;
  IconSize = IconSize;
  Margin = Margin;
  ModalColor = ModalColor;

  @Input() color = ModalColor.LIGHT;
  @Input() edgeToEdge = false;
  @Input() errorMessage: string;

  @Output() retry = new EventEmitter<void>();

  isErrorDisplayed = false;

  handleRetryClick() {
    this.retry.emit();
  }

  toggleError() {
    this.isErrorDisplayed = !this.isErrorDisplayed;
  }
}
