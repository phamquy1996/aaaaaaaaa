import { Component, Input } from '@angular/core';
import { ProjectViewProject } from '@freelancer/datastore/collections';
import { ButtonColor } from '@freelancer/ui/button';
import { ListItemType } from '@freelancer/ui/list-item';
import { Margin } from '@freelancer/ui/margin';
import {
  FontColor,
  FontType,
  FontWeight,
  TextAlign,
  TextSize,
} from '@freelancer/ui/text';

export enum AutomaticBillingInfoContext {
  EMPLOYER,
  EMPLOYER_PAYMENT_VERIFY,
  FREELANCER,
}

@Component({
  selector: 'app-automatic-billing-info',
  template: `
    <!-- Employer hourly explainer -->
    <ng-container *ngIf="context === AutomaticBillingInfoContext.EMPLOYER">
      <fl-text [flMarginBottom]="Margin.MID">
        <ng-container
          *ngIf="isCollaboratorView; else isEmployerViewFirst"
          i18n="Automatic billing description for collaborator"
        >
          With automatic billing, the employer is billed every week based on the
          hours tracked by the freelancer. Automatic billing uses the Milestone
          Payment System which protects the employer and the freelancer.
        </ng-container>
        <ng-template #isEmployerViewFirst>
          <ng-container i18n="Automatic billing description for employer">
            With Automatic Billing, you will be billed for the previous week's
            tracked hours every Monday. We will hold the payment until
            Wednesday, and then automatically pay it to your freelancer.
          </ng-container>
        </ng-template>
      </fl-text>

      <ng-container *ngTemplateOutlet="hourlyBillingStepPicture">
      </ng-container>

      <fl-button
        *ngIf="isCollaboratorView; else isEmployerViewSecond"
        i18n="Collaborator learn more automatic billing button"
        flTrackingLabel="CollaboratorLearnMoreAutomaticBillingButton"
        [color]="ButtonColor.DEFAULT"
        [display]="'block'"
        [link]="
          '/support/employer/Payments/milestone-payment-for-employers-2228'
        "
      >
        Learn More
      </fl-button>
      <ng-template #isEmployerViewSecond>
        <fl-text i18n="Automatic billing cancellation description">
          If you do not want us to automatically release your payment to the
          freelancer on Wednesday, you can raise a dispute on the Milestone that
          has been created.
        </fl-text>
      </ng-template>
    </ng-container>

    <!-- Employer hourly explainer for payment verify page -->
    <ng-container
      *ngIf="context === AutomaticBillingInfoContext.EMPLOYER_PAYMENT_VERIFY"
    >
      <fl-text
        i18n="
           Automatic billing description for employers who require payment
          verification
        "
        [flMarginBottom]="Margin.MID"
      >
        You will NOT be charged right now, a payment method needs to be set up
        so that you are prepared to pay your freelancer when they deliver their
        work.
      </fl-text>

      <fl-text
        i18n="Description of automatic billing system for hourly project"
        [flMarginBottom]="Margin.XSMALL"
      >
        Here is how our Automated Billing System works for hourly projects:
      </fl-text>

      <fl-text [fontType]="FontType.CONTAINER">
        <fl-list [type]="ListItemType.ORDERED" [flMarginBottom]="Margin.MID">
          <fl-list-item i18n="Text to explain the Freelancer's tracked hours">
            Your freelancer tracks the number of hours they have worked each
            week.
          </fl-list-item>
          <fl-list-item
            i18n="Text to explain that milestone will be created every monday"
          >
            Every Monday, this amount is billed (but not paid). This gives you
            time to review the amount of hours your freelancer has submitted.
          </fl-list-item>

          <fl-list-item
            i18n="
               Text to explain that milestone will be released every Wednesday
            "
          >
            By Wednesday of each week, this payment is released to your
            freelancer.
          </fl-list-item>
        </fl-list>
      </fl-text>

      <ng-container *ngTemplateOutlet="hourlyBillingStepPicture">
      </ng-container>
      <fl-text i18n="Automatic billing cancellation description">
        You will always have the ability to turn off Automatic Billing, dispute
        your freelancer's submitted hours, as well as set the weekly work limit
        of your freelancer.
      </fl-text>
    </ng-container>

    <!-- Pictures for explaining automatic billing system -->
    <ng-template #hourlyBillingStepPicture>
      <fl-bit [flMarginBottom]="Margin.MID">
        <fl-grid>
          <fl-col class="IconColumn" [col]="4">
            <fl-picture
              class="IconColumn-icon"
              alt="Freelancer time-tracking icon"
              i18n-alt="Freelancer time-tracking icon"
              [src]="'project-view/icon-track.svg'"
              [flMarginBottom]="Margin.XXSMALL"
            ></fl-picture>
            <fl-text
              class="IconColumn-text"
              i18n="Employer-side time-tracking title"
              [color]="FontColor.DARK"
              [weight]="FontWeight.BOLD"
              [textAlign]="TextAlign.CENTER"
            >
              Freelancer tracks time
            </fl-text>
          </fl-col>
          <fl-col class="IconColumn" [col]="4">
            <fl-picture
              class="IconColumn-icon"
              alt="Freelancer billing icon"
              i18n-alt="Freelancer billing icon"
              [src]="'project-view/icon-bill.svg'"
              [flMarginBottom]="Margin.XXSMALL"
            ></fl-picture>
            <fl-text
              class="IconColumn-text"
              i18n="Freelancer billing title"
              [color]="FontColor.DARK"
              [weight]="FontWeight.BOLD"
              [textAlign]="TextAlign.CENTER"
            >
              Billed on Monday
            </fl-text>
          </fl-col>
          <fl-col class="IconColumn" [col]="4">
            <fl-picture
              class="IconColumn-icon"
              alt="Wallet icon"
              i18n-alt="Wallet icon"
              [src]="'project-view/icon-release.svg'"
              [flMarginBottom]="Margin.XXSMALL"
            ></fl-picture>
            <fl-text
              class="IconColumn-text"
              i18n="Freelancer paid title"
              [color]="FontColor.DARK"
              [weight]="FontWeight.BOLD"
              [textAlign]="TextAlign.CENTER"
            >
              Paid on Wednesday
            </fl-text>
          </fl-col>
        </fl-grid>
      </fl-bit>
    </ng-template>

    <!-- Freelancer variant -->
    <ng-container
      *ngIf="this.context === AutomaticBillingInfoContext.FREELANCER"
    >
      <fl-text
        i18n="Automatic billing description for freelancer"
        [flMarginBottom]="Margin.MID"
      >
        As your employer has a verified payment method, you can be assured that
        your tracked working hours will be paid.
      </fl-text>
      <fl-bit [flMarginBottom]="Margin.MID">
        <fl-grid>
          <fl-col class="IconColumn" [col]="4">
            <fl-picture
              class="IconColumn-icon"
              alt="Employer payment verified icon"
              i18n-alt="Employer payment verified icon"
              [src]="'project-view/icon-bill.svg'"
              [flMarginBottom]="Margin.XXSMALL"
            ></fl-picture>
            <fl-text
              class="IconColumn-text"
              i18n="Employer payment verified title"
              [color]="FontColor.DARK"
              [weight]="FontWeight.BOLD"
              [textAlign]="TextAlign.CENTER"
            >
              Employer's payment source verified
            </fl-text>
          </fl-col>
          <fl-col class="IconColumn" [col]="4">
            <fl-picture
              class="IconColumn-icon"
              alt="Freelancer time-tracking icon"
              i18n-alt="Freelancer time-tracking icon"
              [src]="'project-view/icon-track.svg'"
              [flMarginBottom]="Margin.XXSMALL"
            ></fl-picture>
            <fl-text
              class="IconColumn-text"
              i18n="Freelancer-side time-tracking title"
              [color]="FontColor.DARK"
              [weight]="FontWeight.BOLD"
              [textAlign]="TextAlign.CENTER"
            >
              Freelancer tracks time worked
            </fl-text>
          </fl-col>
          <fl-col class="IconColumn" [col]="4">
            <fl-picture
              class="IconColumn-icon"
              alt="Wallet icon"
              i18n-alt="Wallet icon"
              [src]="'project-view/icon-release.svg'"
              [flMarginBottom]="Margin.XXSMALL"
            ></fl-picture>
            <fl-text
              class="IconColumn-text"
              i18n="Freelancer paid title"
              [color]="FontColor.DARK"
              [weight]="FontWeight.BOLD"
              [textAlign]="TextAlign.CENTER"
            >
              Freelancer paid on Wednesday
            </fl-text>
          </fl-col>
        </fl-grid>
      </fl-bit>
      <fl-text
        i18n="Freelancer time-tracking information"
        [flMarginBottom]="Margin.XSMALL"
      >
        <ng-container *ngIf="!project?.local">
          We recommend that you track hours automatically with the
          <fl-link
            flTrackingLabel="AutomaticBillingInfoDesktopAppLink"
            [link]="'/desktop-app'"
            [newTab]="true"
          >
            Desktop App</fl-link
          >. You can also track hours manually from the
          <fl-link
            flTrackingLabel="AutomaticBillingInfoTrackingTabLink"
            [link]="'../tracking'"
          >
            Tracking Tab</fl-link
          >.</ng-container
        >
        Tracked hours will be paid automatically every Wednesday unless a
        dispute has been raised.
      </fl-text>
      <fl-button
        flTrackingLabel="AutomaticBillingInfoLearnMoreButton"
        i18n="Learn more about automatic billing button"
        [color]="ButtonColor.DEFAULT"
        [display]="'block'"
        [link]="'/support/freelancer/Project/working-on-hourly-projects'"
      >
        Learn More
      </fl-button>
    </ng-container>
  `,
  styleUrls: ['./automatic-billing-info.component.scss'],
})
export class AutomaticBillingInfoComponent {
  AutomaticBillingInfoContext = AutomaticBillingInfoContext;
  ButtonColor = ButtonColor;
  FontColor = FontColor;
  TextSize = TextSize;
  Margin = Margin;
  TextAlign = TextAlign;
  ListItemType = ListItemType;
  FontType = FontType;
  FontWeight = FontWeight;

  @Input() context = AutomaticBillingInfoContext.EMPLOYER;
  @Input() isCollaboratorView = false;
  @Input() project: ProjectViewProject;
}
