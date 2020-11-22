import { Component, Input } from '@angular/core';
import { ModalRef } from '@freelancer/ui';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { TextSize } from '@freelancer/ui/text';

export enum ConfirmationType {
  DELETE_POST,
}

export enum ConfirmationResult {
  ACCEPT,
  CANCEL,
}

@Component({
  selector: 'app-group-confirmation',
  template: `
    <fl-bit class="ConfirmationModal" flTrackingSection="GroupConfirmation">
      <fl-heading
        [flMarginBottom]="Margin.XXSMALL"
        [flMarginBottomDesktop]="Margin.XSMALL"
        [headingType]="HeadingType.H1"
        [ngSwitch]="confirmationType"
        [size]="TextSize.MID"
        [sizeTablet]="TextSize.LARGE"
        [sizeDesktop]="TextSize.MID"
      >
        <ng-container
          *ngSwitchCase="ConfirmationType.DELETE_POST"
          i18n="Delete Post Confirmation Modal Header Text"
        >
          Delete Post
        </ng-container>
      </fl-heading>
      <fl-text
        [flMarginBottom]="Margin.MID"
        [flMarginBottomDesktop]="Margin.SMALL"
        [ngSwitch]="confirmationType"
        [size]="TextSize.XXSMALL"
        [sizeTablet]="TextSize.MID"
        [sizeDesktop]="TextSize.XSMALL"
      >
        <ng-container
          *ngSwitchCase="ConfirmationType.DELETE_POST"
          i18n="Delete Post Confirmation Text"
        >
          Do you wish to delete this post?
        </ng-container>
      </fl-text>
      <fl-bit class="ConfirmationModal-actionContainer">
        <fl-button
          flTrackingLabel="Cancel"
          i18n="Group Confirmation Cancel"
          [flMarginRight]="Margin.SMALL"
          [color]="ButtonColor.TRANSPARENT_DARK"
          [size]="ButtonSize.SMALL"
          [sizeTablet]="ButtonSize.LARGE"
          [sizeDesktop]="ButtonSize.SMALL"
          (click)="handleCancelClick()"
        >
          Cancel
        </fl-button>
        <fl-button
          flTrackingLabel="Accept"
          [color]="ButtonColor.SECONDARY"
          [ngSwitch]="confirmationType"
          [size]="ButtonSize.SMALL"
          [sizeTablet]="ButtonSize.LARGE"
          [sizeDesktop]="ButtonSize.SMALL"
          (click)="handleAcceptClick()"
        >
          <ng-container
            *ngSwitchCase="ConfirmationType.DELETE_POST"
            i18n="Delete Post Confirmation Modal Delete Button"
          >
            Delete
          </ng-container>
        </fl-button>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./group-confirmation-modal.component.scss'],
})
export class GroupConfirmationModalComponent {
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  ConfirmationType = ConfirmationType;
  HeadingType = HeadingType;
  Margin = Margin;
  TextSize = TextSize;

  @Input() confirmationType: ConfirmationType;

  constructor(private modalRef: ModalRef<GroupConfirmationModalComponent>) {}

  handleAcceptClick(): void {
    this.modalRef.close(ConfirmationResult.ACCEPT);
  }

  handleCancelClick(): void {
    this.modalRef.close(ConfirmationResult.CANCEL);
  }
}
