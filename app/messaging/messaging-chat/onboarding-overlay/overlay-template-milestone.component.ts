import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  HourlyContract,
  Project,
  User,
} from '@freelancer/datastore/collections';
import { FontType, TextSize } from '@freelancer/ui/text';
import { ProjectTypeApi } from 'api-typings/projects/projects';

@Component({
  selector: 'app-overlay-template-milestone',
  template: `
    <ng-container *ngIf="isHourlyProject; else default">
      <ng-container *ngIf="!project.local">
        <fl-bit class="OnboardingOverlayTitle">
          <fl-text
            [size]="TextSize.SMALL"
            i18n="Chatbox overlay hourly-project title"
          >
            Track time to get paid
          </fl-text>
        </fl-bit>
        <fl-bit class="OnboardingOverlayBody">
          <fl-text i18n="Chatbox overlay hourly-project body">
            If {{ otherUser.displayName }} has enabled time tracking, simply
            track time with the Desktop App or from the Time Tracking tab to get
            paid.
          </fl-text>
        </fl-bit>
      </ng-container>

      <ng-container *ngIf="project.local">
        <fl-bit class="OnboardingOverlayTitle">
          <fl-text
            [size]="TextSize.SMALL"
            i18n="Chatbox overlay hourly-local-project title"
          >
            Track location to get paid
          </fl-text>
        </fl-bit>
        <fl-bit class="OnboardingOverlayBody">
          <fl-text
            *ngIf="project.local"
            i18n="Chatbox overlay hourly-local-project body"
          >
            For {{ otherUser.displayName }} to see your location, you need to
            use our
            <fl-link
              flTrackingLabel="DownloadMobileAppLink"
              [link]="MOBILE_APP_DOWNLOAD_LINK"
            >
              mobile app
            </fl-link>
            while on the job.
          </fl-text>
        </fl-bit>
      </ng-container>
    </ng-container>
    <ng-template #default>
      <fl-bit class="OnboardingOverlayTitle">
        <fl-text [size]="TextSize.SMALL" i18n="Chatbox overlay title">
          Only ask for payment to be released after you have completed work
        </fl-text>
      </fl-bit>
      <fl-bit class="OnboardingOverlayBody">
        <fl-text i18n="Chatbox overlay body">
          Ask {{ otherUser.displayName }} to create milestone payments for work
          you agree to complete, and only ask for it to be released once you
          complete the task.
        </fl-text>
      </fl-bit>
    </ng-template>
  `,
  styleUrls: ['onboarding-overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverlayTemplateMilestoneComponent implements OnChanges {
  FontType = FontType;
  TextSize = TextSize;

  @Input() otherUser: User;
  @Input() project: Project;
  @Input() hourlyContracts: ReadonlyArray<HourlyContract>;

  isHourlyProject: boolean;

  readonly MOBILE_APP_DOWNLOAD_LINK = 'https://bnc.lt/Ed5l/VcovUszaWr';

  ngOnChanges(changes: SimpleChanges): void {
    // Project type can be 'hourly' but still be awarded as fixed. Therefore only
    // way to check if project is truly hourly is to check if it contains hourly
    // contract
    if ('hourlyContracts' in changes || 'project' in changes) {
      this.isHourlyProject =
        this.project.type === ProjectTypeApi.HOURLY &&
        this.hourlyContracts?.some(
          contract => contract.projectId === this.project.id,
        );
    }
  }
}
