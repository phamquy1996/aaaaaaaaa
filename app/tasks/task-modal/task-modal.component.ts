import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Task } from '@freelancer/datastore/collections';
import { Tracking } from '@freelancer/tracking';
import { ModalRef } from '@freelancer/ui';
import { ButtonColor, ButtonGroupPosition } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { TextSize } from '@freelancer/ui/text';

export enum TaskModalAction {
  UNSAVED_CHANGES = 'unsaved_changes',
  CONFIRM_DELETE = 'confirm_delete',
}

export enum TaskModalResult {
  CONFIRM = 'confirm',
  CANCEL = 'cancel',
}

@Component({
  selector: 'app-task-modal',
  template: `
    <fl-bit [ngSwitch]="action" flTrackingSection="TasklistModal">
      <fl-bit *ngSwitchCase="TaskModalAction.CONFIRM_DELETE">
        <fl-bit class="HeaderSection">
          <fl-heading
            *ngIf="task && task.title"
            i18n="Task modal title"
            [size]="TextSize.LARGE"
            [headingType]="HeadingType.H1"
            [flMarginBottom]="Margin.SMALL"
          >
            Are you sure you want to delete<br />"{{ task.title }}"?
          </fl-heading>
          <fl-heading
            *ngIf="!task || !task.title"
            i18n="Task modal title"
            [size]="TextSize.LARGE"
            [headingType]="HeadingType.H1"
            [flMarginBottom]="Margin.MID"
          >
            Are you sure you want to delete this task?
          </fl-heading>
        </fl-bit>

        <fl-bit class="BodySection">
          <fl-text i18n="Task modal message" [flMarginBottom]="Margin.MID">
            This will permanently delete the task and it will no longer be
            accessible to you or anyone else.
          </fl-text>
        </fl-bit>

        <fl-bit>
          <fl-button
            i18n="Task modal button"
            flTrackingLabel="TaskModalCancel"
            [color]="ButtonColor.DEFAULT"
            [flMarginRight]="Margin.SMALL"
            (click)="handleClose(TaskModalResult.CANCEL)"
          >
            Cancel
          </fl-button>

          <fl-button
            i18n="Task modal button"
            flTrackingLabel="TaskModalDelete"
            [color]="ButtonColor.SECONDARY"
            (click)="handleClose(TaskModalResult.CONFIRM)"
          >
            Delete
          </fl-button>
        </fl-bit>
      </fl-bit>

      <fl-bit *ngSwitchCase="TaskModalAction.UNSAVED_CHANGES">
        <fl-bit class="HeaderSection">
          <fl-heading
            *ngIf="task && task.title"
            i18n="Task modal title"
            [size]="TextSize.LARGE"
            [headingType]="HeadingType.H1"
            [flMarginBottom]="Margin.SMALL"
          >
            Do you want to keep editing <br />"{{ task.title }}"?
          </fl-heading>
          <fl-heading
            *ngIf="!task || !task.title"
            i18n="Task modal title"
            [size]="TextSize.LARGE"
            [headingType]="HeadingType.H1"
            [flMarginBottom]="Margin.MID"
          >
            Do you want to keep editing this task?
          </fl-heading>
        </fl-bit>

        <fl-bit class="BodySection">
          <fl-text i18n="Task modal message" [flMarginBottom]="Margin.MID">
            Any unsaved changes will be lost.
          </fl-text>
        </fl-bit>

        <fl-bit>
          <fl-button
            i18n="Task modal button"
            flTrackingLabel="TaskModalDropChanges"
            [color]="ButtonColor.DEFAULT"
            [flMarginRight]="Margin.SMALL"
            (click)="handleClose(TaskModalResult.CANCEL)"
          >
            Discard changes
          </fl-button>

          <fl-button
            i18n="Task modal button"
            flTrackingLabel="TaskModalKeepEditing"
            [color]="ButtonColor.SECONDARY"
            (click)="handleClose(TaskModalResult.CONFIRM)"
          >
            Keep editing
          </fl-button>
        </fl-bit>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./task-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskModalComponent {
  ButtonColor = ButtonColor;
  ButtonGroupPosition = ButtonGroupPosition;
  TextSize = TextSize;
  HeadingType = HeadingType;
  Margin = Margin;
  TaskModalAction = TaskModalAction;
  TaskModalResult = TaskModalResult;

  @Input() action: TaskModalAction;
  @Input() task?: Task;
  @Input() projectId?: number;

  constructor(
    private modalRef: ModalRef<TaskModalComponent>,
    private tracking: Tracking,
  ) {}

  handleClose(result: TaskModalResult) {
    this.tracking.track('user_action', {
      reference: 'project_id',
      reference_id: this.projectId,
      section: 'Tasklist',
      subsection: 'TasklistModal',
      label: 'ModalClose',
      name: 'action',
      value: result,
    });
    this.modalRef.close(result);
  }
}
