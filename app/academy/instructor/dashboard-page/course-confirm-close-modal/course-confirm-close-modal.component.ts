import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ModalRef } from '@freelancer/ui';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { ButtonColor } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { TextSize } from '@freelancer/ui/text';

@Component({
  template: `
    <fl-bit class="Header" flTrackingSection="CourseCloseModal">
      <fl-heading
        i18n="Close course modal header"
        [size]="TextSize.MID"
        [headingType]="HeadingType.H4"
        [flMarginBottom]="Margin.SMALL"
      >
        Close your course
      </fl-heading>
    </fl-bit>
    <fl-bit class="MainBody">
      <fl-text i18n="Close course modal body" [flMarginBottom]="Margin.SMALL">
        Once you close the course, you will no longer be able to publish it.
      </fl-text>
    </fl-bit>
    <div class="ActionContainer">
      <fl-button
        class="ActionButton"
        i18n="Close course modal cancel button"
        flTrackingLabel="CancelClose"
        [color]="ButtonColor.DEFAULT"
        [flMarginRight]="Margin.SMALL"
        (click)="cancel()"
      >
        Cancel
      </fl-button>
      <fl-button
        class="ActionButton"
        i18n="Close course modal close button"
        flTrackingLabel="ConfirmClose"
        [color]="ButtonColor.SECONDARY"
        (click)="confirm()"
      >
        Close
      </fl-button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./course-confirm-close-modal.scss'],
})
export class CourseConfirmCloseModalComponent {
  Margin = Margin;
  BannerAlertType = BannerAlertType;
  ButtonColor = ButtonColor;
  TextSize = TextSize;
  HeadingType = HeadingType;

  constructor(private modalRef: ModalRef<CourseConfirmCloseModalComponent>) {}

  confirm() {
    this.modalRef.close(true);
  }

  cancel() {
    this.modalRef.close(false);
  }
}
