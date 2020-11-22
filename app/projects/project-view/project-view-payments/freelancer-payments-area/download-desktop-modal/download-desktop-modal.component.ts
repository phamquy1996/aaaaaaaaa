import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ProjectViewUser } from '@freelancer/datastore/collections';
import { ModalRef } from '@freelancer/ui';
import { ButtonColor } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { FontType, FontWeight, TextSize } from '@freelancer/ui/text';

@Component({
  template: `
    <fl-bit class="ModalBody" flTrackingSection="DownloadDesktopModal">
      <fl-heading
        i18n="Download desktop app modal title"
        [headingType]="HeadingType.H3"
        [size]="TextSize.LARGE"
        [flMarginBottom]="Margin.SMALL"
      >
        Download Desktop App
      </fl-heading>
      <fl-text
        i18n="Download desktop app modal body paragraph"
        [flMarginBottom]="Margin.MID"
      >
        The desktop app is the most efficient way of working on Freelancer.com.
        The Freelancer desktop app automatically tracks your worked hours and
        proves to
        <fl-text [weight]="FontWeight.BOLD" [fontType]="FontType.SPAN">
          {{ employer.displayName }}
        </fl-text>
        that you have been working on their tasks.
      </fl-text>
      <fl-text [flMarginBottom]="Margin.MID">
        <ng-container i18n="Download desktop app modal body paragraph">
          Alternatively, you can manually track your hours from the Tracking
          tab.
        </ng-container>
        <fl-link
          i18n="Learn more about desktop app link"
          flTrackingLabel="LearnMoreLink"
          [link]="'/desktop-app'"
          [newTab]="true"
          [queryParams]="{ referrer: 'award-accept' }"
          (click)="closeModal()"
        >
          Learn More
        </fl-link>
      </fl-text>
      <fl-bit class="ButtonGroup">
        <fl-button
          i18n="Maybe later button"
          flTrackingLabel="MaybeLaterButton"
          [color]="ButtonColor.DEFAULT"
          [flMarginRight]="Margin.SMALL"
          (click)="closeModal()"
        >
          Maybe Later
        </fl-button>
        <!-- FIXME: not sure why but if redirecting the
          users to a new tab, the modal cannot be closed
          immediately. -->
        <fl-button
          i18n="Download desktop app button"
          flTrackingLabel="DownloadDesktopAppButton"
          [color]="ButtonColor.SECONDARY"
          [link]="'/desktop-app'"
          [newTab]="true"
          [queryParams]="{ referrer: 'award-accept' }"
          (click)="closeModal()"
        >
          Download Desktop App
        </fl-button>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./download-desktop-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DownloadDesktopModalComponent {
  ButtonColor = ButtonColor;
  FontType = FontType;
  FontWeight = FontWeight;
  TextSize = TextSize;
  HeadingType = HeadingType;
  Margin = Margin;

  @Input() employer: ProjectViewUser;

  constructor(private modalRef: ModalRef<DownloadDesktopModalComponent>) {}

  closeModal() {
    this.modalRef.close();
  }
}
