import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DriveFile } from '@freelancer/datastore/collections';
import { ModalRef } from '@freelancer/ui';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { HeadingType, HeadingWeight } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { FontType, TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'app-project-files-rename-modal',
  template: `
    <fl-bit flTrackingSection="ProjectFileRenameModal">
      <fl-heading
        i18n="File rename modal title"
        [flMarginBottom]="Margin.XSMALL"
        [headingType]="HeadingType.H3"
        [size]="TextSize.SMALL"
        [weight]="HeadingWeight.BOLD"
      >
        Rename File
      </fl-heading>
      <fl-label i18n="Label for filename input" [for]="'filename-input'">
        Filename
      </fl-label>
      <fl-input
        flTrackingLabel="RenameFileInput"
        [id]="'filename-input'"
        [control]="control"
        [flMarginBottom]="Margin.MID"
      ></fl-input>
      <fl-bit class="ButtonsContainer">
        <fl-button
          flTrackingLabel="CloseRenameFileModalButton"
          i18n="Button to cancel changes"
          [color]="ButtonColor.DEFAULT"
          [flMarginRight]="Margin.XXSMALL"
          [size]="ButtonSize.SMALL"
          (click)="closeModal(false)"
        >
          Cancel
        </fl-button>
        <fl-button
          flTrackingLabel="SaveRenameFileModalButton"
          i18n="Button to save changes"
          [color]="ButtonColor.SECONDARY"
          [size]="ButtonSize.SMALL"
          (click)="closeModal(true)"
        >
          Save
        </fl-button>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./project-file-rename-modal.component.scss'],
})
export class ProjectFileRenameModalComponent implements OnInit {
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  FontType = FontType;
  TextSize = TextSize;
  HeadingType = HeadingType;
  HeadingWeight = HeadingWeight;
  Margin = Margin;

  @Input() file: DriveFile;

  control = new FormControl();

  constructor(private modalRef: ModalRef<ProjectFileRenameModalComponent>) {}

  ngOnInit() {
    this.control.setValue(this.file.displayName);
  }

  closeModal(saveChanges: boolean) {
    if (!saveChanges) {
      this.modalRef.close();
      return;
    }

    const params: FileRenameRequest = {
      fileId: this.file.id,
      newName: this.control.value,
    };
    this.modalRef.close(params);
  }
}

export interface FileRenameRequest {
  fileId: number;
  newName: string;
}
