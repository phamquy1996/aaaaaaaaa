import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Margin } from '@freelancer/ui/margin';
import { PictureDisplay } from '@freelancer/ui/picture';
import { TextAlign, TextSize } from '@freelancer/ui/text';

@Component({
  template: `
    <fl-bit class="SubscriptionErrorModal">
      <fl-picture
        alt="Trial Subscription Request Failed"
        i18n-alt="Trial Subscription Request Failed image alt"
        [alignCenter]="true"
        [src]="'search/empty-or-error-state.svg'"
        [display]="PictureDisplay.BLOCK"
        [flMarginBottom]="Margin.LARGE"
      >
      </fl-picture>
      <fl-text [textAlign]="TextAlign.CENTER">
        <ng-container
          *ngIf="!requestId; else withRequestId"
          i18n="Subscription error generic message"
        >
          Something went wrong. Please try again.
        </ng-container>
        <ng-template #withRequestId>
          <ng-container i18n="Subscription error contact support message">
            Something went wrong. Please try again or contact support with
            request ID:
            {{ requestId }}
          </ng-container>
        </ng-template>
      </fl-text>
    </fl-bit>
  `,
  styleUrls: ['./subscription-error-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionErrorModalComponent {
  Margin = Margin;
  PictureDisplay = PictureDisplay;
  TextAlign = TextAlign;
  TextSize = TextSize;

  @Input() requestId?: string;
}
