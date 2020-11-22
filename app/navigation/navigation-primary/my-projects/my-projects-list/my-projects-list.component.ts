import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { UserRecentProjectsAndContestsEntry } from '@freelancer/datastore/collections';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { LinkIconPosition } from '@freelancer/ui/link';
import { Margin } from '@freelancer/ui/margin';
import { PictureDisplay } from '@freelancer/ui/picture';
import { TabsDirection, TabsSize } from '@freelancer/ui/tabs';
import {
  FontWeight,
  TextAlign,
  TextSize,
  TextTransform,
} from '@freelancer/ui/text';

@Component({
  selector: 'app-my-projects-list',
  template: `
    <fl-bit>
      <fl-bit class="Heading">
        <fl-text
          i18n="My Projects heading"
          [flMarginRight]="Margin.MID"
          [size]="TextSize.XXSMALL"
          [textTransform]="TextTransform.UPPERCASE"
          [weight]="FontWeight.BOLD"
        >
          Recent Projects
        </fl-text>

        <app-my-projects-view-all
          *ngIf="recentJobs && recentJobs.length == 0"
        ></app-my-projects-view-all>
      </fl-bit>

      <fl-bit class="Body">
        <fl-tabs
          *ngIf="recentJobs?.length > 0; else noRecentJobs"
          class="List"
          [direction]="TabsDirection.COLUMN_RIGHT"
          [flMarginBottom]="Margin.SMALL"
          [size]="TabsSize.SMALL"
        >
          <fl-tab-item
            *ngFor="let recentJob of recentJobs"
            flTrackingLabel="RecentJob"
            flTrackingReferenceType="{{ recentJob.type }}_id"
            flTrackingReferenceId="{{ recentJob.projectOrContestId }}"
            [title]="recentJob.name"
            [routerLink]="recentJob.urlPart"
            [iconName]="'ui-computer-outline'"
            [preserveBackButton]="false"
          ></fl-tab-item>
        </fl-tabs>

        <app-my-projects-view-all
          *ngIf="recentJobs?.length > 0"
          class="ViewAll"
        ></app-my-projects-view-all>
      </fl-bit>
    </fl-bit>

    <ng-template #noRecentJobs>
      <fl-picture
        class="EmptyImg"
        alt=" Empty My Projects Image"
        i18n-alt="My Projects empty my projects image"
        [alignCenter]="true"
        [display]="PictureDisplay.BLOCK"
        [flMarginBottom]="Margin.SMALL"
        [src]="'navigation/my-projects/empty-my-projects.svg'"
      >
      </fl-picture>
      <fl-text
        i18n="My Projects empty my projects"
        [size]="TextSize.XXSMALL"
        [textAlign]="TextAlign.CENTER"
      >
        You do not have any active projects.
      </fl-text>
      <fl-text
        i18n="My Projects action"
        [size]="TextSize.XXSMALL"
        [textAlign]="TextAlign.CENTER"
      >
        <fl-link
          flTrackingLabel="MyProjects-PostProject"
          [link]="'/post-project'"
          [size]="TextSize.XXSMALL"
        >
          Create one
        </fl-link>
        to get started!
      </fl-text>
    </ng-template>
  `,
  styleUrls: ['./my-projects-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyProjectsListComponent {
  TextSize = TextSize;
  FontWeight = FontWeight;
  IconColor = IconColor;
  IconSize = IconSize;
  LinkIconPosition = LinkIconPosition;
  Margin = Margin;
  PictureDisplay = PictureDisplay;
  TabsDirection = TabsDirection;
  TabsSize = TabsSize;
  TextAlign = TextAlign;
  TextTransform = TextTransform;

  readonly MAX_LENGTH = 35;

  private _recentJobs: ReadonlyArray<UserRecentProjectsAndContestsEntry>;

  @Input()
  set recentJobs(jobs: ReadonlyArray<UserRecentProjectsAndContestsEntry>) {
    if (jobs) {
      this._recentJobs = jobs.map(job => {
        // TODO: Truncate using mixin when
        // tabs component is made declarative in T68216
        const truncatedText = `${job.name.slice(0, this.MAX_LENGTH)}...`;

        return {
          ...job,
          name: job.name.length > this.MAX_LENGTH ? truncatedText : job.name,
        };
      });
    }
  }

  get recentJobs() {
    return this._recentJobs;
  }
}
