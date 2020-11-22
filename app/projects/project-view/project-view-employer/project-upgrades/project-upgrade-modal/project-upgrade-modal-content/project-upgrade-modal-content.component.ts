import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonColor } from '@freelancer/ui/button';
import { Margin } from '@freelancer/ui/margin';
import { FontType, FontWeight, TextAlign, TextSize } from '@freelancer/ui/text';
import { UpgradeType } from '@freelancer/ui/upgrade-tag';

@Component({
  selector: 'app-project-upgrade-modal-content',
  template: `
    <fl-bit class="ProjectUpgradeModalContent">
      <fl-picture
        class="UpgradeIconPicture"
        [alt]="imgAlt"
        [flMarginBottom]="Margin.MID"
        [src]="imgSrc"
      ></fl-picture>

      <fl-text
        [flMarginBottom]="Margin.MID"
        [size]="projectHasUpgrade ? TextSize.MID : TextSize.LARGE"
        [textAlign]="TextAlign.CENTER"
        [weight]="FontWeight.BOLD"
      >
        {{ projectHasUpgrade ? hasUpgradeHeading : upgradeAvailableHeading }}
      </fl-text>

      <fl-bit *ngIf="!projectHasUpgrade" [flMarginBottom]="Margin.MID">
        <ng-content></ng-content>
      </fl-bit>

      <fl-button
        [busy]="busy"
        [color]="ButtonColor.SECONDARY"
        [flTrackingLabel]="
          projectHasUpgrade ? 'HasProjectUpgradeButton' : 'ProjectUpgradeButton'
        "
        [flTrackingReferenceId]="upgradeType"
        [flTrackingReferenceType]="'upgrade_type'"
        (click)="projectHasUpgrade ? close.emit() : upgrade.emit()"
      >
        <ng-container *ngIf="!projectHasUpgrade; else hasProjectUpgradeButton">
          {{ upgradeAvailableButtonLabel }}
        </ng-container>

        <ng-template #hasProjectUpgradeButton>
          <ng-container i18n="Close popup modal button">
            Close
          </ng-container>
        </ng-template>
      </fl-button>
    </fl-bit>
  `,
  styleUrls: ['./project-upgrade-modal-content.component.scss'],
})
export class ProjectUpgradeModalContentComponent {
  ButtonColor = ButtonColor;
  FontType = FontType;
  FontWeight = FontWeight;
  Margin = Margin;
  TextAlign = TextAlign;
  TextSize = TextSize;

  @Input() busy: boolean;
  @Input() hasUpgradeHeading: string;
  @Input() imgAlt: string;
  @Input() imgSrc: string;
  @Input() projectHasUpgrade: boolean;
  @Input() upgradeAvailableButtonLabel: string;
  @Input() upgradeAvailableHeading: string;
  @Input() upgradeType: UpgradeType;

  @Output() upgrade = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
}
