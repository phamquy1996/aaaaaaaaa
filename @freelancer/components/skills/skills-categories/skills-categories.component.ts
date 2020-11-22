import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Category } from '@freelancer/datastore/collections';
import { HeadingType } from '@freelancer/ui/heading';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { ListItemPadding } from '@freelancer/ui/list-item';
import { Margin } from '@freelancer/ui/margin';
import { TextSize } from '@freelancer/ui/text';
import * as Rx from 'rxjs';
import { getSkillCategoryIcon } from '../skills.config';

@Component({
  selector: 'fl-skills-categories',
  template: `
    <fl-heading
      class="SkillsCategoryHeading"
      i18n="Skill categories heading"
      [headingType]="HeadingType.H3"
      [size]="TextSize.XSMALL"
    >
      Select a category
    </fl-heading>

    <perfect-scrollbar class="SkillsCategoryList">
      <fl-list [clickable]="true" [padding]="ListItemPadding.SMALL">
        <ng-container *ngIf="categories$ | async as categories; else loading">
          <fl-list-item
            *ngFor="let category of categories; trackBy: trackByCategoryId"
            flTrackingLabel="SelectCategory"
            (click)="handleSelectedCategory(category)"
          >
            <fl-bit class="SkillsCategory">
              <fl-bit
                class="SkillsCategory-content"
                [flMarginRight]="Margin.MID"
              >
                <fl-icon
                  [name]="getSkillCategoryIcon(category)"
                  [color]="IconColor.DARK"
                  [flMarginRight]="Margin.SMALL"
                ></fl-icon>

                <fl-text>
                  {{ category.name }}
                </fl-text>
              </fl-bit>

              <fl-icon
                [name]="'ui-arrow-right-alt'"
                [color]="IconColor.PRIMARY"
                [size]="IconSize.XSMALL"
              ></fl-icon>
            </fl-bit>
          </fl-list-item>
        </ng-container>

        <ng-template #loading>
          <fl-spinner
            class="SkillsCategoryList-loading"
            flTrackingLabel="SkillsCategoriesLoadingSpinner"
          ></fl-spinner>
        </ng-template>
      </fl-list>
    </perfect-scrollbar>
  `,
  styleUrls: ['./skills-categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsCategoriesComponent {
  HeadingType = HeadingType;
  IconColor = IconColor;
  IconSize = IconSize;
  ListItemPadding = ListItemPadding;
  Margin = Margin;
  TextSize = TextSize;

  @Input() categories$: Rx.Observable<ReadonlyArray<Category>>;
  @Output() selectCategory = new EventEmitter<Category>();

  getSkillCategoryIcon(category: Category) {
    return getSkillCategoryIcon(category);
  }

  handleSelectedCategory(category: Category) {
    this.selectCategory.emit(category);
  }

  trackByCategoryId(index: number, category: Category): number {
    return category.id;
  }
}
