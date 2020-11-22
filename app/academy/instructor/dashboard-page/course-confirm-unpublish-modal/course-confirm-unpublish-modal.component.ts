import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ModalRef } from '@freelancer/ui';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { ButtonColor } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { TextSize } from '@freelancer/ui/text';

@Component({
  template: `
    <fl-bit class="Header" flTrackingSection="CourseUnpublishModal">
      <fl-heading
        i18n="Unpublish course modal header"
        [size]="TextSize.MID"
        [headingType]="HeadingType.H4"
        [flMarginBottom]="Margin.SMALL"
      >
        Unpublish your course
      </fl-heading>
    </fl-bit>
    <fl-bit class="MainBody">
      <fl-text
        i18n="Unpublish course modal body"
        [flMarginBottom]="Margin.SMALL"
      >
        Unpublishing your course moves it back to draft. This will allow you to
        edit your course without affecting currently enrolled students. No new
        students will be able to enroll while the course is in draft.
      </fl-text>
    </fl-bit>
    <div class="ActionContainer">
      <fl-button
        class="ActionButton"
        i18n="Unpublish course modal cancel button"
        flTrackingLabel="CancelUnpublish"
        [color]="ButtonColor.DEFAULT"
        [flMarginRight]="Margin.SMALL"
        (click)="cancel()"
      >
        Cancel
      </fl-button>
      <fl-button
        class="ActionButton"
        i18n="Unpublish course modal unpublish button"
        flTrackingLabel="ConfirmUnpublish"
        [color]="ButtonColor.SECONDARY"
        (click)="confirm()"
      >
        Unpublish
      </fl-button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./course-confirm-unpublish-modal.scss'],
})
export class CourseConfirmUnpublishModalComponent {
  Margin = Margin;
  BannerAlertType = BannerAlertType;
  ButtonColor = ButtonColor;
  TextSize = TextSize;
  HeadingType = HeadingType;

  constructor(
    private modalRef: ModalRef<CourseConfirmUnpublishModalComponent>,
  ) {}

  confirm() {
    this.modalRef.close(true);
  }

  cancel() {
    this.modalRef.close(false);
  }
}
