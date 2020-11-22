import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { LogoSize } from '@freelancer/ui/logo';
import { Margin } from '@freelancer/ui/margin';

@Component({
  selector: `app-form-logo`,
  template: `
    <fl-bit class="Header">
      <fl-link
        *ngIf="showBackButton"
        class="Header-back"
        [flTrackingLabel]="backTrackingLabel"
        (click)="back.emit()"
      >
        <fl-icon
          [color]="IconColor.DARK"
          [name]="'ui-arrow-left-alt'"
          [size]="IconSize.SMALL"
        ></fl-icon>
      </fl-link>
      <fl-logo
        class="Header-logo"
        *ngIf="!forceFreelancerBranding; else freelancerLogo"
        [size]="size"
      ></fl-logo>
      <ng-template #freelancerLogo>
        <fl-picture
          class="Header-logo"
          alt="Freelancer only logo"
          i18n-alt="Freelancer only logo"
          [attr.data-size]="size"
          [src]="'freelancer-only-logo.svg'"
        ></fl-picture>
      </ng-template>
    </fl-bit>
  `,
  styleUrls: ['./form-logo.component.scss'],
})
export class FormLogoComponent {
  IconColor = IconColor;
  IconSize = IconSize;
  Margin = Margin;
  LogoSize = LogoSize;

  @Input() size = LogoSize.MID;
  /**
   * This will force using freelancer branding and the freelancer logo.
   * The reason for this is because there are places on partner domains where
   * we still need the FLN logo (eg. FLN password reset in arrow).
   *
   * This does not need to be set for FLN because the branding will
   * automatically be Freelancer due to the build.
   */
  @Input() forceFreelancerBranding = false;
  @Input() showBackButton: boolean;
  @Input() backTrackingLabel: string;
  @Output() back = new EventEmitter();
}
