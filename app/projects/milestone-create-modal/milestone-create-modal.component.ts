import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ABTest } from '@freelancer/abtest';
import { Auth } from '@freelancer/auth';
import {
  BackendPushErrorResponse,
  BackendUpdateErrorResponse,
  Datastore,
} from '@freelancer/datastore';
import {
  CartItemsCollection,
  CartsCollection,
  Currency,
  HourlyContractsCollection,
  HourlyProjectMilestoneFeesCollection,
  MilestoneDraftsCollection,
  MilestonesCollection,
  ProjectViewProjectsCollection,
  UsersCollection,
  UsersProfileCollection,
} from '@freelancer/datastore/collections';
import {
  PartialPaymentsCartItem,
  PaymentsCart,
} from '@freelancer/payments-cart';
import { TimeUtils } from '@freelancer/time-utils';
import { ModalRef } from '@freelancer/ui';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { ButtonColor } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { InputType } from '@freelancer/ui/input';
import { Margin } from '@freelancer/ui/margin';
import { FontType, FontWeight, TextSize } from '@freelancer/ui/text';
import { UI_CONFIG } from '@freelancer/ui/ui.config';
import { UiConfig } from '@freelancer/ui/ui.interface';
import {
  maxLength,
  maxValue,
  minValueExclusive,
  pattern,
  required,
} from '@freelancer/ui/validators';
import { isFormControl, toNumber } from '@freelancer/utils';
import { ErrorCodeApi } from 'api-typings/errors/errors';
import { ContextTypeApi, DestinationApi } from 'api-typings/payments/payments';
import * as Rx from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { transformProjectFeeToCartItem } from '../shared/cart.helper';

@Component({
  template: `
    <fl-bit
      *ngIf="(areEscrowActionsRequired$ | async) === false; else loading"
      flTrackingSection="MilestoneCreateModal"
    >
      <fl-bit class="Header">
        <fl-heading
          i18n="Create milestone modal header"
          [headingType]="HeadingType.H4"
          [size]="TextSize.MID"
        >
          Create Milestone Payment
        </fl-heading>
      </fl-bit>
      <fl-bit class="MainBody">
        <fl-text
          i18n="Create milestone modal body"
          [flMarginBottom]="Margin.SMALL"
        >
          You can release this payment once you are 100% satisfied with the work
          provided.
        </fl-text>
      </fl-bit>
      <fl-grid>
        <fl-col [col]="12" [colTablet]="4" [flMarginBottom]="Margin.XSMALL">
          <fl-label
            *ngIf="currencyDetails.code !== 'TKN'; else amountInToken"
            i18n="Milestone amount input label"
            [weight]="FontWeight.BOLD"
          >
            Amount ({{ currencyDetails.code }})
          </fl-label>
          <ng-template #amountInToken>
            <fl-label
              i18n="Milestone amount input label"
              [weight]="FontWeight.BOLD"
            >
              Amount (Hours)
            </fl-label>
          </ng-template>
          <ng-container *ngIf="formGroup.controls.amount as control">
            <fl-input
              *ngIf="isFormControl(control)"
              flTrackingLabel="MilestoneCreateModalInputAmount"
              [beforeLabel]="currencyDetails.sign"
              [control]="control"
              placeholder="25"
              i18n-placeholder="Amount of hours"
              [type]="InputType.NUMBER"
            ></fl-input>
          </ng-container>
        </fl-col>
        <fl-col [col]="12" [colTablet]="8" [flMarginBottom]="Margin.XSMALL">
          <fl-label [weight]="FontWeight.BOLD" i18n="Description input label">
            Description
          </fl-label>
          <ng-container *ngIf="formGroup.controls.description as control">
            <fl-input
              *ngIf="isFormControl(control)"
              flTrackingLabel="MilestoneCreateModalInputDescription"
              i18n-placeholder="
                 Example description for milestone description input
              "
              placeholder="e.g. Milestone for the design"
              [control]="control"
              [flMarginBottom]="Margin.SMALL"
              [maxLength]="100"
            ></fl-input>
          </ng-container>
        </fl-col>
      </fl-grid>
      <fl-banner-alert
        *ngIf="(createMilestonePromise | async)?.status === 'error'"
        bannerTitle="Unable to create milestone"
        i18n-bannerTitle="error banner title for milestone creation failed"
        [closeable]="false"
        [flMarginBottom]="Margin.XSMALL"
        [type]="BannerAlertType.ERROR"
        [ngSwitch]="(createMilestonePromise | async)?.errorCode"
      >
        <ng-container
          *ngSwitchCase="ErrorCodeApi.PROFILE_INCOMPLETE"
          i18n="
             Milestone creation failed because freelancer's profile is
            incomplete
          "
        >
          We require that
          <fl-text [fontType]="FontType.SPAN" [weight]="FontWeight.BOLD">
            {{ username }}
          </fl-text>
          completes their profile before a Milestone Payment can be created.
          Please message
          <fl-text [fontType]="FontType.SPAN" [weight]="FontWeight.BOLD">
            {{ username }}
          </fl-text>
          or contact support@freelancer.com with request ID:
          {{ (createMilestonePromise | async)?.requestId }} if the issue
          persists.
        </ng-container>

        <ng-container
          *ngSwitchCase="ErrorCodeApi.ESCROWCOM_ACCOUNT_UNLINKED"
          i18n="
             Milestone creation failed because freelancer's account is not
            linked to Escrow.com
          "
        >
          We require that
          <fl-text [fontType]="FontType.SPAN" [weight]="FontWeight.BOLD">
            {{ username }}
          </fl-text>
          agrees to the Escrow.com terms before a Milestone Payment can be
          created. Please message
          <fl-text [fontType]="FontType.SPAN" [weight]="FontWeight.BOLD">
            {{ username }}
          </fl-text>
          or contact support@freelancer.com with request ID:
          {{ (createMilestonePromise | async)?.requestId }} if the issue
          persists.
        </ng-container>

        <ng-container
          *ngSwitchDefault
          i18n="Contact support for milestone creation network request error"
        >
          The milestone creation request failed. Please try again or contact
          support@freelancer.com with request_id:
          {{ (createMilestonePromise | async)?.requestId }}
        </ng-container>
      </fl-banner-alert>
      <fl-bit class="ActionContainer">
        <fl-button
          flTrackingLabel="MilestoneCreateModalCancelButton"
          i18n="Create milestone modal cancel button"
          [color]="ButtonColor.DEFAULT"
          [flMarginRight]="Margin.XXXSMALL"
          (click)="cancel()"
        >
          Cancel
        </fl-button>
        <ng-container *ngIf="inTest$ | async">
          <fl-button
            flTrackingLabel="MilestoneCreateModalCreateCartButton"
            flTrackingReferenceId="{{ bidderId }}"
            flTrackingReferenceType="bidder_id"
            i18n="Create milestone modal create button"
            [busy]="
              createMilestonePromise &&
              (createMilestonePromise | async) === null
            "
            [color]="ButtonColor.SECONDARY"
            [disabled]="!formGroup.valid"
            [flTrackingExtraParams]="{
              amount: formGroup.get('amount')?.value,
              description: formGroup.get('description')?.value
            }"
            (click)="createMilestoneCart()"
          >
            Create Milestone
          </fl-button>
        </ng-container>
        <ng-container *ngIf="!(inTest$ | async)">
          <fl-button
            flTrackingLabel="MilestoneCreateModalCreateButton"
            flTrackingReferenceId="{{ bidderId }}"
            flTrackingReferenceType="bidder_id"
            i18n="Create milestone modal create button"
            [busy]="
              createMilestonePromise &&
              (createMilestonePromise | async) === null
            "
            [color]="ButtonColor.SECONDARY"
            [disabled]="!formGroup.valid"
            [flTrackingExtraParams]="{
              amount: formGroup.get('amount')?.value,
              description: formGroup.get('description')?.value
            }"
            (click)="createMilestone()"
          >
            Create Milestone
          </fl-button>
        </ng-container>
      </fl-bit>
    </fl-bit>

    <ng-template #loading>
      <fl-spinner
        flTrackingLabel="MilestoneCreateModalSpinner"
        [overlay]="true"
      ></fl-spinner>
    </ng-template>
  `,
  styleUrls: ['./milestone-create-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MilestoneCreateModalComponent implements OnInit, OnDestroy {
  BannerAlertType = BannerAlertType;
  ButtonColor = ButtonColor;
  ErrorCodeApi = ErrorCodeApi;
  FontWeight = FontWeight;
  FontType = FontType;
  HeadingType = HeadingType;
  InputType = InputType;
  isFormControl = isFormControl;
  Margin = Margin;
  TextSize = TextSize;

  formGroup: FormGroup;

  readonly REDIRECT_TIMEOUT = 50;

  isBusy = false;
  showError = false;
  createMilestonePromise: Promise<
    | BackendPushErrorResponse<MilestonesCollection>
    | BackendUpdateErrorResponse<MilestoneDraftsCollection>
    | BackendUpdateErrorResponse<MilestonesCollection>
    | BackendUpdateErrorResponse<CartsCollection>
    | BackendUpdateErrorResponse<CartItemsCollection>
    | undefined
  >;
  inTest$: Rx.Observable<boolean>;
  areEscrowActionsRequired$: Rx.Observable<boolean>;
  areEscrowActionsRequiredSubscription?: Rx.Subscription;

  @Input() projectId: number;
  @Input() bidId: number;
  @Input() currencyDetails: Currency;
  @Input() bidderId: number;
  @Input() username: string;

  constructor(
    private modalRef: ModalRef<MilestoneCreateModalComponent>,
    private auth: Auth,
    private datastore: Datastore,
    private router: Router,
    private cart: PaymentsCart,
    private abtest: ABTest,
    private timeUtils: TimeUtils,
    @Inject(UI_CONFIG) private uiConfig: UiConfig,
  ) {}

  ngOnInit() {
    // set up input formgroup
    this.formGroup = new FormGroup({
      amount: new FormControl('', [
        required($localize`Amount field is required`),
        minValueExclusive(0, $localize`Please enter a greater amount.`),
        maxValue(999999999, $localize`Please enter a lesser amount.`),
        pattern(/^[1-9]\d*(\.\d{1,2})?$/, $localize`Invalid amount specified`),
      ]),
      description: new FormControl('', [
        required($localize`Description is required`),
        maxLength(200, $localize`Please create a shorter description.`),
      ]),
    });

    const project$ = this.datastore
      .document<ProjectViewProjectsCollection>(
        'projectViewProjects',
        this.projectId,
      )
      .valueChanges();

    const isEscrowInteractionRequired$ = this.datastore
      .collection<UsersCollection>(
        'users',
        this.auth
          .getUserId()
          .pipe(map(authUid => [toNumber(authUid), this.bidderId])),
      )
      .valueChanges()
      .pipe(map(users => users.some(u => u.escrowComInteractionRequired)));

    if (this.abtest.isWhitelistUser()) {
      this.inTest$ = Rx.of(true);
    } else if (this.uiConfig.theme === 'arrow') {
      this.inTest$ = Rx.of(false);
    } else {
      this.inTest$ = Rx.combineLatest([
        project$,
        isEscrowInteractionRequired$,
      ]).pipe(
        switchMap(([project, escrowRequired]) => {
          // projects with local jobs not in the test
          if (project.local && !escrowRequired) {
            return Rx.of(false);
          }

          return Rx.of(true);
        }),
      );
    }

    const employerProfile$ = this.datastore
      .document<UsersProfileCollection>(
        'usersProfile',
        project$.pipe(map(project => project.ownerId)),
      )
      .valueChanges();

    this.areEscrowActionsRequired$ = Rx.combineLatest([
      employerProfile$,
      isEscrowInteractionRequired$,
    ]).pipe(
      map(
        ([profile, escrowComInteractionRequired]) =>
          escrowComInteractionRequired &&
          !(
            profile.escrowProfileCompleted && profile.hasLinkedEscrowComAccount
          ),
      ),
    );

    this.areEscrowActionsRequiredSubscription = this.areEscrowActionsRequired$.subscribe(
      escrowRequired => {
        if (escrowRequired) {
          this.timeUtils.setTimeout(() => {
            this.router.navigate([`/projects/${this.projectId}`]);
          }, this.REDIRECT_TIMEOUT);
        }
      },
    );
  }

  ngOnDestroy() {
    if (this.areEscrowActionsRequiredSubscription) {
      this.areEscrowActionsRequiredSubscription.unsubscribe();
    }
  }

  // Create milestone without cart
  createMilestone() {
    this.createMilestonePromise = this.datastore
      .createDocument<MilestonesCollection>('milestones', {
        projectId: this.projectId,
        bidderId: this.bidderId,
        amount: toNumber(this.formGroup.controls.amount.value),
        description: this.formGroup.controls.description.value,
        currency: this.currencyDetails,
        timeCreated: Date.now(),
      })
      .then(res => {
        if (res.status === 'success') {
          this.modalRef.close(true);
        } else {
          if (res.errorCode === ErrorCodeApi.PAYMENT_REQUIRED) {
            // if it fails due to insufficient funds, redirect to deposit page
            // refAction = create_milestone handles the dataToken for us
            const queryParams = {
              amount: toNumber(this.formGroup.controls.amount.value),
              bidderId: this.bidderId,
              currency: this.currencyDetails.id,
              descr: this.formGroup.controls.description.value,
              id: this.projectId, // id is projectId, gets transformed to `pid` later
              refAction: 'create_milestone',
              username: this.username,
              checkBalance: true,
            };
            this.router.navigate(['/deposit'], { queryParams });
          }
          return res;
        }
      });
  }

  /**
   * 1. create cart
   * 2. create milestone draft
   * 3. create cart item
   * 4. add project fee cart item if hourly
   * 5. If success, to payment page, all errors in all steps show and break promise
   *
   */
  createMilestoneCart() {
    this.createMilestonePromise = this.createMilestoneDraft(this.formGroup)
      .then(milestoneDraftResponse => {
        if (milestoneDraftResponse.status !== 'success') {
          throw milestoneDraftResponse;
        }

        const milestoneRequestCartItem = this.transformMilestoneRequestToCartItem(
          this.formGroup,
          milestoneDraftResponse.id,
        );
        return Rx.combineLatest([
          this.datastore
            .document<ProjectViewProjectsCollection>(
              'projectViewProjects',
              this.projectId,
            )
            .valueChanges(),
          this.datastore
            .collection<HourlyContractsCollection>('hourlyContracts', query =>
              query
                .where('projectId', '==', this.projectId)
                .where('active', '==', true)
                .where('bidderId', '==', this.bidderId),
            )
            .valueChanges(),
        ])
          .pipe(take(1))
          .toPromise()
          .then(([project, hourlyContracts]) => {
            // if it's hourly, we need to attach a project fee cart item
            if (project.hourlyProjectInfo && hourlyContracts.length > 0) {
              return this.datastore
                .collection<HourlyProjectMilestoneFeesCollection>(
                  'hourlyProjectMilestoneFees',
                  query =>
                    query
                      .where('projectId', '==', this.projectId)
                      .where(
                        'milestoneAmount',
                        '==',
                        toNumber(this.formGroup.controls.amount.value),
                      ),
                )
                .valueChanges()
                .pipe(
                  take(1),
                  map(res => res[0]),
                )
                .toPromise()
                .then(r => {
                  const { fee, currencyId } = r;
                  const projectFeeItem = transformProjectFeeToCartItem(
                    milestoneDraftResponse.id,
                    currencyId,
                    fee,
                  );
                  return [projectFeeItem, milestoneRequestCartItem];
                });
            }
            return [milestoneRequestCartItem];
          });
      })
      .then(items =>
        this.cart.handle(
          `Chat box create milestone for project ${this.projectId}`,
          {
            destination: DestinationApi.PROJECT_VIEW_PAGE,
            payload: `${this.projectId}`,
          },
          items,
        ),
      )
      .catch(e => e);
  }

  private createMilestoneDraft(milestoneForm: FormGroup) {
    return this.datastore.createDocument<MilestoneDraftsCollection>(
      'milestoneDrafts',
      {
        amount: Number(milestoneForm.value.amount),
        bidderId: this.bidderId,
        bidId: this.bidId,
        currencyId: this.currencyDetails.id,
        description: milestoneForm.value.description,
        milestoneRequestId: undefined,
        projectId: this.projectId,
        projectOwnerId: Date.now(), // FIXME
        timeCreated: Date.now(),
        transactionId: undefined,
      },
    );
  }

  private transformMilestoneRequestToCartItem(
    milestoneForm: FormGroup,
    milestoneDraftId: number,
  ): PartialPaymentsCartItem {
    return {
      contextType: ContextTypeApi.MILESTONE,
      contextId: String(milestoneDraftId),
      description: milestoneForm.value.description,
      currencyId: this.currencyDetails.id,
      amount: Number(milestoneForm.value.amount),
      useBonus: true,
    };
  }

  cancel() {
    this.modalRef.close(false);
  }
}
