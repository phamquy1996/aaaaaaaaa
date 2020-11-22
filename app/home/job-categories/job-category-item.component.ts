import { Component, Input } from '@angular/core';
import { DirectoryItemAlignment } from '@freelancer/ui/directory-item';
import { HeadingType } from '@freelancer/ui/heading';
import { LinkColor } from '@freelancer/ui/link';
import { Margin } from '@freelancer/ui/margin';
import { TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'app-job-category-item',
  template: `
    <fl-directory-item
      class="JobCategoryItem"
      [alignment]="DirectoryItemAlignment.TOP"
      [flMarginBottom]="Margin.XXXSMALL"
    >
      <fl-link
        [flTrackingLabel]="qtsLabel"
        [link]="'hire' + link"
        [size]="TextSize.SMALL"
        [color]="LinkColor.INHERIT"
      >
        {{ displayName }}
      </fl-link>
    </fl-directory-item>
  `,
  styleUrls: ['./job-category-item.component.scss'],
})
export class HomePageJobCategoryItemComponent {
  DirectoryItemAlignment = DirectoryItemAlignment;
  HeadingType = HeadingType;
  LinkColor = LinkColor;
  Margin = Margin;
  TextSize = TextSize;

  @Input() qtsLabel: string;
  @Input() link: string;
  @Input() displayName: string;
}
