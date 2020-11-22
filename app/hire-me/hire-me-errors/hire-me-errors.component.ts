import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { Margin } from '@freelancer/ui/margin';
import { ErrorCodeApi } from 'api-typings/errors/errors';

@Component({
  selector: 'app-hire-me-errors',
  template: `
    <ng-container [ngSwitch]="error.errorCode">
      <fl-banner-alert
        *ngSwitchCase="ErrorCodeApi.EMAIL_VERIFICATION_REQUIRED"
        bannerTitle="Email verification needed"
        i18n-bannerTitle="Email verification needed banner title"
        [flMarginBottom]="Margin.XXSMALL"
        [closeable]="false"
        [compact]="true"
        [type]="BannerAlertType.ERROR"
      >
        <fl-text
          i18n="Email verification needed description"
          [flMarginBottom]="Margin.XXSMALL"
        >
          You need to verify your email before hiring this user.
        </fl-text>

        <fl-link
          i18n="Email verification link"
          [flTrackingLabel]="'GoToEmailVerifyPage'"
          [link]="'/users/verify.php'"
          [newTab]="true"
          [queryParams]="{ id: userId, sellerId: sellerId }"
        >
          Verify your email
        </fl-link>
      </fl-banner-alert>

      <fl-banner-alert
        *ngSwitchCase="ErrorCodeApi.FREELANCER_AWARD_RESTRICTION"
        bannerTitle="Freelancer restricted"
        i18n-bannerTitle="Freelancer restricted banner title"
        [flMarginBottom]="Margin.XXSMALL"
        [closeable]="false"
        [compact]="true"
        [type]="BannerAlertType.ERROR"
      >
        <fl-text
          i18n="Freelancer restricted description"
          [flMarginBottom]="Margin.XXSMALL"
        >
          This freelancer currently has a restriction that prevents them from
          being awarded new projects.
        </fl-text>
      </fl-banner-alert>

      <fl-banner-alert
        *ngSwitchDefault
        i18n-bannerTitle="Error banner title"
        bannerTitle="Error"
        [closeable]="false"
        [type]="BannerAlertType.ERROR"
        [flMarginBottom]="Margin.XXSMALL"
      >
        <ng-container [ngSwitch]="error.errorCode">
          <fl-text
            *ngSwitchCase="'BID_AMOUNT_TOO_HIGH'"
            i18n="Budget is too large Hireme Error"
          >
            Budget is too large.
          </fl-text>

          <fl-text
            *ngSwitchCase="'BID_AMOUNT_TOO_LOW'"
            i18n="Budget is too small Hireme Error"
          >
            Budget is too small.
          </fl-text>

          <fl-text
            *ngSwitchCase="'COMMITMENT_INTERVAL_INVALID'"
            i18n="Commitment Interval Invalid Hireme Error"
          >
            Wrong commitment interval for hourly project.
          </fl-text>

          <fl-text
            *ngSwitchCase="'COMMITMENT_INVALID'"
            i18n="Commitment Invalid Hireme Error"
          >
            Wrong commitment on project.
          </fl-text>

          <fl-text
            *ngSwitchCase="'CURRENCY_ID_INVALID'"
            i18n="Currency ID Invalid Hireme Error"
          >
            Invalid currency ID.
          </fl-text>

          <fl-text
            *ngSwitchCase="'DURATION_INVALID'"
            i18n="Duration Invalid Hireme Error"
          >
            Wrong duration on project.
          </fl-text>

          <fl-text
            *ngSwitchCase="'EMPLOYER_NOT_FOUND'"
            i18n="Employer Not Found Hireme Error"
          >
            Failed on fetching the employer info.
          </fl-text>

          <fl-text
            *ngSwitchCase="'FREELANCER_NOT_FOUND'"
            i18n="Freelancer Not Found Hireme Error"
          >
            Failed on fetching the freelancer info.
          </fl-text>

          <fl-text
            *ngSwitchCase="'HIREME_BID_AMOUNT_REQUIRED'"
            i18n="Hireme Bid Amount Required Error"
          >
            Budget for a hire-me project is required.
          </fl-text>

          <fl-text
            *ngSwitchCase="'HIREME_FREELANCER_HAS_NO_JOBS'"
            i18n="Hireme Freelancer Has No Jobs Error"
          >
            The freelancer has no skills.
          </fl-text>

          <fl-text
            *ngSwitchCase="'HIREME_FREELANCER_IS_SELF'"
            i18n="Hireme Freelancer Is Self Error"
          >
            You cannot hire yourself.
          </fl-text>

          <fl-text
            *ngSwitchCase="'HIREME_INITIAL_BID_REQUIRED'"
            i18n="Hireme Initial Bid Required Error"
          >
            Hireme project needs initial bid with bidder id and amount.
          </fl-text>

          <fl-text
            *ngSwitchCase="'HIREME_PROJECT_POST_LIMIT_REACHED'"
            i18n="Hireme Project Post Limit Reached Error"
          >
            Limit of posting hire-me projects have been exceeded.
          </fl-text>

          <fl-text
            *ngSwitchCase="'JOB_ID_INVALID'"
            i18n="Job Id Invalid Hireme Error"
          >
            Job ID can not be found.
          </fl-text>

          <fl-text
            *ngSwitchCase="'PROJECT_DESCRIPTION_CONTAINS_CONTACT_DETAILS'"
            i18n="Project Description Contains Contact Details Hireme Error"
          >
            Contact details are not allowed in project description.
          </fl-text>

          <fl-text
            *ngSwitchCase="'PROJECT_DESCRIPTION_INVALID'"
            i18n="Project Description Invalid Hireme Error"
          >
            The project description cannot be empty.
          </fl-text>

          <fl-text
            *ngSwitchCase="'PROJECT_DESCRIPTION_LENGTH_INVALID'"
            i18n="Project Description Length Invalid Hireme Error"
          >
            Invalid project description length.
          </fl-text>

          <fl-text
            *ngSwitchCase="'PROJECT_JOBS_REQUIRED'"
            i18n="Project Jobs Required Hireme Error"
          >
            You cannot hire this freelancer because they have not listed their
            skills yet.
          </fl-text>

          <fl-text
            *ngSwitchCase="'PROJECT_PERIOD_INVALID'"
            i18n="Project Period Invalid Hireme Error"
          >
            Project period is incorrect for fixed type project.
          </fl-text>

          <fl-text
            *ngSwitchCase="'PROJECT_TITLE_CONTAINS_CONTACT_DETAILS'"
            i18n="Project Title Contains Contact Details"
          >
            Contact details are not allowed in project title.
          </fl-text>

          <fl-text
            *ngSwitchCase="'PROJECT_TITLE_INVALID'"
            i18n="Project Title Invalid"
          >
            The project title cannot be empty.
          </fl-text>

          <fl-text
            *ngSwitchCase="'PROJECT_TITLE_NOT_UNIQUE'"
            i18n="Project Title Not Unique Hireme Error"
          >
            Duplicate project title.
          </fl-text>

          <fl-text
            *ngSwitchCase="'PROJECT_TYPE_INVALID'"
            i18n="Project Type Invalid Hireme Error"
          >
            Unknown project type.
          </fl-text>

          <fl-text
            *ngSwitchCase="'FREELANCER_RESTRICTED_FROM_BIDDING'"
            i18n="Freelancer is restricted from bidding Hireme Error"
          >
            Sorry, this freelancer can not be hired at this moment.
          </fl-text>

          <fl-text
            *ngSwitchCase="'FREELANCER_NEGATIVE_BALANCE'"
            i18n="Freelancer negative balance hireme error message"
          >
            Sorry, this freelancer can not be hired at this moment.
          </fl-text>

          <fl-text
            *ngSwitchCase="'HIREME_HOURLY_RATE_BELOW_MINIMUM'"
            i18n="Hourly rate is lesser than minimum wage"
          >
            Please set the hourly rate above the freelancer's minimum hourly
            wage.
          </fl-text>

          <fl-text *ngSwitchDefault i18n="Default Hireme Error">
            Unknown Project Error. Request id: {{ error.requestId }}
          </fl-text>
        </ng-container>
      </fl-banner-alert>
    </ng-container>
  `,
  styleUrls: ['./hire-me-errors.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HireMeErrorsComponent {
  BannerAlertType = BannerAlertType;
  ErrorCodeApi = ErrorCodeApi;
  Margin = Margin;

  @Input() error: any; // FIXME Remove `any`
  @Input() userId: number;
  @Input() sellerId: number;
}
