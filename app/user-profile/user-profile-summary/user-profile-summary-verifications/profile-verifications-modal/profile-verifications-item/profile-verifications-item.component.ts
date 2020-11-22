import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IconColor } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';

@Component({
  selector: 'app-profile-verifications-item',
  template: `
    <fl-grid>
      <fl-col [col]="10">
        <fl-bit class="ProfileVerificationsItem">
          <fl-icon
            [name]="verificationIcon"
            [flMarginRight]="Margin.XXSMALL"
            [color]="isVerified ? IconColor.SUCCESS : IconColor.MID"
          ></fl-icon>
          <fl-text>
            <ng-content></ng-content>
          </fl-text>
        </fl-bit>
      </fl-col>
      <fl-col [col]="2">
        <ng-container *ngIf="isVerified; else unverifiedIcon">
          <ng-container *ngTemplateOutlet="verifiedIcon"></ng-container>
        </ng-container>
      </fl-col>
    </fl-grid>

    <ng-template #verifiedIcon>
      <fl-icon [name]="'ui-tick'" [color]="IconColor.SUCCESS"></fl-icon>
    </ng-template>

    <ng-template #unverifiedIcon>
      <fl-icon [name]="'ui-minus-thin'" [color]="IconColor.MID"></fl-icon>
    </ng-template>
  `,
  styleUrls: ['./profile-verifications-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileVerificationsItemComponent {
  IconColor = IconColor;
  Margin = Margin;

  @Input() isVerified: boolean;
  @Input() verificationIcon: string;
}
