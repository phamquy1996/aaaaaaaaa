import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Tracking } from '@freelancer/tracking';
import { ModalRef } from '@freelancer/ui';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { LinkWeight } from '@freelancer/ui/link';
import { Margin } from '@freelancer/ui/margin';
import { FontWeight, TextSize } from '@freelancer/ui/text';
import { minLength, required } from '@freelancer/ui/validators';
import * as Rx from 'rxjs';
import {
  itemsPerPageOptions,
  ManageProjectFilter,
  manageProjectFilterOptions,
} from '../../manage.types';

@Component({
  template: `
    <ng-container flTrackingSection="ManageFilterMobileModal">
      <fl-heading
        i18n="Filter Options Header"
        [size]="TextSize.MID"
        [headingType]="HeadingType.H4"
        [flMarginBottom]="Margin.MID"
      >
        Options
      </fl-heading>
      <fl-bit class="Filters">
        <fl-bit *ngIf="showFilter" [flMarginBottom]="Margin.SMALL">
          <fl-text
            i18n="Filter label"
            [flMarginBottom]="Margin.XXSMALL"
            [size]="TextSize.SMALL"
            [weight]="FontWeight.BOLD"
          >
            View
          </fl-text>
          <fl-radio
            flTrackingLabel="ManageMobileViewControlRadio"
            [control]="viewControl"
            [options]="manageProjectFilterOptions"
          ></fl-radio>
        </fl-bit>
        <fl-text
          i18n="Items per Page label"
          [flMarginBottom]="Margin.XXSMALL"
          [size]="TextSize.SMALL"
          [weight]="FontWeight.BOLD"
        >
          Items Per Page
        </fl-text>
        <fl-radio
          flTrackingLabel="ManageMobileItemsPerPageControlRadio"
          [control]="itemsPerPageControl"
          [options]="itemsPerPageOptions"
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
        [flMarginBottom]="Margin.SMALL"
        [size]="TextSize.SMALL"
        [weight]="LinkWeight.BOLD"
        (click)="handleReset()"
      >
        Reset
      </fl-link>
    </ng-container>
  `,
  styleUrls: ['./manage-filter-modal.component.scss'],
})
export class ManageFilterModalComponent implements OnDestroy, OnInit {
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  FontWeight = FontWeight;
  HeadingType = HeadingType;
  LinkWeight = LinkWeight;
  Margin = Margin;
  TextSize = TextSize;
  itemsPerPageOptions = itemsPerPageOptions;
  manageProjectFilterOptions = manageProjectFilterOptions;

  @Input() showFilter = false;
  @Input() view: ManageProjectFilter;
  @Input() show: number;
  @Input() trackingSection: string;

  itemsPerPageControl: FormControl;
  viewControl: FormControl;

  private itemsPerPageControlSubscription?: Rx.Subscription;
  private viewControlSubscription?: Rx.Subscription;

  constructor(
    private modalRef: ModalRef<ManageFilterModalComponent>,
    private tracking: Tracking,
  ) {}

  ngOnInit() {
    this.viewControl = new FormControl(this.view, [
      required($localize`Please enter a valid filter`),
    ]);
    this.itemsPerPageControl = new FormControl(this.show, [
      required($localize`Please enter a valid number of records to show`),
      minLength(1, $localize`Number of records to show must be at least 1`),
    ]);

    this.itemsPerPageControlSubscription = this.itemsPerPageControl.valueChanges.subscribe(
      value => {
        this.tracking.trackCustomEvent(
          'ManageMobileItemsPerPageControlRadioSelect',
          this.trackingSection,
          { value },
        );
      },
    );

    this.viewControlSubscription = this.viewControl.valueChanges.subscribe(
      value => {
        this.tracking.trackCustomEvent(
          'ManageMobileViewControlRadioSelect',
          this.trackingSection,
          { value },
        );
      },
    );
  }

  handleReset() {
    this.itemsPerPageControl.setValue(itemsPerPageOptions[0]);
    this.viewControl.setValue(manageProjectFilterOptions[0]);
  }

  handleApply() {
    const show = this.itemsPerPageControl.value;
    if (this.showFilter) {
      const view = this.viewControl.value;
      this.modalRef.close({ show, view });
    } else {
      this.modalRef.close({ show });
    }
  }

  closeModal() {
    this.modalRef.close();
  }

  ngOnDestroy() {
    if (this.itemsPerPageControlSubscription) {
      this.itemsPerPageControlSubscription.unsubscribe();
    }

    if (this.viewControlSubscription) {
      this.viewControlSubscription.unsubscribe();
    }
  }
}
