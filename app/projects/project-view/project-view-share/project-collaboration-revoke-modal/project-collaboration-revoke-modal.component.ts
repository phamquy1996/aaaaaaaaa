import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import {
  BackendUpdateResponse,
  DatastoreCollection,
} from '@freelancer/datastore';
import {
  ProjectCollaborationAction,
  ProjectCollaborationsCollection,
} from '@freelancer/datastore/collections';
import { ModalRef } from '@freelancer/ui';
import { ButtonColor } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { TextSize } from '@freelancer/ui/text';

@Component({
  template: `
    <fl-bit class="RevokeModal">
      <fl-heading
        [headingType]="HeadingType.H3"
        [size]="TextSize.MID"
        [flMarginBottom]="Margin.SMALL"
      >
        <ng-container
          *ngIf="isCollaborator; else isEmployerHeader"
          i18n="Leave project modal heading"
        >
          Leave Project
        </ng-container>
        <ng-template #isEmployerHeader>
          <ng-container i18n="Revoke modal heading">
            Revoke collaborator access
          </ng-container>
        </ng-template>
      </fl-heading>

      <fl-text [flMarginBottom]="Margin.LARGE">
        <ng-container
          *ngIf="isCollaborator; else isEmployerText"
          i18n="Leave project modal notification text"
        >
          This will remove your access to the project and you will no longer
          receive notifications for this project. You can't undo this action.
        </ng-container>
        <ng-template #isEmployerText>
          <ng-container i18n="Revoke modal notification text">
            This will remove the collaborator from the project. You can add them
            as a collaborator again if you change your mind.
          </ng-container>
        </ng-template>
      </fl-text>

      <fl-bit class="ButtonGroup">
        <fl-button
          i18n="Cancel button"
          flTrackingLabel="CloseRevokeCollaborationModalButton"
          [color]="ButtonColor.DEFAULT"
          [flMarginRight]="Margin.XSMALL"
          (click)="cancel()"
        >
          Cancel
        </fl-button>

        <fl-button
          flTrackingLabel="SaveRevokeCollaborationModalButton"
          [color]="ButtonColor.SECONDARY"
          [busy]="revokePromise && (revokePromise | async) === null"
          (click)="remove()"
        >
          <ng-container
            *ngIf="isCollaborator; else isEmployerButton"
            i18n="Leave project button"
          >
            Leave Project
          </ng-container>
          <ng-template #isEmployerButton>
            <ng-container i18n="Revoke access button">Revoke</ng-container>
          </ng-template>
        </fl-button>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./project-collaboration-revoke-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCollaborationRevokeModalComponent {
  ButtonColor = ButtonColor;
  Margin = Margin;
  TextSize = TextSize;
  HeadingType = HeadingType;

  revokePromise: Promise<
    BackendUpdateResponse<ProjectCollaborationsCollection>
  >;

  @Input() projectCollaborationCollection: DatastoreCollection<
    ProjectCollaborationsCollection
  >;
  @Input() collaborationId: number;
  @Input() isCollaborator = false;

  constructor(
    private modalRef: ModalRef<ProjectCollaborationRevokeModalComponent>,
    private router: Router,
  ) {}

  cancel() {
    this.modalRef.close(false);
  }

  remove() {
    this.revokePromise = this.projectCollaborationCollection
      .update(this.collaborationId, {
        action: ProjectCollaborationAction.REVOKE,
      })
      .then(response => {
        if (response.status === 'success') {
          if (this.isCollaborator) {
            this.router.navigate([`/dashboard`]);
          } else {
            this.cancel();
          }
        } else {
          this.modalRef.close(true);
        }
        return response;
      });
  }
}
