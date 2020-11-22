import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, FontWeight, TextSize } from '@freelancer/ui/text';
import { isDefined } from '@freelancer/utils';

@Component({
  selector: 'app-freelancer-verified-landing-status-modal-requirement',
  template: `
    <fl-grid>
      <ng-container *ngIf="!isLoading; else loading">
        <fl-col [col]="hideActionColumn ? 12 : 6">
          <fl-bit class="RequirementName">
            <fl-bit>
              <fl-icon
                *ngIf="isCompleted; else notCompleted"
                [name]="'ui-check-in-circle-v2'"
                [color]="IconColor.SUCCESS"
                [flMarginRight]="Margin.XXXSMALL"
                [size]="IconSize.SMALL"
              ></fl-icon>
              <ng-template #notCompleted>
                <fl-icon
                  [name]="'ui-warning-v2'"
                  [color]="IconColor.ERROR"
                  [flMarginRight]="Margin.XXXSMALL"
                  [size]="IconSize.SMALL"
                ></fl-icon>
              </ng-template>
            </fl-bit>
            <fl-text [size]="TextSize.SMALL">
              {{ name }}
            </fl-text>
          </fl-bit>
        </fl-col>

        <fl-col *ngIf="!hideActionColumn" [col]="6">
          <fl-text *ngIf="!isCompleted" [size]="TextSize.SMALL">
            {{ actionText }}
            <fl-link
              i18n="
                 Freelancer Verified requirement action link click here text
              "
              [flTrackingLabel]="name + 'ActionLink'"
              [fragment]="actionFragment"
              [link]="actionLink"
              [size]="TextSize.SMALL"
            >
              here
            </fl-link>
          </fl-text>
        </fl-col>
      </ng-container>

      <ng-template #loading>
        <fl-col [col]="6">
          <fl-loading-text [rows]="1" [padded]="false"></fl-loading-text>
        </fl-col>
        <fl-col [col]="6">
          <fl-loading-text [rows]="1" [padded]="false"></fl-loading-text>
        </fl-col>
      </ng-template>
    </fl-grid>
  `,
  styleUrls: [
    './freelancer-verified-landing-status-modal-requirement.component.scss',
  ],
})
export class FreelancerVerifiedLandingStatusModalRequirementComponent
  implements OnChanges {
  IconColor = IconColor;
  IconSize = IconSize;
  FontColor = FontColor;
  FontWeight = FontWeight;
  Margin = Margin;
  TextSize = TextSize;

  @Input() actionFragment: string;
  @Input() actionLink: string;
  @Input() actionText: string;
  @Input() hideActionColumn = false;
  @Input() isCompleted: boolean;
  @Input() name: string;

  isLoading = true;

  ngOnChanges(changes: SimpleChanges): void {
    if ('isCompleted' in changes) {
      this.isLoading = !isDefined(this.isCompleted);
    }
  }
}
