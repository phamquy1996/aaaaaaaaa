import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { ButtonColor } from '@freelancer/ui/button';
import { HeadingColor, HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { FontColor } from '@freelancer/ui/text';

@Component({
  selector: 'app-hire-me-rookie-message',
  template: `
    <fl-bit class="Container">
      <fl-button
        class="CloseButton"
        flTrackingLabel="RookieMessageCloseButton"
        (click)="close.emit()"
      >
        <fl-icon [name]="'ui-close'"></fl-icon>
      </fl-button>

      <fl-heading
        i18n="Hire Me Rookie message heading"
        [flMarginBottom]="Margin.MID"
        [headingType]="HeadingType.H5"
        [color]="HeadingColor.LIGHT"
      >
        Would you like to Post a Project instead?
      </fl-heading>
      <fl-text
        i18n="Hire Me Rookie message content"
        [flMarginBottom]="Margin.MID"
        [color]="FontColor.LIGHT"
      >
        Post a public project and receive bids from multiple freelancers,
        helping you find the perfect freelancer for your project.
      </fl-text>
      <fl-bit>
        <fl-button
          i18n="Hire Me Rookie message Post project button"
          flTrackingLabel="RookieMessagePostProjectButton"
          [flMarginRight]="Margin.SMALL"
          [link]="'/post-project'"
          [color]="ButtonColor.PRIMARY"
        >
          Post a project
        </fl-button>
        <fl-button
          i18n="Hire Me Rookie message Continue button"
          flTrackingLabel="RookieMessageContinueButton"
          (click)="proceed.emit()"
          [color]="ButtonColor.TRANSPARENT_LIGHT"
        >
          Hire
        </fl-button>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./rookie-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RookieMessageComponent {
  HeadingColor = HeadingColor;
  ButtonColor = ButtonColor;
  HeadingType = HeadingType;
  FontColor = FontColor;
  Margin = Margin;

  @Output() close = new EventEmitter<void>();
  @Output() proceed = new EventEmitter<void>();
}
