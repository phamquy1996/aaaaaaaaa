import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BackendDeleteResponse, Datastore } from '@freelancer/datastore';
import { TimeTrackingSessionCollection } from '@freelancer/datastore/collections';
import { ModalService } from '@freelancer/ui';
import { ButtonColor } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, TextSize } from '@freelancer/ui/text';
import { ErrorCodeApi } from 'api-typings/errors/errors';

@Component({
  template: `
    <fl-bit flTrackingSection="DeleteTimeTrackingSession">
      <fl-heading
        i18n="Delete session modal title"
        [headingType]="HeadingType.H1"
        [size]="TextSize.MID"
        [flMarginBottom]="Margin.SMALL"
      >
        Delete Tracked Time Session?
      </fl-heading>
      <fl-text i18n="Delete session description text">
        This will remove the tracked time session.
      </fl-text>
      <fl-text
        i18n="Delete action cannot be undone text"
        [flMarginBottom]="Margin.LARGE"
      >
        This action cannot be undone.
      </fl-text>
      <ng-container *ngIf="deletePromise | async as deleteResponse">
        <fl-text
          *ngIf="deleteResponse.status === 'error'"
          [flMarginBottom]="Margin.LARGE"
          [color]="FontColor.ERROR"
          [ngSwitch]="deleteResponse.errorCode"
        >
          <ng-container
            *ngSwitchCase="ErrorCodeApi.TIME_TRACKING_SESSION_NOT_FOUND"
            i18n="Time tracking session not found text"
          >
            Time tracking session does not exist.
          </ng-container>
          <ng-container
            *ngSwitchCase="ErrorCodeApi.TIME_TRACKING_SESSION_DELETED"
            i18n="Time tracking session already deleted text"
          >
            Time tracking session is already deleted.
          </ng-container>
          <ng-container
            *ngSwitchCase="ErrorCodeApi.TIME_TRACKING_SESSION_FINALISED"
            i18n="Time tracking session finalised text"
          >
            Finalized time tracking sessions cannot be deleted.
          </ng-container>
          <ng-container
            *ngSwitchDefault
            i18n="Delete time tracking session failed text"
          >
            Something went wrong. Please try again or contact support with
            request ID: {{ deleteResponse.requestId }}
          </ng-container>
        </fl-text>
      </ng-container>
      <fl-bit class="DeleteSessionButtons">
        <fl-button
          i18n="Delete session button"
          flTrackingLabel="DeleteSessionButton"
          [flMarginRight]="Margin.XXSMALL"
          [color]="ButtonColor.TRANSPARENT_DARK"
          [busy]="deletePromise && (deletePromise | async) === null"
          (click)="deleteSession()"
        >
          Delete
        </fl-button>
        <fl-button
          i18n="Go back delete session button"
          flTrackingLabel="GoBackButton"
          [color]="ButtonColor.SECONDARY"
          [disabled]="deletePromise && (deletePromise | async) === null"
          (click)="closeModal()"
        >
          Go Back
        </fl-button>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['delete-time-tracking-session-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteTimeTrackingSessionModalComponent {
  ButtonColor = ButtonColor;
  ErrorCodeApi = ErrorCodeApi;
  FontColor = FontColor;
  TextSize = TextSize;
  HeadingType = HeadingType;
  Margin = Margin;

  @Input() sessionId: number;

  deletePromise: Promise<BackendDeleteResponse<TimeTrackingSessionCollection>>;

  constructor(
    private datastore: Datastore,
    private modalService: ModalService,
  ) {}

  deleteSession() {
    this.deletePromise = this.datastore
      .document<TimeTrackingSessionCollection>(
        'timeTrackingSession',
        this.sessionId,
      )
      .remove()
      .then(response => {
        if (response.status === 'success') {
          this.closeModal();
        }

        return response;
      });
  }

  closeModal() {
    this.modalService.close();
  }
}
