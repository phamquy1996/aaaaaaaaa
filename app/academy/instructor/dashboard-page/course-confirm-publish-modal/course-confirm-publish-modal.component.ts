import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ModalRef } from '@freelancer/ui';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { ButtonColor } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { TextSize } from '@freelancer/ui/text';

@Component({
  template: `
    <fl-bit class="Header" flTrackingSection="CourseDeleteModal">
      <fl-heading
        i18n="Publish course modal header"
        [size]="TextSize.MID"
        [headingType]="HeadingType.H4"
        [flMarginBottom]="Margin.SMALL"
      >
        Publish your course
      </fl-heading>
    </fl-bit>
    <fl-bit class="MainBody">
      <fl-text i18n="Publish course modal body" [flMarginBottom]="Margin.SMALL">
        You're almost there! Once published, your course will be live
        immediately and students will be able to enroll. A published course is
        still editable and enrolled students will see these changes.
      </fl-text>
    </fl-bit>
    <div class="ActionContainer">
      <fl-button
        class="ActionButton"
        i18n="Publish course modal cancel button"
        flTrackingLabel="CancelPublish"
        [color]="ButtonColor.DEFAULT"
        [flMarginRight]="Margin.SMALL"
        (click)="cancel()"
      >
        Cancel
      </fl-button>
      <fl-button
        class="ActionButton"
        i18n="Publish course modal publish button"
        flTrackingLabel="ConfirmPublish"
        [color]="ButtonColor.SECONDARY"
        (click)="confirm()"
      >
        Publish
      </fl-button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./course-confirm-publish-modal.scss'],
})
export class CourseConfirmPublishModalComponent {
  Margin = Margin;
  BannerAlertType = BannerAlertType;
  ButtonColor = ButtonColor;
  TextSize = TextSize;
  HeadingType = HeadingType;

  constructor(private modalRef: ModalRef<CourseConfirmPublishModalComponent>) {}

  confirm() {
    this.modalRef.close(true);
  }

  cancel() {
    this.modalRef.close(false);
  }
}
