import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersSelf } from '@freelancer/datastore/collections';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { HeadingType } from '@freelancer/ui/heading';
import { InputSize } from '@freelancer/ui/input';
import { Margin } from '@freelancer/ui/margin';
import { FontType, FontWeight, TextSize } from '@freelancer/ui/text';
import { TooltipPosition } from '@freelancer/ui/tooltip';
import { isFormControl } from '@freelancer/utils';

@Component({
  selector: 'app-ownership-user',
  template: `
    <ng-container
      *ngIf="verifyEmail && !user.status.emailVerified; else default"
    >
      <fl-card [edgeToEdge]="true" [flMarginBottom]="Margin.LARGE">
        <fl-banner-alert
          i18n="Post Job Page ownership unverified email alert text"
          i18n-bannerTitle="
             Post Job Page ownership unverified email alert heading
          "
          bannerTitle="To access this feature you must verify your email address"
          [type]="BannerAlertType.WARNING"
          [closeable]="false"
          [bannerAlertButton]="{ text: 'Verify Your Account' }"
          (buttonClicked)="emailVerifyRedirect()"
        >
          Once your account has been email verified you will be able to post a
          project on behalf of somebody else
        </fl-banner-alert>
      </fl-card>
    </ng-container>
    <ng-template #default>
      <fl-heading
        i18n="Post Job Page ownership user label"
        [headingType]="HeadingType.H3"
        [flMarginBottom]="Margin.XXXSMALL"
        [size]="TextSize.MID"
      >
        Who are you submitting this project for?
      </fl-heading>
      <fl-text
        i18n="Post Job Page ownership user description"
        [flMarginBottom]="Margin.SMALL"
      >
        An email will be sent to the person or entity for whom the project is
        posted for.
      </fl-text>
      <ng-container *ngIf="formGroup.get('ownershipUser') as control">
        <fl-input
          *ngIf="isFormControl(control)"
          flTrackingLabel="OwnershipUserEmail"
          i18n-placeholder="Post Job Page ownership user email placeholder"
          placeholder="email@email.com"
          [control]="control"
          [flMarginBottom]="Margin.SMALL"
          [size]="InputSize.LARGE"
        ></fl-input>
      </ng-container>
      <ng-container *ngIf="invitePartner">
        <fl-heading
          i18n="Post Job Page partner label"
          [headingType]="HeadingType.H3"
          [flMarginBottom]="Margin.XXXSMALL"
          [size]="TextSize.MID"
        >
          Would you like to invite an {{ enterpriseName }} partner to bid?
        </fl-heading>
        <fl-bit
          *ngIf="formGroup.get('ownershipHasPartner') as control"
          [flMarginBottom]="Margin.SMALL"
        >
          <fl-checkbox
            *ngIf="isFormControl(control)"
            i18n-label="Project partner indicator checkbox label"
            flTrackingLabel="PostProjectPartnerCheckbox"
            label="'Yes, I would like to invite an {{
              enterpriseName
            }} partner'"
            [control]="control"
          >
          </fl-checkbox>
        </fl-bit>
        <ng-container *ngIf="formGroup.get('ownershipHasPartner')?.value">
          <ng-container *ngIf="formGroup.get('ownershipPartner') as control">
            <fl-input
              *ngIf="isFormControl(control)"
              flTrackingLabel="OwnershipPartnerName"
              i18n-placeholder="Post Job Page ownership partner placeholder"
              placeholder="'Name your {{ enterpriseName }} partner here...'"
              [control]="control"
              [flMarginBottom]="Margin.SMALL"
              [size]="InputSize.LARGE"
            ></fl-input>
          </ng-container>
        </ng-container>
      </ng-container>
      <fl-bit [flMarginBottom]="Margin.LARGE">
        <fl-text
          i18n="Enterprise representative name label"
          [fontType]="FontType.SPAN"
          [size]="TextSize.SMALL"
          [weight]="FontWeight.BOLD"
        >
          {{ enterpriseName }} representative:
        </fl-text>
        <fl-text [fontType]="FontType.SPAN" [size]="TextSize.SMALL">
          {{ user.firstName }} {{ user.lastName }}
        </fl-text>
        <fl-tooltip
          i18n-message="Enterprise representative name tooltip"
          message="'By submitting this project you will become the {{
            enterpriseName
          }} representative responsible for this project and will receive emails regarding this project'"
          [position]="TooltipPosition.END_TOP"
        >
          <fl-icon [name]="'ui-info-v2'"></fl-icon>
        </fl-tooltip>
      </fl-bit>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnershipUserComponent {
  BannerAlertType = BannerAlertType;
  FontWeight = FontWeight;
  TextSize = TextSize;
  FontType = FontType;
  HeadingType = HeadingType;
  InputSize = InputSize;
  isFormControl = isFormControl;
  Margin = Margin;
  TooltipPosition = TooltipPosition;

  @Input() formGroup: FormGroup;
  @Input() invitePartner = false;
  @Input() user: UsersSelf;
  @Input() verifyEmail = false;
  @Input() enterpriseName: string;

  constructor(private router: Router) {}

  emailVerifyRedirect() {
    this.router.navigate(['/email-verify']);
  }
}
