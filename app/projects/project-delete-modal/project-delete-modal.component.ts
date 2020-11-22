import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { Datastore } from '@freelancer/datastore';
import { ProjectsCollection } from '@freelancer/datastore/collections';
import { ModalRef } from '@freelancer/ui';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { ButtonColor } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { TextSize } from '@freelancer/ui/text';
import { ErrorCodeApi } from 'api-typings/errors/errors';
import { take } from 'rxjs/operators';

@Component({
  template: `
    <ng-container flTrackingSection="ProjectDeleteModal">
      <fl-bit class="Header">
        <fl-heading
          i18n="My project delete modal header"
          [size]="TextSize.MID"
          [headingType]="HeadingType.H4"
          [flMarginBottom]="Margin.SMALL"
        >
          Delete project
        </fl-heading>
      </fl-bit>
      <fl-bit class="MainBody">
        <fl-text
          i18n="My project delete modal body"
          [flMarginBottom]="Margin.SMALL"
        >
          By deleting your project, no one will be able to view the project
          information, the attached files nor any of the bids on the project.
        </fl-text>
      </fl-bit>
      <fl-banner-alert
        *ngIf="error"
        [type]="BannerAlertType.ERROR"
        [closeable]="false"
        [flMarginBottom]="Margin.XXSMALL"
        [ngSwitch]="error"
      >
        <ng-container
          i18n="My project delete modal in progress project error message"
          *ngSwitchCase="ErrorCodeApi.PROJECT_PENDING_INVOICE"
        >
          Cannot delete the projects that are still in progress. To delete this
          project, you must end all awarded bids from the payments tab.
        </ng-container>

        <ng-container
          i18n="My project delete modal pending award error message"
          *ngSwitchCase="ErrorCodeApi.PROJECT_HAS_PENDING_AWARD"
        >
          Projects with an Awaiting Acceptance status cannot be deleted. To
          delete this project you must first revoke the pending award from the
          proposals tab.
        </ng-container>

        <ng-container
          i18n="My project delete modal pending milestone error message"
          *ngSwitchCase="ErrorCodeApi.PROJECT_HAS_PENDING_MILESTONE"
        >
          Projects with pending milestones cannot be deleted. To delete this
          project you must first release or cancel all the pending milestones
          from the payments tab.
        </ng-container>

        <ng-container
          i18n="My project delete modal invalid project state error message"
          *ngSwitchCase="ErrorCodeApi.PROJECT_NOT_DELETABLE"
        >
          This project cannot be deleted.
          <fl-link
            flTrackingLabel="DeleteProjectErrorLearnMore"
            [link]="'/support/Project/how-to-delete-a-project'"
            [newTab]="true"
          >
            Learn More
          </fl-link>
        </ng-container>

        <ng-container
          i18n="My project delete modal error alert"
          *ngSwitchDefault
        >
          There was a problem deleting your project. Please try again or contact
          support.
        </ng-container>
      </fl-banner-alert>
      <div class="ActionContainer">
        <fl-button
          class="ActionButton"
          i18n="My project delete modal cancel button"
          flTrackingLabel="CancelButton"
          [color]="ButtonColor.DEFAULT"
          [flMarginRight]="Margin.SMALL"
          (click)="cancel()"
        >
          Cancel
        </fl-button>
        <fl-button
          class="ActionButton"
          i18n="My project delete modal delete button"
          flTrackingLabel="DeleteButton"
          [busy]="isBusy"
          [color]="ButtonColor.SECONDARY"
          (click)="confirm()"
        >
          Delete
        </fl-button>
      </div>
    </ng-container>
  `,
  styleUrls: ['./project-delete-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDeleteModalComponent {
  BannerAlertType = BannerAlertType;
  ButtonColor = ButtonColor;
  TextSize = TextSize;
  ErrorCodeApi = ErrorCodeApi;
  HeadingType = HeadingType;
  Margin = Margin;

  isBusy = false;
  error: ErrorCodeApi | unknown;

  @Input() projectId: number;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private modalRef: ModalRef<ProjectDeleteModalComponent>,
    private datastore: Datastore,
  ) {}

  confirm() {
    this.isBusy = true;
    const projectDoc = this.datastore.document<ProjectsCollection>(
      'projects',
      this.projectId,
    );

    projectDoc
      .valueChanges()
      .pipe(take(1))
      .toPromise()
      .then(_ => {
        projectDoc.remove().then(response => {
          if (response.status === 'success') {
            this.modalRef.close(true);
          } else {
            this.error = response.errorCode;
          }
          this.isBusy = false;
          this.changeDetectorRef.markForCheck();
        });
      });
  }

  cancel() {
    this.modalRef.close(false);
  }
}
