import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnInit,
} from '@angular/core';
import { ABTest } from '@freelancer/abtest';
import { Auth } from '@freelancer/auth';
import { Datastore, DatastoreDocument } from '@freelancer/datastore';
import {
  Bid,
  BidsCollection,
  Project,
  ProjectsCollection,
  UsersCollection,
} from '@freelancer/datastore/collections';
import { IconSize } from '@freelancer/ui/icon';
import { UI_CONFIG } from '@freelancer/ui/ui.config';
import { UiConfig } from '@freelancer/ui/ui.interface';
import { toNumber } from '@freelancer/utils';
import * as Rx from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  template: `
    <fl-bit class="AwardModalContainer">
      <ng-container
        *ngIf="(showNormalAwardModal$ | async) !== null; else Loading"
      >
        <ng-container *ngIf="showNormalAwardModal$ | async">
          <app-award-modal-body
            class="AwardModalBody"
            *ngIf="(cartVariant$ | async) === false"
            flTrackingSection="AwardModal"
            [bidId]="bidId"
          ></app-award-modal-body>
          <app-award-modal-body-cart
            class="AwardModalBody"
            *ngIf="(cartVariant$ | async) === true"
            flTrackingSection="CartAwardModal"
            [showUpgrades]="showUpgrades"
            [bidId]="bidId"
            [bidDoc]="bidDoc"
            [projectDoc]="projectDoc"
          ></app-award-modal-body-cart>
        </ng-container>
        <ng-container *ngIf="(showNormalAwardModal$ | async) === false">
          <app-award-modal-body-no-milestones
            class="AwardModalBody"
            flTrackingSection="CaliAwardModal"
            [bid]="bid$ | async"
            [project]="project$ | async"
            [bidDoc]="bidDoc"
            [projectDoc]="projectDoc"
          ></app-award-modal-body-no-milestones>
        </ng-container>
      </ng-container>
      <ng-template #Loading>
        <fl-spinner
          flTrackingLabel="AwardModalInitialisationSpinner"
          [overlay]="true"
        ></fl-spinner>
      </ng-template>
      <app-award-modal-sidebar
        class="AwardModalSidebar"
      ></app-award-modal-sidebar>
    </fl-bit>
  `,
  styleUrls: ['./award-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AwardModalComponent implements OnInit {
  IconSize = IconSize;

  @Input() bidId: number;
  @Input() projectId: number;
  @Input() showUpgrades = false;

  bidDoc: DatastoreDocument<BidsCollection>;
  bid$: Rx.Observable<Bid>;
  cartVariant$: Rx.Observable<boolean>;
  projectDoc: DatastoreDocument<ProjectsCollection>;
  project$: Rx.Observable<Project>;
  showNormalAwardModal$: Rx.Observable<boolean>;

  constructor(
    private abtest: ABTest,
    private auth: Auth,
    private datastore: Datastore,
    @Inject(UI_CONFIG) private uiConfig: UiConfig,
  ) {}

  ngOnInit() {
    this.bidDoc = this.datastore.document<BidsCollection>('bids', this.bidId);
    this.bid$ = this.bidDoc.valueChanges();

    this.projectDoc = this.datastore.document<ProjectsCollection>(
      'projects',
      this.projectId,
    );
    this.project$ = this.projectDoc.valueChanges();

    const employerAndFreelancer$ = this.datastore
      .collection<UsersCollection>(
        'users',
        Rx.combineLatest([
          this.auth.getUserId(),
          this.bid$.pipe(map(bid => bid.bidderId)),
        ]).pipe(map(([authUid, bidderId]) => [toNumber(authUid), bidderId])),
      )
      .valueChanges();

    const escrowRequired$ = employerAndFreelancer$.pipe(
      map(users => users.some(u => u.escrowComInteractionRequired)),
    );

    if (this.showUpgrades) {
      this.cartVariant$ = Rx.of(true);
    } else if (this.abtest.isWhitelistUser()) {
      this.cartVariant$ = Rx.of(true);
    } else if (this.uiConfig.theme === 'arrow') {
      this.cartVariant$ = Rx.of(false);
    } else {
      this.cartVariant$ = Rx.combineLatest([
        this.project$,
        escrowRequired$,
      ]).pipe(
        switchMap(([projects, escrowRequired]) => {
          // projects with local jobs not in the test
          if (projects.local && !escrowRequired) {
            return Rx.of(false);
          }

          return Rx.of(true);
        }),
      );
    }

    // allow to create milestone with award modal only when
    // 1. Not escrow interaction needed OR
    // 2. Escrow interaction is needed but both freelancer and employer have linked escrow account
    this.showNormalAwardModal$ = employerAndFreelancer$.pipe(
      map(
        users =>
          users.every(u => !u.escrowComInteractionRequired) ||
          users.every(user => user.hasLinkedEscrowComAccount),
      ),
    );
  }
}
