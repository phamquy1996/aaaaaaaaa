import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Margin } from '@freelancer/ui/margin';
import { SpinnerType } from '@freelancer/ui/spinner';

@Component({
  template: `
    <fl-bit class="ProjectLoadingModal">
      <fl-spinner
        flTrackingSection="PreparingNewProjectModal"
        flTrackingLabel="PreparingNewProjectSpinner"
        [type]="SpinnerType.HOURGLASS"
        [flMarginBottom]="Margin.SMALL"
      ></fl-spinner>
      <fl-text i18n="Preparing new project text">
        Preparing your new project...
      </fl-text>
    </fl-bit>
  `,
  styleUrls: ['./employer-new-rehire-project-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployerNewRehireProjectModalComponent {
  SpinnerType = SpinnerType;
  Margin = Margin;
}
