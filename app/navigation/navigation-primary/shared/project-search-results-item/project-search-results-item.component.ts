import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  SearchActiveProject,
  SearchKeywordProject,
} from '@freelancer/datastore/collections';
import { IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { TagType } from '@freelancer/ui/tag';
import { FontColor, FontType, FontWeight, TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'app-project-search-results-item',
  template: `
    <fl-button
      [flTrackingLabel]="trackingLabel"
      [display]="'block'"
      [link]="'/projects/' + project?.id"
    >
      <fl-bit class="ResultsItemContainer">
        <fl-icon
          [flHideMobile]="true"
          [flMarginRight]="Margin.MID"
          [name]="'ui-computer-outline'"
        ></fl-icon>

        <fl-bit
          class="Item"
          [flMarginRight]="Margin.XSMALL"
          [flMarginRightTablet]="Margin.NONE"
        >
          <fl-bit
            class="Item-content"
            [flMarginRight]="Margin.NONE"
            [flMarginRightTablet]="Margin.MID"
          >
            <fl-text
              *ngIf="project?.title"
              [flMarginBottom]="Margin.NONE"
              [flMarginBottomTablet]="Margin.XXXSMALL"
              [weight]="FontWeight.BOLD"
            >
              {{ project.title }}
            </fl-text>
            <fl-bit [flHideMobile]="true">
              <fl-text
                class="Description"
                *ngIf="project?.description"
                [flMarginBottom]="Margin.XSMALL"
              >
                {{ project.description }}
              </fl-text>
            </fl-bit>
            <ng-container *ngIf="skillNames">
              <fl-bit class="TagsContainer" [flHideMobile]="true">
                <fl-tag
                  *ngFor="let skillName of skillNames"
                  [flMarginBottom]="Margin.XXSMALL"
                  [flMarginRight]="Margin.XXSMALL"
                  [type]="TagType.DEFAULT"
                >
                  {{ skillName }}
                </fl-tag>
              </fl-bit>
              <fl-bit [flMarginBottom]="Margin.XSMALL" [flShowMobile]="true">
                <fl-text
                  *ngFor="let skillName of skillNames; let isLast = last"
                  [color]="FontColor.MID"
                  [fontType]="FontType.SPAN"
                  [size]="TextSize.XXXSMALL"
                >
                  {{ skillName }}{{ isLast ? '' : ', ' }}
                </fl-text>
              </fl-bit>
            </ng-container>
          </fl-bit>

          <fl-bit class="Item-info">
            <ng-container
              *ngIf="!(project?.currency?.code === 'TKN'); else commitmentBlock"
            >
              <fl-text
                *ngIf="project?.budget"
                [flMarginBottom]="Margin.NONE"
                [flMarginBottomTablet]="Margin.XXSMALL"
                [flMarginRight]="Margin.XXSMALL"
                [flMarginRightTablet]="Margin.NONE"
                [size]="TextSize.XXSMALL"
                [sizeTablet]="TextSize.SMALL"
              >
                {{ project.budget | flCurrency: project.currency.code }}
              </fl-text>
            </ng-container>
            <ng-template #commitmentBlock>
              <fl-text
                *ngIf="commitment"
                [flMarginBottom]="Margin.NONE"
                [flMarginBottomTablet]="Margin.XXSMALL"
                [flMarginRight]="Margin.XXSMALL"
                [flMarginRightTablet]="Margin.NONE"
                [size]="TextSize.XXSMALL"
                [sizeTablet]="TextSize.SMALL"
                i18n="hourly commitment"
              >
                {{ commitment }} hrs
              </fl-text>
            </ng-template>
            <fl-project-status
              *ngIf="project?.frontendProjectStatus"
              [status]="project.frontendProjectStatus"
            ></fl-project-status>
          </fl-bit>
        </fl-bit>

        <fl-icon
          class="ArrowIcon"
          [flHideTablet]="true"
          [flHideDesktop]="true"
          [name]="'ui-chevron-right'"
          [size]="IconSize.XSMALL"
        ></fl-icon>
      </fl-bit>
    </fl-button>
  `,
  styleUrls: ['./project-search-results-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectSearchResultsItemComponent implements OnChanges {
  FontColor = FontColor;
  FontType = FontType;
  FontWeight = FontWeight;
  IconSize = IconSize;
  Margin = Margin;
  TagType = TagType;
  TextSize = TextSize;

  @Input() project: SearchActiveProject | SearchKeywordProject;
  @Input() trackingLabel: string;

  commitment: number | undefined;
  skillNames: ReadonlyArray<string>;

  ngOnChanges(changes: SimpleChanges) {
    if ('project' in changes && 'skills' in this.project) {
      // this means it is a SearchActiveProject
      this.skillNames = this.project.skills.map(skill => skill.name);
    } else if ('project' in changes && 'skillList' in this.project) {
      // this means it is a SearchKeywordProject
      this.skillNames = this.project.skillListArray;
      this.commitment = this.project.commitment;
    }
  }
}
