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
        i18n="Delete course modal header"
        [size]="TextSize.MID"
        [headingType]="HeadingType.H4"
        [flMarginBottom]="Margin.SMALL"
      >
        Delete your course
      </fl-heading>
    </fl-bit>
    <fl-bit class="MainBody">
      <fl-text i18n="Delete course modal body" [flMarginBottom]="Margin.SMALL">
        Once you delete the course, you will lose all content.
      </fl-text>
    </fl-bit>
    <div class="ActionContainer">
      <fl-button
        class="ActionButton"
        i18n="Delete course modal cancel button"
        flTrackingLabel="CancelDelete"
        [color]="ButtonColor.DEFAULT"
        [flMarginRight]="Margin.SMALL"
        (click)="cancel()"
      >
        Cancel
      </fl-button>
      <fl-button
        class="ActionButton"
        flTrackingLabel="ConfirmDelete"
        i18n="Delete course modal delete button"
        [color]="ButtonColor.SECONDARY"
        (click)="confirm()"
      >
        Delete
      </fl-button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./course-confirm-delete-modal.scss'],
})
export class CourseConfirmDeleteModalComponent {
  Margin = Margin;
  BannerAlertType = BannerAlertType;
  ButtonColor = ButtonColor;
  TextSize = TextSize;
  HeadingType = HeadingType;

  constructor(private modalRef: ModalRef<CourseConfirmDeleteModalComponent>) {}

  confirm() {
    this.modalRef.close(true);
  }

  cancel() {
    this.modalRef.close(false);
  }
}
