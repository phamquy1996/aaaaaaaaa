import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Skill } from '@freelancer/datastore/collections';
import { HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { TagSize, TagType } from '@freelancer/ui/tag';
import { TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'fl-skills-selected',
  template: `
    <fl-bit class="SelectedSkillsContainer">
      <fl-heading
        class="SelectedSkillsHeading"
        [headingType]="HeadingType.H3"
        [size]="TextSize.XSMALL"
      >
        <ng-container
          *ngIf="selectedSkills.length > 0; else noSelectedSkills"
          i18n="Number of selected skills heading"
        >
          {{ selectedSkills.length }} out of {{ maxSkillsLimit }} skills
          selected
        </ng-container>

        <ng-template #noSelectedSkills>
          <ng-container i18n="No selected skills heading">
            0 skills selected
          </ng-container>
        </ng-template>
      </fl-heading>

      <fl-bit class="SelectedSkillsContent">
        <ng-container
          *ngIf="selectedSkills.length > 0; else noSelectedSkillsMessage"
        >
          <perfect-scrollbar>
            <fl-text
              i18n="Number of jobs matching the skills"
              [flMarginBottom]="Margin.SMALL"
            >
              {{ matchingSkillCount }} jobs matching your skills
            </fl-text>

            <fl-tag
              *ngFor="let skill of selectedSkills; trackBy: trackBySkillId"
              [flMarginBottom]="Margin.XXSMALL"
              [flMarginRight]="Margin.XXSMALL"
              [size]="TagSize.MID"
              [type]="TagType.DISMISSABLE"
              (dismiss)="handleDeselectedSkill(skill)"
            >
              {{ skill.name }}
            </fl-tag>
          </perfect-scrollbar>
        </ng-container>

        <ng-template #noSelectedSkillsMessage>
          <fl-text i18n="No selected skills message">
            Select at least one skill to help us recommend you customized jobs.
          </fl-text>
        </ng-template>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./skills-selected.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsSelectedComponent {
  HeadingType = HeadingType;
  Margin = Margin;
  TagSize = TagSize;
  TagType = TagType;
  TextSize = TextSize;

  @Input() matchingSkillCount: number;
  @Input() maxSkillsLimit: number;
  @Input() selectedSkills: ReadonlyArray<Skill> = [];
  @Output() deselectSkill = new EventEmitter<Skill>();

  handleDeselectedSkill(skill: Skill) {
    this.deselectSkill.emit(skill);
  }

  trackBySkillId(index: number, skill: Skill): number {
    return skill.id;
  }
}
