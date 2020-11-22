import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  arrayIsShallowEqual,
  Datastore,
  DatastoreCollection,
  RequestStatus,
} from '@freelancer/datastore';
import {
  TimeTrackingPunch,
  TimeTrackingPunchesCollection,
  TimeTrackingSession,
} from '@freelancer/datastore/collections';
import { CarouselImage } from '@freelancer/ui/carousel';
import { Margin } from '@freelancer/ui/margin';
import { FontWeight } from '@freelancer/ui/text';
import * as Rx from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  template: `
    <ng-container
      flTrackingSection="PunchViewerModal"
      *ngIf="session; else modalContent"
    >
      <ng-container *ngIf="punchesStatus$ | async as punchesStatus">
        <ng-container *ngIf="punchesStatus.ready; else Loading">
          <ng-container
            *ngIf="
              !punchesStatus.error && (images$ | async) as images;
              else Error
            "
          >
            <!-- Show the screenshots -->
            <app-punch-viewer-modal-content [images]="images">
            </app-punch-viewer-modal-content>
          </ng-container>

          <!-- Error loading screenshots -->
          <ng-template #Error>
            <fl-bit class="ErrorState">
              <fl-picture
                alt="Freelancer time-tracking icon"
                i18n-alt="Freelancer time-tracking icon"
                [src]="'project-view/icon-track.svg'"
                [flMarginBottom]="Margin.XXSMALL"
              ></fl-picture>
              <fl-text
                i18n="Screenshot viewer modal error message"
                [weight]="FontWeight.BOLD"
                [flMarginBottom]="Margin.XXXSMALL"
              >
                Screenshots could not be loaded.
              </fl-text>
              <fl-link
                i18n="Link to retry on screenshot viewer modal error"
                flTrackingLabel="ReloadScreenshotsLink"
                (click)="handleRetryClick()"
              >
                Please try again.
              </fl-link>
            </fl-bit>
          </ng-template>
        </ng-container>

        <ng-template #Loading>
          <fl-bit class="LoadingSpinner">
            <fl-spinner
              flTrackingLabel="PunchModalInitialisationSpinner"
              [overlay]="true"
            ></fl-spinner>
          </fl-bit>
        </ng-template>
      </ng-container>
    </ng-container>
    <ng-template #modalContent>
      <app-punch-viewer-modal-content
        flTrackingSection="FilmStripViewerModal"
        [images]="images$ | async"
        [currentImageIndex]="currentImageIndex"
      >
      </app-punch-viewer-modal-content
    ></ng-template>
  `,
  styleUrls: ['./punch-viewer-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PunchViewerModalComponent implements OnInit {
  Margin = Margin;
  FontWeight = FontWeight;

  punchesCollection: DatastoreCollection<TimeTrackingPunchesCollection>;
  punchesStatus$: Rx.Observable<RequestStatus<TimeTrackingPunchesCollection>>;
  punches$: Rx.Observable<ReadonlyArray<TimeTrackingPunch>>;

  @Input() images$: Rx.Observable<
    ReadonlyArray<CarouselImage & { timeCreated: number }>
  >;
  @Input() session: TimeTrackingSession;
  @Input() currentImageIndex = 0;

  constructor(private datastore: Datastore) {}

  ngOnInit() {
    if (this.session) {
      this.punchesCollection = this.datastore.collection<
        TimeTrackingPunchesCollection
      >('timeTrackingPunches', query =>
        query
          .where('sessionId', '==', this.session.id)
          .where('bidId', '==', this.session.bidId),
      );
      this.punchesStatus$ = this.punchesCollection.status$;
      this.punches$ = this.punchesCollection.valueChanges();

      this.images$ = this.punches$.pipe(
        distinctUntilChanged((a, b) =>
          arrayIsShallowEqual(
            a.map(punch => punch.timeCreated),
            b.map(punch => punch.timeCreated),
          ),
        ),
        map(punches =>
          punches.map(punch => ({
            src: punch.url ? punch.url : '',
            alt: punch.note ? punch.note : '',
            timeCreated: punch.timeCreated,
          })),
        ),
      );
    }
  }

  // Trigger resubscription via async pipe to retry the datastore call
  handleRetryClick() {
    this.punchesStatus$ = this.punchesCollection.status$.pipe(map(x => x));
  }
}
