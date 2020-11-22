import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Category, Skill } from '@freelancer/datastore/collections';
import { HeadingType } from '@freelancer/ui/heading';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { ListItemPadding } from '@freelancer/ui/list-item';
import { Margin } from '@freelancer/ui/margin';
import { TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'fl-skills-category',
  template: `
    <fl-heading
      class="SkillsHeading"
      [headingType]="HeadingType.H3"
      [size]="TextSize.XSMALL"
    >
      <fl-icon
        flTrackingLabel="ShowCategories"
        [name]="'ui-arrow-left-alt'"
        [flHideDesktop]="true"
        [flMarginRight]="Margin.XSMALL"
        [size]="IconSize.XSMALL"
        (click)="showSkillCategories()"
      ></fl-icon>

      <ng-container
        *ngIf="selectedCategory || searchText; else noCategorySelected"
      >
        <ng-container *ngIf="selectedCategory && !searchText">
          {{ selectedCategory?.name }}
        </ng-container>

        <ng-container
          *ngIf="searchText"
          i18n="Search results for searched text heading"
        >
          Search results for "{{ searchText }}"
        </ng-container>
      </ng-container>

      <ng-template #noCategorySelected>
        <ng-container i18n="No category selected heading">
          No category selected
        </ng-container>
      </ng-template>
    </fl-heading>

    <perfect-scrollbar class="SkillsContent">
      <fl-list
        *ngIf="!loadingSkillSearch; else loading"
        [bottomBorder]="true"
        [clickable]="true"
        [padding]="ListItemPadding.SMALL"
      >
        <ng-container
          *ngIf="selectedCategory || searchText; else noCategorySelectedMessage"
        >
          <ng-container *ngIf="filteredSkills?.length > 0; else emptyState">
            <fl-list-item
              *ngFor="let skill of filteredSkills; trackBy: trackBySkillId"
              (click)="handleClick(skill)"
            >
              <fl-bit class="SkillsContent-details">
                <fl-text i18n="Skill label" class="SkillsContent-text">
                  {{ skill.name }}
                  <ng-container *ngIf="skill.activeProjectCount > 0">
                    ({{ skill.activeProjectCount }} jobs)
                  </ng-container>
                </fl-text>

                <fl-icon
                  *ngIf="selectedSkills?.includes(skill); else notSelected"
                  [name]="'ui-tick'"
                  [color]="IconColor.SUCCESS"
                  [size]="IconSize.SMALL"
                ></fl-icon>

                <ng-template #notSelected>
                  <fl-icon
                    class="SkillsContent-icon"
                    [name]="'ui-plus-thin'"
                    [color]="IconColor.PRIMARY"
                    [size]="IconSize.XSMALL"
                  ></fl-icon>
                </ng-template>
              </fl-bit>
            </fl-list-item>
          </ng-container>

          <ng-template #emptyState>
            <fl-text i18n="Empty skills message" class="SkillsContent-message">
              No skills were found
            </fl-text>
          </ng-template>
        </ng-container>

        <ng-template #noCategorySelectedMessage>
          <fl-text
            i18n="No selected category message"
            class="SkillsContent-message"
          >
            Select a category to start populating the skills
          </fl-text>
        </ng-template>
      </fl-list>
    </perfect-scrollbar>

    <ng-template #loading>
      <fl-spinner
        class="SkillsLoading"
        flTrackingLabel="SkillsLoadingSpinner"
      ></fl-spinner>
    </ng-template>
  `,
  styleUrls: ['./skills-category.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsCategoryComponent {
  HeadingType = HeadingType;
  IconColor = IconColor;
  IconSize = IconSize;
  ListItemPadding = ListItemPadding;
  Margin = Margin;
  TextSize = TextSize;

  @Input() filteredSkills?: ReadonlyArray<Skill>;
  @Input() loadingSkillSearch?: boolean;
  @Input() maxSkillsLimit: number;
  @Input() searchText?: string;
  @Input() selectedCategory?: Category;
  @Input() selectedSkills?: ReadonlyArray<Skill>;

  @Output() deselectSkill = new EventEmitter<Skill>();
  @Output() selectSkill = new EventEmitter<Skill>();
  @Output() showCategories = new EventEmitter<boolean>();
  @Output() showMaxSkillsLimit = new EventEmitter();

  handleClick(skill: Skill) {
    if (!this.selectedSkills) {
      return;
    }

    if (this.selectedSkills.includes(skill)) {
      this.deselectSkill.emit(skill);
      return;
    }

    if (this.selectedSkills.length < this.maxSkillsLimit) {
      this.selectSkill.emit(skill);
    } else if (this.selectedSkills.length >= this.maxSkillsLimit) {
      this.showMaxSkillsLimit.emit();
    }
  }

  showSkillCategories() {
    this.showCategories.emit(true);
  }

  trackBySkillId(index: number, skill: Skill): number {
    return skill.id;
  }
}
