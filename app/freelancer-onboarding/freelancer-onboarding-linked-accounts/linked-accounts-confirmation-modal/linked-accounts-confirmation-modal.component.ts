import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ModalRef } from '@freelancer/ui';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { StickyBehaviour, StickyPosition } from '@freelancer/ui/sticky';
import { TextSize } from '@freelancer/ui/text';
import { LinkedAccountType } from 'app/freelancer-onboarding/freelancer-onboarding.types';

@Component({
  template: `
    <fl-sticky-footer-wrapper flTrackingSection="OnboardingLinkedAccounts">
      <fl-sticky-footer-body>
        <fl-bit
          class="FreelancerOnboardingLinkedAccountsModal-header"
          [flMarginBottom]="Margin.SMALL"
        >
          <fl-bit
            [flMarginBottom]="Margin.MID"
            [flMarginBottomDesktop]="Margin.SMALL"
          >
            <fl-picture
              alt="Linked account imagery"
              i18n-alt="Linked account imagery"
              [src]="'onboarding/linked-accounts.svg'"
            ></fl-picture>
          </fl-bit>
          <fl-heading
            i18n="Heading for profile import confirmation"
            [headingType]="HeadingType.H2"
            [flMarginBottom]="Margin.SMALL"
            [size]="TextSize.LARGE"
          >
            Confirm profile import
          </fl-heading>
        </fl-bit>
        <fl-bit
          class="FreelancerOnboardingLinkedAccountsModal-body"
          [flMarginBottom]="Margin.XXLARGE"
        >
          <fl-bit [flMarginRight]="Margin.SMALL">
            <fl-icon
              *ngIf="linkedAccountType === LinkedAccountType.FACEBOOK"
              class="FreelancerOnboardingLinkedAccountsModal-logoFacebook"
              [color]="IconColor.INHERIT"
              [name]="'ui-facebook'"
              [size]="IconSize.LARGE"
            ></fl-icon>
            <fl-icon
              *ngIf="linkedAccountType === LinkedAccountType.LINKEDIN"
              class="FreelancerOnboardingLinkedAccountsModal-logoLinkedIn"
              [color]="IconColor.INHERIT"
              [name]="'ui-linkedin'"
              [size]="IconSize.LARGE"
            ></fl-icon>
          </fl-bit>
          <fl-bit>
            <fl-text
              i18n="Text description for profile import confirmation"
              [flMarginBottom]="Margin.XSMALL"
              [flMarginBottomTablet]="Margin.XXXSMALL"
              [size]="TextSize.SMALL"
            >
              You've already imported your profile details from another account.
            </fl-text>
            <fl-text
              *ngIf="linkedAccountType === LinkedAccountType.FACEBOOK"
              i18n="Text description for Facebook profile import confirmation"
              [size]="TextSize.SMALL"
            >
              Would you like to import from Facebook instead?
            </fl-text>
            <fl-text
              *ngIf="linkedAccountType === LinkedAccountType.LINKEDIN"
              i18n="Text description for LinkedIn profile import confirmation"
              [size]="TextSize.SMALL"
            >
              Would you like to import from LinkedIn instead?
            </fl-text>
          </fl-bit>
        </fl-bit>
      </fl-sticky-footer-body>
      <fl-sticky-footer>
        <fl-button
          class="FreelancerOnboardingLinkedAccountsModal-button"
          flTrackingLabel="CancelProfileImport"
          i18n="Freelancer onboarding back button"
          [color]="ButtonColor.TRANSPARENT_DARK"
          [flMarginRight]="Margin.SMALL"
          [flMarginRightDesktop]="Margin.MID"
          [size]="ButtonSize.LARGE"
          (click)="handleCancel()"
        >
          Cancel
        </fl-button>
        <fl-button
          class="FreelancerOnboardingLinkedAccountsModal-button"
          flTrackingLabel="ConfirmProfileImport"
          i18n="Freelancer onboarding modal confirm button"
          [color]="ButtonColor.SECONDARY"
          [size]="ButtonSize.LARGE"
          (click)="handleConfirm()"
        >
          Confirm
        </fl-button>
      </fl-sticky-footer>
    </fl-sticky-footer-wrapper>
  `,
  styleUrls: ['./linked-accounts-confirmation-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkedAccountsConfirmationModalComponent {
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  HeadingType = HeadingType;
  IconColor = IconColor;
  IconSize = IconSize;
  LinkedAccountType = LinkedAccountType;
  Margin = Margin;
  StickyBehaviour = StickyBehaviour;
  StickyPosition = StickyPosition;
  TextSize = TextSize;

  @Input()
  linkedAccountType: LinkedAccountType = LinkedAccountType.FACEBOOK;

  constructor(
    private modalRef: ModalRef<LinkedAccountsConfirmationModalComponent>,
  ) {}

  handleCancel() {
    this.modalRef.close({
      confirmed: false,
    });
  }

  handleConfirm() {
    this.modalRef.close({
      confirmed: true,
    });
  }
}
