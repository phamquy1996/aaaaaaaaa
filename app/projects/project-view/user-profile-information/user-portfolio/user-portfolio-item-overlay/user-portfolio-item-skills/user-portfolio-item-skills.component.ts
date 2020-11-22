import { Component, Input } from '@angular/core';
import { Skill } from '@freelancer/datastore/collections';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { Margin } from '@freelancer/ui/margin';
import { SpinnerColor, SpinnerSize } from '@freelancer/ui/spinner';
import { FontColor, TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'app-user-portfolio-item-skills',
  template: `
    <fl-bit *ngIf="itemSkills; else loadingState" [flMarginBottom]="Margin.MID">
      <fl-text
        *ngIf="itemSkills.length > 0"
        class="Skill-title"
        i18n="Skill title label"
        [size]="TextSize.XXSMALL"
        [color]="FontColor.MID"
        [flMarginBottom]="Margin.XSMALL"
      >
        Skills
      </fl-text>
      <fl-bit class="Skill-button">
        <fl-button
          *ngFor="let skill of itemSkills"
          flTrackingLabel="SkillNavigate"
          i18n="Skill name label"
          [color]="ButtonColor.TRANSPARENT_DARK"
          [flMarginBottom]="Margin.XXXSMALL"
          [flMarginRight]="Margin.XXXSMALL"
          [link]="'/freelancers/skills/' + skill.seoUrl"
          [size]="ButtonSize.MINI"
        >
          {{ skill.name }}
        </fl-button>
      </fl-bit>
    </fl-bit>
    <ng-template #loadingState>
      <fl-bit class="LoadingContainer" [flMarginBottom]="Margin.MID">
        <fl-spinner
          flTrackingLabel="PVPExpandedBidSkillsInitialisationSpinner"
          [color]="SpinnerColor.GRAY"
          [size]="SpinnerSize.SMALL"
        ></fl-spinner>
      </fl-bit>
    </ng-template>
  `,
  styleUrls: ['user-portfolio-item-skills.component.scss'],
})
export class UserPortfolioItemSkillsComponent {
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  FontColor = FontColor;
  TextSize = TextSize;
  Margin = Margin;
  SpinnerColor = SpinnerColor;
  SpinnerSize = SpinnerSize;

  @Input() itemSkills: ReadonlyArray<Skill>;
}
