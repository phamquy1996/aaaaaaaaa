import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ModalRef } from '@freelancer/ui';
import { ButtonColor } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { TextSize } from '@freelancer/ui/text';

@Component({
  template: `
    <fl-bit class="MainBody" flTrackingSection="DiscoverPublishCancelModal">
      <fl-heading
        i18n="Cancel portfolio form"
        [size]="TextSize.MID"
        [headingType]="HeadingType.H1"
        [flMarginBottom]="Margin.XXSMALL"
      >
        Are you sure you want to cancel?
      </fl-heading>
      <fl-text
        i18n="Cancel portfolio form subtitle"
        [flMarginBottom]="Margin.LARGE"
      >
        Your portfolio item will not be saved.
      </fl-text>
      <fl-bit class="ActionContainer">
        <fl-button
          i18n="Cancel form modal redirect button"
          flTrackingLabel="CancelModalRedirectButton"
          [color]="ButtonColor.TRANSPARENT_DARK"
          [flMarginRight]="Margin.SMALL"
          (click)="confirm()"
        >
          Yes, Cancel
        </fl-button>
        <fl-button
          i18n="Cancel form modal cancel button"
          flTrackingLabel="CancelModalCancelButton"
          [color]="ButtonColor.SECONDARY"
          (click)="close()"
        >
          Go Back
        </fl-button>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./discover-publish-cancel-modal.scss'],
})
export class DiscoverPublishCancelModalComponent {
  ButtonColor = ButtonColor;
  TextSize = TextSize;
  HeadingType = HeadingType;
  Margin = Margin;

  @Input() redirectUrl?: string;

  constructor(
    private modalRef: ModalRef<DiscoverPublishCancelModalComponent>,
    private router: Router,
  ) {}

  close() {
    this.modalRef.close();
  }

  confirm() {
    if (this.redirectUrl) {
      this.router.navigate([this.redirectUrl]);
    } else {
      this.close();
    }
  }
}
