import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Auth } from '@freelancer/auth';
import { BackendPushResponse, Datastore } from '@freelancer/datastore';
import {
  ContestInviteCollection,
  ContestsCollection,
  ProjectInviteCollection,
  ProjectsCollection,
} from '@freelancer/datastore/collections';
import { ModalRef } from '@freelancer/ui';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { ButtonColor } from '@freelancer/ui/button';
import { HeadingType, HeadingWeight } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { SelectItem } from '@freelancer/ui/select';
import { StickyBehaviour, StickyPosition } from '@freelancer/ui/sticky';
import { FontType, FontWeight, TextSize } from '@freelancer/ui/text';
import { ToastAlertService } from '@freelancer/ui/toast-alert';
import { required } from '@freelancer/ui/validators';
import { toNumber } from '@freelancer/utils';
import { FrontendProjectStatusApi } from 'api-typings/common/common';
import { ContestStatusApi } from 'api-typings/contests/contests';
import * as Rx from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  template: `
    <fl-bit flTrackingSection="ProjectInviteModal">
      <ng-container *flModalTitle i18n="Invite freelancer header">
        Invite Freelancer to a Project
      </ng-container>
      <fl-heading
        i18n="Invite freelancer heading"
        [size]="TextSize.LARGE"
        [headingType]="HeadingType.H3"
        [weight]="HeadingWeight.BOLD"
        [flMarginBottom]="Margin.MID"
        [flHideMobile]="true"
      >
        Invite Freelancer to a Project
      </fl-heading>

      <ng-container
        *ngIf="inviteOptions$ | async as options; else loadingOptions"
      >
        <ng-container *ngIf="options.length > 0; else noValidProject">
          <fl-sticky-footer-wrapper>
            <fl-sticky-footer-body>
              <fl-picture
                class="InviteModalLogo"
                alt="Active Projects Logo"
                i18n-alt="Active projects logo Icon"
                [flMarginBottom]="Margin.SMALL"
                [src]="'profile/active-projects.svg'"
              ></fl-picture>
              <fl-text
                i18n="Select project for freelancer to bid text"
                [flMarginBottom]="Margin.SMALL"
              >
                Select the project you would like to invite
                <fl-text [fontType]="FontType.SPAN" [weight]="FontWeight.BOLD">
                  {{ freelancerName }}
                </fl-text>
                to bid on.
              </fl-text>
              <fl-select
                flTrackingLabel="SelectProject"
                [control]="projectContestSelectControl"
                [flMarginBottom]="Margin.MID"
                [options]="inviteOptions$ | async"
              ></fl-select>

              <fl-banner-alert
                *ngIf="hasError$ | async"
                i18n="Failed to send message error message"
                [closeable]="false"
                [type]="BannerAlertType.ERROR"
                [flMarginBottom]="Margin.SMALL"
              >
                An error has occurred. Make sure you haven't invited
                <fl-text [fontType]="FontType.SPAN" [weight]="FontWeight.BOLD">
                  {{ freelancerName }}
                </fl-text>
                to this project or contest already.
              </fl-banner-alert>

              <fl-bit class="ActionRow" [flHideMobile]="true">
                <fl-button
                  flTrackingLabel="Cancel"
                  i18n="Cancel button"
                  [color]="ButtonColor.DEFAULT"
                  [disabled]="busy$ | async"
                  [flMarginRight]="Margin.SMALL"
                  (click)="closeModal()"
                >
                  Cancel
                </fl-button>

                <fl-button
                  flTrackingLabel="Invite"
                  i18n="Invite button"
                  [busy]="busy$ | async"
                  [color]="ButtonColor.SECONDARY"
                  [disabled]="projectContestSelectControl.invalid"
                  (click)="handleInviteFreelancer()"
                >
                  Invite Freelancer
                </fl-button>
              </fl-bit>
            </fl-sticky-footer-body>
            <fl-sticky-footer>
              <fl-bit class="ActionRow" [flShowMobile]="true">
                <fl-button
                  flTrackingLabel="Cancel"
                  i18n="Cancel button"
                  [color]="ButtonColor.DEFAULT"
                  [disabled]="busy$ | async"
                  [flMarginRight]="Margin.SMALL"
                  [display]="'block'"
                  (click)="closeModal()"
                >
                  Cancel
                </fl-button>

                <fl-button
                  flTrackingLabel="Invite"
                  i18n="Invite button"
                  [busy]="busy$ | async"
                  [color]="ButtonColor.SECONDARY"
                  [disabled]="projectContestSelectControl.invalid"
                  [display]="'block'"
                  (click)="handleInviteFreelancer()"
                >
                  Invite Freelancer
                </fl-button>
              </fl-bit>
            </fl-sticky-footer>
          </fl-sticky-footer-wrapper>
        </ng-container>

        <ng-template #noValidProject>
          <fl-bit class="NoValidProjectState">
            <fl-sticky-footer-wrapper>
              <fl-sticky-footer-body>
                <fl-picture
                  class="InviteModalLogo"
                  alt="Empty Project Logo"
                  i18n-alt="Empty project logo Icon"
                  [flMarginBottom]="Margin.SMALL"
                  [src]="'profile/empty-project.svg'"
                ></fl-picture>
                <fl-text
                  i18n="No valid project message"
                  [flMarginBottom]="Margin.SMALL"
                >
                  You don't seem to have an active project at the moment. Why
                  not post a project now? It's free!
                </fl-text>
                <fl-bit class="ActionRow" [flHideMobile]="true">
                  <fl-button
                    flTrackingLabel="EmptyStatePostProject"
                    i18n="Post project button"
                    link="/post-project"
                    [color]="ButtonColor.PRIMARY"
                    [flMarginRight]="Margin.SMALL"
                  >
                    Post a Project
                  </fl-button>
                  <fl-button
                    flTrackingLabel="EmptyStateCancel"
                    i18n="Cancel button"
                    [color]="ButtonColor.DEFAULT"
                    (click)="closeModal()"
                  >
                    Cancel
                  </fl-button>
                </fl-bit>
              </fl-sticky-footer-body>
              <fl-sticky-footer [flShowMobile]="true">
                <fl-bit class="ActionRow">
                  <fl-button
                    flTrackingLabel="EmptyStatePostProject"
                    i18n="Post project button"
                    link="/post-project"
                    [color]="ButtonColor.PRIMARY"
                    [flMarginRight]="Margin.SMALL"
                    [display]="'block'"
                  >
                    Post a Project
                  </fl-button>
                  <fl-button
                    flTrackingLabel="EmptyStateCancel"
                    i18n="Cancel button"
                    [color]="ButtonColor.DEFAULT"
                    [display]="'block'"
                    (click)="closeModal()"
                  >
                    Cancel
                  </fl-button>
                </fl-bit>
              </fl-sticky-footer>
            </fl-sticky-footer-wrapper>
          </fl-bit>
        </ng-template>
      </ng-container>

      <ng-template #loadingOptions>
        <fl-bit class="LoadingState">
          <fl-spinner
            flTrackingLabel="ProjectInviteModalInitialisationSpinner"
          ></fl-spinner>
        </fl-bit>
      </ng-template>
    </fl-bit>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./invite-modal.component.scss'],
})
export class InviteModalComponent implements OnInit, OnDestroy {
  BannerAlertType = BannerAlertType;
  ButtonColor = ButtonColor;
  FontType = FontType;
  FontWeight = FontWeight;
  TextSize = TextSize;
  HeadingType = HeadingType;
  HeadingWeight = HeadingWeight;
  Margin = Margin;
  StickyBehaviour = StickyBehaviour;
  StickyPosition = StickyPosition;

  @Input() freelancerId: number;
  @Input() freelancerName: string;

  private _busy$ = new Rx.Subject<boolean>();
  private _hasError$ = new Rx.Subject<boolean>();

  hasError$ = this._hasError$.asObservable();
  busy$ = this._busy$.asObservable();

  inviteOptions$: Rx.Observable<ReadonlyArray<SelectItem>>;

  projectContestSelectControl = new FormControl(
    '',
    required($localize`Please select a project or contest.`),
  );

  private inviteOptionsSubscription?: Rx.Subscription;

  constructor(
    private auth: Auth,
    private datastore: Datastore,
    private modalRef: ModalRef<InviteModalComponent>,
    private toastAlertService: ToastAlertService,
  ) {}

  ngOnInit(): void {
    const ownerId$ = this.auth.getUserId().pipe(map(id => toNumber(id)));

    const projectsCollection = this.datastore.collection<ProjectsCollection>(
      'projects',
      query =>
        query
          .where('ownerId', '==', ownerId$)
          .where('frontendProjectStatus', '==', FrontendProjectStatusApi.OPEN),
    );

    const contestsCollection = this.datastore.collection<ContestsCollection>(
      'contests',
      query =>
        query
          .where('ownerId', '==', ownerId$)
          .where('status', '==', ContestStatusApi.ACTIVE),
    );

    this.inviteOptions$ = Rx.combineLatest([
      projectsCollection.valueChanges(),
      contestsCollection.valueChanges(),
    ]).pipe(
      map(([projects, contests]) => {
        const nonHireMeProjectOptions = projects
          .filter(project => !project.hireme)
          .map(project => ({
            displayText: project.title,
            value: { id: project.id, isContest: false },
          }));

        const contestOptions = contests.map(contest => ({
          displayText: contest.title,
          value: { id: contest.id, isContest: true },
        }));

        return [...nonHireMeProjectOptions, ...contestOptions];
      }),
    );

    this.inviteOptionsSubscription = this.inviteOptions$.subscribe(options => {
      if (options.length > 0) {
        this.projectContestSelectControl.setValue(options[0].value);
      }
    });
  }

  closeModal(): void {
    this.modalRef.close();
  }

  handleInviteFreelancer(): void {
    this._busy$.next(true);
    this._hasError$.next(false);

    let invitePromise: Promise<BackendPushResponse<
      ContestInviteCollection | ProjectInviteCollection
    >>;

    if (this.projectContestSelectControl.value.isContest === true) {
      invitePromise = this.datastore.createDocument<ContestInviteCollection>(
        'contestInvite',
        {
          contestId: this.projectContestSelectControl.value.id,
          freelancerId: this.freelancerId,
        },
      );
    } else {
      invitePromise = this.datastore.createDocument<ProjectInviteCollection>(
        'projectInvite',
        {
          projectId: this.projectContestSelectControl.value.id,
          freelancerId: this.freelancerId,
        },
      );
    }

    invitePromise.then(res => {
      this._busy$.next(false);

      if (res.status === 'error') {
        this._hasError$.next(true);
        return;
      }

      this.closeModal();
      this.toastAlertService.open('invite-freelancer-success-toast-alert');
    });
  }

  ngOnDestroy() {
    if (this.inviteOptionsSubscription) {
      this.inviteOptionsSubscription.unsubscribe();
    }
  }
}
