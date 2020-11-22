import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  BackendUpdateResponse,
  DatastoreCollection,
} from '@freelancer/datastore';
import {
  MilestoneRequestAction,
  MilestoneRequestsCollection,
  ProjectViewBidsCollection,
} from '@freelancer/datastore/collections';
import { ModalRef } from '@freelancer/ui';
import { ButtonColor } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, TextSize } from '@freelancer/ui/text';
import { ToastAlertService } from '@freelancer/ui/toast-alert';
import { take } from 'rxjs/operators';

@Component({
  template: `
    <fl-bit flTrackingSection="BidRetractModal">
      <fl-heading
        i18n="Bid retract modal title"
        [headingType]="HeadingType.H1"
        [size]="TextSize.MID"
        [flMarginBottom]="Margin.SMALL"
      >
        Retract bid
      </fl-heading>
      <fl-text i18n="Bid retract text" [flMarginBottom]="Margin.SMALL">
        Are you sure you want to retract your bid?
      </fl-text>
      <fl-bit class="BidRetractModal-buttons">
        <fl-button
          class="BidRetractModal-cta"
          flTrackingLabel="CancelRetractButton"
          i18n="Cancel retract button"
          [color]="ButtonColor.TRANSPARENT_DARK"
          [flMarginRight]="Margin.SMALL"
          [disabled]="bidRetractPromise && (bidRetractPromise | async) === null"
          (click)="closeModal()"
        >
          Cancel
        </fl-button>
        <fl-button
          class="BidRetractModal-cta"
          flTrackingLabel="ConfirmRetractButton"
          i18n="Confirm retract button"
          [color]="ButtonColor.SECONDARY"
          [busy]="bidRetractPromise && (bidRetractPromise | async) === null"
          (click)="retractBid()"
        >
          Confirm
        </fl-button>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./bid-retract-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BidRetractModalComponent {
  ButtonColor = ButtonColor;
  FontColor = FontColor;
  TextSize = TextSize;
  HeadingType = HeadingType;
  Margin = Margin;

  @Input() bidListCollection: DatastoreCollection<ProjectViewBidsCollection>;
  @Input() freelancerMilestoneRequestCollection: DatastoreCollection<
    MilestoneRequestsCollection
  >;
  @Input() bidId: number;

  bidRetractPromise: Promise<BackendUpdateResponse<ProjectViewBidsCollection>>;

  constructor(
    private modalRef: ModalRef<BidRetractModalComponent>,
    private toastAlertService: ToastAlertService,
  ) {}

  retractBid() {
    this.bidRetractPromise = this.bidListCollection
      .update(this.bidId, { retracted: true })
      .then(result => {
        if (result.status === 'success') {
          this.freelancerMilestoneRequestCollection
            .valueChanges()
            .pipe(take(1))
            .toPromise()
            .then(milestoneRequests => {
              milestoneRequests.forEach(milestoneRequest => {
                this.freelancerMilestoneRequestCollection.update(
                  milestoneRequest.id,
                  {
                    action: MilestoneRequestAction.DELETE,
                  },
                );
              });
            });

          this.toastAlertService.open('bid-retract-success-toast-alert');
        } else {
          this.toastAlertService.open('bid-retract-success-toast-alert');
        }

        this.modalRef.close();
        return result;
      });
  }

  closeModal() {
    this.modalRef.close();
  }
}
