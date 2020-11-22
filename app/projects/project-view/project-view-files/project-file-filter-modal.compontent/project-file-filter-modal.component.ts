import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ModalRef } from '@freelancer/ui';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { LinkWeight } from '@freelancer/ui/link';
import { Margin } from '@freelancer/ui/margin';
import { RadioOptionItem, RadioSize } from '@freelancer/ui/radio';
import { FontWeight, TextSize } from '@freelancer/ui/text';
import { required } from '@freelancer/ui/validators';
import { DriveFileTypeApi } from 'api-typings/drive/drive';
import * as Rx from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectFilterType } from '../project-filter-types';

@Component({
  template: `
    <ng-container flTrackingSection="ProjectFilterMobileModal">
      <fl-heading
        i18n="Filter Options Header"
        [size]="TextSize.MID"
        [headingType]="HeadingType.H4"
        [flMarginBottom]="Margin.MID"
      >
        Filter Files
      </fl-heading>

      <fl-bit class="Filters">
        <fl-label
          class="Label"
          i18n="Filter label"
          [flMarginBottom]="Margin.SMALL"
          [size]="TextSize.SMALL"
          [for]="'ProjectFileFilterModalRadio'"
          [weight]="FontWeight.BOLD"
        >
          By Type
        </fl-label>
        <fl-radio
          flTrackingLabel="ProjectFileFilterModalRadio"
          [options]="fileFilterOptions$ | async"
          [control]="control"
          [size]="RadioSize.SMALL"
          [flMarginBottom]="Margin.XXSMALL"
        ></fl-radio>
      </fl-bit>

      <fl-button
        flTrackingLabel="ApplyFilterButton"
        i18n="Apply Filter Button"
        [color]="ButtonColor.SECONDARY"
        [display]="'block'"
        [flMarginBottom]="Margin.SMALL"
        [size]="ButtonSize.SMALL"
        (click)="handleApply()"
      >
        Apply
      </fl-button>
      <fl-link
        class="ResetLink"
        flTrackingLabel="ResetFilterToDefaultLink"
        i18n="Reset Filter Values to Default link"
        [size]="TextSize.SMALL"
        [weight]="LinkWeight.BOLD"
        (click)="handleReset()"
      >
        Reset
      </fl-link>
    </ng-container>
  `,
  styleUrls: ['./project-file-filter-modal.scss'],
})
export class ProjectFileFilterModalComponent implements OnInit {
  Margin = Margin;
  TextSize = TextSize;
  HeadingType = HeadingType;
  FontWeight = FontWeight;
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  LinkWeight = LinkWeight;
  RadioSize = RadioSize;

  control: FormControl;

  @Input() filter$: Rx.Observable<DriveFileTypeApi | null>;
  @Input() allFilesCount$: Rx.Observable<number>;
  @Input() documentCount$: Rx.Observable<number>;
  @Input() imageCount$: Rx.Observable<number>;
  @Input() videoCount$: Rx.Observable<number>;

  fileFilterOptions$: Rx.Observable<ReadonlyArray<RadioOptionItem>>;

  private defaultFilter: String;

  constructor(private modalRef: ModalRef<ProjectFileFilterModalComponent>) {}

  ngOnInit() {
    this.defaultFilter = ProjectFilterType.ALL;

    this.control = new FormControl(ProjectFilterType.ALL, [
      required($localize`Please enter a valid filter`),
    ]);
    this.fileFilterOptions$ = Rx.combineLatest([
      this.allFilesCount$,
      this.documentCount$,
      this.imageCount$,
      this.videoCount$,
      this.filter$,
    ]).pipe(
      map(([allFileCount, documentCount, imageCount, videoCount, option]) => {
        const filterType = this.mapToFilterType(option);
        this.control.setValue(filterType);
        return [
          {
            value: ProjectFilterType.ALL,
            displayText: `${ProjectFilterType.ALL} (${allFileCount})`,
          },
          {
            value: ProjectFilterType.DOCUMENTS,
            displayText: `${ProjectFilterType.DOCUMENTS} (${documentCount})`,
          },
          {
            value: ProjectFilterType.IMAGES,
            displayText: `${ProjectFilterType.IMAGES} (${imageCount})`,
          },
          {
            value: ProjectFilterType.VIDEO,
            displayText: `${ProjectFilterType.VIDEO} (${videoCount})`,
          },
        ];
      }),
    );
  }

  handleApply() {
    this.modalRef.close(this.mapToDriveFileType(this.control.value));
  }

  handleReset() {
    this.control.setValue(this.defaultFilter);
  }

  private mapToFilterType(
    driveFileType: DriveFileTypeApi | null,
  ): ProjectFilterType {
    let type: ProjectFilterType;
    switch (driveFileType) {
      case DriveFileTypeApi.APPLICATION:
        type = ProjectFilterType.DOCUMENTS;
        break;
      case DriveFileTypeApi.IMAGE:
        type = ProjectFilterType.IMAGES;
        break;
      case DriveFileTypeApi.VIDEO:
        type = ProjectFilterType.VIDEO;
        break;
      default:
        type = ProjectFilterType.ALL;
    }
    return type;
  }

  private mapToDriveFileType(
    projectFilterType: ProjectFilterType,
  ): DriveFileTypeApi | null {
    let type: DriveFileTypeApi | null;
    switch (projectFilterType) {
      case ProjectFilterType.VIDEO:
        type = DriveFileTypeApi.VIDEO;
        break;
      case ProjectFilterType.IMAGES:
        type = DriveFileTypeApi.IMAGE;
        break;
      case ProjectFilterType.DOCUMENTS:
        type = DriveFileTypeApi.APPLICATION;
        break;
      default:
        type = null;
    }
    return type;
  }
}
