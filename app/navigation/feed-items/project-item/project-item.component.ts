import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ProjectFeedEntry } from '@freelancer/datastore/collections';
import { BudgetLength } from '@freelancer/ui/budget.component';
import { IconBackdrop, IconColor } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { FontWeight, TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'app-project-item',
  template: `
    <app-feed-item
      [link]="entry.linkUrl"
      [thumbnailBackdrop]="thumbnailBackdrop"
      [thumbnailIcon]="thumbnailIcon"
      flTrackingLabel="ProjectFeedItem"
      thumbnail="icon"
      thumbnailAlt=""
      [thumbnailColor]="IconColor.LIGHT"
      [size]="size"
    >
      <app-notification-template-project-feed
        [hasNoBudget]="true"
        [event]="entry"
      ></app-notification-template-project-feed>
      <fl-bit class="EntryDetails">
        <fl-budget
          [min]="entry.minBudget"
          [max]="entry.maxBudget"
          [currencyCode]="entry.currencyCode"
          [length]="BudgetLength.LONG"
          [flMarginRight]="Margin.SMALL"
          *ngIf="entry.currencyCode !== 'TKN'"
        ></fl-budget>
        <fl-relative-time
          [date]="entry.time"
          [suffix]="true"
        ></fl-relative-time>
      </fl-bit>
    </app-feed-item>
  `,
  styleUrls: ['./project-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectItemComponent implements OnInit {
  BudgetLength = BudgetLength;
  FontWeight = FontWeight;
  IconColor = IconColor;
  Margin = Margin;
  TextSize = TextSize;

  @Input() entry: ProjectFeedEntry;
  @Input() size: 'small' | 'mid';
  thumbnailIcon: string;
  thumbnailBackdrop: IconBackdrop;

  ngOnInit() {
    switch (this.entry.type) {
      case 'contest':
      case 'xpContest': {
        this.thumbnailIcon = 'ui-trophy';
        this.thumbnailBackdrop = IconBackdrop.TERTIARY;
        break;
      }
      case 'localJobPosted': {
        this.thumbnailIcon = 'ui-pin-location';
        this.thumbnailBackdrop = IconBackdrop.PRIMARY_DARK;
        break;
      }
      case 'failingProject':
      case 'project':
      case 'recruiterProject':
      default: {
        if (this.entry.recruiter) {
          this.thumbnailIcon = 'ui-recruiter';
          this.thumbnailBackdrop = IconBackdrop.RECRUITER;
        } else {
          this.thumbnailIcon = 'ui-computer';
          this.thumbnailBackdrop = IconBackdrop.PRIMARY;
        }
        break;
      }
    }
  }
}
