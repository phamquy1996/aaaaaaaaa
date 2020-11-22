import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ProjectUpgradeFees } from '@freelancer/datastore/collections';
import { ModalRef } from '@freelancer/ui';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'app-project-manager-sidebar-modal',
  template: `
    <fl-bit
      class="ProjectManagerSidebarModal"
      flTrackingSection="ProjectManagementSidebarModal"
    >
      <fl-bit [flMarginBottom]="Margin.MID">
        <fl-picture
          class="ProjectManagerIcon"
          alt="Technical Co-pilot icon"
          i18n-alt="Technical Co-pilot icon"
          src="project-management/project-manager-icon-blue.svg"
        ></fl-picture>
      </fl-bit>
      <fl-heading
        i18n="Project manager modal title"
        [headingType]="HeadingType.H3"
        [size]="TextSize.LARGE"
        [flMarginBottom]="Margin.MID"
      >
        Save time and ensure your project is a success
      </fl-heading>
      <fl-bit [flMarginBottom]="Margin.LARGE">
        <fl-text
          i18n="Project manager modal description"
          [flMarginBottom]="Margin.XSMALL"
        >
          Let our experts split your project into milestones, prepare
          specifications, answer technical questions, manage your freelancers
          and much more.
        </fl-text>
        <fl-text i18n="Project manager modal pricing description">
          Having a Technical Co-pilot will cost you only
          {{
            upgradeFees.projectManagementPrice
              | flCurrency: upgradeFees.currency.code
          }}
          per hour. You can cancel any time and we'll only spend as much time on
          it as agreed with you.
        </fl-text>
      </fl-bit>
      <fl-button
        i18n="Project manager modal upgrade confirmation"
        flTrackingLabel="ProjectManagerSidebarModalUpgradeButton"
        [color]="ButtonColor.SECONDARY"
        [size]="ButtonSize.LARGE"
        (click)="handleUpgradeConfirmation()"
      >
        Start a 30 minute free trial
      </fl-button>
    </fl-bit>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./project-manager-sidebar-modal.component.scss'],
})
export class ProjectManagerSidebarModalComponent {
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  TextSize = TextSize;
  HeadingType = HeadingType;
  Margin = Margin;

  @Input() upgradeFees: ProjectUpgradeFees;

  constructor(
    private modalRef: ModalRef<ProjectManagerSidebarModalComponent>,
  ) {}

  handleUpgradeConfirmation() {
    this.modalRef.close(true);
  }
}
