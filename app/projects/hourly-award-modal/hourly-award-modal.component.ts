import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Auth } from '@freelancer/auth';
import { Datastore, DatastoreDocument } from '@freelancer/datastore';
import {
  Bid,
  BidsCollection,
  ProjectViewProject,
  ProjectViewProjectsCollection,
  ProjectViewUser,
  ProjectViewUsersCollection,
  UsersCollection,
} from '@freelancer/datastore/collections';
import { ModalRef } from '@freelancer/ui';
import { toNumber } from '@freelancer/utils';
import { ProjectTypeApi } from 'api-typings/projects/projects';
import * as Rx from 'rxjs';
import { map } from 'rxjs/operators';

interface Payload {
  bid: Bid;
  bidder: ProjectViewUser;
  employer: ProjectViewUser;
  project: ProjectViewProject;
}

@Component({
  template: `
    <fl-bit>
      <ng-container *ngIf="payload$ | async as payload; else Loading">
        <app-hourly-hourly-award-modal
          *ngIf="payingHourly"
          flTrackingSection="HourlyHourlyAwardModal"
          [bid]="payload.bid"
          [eligibleForInitialPayment]="eligibleForInitialPayment"
          [employer]="payload.employer"
          [freelancer]="payload.bidder"
          [project]="payload.project"
          (switchAwardType)="switchAwardType($event)"
          (close)="close($event)"
        ></app-hourly-hourly-award-modal>
        <app-hourly-fixed-award-modal
          *ngIf="!payingHourly"
          flTrackingSection="HourlyFixedAwardModal"
          [bid]="payload.bid"
          [user]="payload.bidder"
          [allowMilestoneCreation]="allowMilestoneCreation$ | async"
          [project]="payload.project"
          (switchAwardType)="switchAwardType($event)"
          (close)="close($event)"
        ></app-hourly-fixed-award-modal>
      </ng-container>
      <ng-template #Loading>
        <fl-spinner
          flTrackingLabel="HourlyAwardModalInitialisationSpinner"
          [overlay]="true"
        ></fl-spinner>
      </ng-template>
    </fl-bit>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HourlyAwardModalComponent implements OnInit {
  @Input() bidId: number;
  @Input() eligibleForInitialPayment: boolean;

  payingHourly: boolean;

  bidDoc: DatastoreDocument<BidsCollection>;
  bidderDoc: DatastoreDocument<ProjectViewUsersCollection>;
  employerDoc: DatastoreDocument<ProjectViewUsersCollection>;
  projectDoc: DatastoreDocument<ProjectViewProjectsCollection>;
  payload$: Rx.Observable<Payload>;
  allowMilestoneCreation$: Rx.Observable<boolean>;
  userId$: Rx.Observable<number>;

  constructor(
    private auth: Auth,
    private datastore: Datastore,
    private modalRef: ModalRef<HourlyAwardModalComponent>,
  ) {}

  ngOnInit() {
    this.payingHourly = true;
    this.userId$ = this.auth.getUserId().pipe(map(id => toNumber(id)));

    this.bidDoc = this.datastore.document<BidsCollection>('bids', this.bidId);
    const bidderId$ = this.bidDoc.valueChanges().pipe(map(b => b.bidderId));

    this.bidderDoc = this.datastore.document<ProjectViewUsersCollection>(
      'projectViewUsers',
      bidderId$,
    );

    this.employerDoc = this.datastore.document<ProjectViewUsersCollection>(
      'projectViewUsers',
      this.userId$,
    );

    this.projectDoc = this.datastore.document<ProjectViewProjectsCollection>(
      'projectViewProjects',
      this.bidDoc.valueChanges().pipe(map(b => b.projectId)),
    );

    this.payload$ = Rx.combineLatest([
      this.bidDoc.valueChanges(),
      this.bidderDoc.valueChanges(),
      this.employerDoc.valueChanges(),
      this.projectDoc.valueChanges(),
    ]).pipe(
      map(([bid, bidder, employer, project]) => ({
        bid,
        bidder,
        employer,
        project,
      })),
    );

    const employerAndFreelancer$ = this.datastore
      .collection<UsersCollection>(
        'users',
        Rx.combineLatest([this.userId$, bidderId$]).pipe(
          map(([authUid, bidderId]) => [authUid, bidderId]),
        ),
      )
      .valueChanges();

    // allow to create milestone with award modal only when
    // 1. Not escrow interaction needed OR
    // 2. Escrow interaction is needed but both freelancer and employer have linked escrow account
    this.allowMilestoneCreation$ = employerAndFreelancer$.pipe(
      map(
        users =>
          users.every(u => !u.escrowComInteractionRequired) ||
          users.every(user => user.hasLinkedEscrowComAccount),
      ),
    );
  }

  close(event: boolean) {
    this.modalRef.close(event);
  }

  switchAwardType(awardType: string) {
    this.payingHourly = awardType === ProjectTypeApi.HOURLY;
  }
}
