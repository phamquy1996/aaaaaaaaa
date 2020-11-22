import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Datastore } from '@freelancer/datastore';
import { BidsCollection, User } from '@freelancer/datastore/collections';
import { Feature, FeatureFlagsService } from '@freelancer/feature-flags';
import { ModalService } from '@freelancer/ui';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { HorizontalAlignment, VerticalAlignment } from '@freelancer/ui/grid';
import { LinkColor, LinkHoverColor } from '@freelancer/ui/link';
import { Margin } from '@freelancer/ui/margin';
import { ModalSize } from '@freelancer/ui/modal';
import { FontColor, FontType, FontWeight, TextSize } from '@freelancer/ui/text';
import { ErrorCodeApi } from 'api-typings/errors/errors';
import { BidAwardStatusApi } from 'api-typings/projects/projects';
import { AwardModalComponent } from 'app/projects/award-modal/award-modal.component';
import { MilestoneCreateModalComponent } from 'app/projects/milestone-create-modal/milestone-create-modal.component';
import * as Rx from 'rxjs';
import { isSupportUser } from '../helpers';
import { ContextBoxState, ContextBoxStateName } from './state-manager';

type ContextState = ContextBoxState;

@Component({
  selector: 'app-context-box',
  template: `
    <ng-container *ngIf="state">
      <ng-container *ngIf="chatBoxMode">
        <fl-text
          class="ContextBox-title"
          *ngIf="state.name === 'hireme'"
          i18n="Chatbox context box title"
        >
          I'm available! Let's work together.
        </fl-text>
        <fl-link
          class="ContextBox-title"
          *ngIf="state.name !== 'hireme'"
          [queryParams]="state?.linkQueryParams"
          flTrackingLabel="ContextBox-link"
          link="{{ state?.linkUrl }}"
        >
          {{ state?.linkText }}
        </fl-link>
        <ng-template [ngTemplateOutlet]="contextButton"></ng-template>
      </ng-container>
      <fl-grid
        *ngIf="!chatBoxMode"
        [hAlign]="HorizontalAlignment.HORIZONTAL_CENTER"
        [vAlign]="VerticalAlignment.VERTICAL_CENTER"
      >
        <fl-col
          [col]="12"
          [colTablet]="extended ? 12 : 9"
          [colDesktopSmall]="extended ? 12 : 9"
        >
          <fl-grid
            *ngIf="!extended"
            [vAlign]="VerticalAlignment.VERTICAL_STRETCH"
          >
            <fl-col [flHideDesktop]="true">
              <fl-text
                *ngIf="!isGroupChatThread"
                [flMarginBottom]="Margin.XXSMALL"
                [weight]="FontWeight.BOLD"
              >
                {{ state.otherUserName }}
                <fl-online-indicator
                  [isOnline]="isOnline"
                  [flMarginRight]="Margin.SMALL"
                ></fl-online-indicator>
              </fl-text>
              <fl-text
                *ngIf="isGroupChatThread"
                [flMarginBottom]="Margin.XXSMALL"
                [weight]="FontWeight.BOLD"
              >
                {{ otherMembersList }}
              </fl-text>
            </fl-col>
            <fl-col>
              <fl-bit
                class="ContextBox-header"
                [flMarginBottom]="Margin.XXSMALL"
              >
                <fl-text
                  *ngIf="state.name === 'hireme'"
                  i18n="Chatbox context box title"
                >
                  I'm available! Let's work together.
                </fl-text>
                <fl-link
                  *ngIf="state.name !== 'hireme'"
                  class="ContextBox-projectLink"
                  flTrackingLabel="Inbox.ProjectLink"
                  [link]="state.linkUrl"
                  [queryParams]="state.linkQueryParams"
                  [color]="chatBoxMode ? LinkColor.INHERIT : LinkColor.DARK"
                  [hoverColor]="LinkHoverColor.INHERIT"
                >
                  {{ state.linkText }}
                </fl-link>
              </fl-bit>
              <fl-text
                *ngIf="state.name !== 'hireme'"
                i18n="Inbox context header submit date"
                [fontType]="FontType.PARAGRAPH"
                [color]="FontColor.MID"
                [size]="TextSize.XXSMALL"
                [flHideMobile]="true"
              >
                Posted
                <fl-relative-time
                  [date]="state.timeSubmitted"
                  [size]="TextSize.XXSMALL"
                ></fl-relative-time>
              </fl-text>
            </fl-col>
          </fl-grid>
          <fl-bit *ngIf="extended">
            <fl-text [flMarginBottom]="Margin.XXSMALL">
              <ng-container
                *ngIf="state.name === 'hireme'"
                i18n="Chatbox context box description"
              >
                I'm available! Let's work together.
              </ng-container>
              <ng-container
                *ngIf="
                  state.name === 'projectAwardHourly' ||
                  state.name === 'projectAwardFixed'
                "
                i18n="Chatbox context box description"
              >
                To start working with this freelancer, award
                {{ state.otherUserName }} the project. They will be notified
                that you have chosen them for your project.
              </ng-container>
              <ng-container
                *ngIf="
                  state.name === 'projectAcceptHourly' ||
                  state.name === 'projectAcceptFixed' ||
                  state.name === 'projectAcceptRedirect'
                "
                i18n="Chatbox context box description"
              >
                {{ state.otherUserName }} has chosen you for their project.
                Accept the project to begin working.
              </ng-container>
              <ng-container
                *ngIf="
                  state.name === 'setupBilling' && (billingEnabled$ | async)
                "
                i18n="Chatbox context box description"
              >
                Set up billing to allow {{ state.otherUserName }} to track hours
                they work, and invoice you automatically each Monday.
              </ng-container>
              <ng-container
                *ngIf="
                  state.name === 'milestoneCreateRedirect' ||
                  state.name === 'milestoneCreateFromRequest' ||
                  state.name === 'milestoneCreateInitial' ||
                  state.name === 'milestoneCreate'
                "
                i18n="Chatbox context box description"
              >
                Create a Milestone Payment for {{ state.otherUserName
                }}<ng-container *ngIf="!state.otherUserName?.endsWith('.')"
                  >.</ng-container
                >
                This is a secure deposit for work they are about to do which you
                can release when you're happy.
              </ng-container>
              <ng-container
                *ngIf="state.name === 'trackTime'"
                i18n="Chatbox context box description"
              >
                Track the hours you are working, and we will automatically
                invoice {{ state.otherUserName }} each Monday.
              </ng-container>
              <ng-container
                *ngIf="
                  state.name === 'requestMilestone' ||
                  state.name === 'requestMilestoneRedirect'
                "
                i18n="Chatbox context box description"
              >
                Create a request for {{ state.otherUserName }} to make a
                Milestone Payment. They will be notified that you have requested
                a milestone payment.
              </ng-container>
            </fl-text>
          </fl-bit>
        </fl-col>
        <fl-col
          [col]="12"
          [colTablet]="extended ? 12 : 3"
          [colDesktopSmall]="extended ? 12 : 3"
        >
          <fl-bit class="ContextBox-buttonWrapper">
            <ng-template [ngTemplateOutlet]="contextButton"></ng-template>
          </fl-bit>
        </fl-col>
      </fl-grid>
      <ng-template #contextButton>
        <ng-container
          *ngIf="(billingEnabled$ | async) || state?.name !== 'setupBilling'"
        >
          <fl-button
            class="ContextBox-button"
            flTrackingLabel="contextBoxButton-{{ state?.name }}"
            *ngIf="state.button"
            [busy]="buttonBusy"
            [color]="buttonColor"
            [size]="ButtonSize.MINI"
            [sizeTablet]="chatBoxMode ? ButtonSize.MINI : ButtonSize.SMALL"
            [attr.data-uitest-target]="state?.button?.tag"
            (click)="handleButtonClick()"
          >
            <ng-container
              *ngIf="state.name === 'hireme'"
              i18n="Chatbox context box button"
            >
              Hire Me!
            </ng-container>
            <ng-container
              *ngIf="
                state.name === 'projectAwardHourly' ||
                state.name === 'projectAwardFixed'
              "
              i18n="Chatbox context box button"
            >
              Award
            </ng-container>
            <ng-container
              *ngIf="
                state.name === 'projectAcceptHourly' ||
                state.name === 'projectAcceptFixed' ||
                state.name === 'projectAcceptRedirect'
              "
              i18n="Chatbox context box button"
            >
              Accept
            </ng-container>
            <ng-container
              *ngIf="state.name === 'setupBilling'"
              i18n="Chatbox context box button"
            >
              Setup Billing
            </ng-container>
            <ng-container
              *ngIf="state.name === 'payFailedInvoices'"
              i18n="Chatbox context box button"
            >
              Pay Outstanding Bill
            </ng-container>
            <ng-container
              *ngIf="
                state.name === 'milestoneCreateRedirect' ||
                state.name === 'milestoneCreateFromRequest' ||
                state.name === 'milestoneCreateInitial' ||
                state.name === 'milestoneCreate'
              "
              i18n="Chatbox context box button"
            >
              Create Milestone
            </ng-container>
            <ng-container
              *ngIf="state.name === 'trackTime'"
              i18n="Chatbox context box button"
            >
              Track Time
            </ng-container>
            <ng-container
              *ngIf="
                state.name === 'requestMilestone' ||
                state.name === 'requestMilestoneRedirect'
              "
              i18n="Chatbox context box button"
            >
              Request Milestone
            </ng-container>
            <ng-container
              *ngIf="
                state.name === 'projectAdmin' || state.name === 'userAdmin'
              "
              i18n="Chatbox context box button"
            >
              View Admin
            </ng-container>
          </fl-button>
        </ng-container>
      </ng-template>
    </ng-container>
    <ng-container *ngIf="!state && !chatBoxMode">
      <fl-text [flMarginBottom]="Margin.XXXSMALL" [weight]="FontWeight.BOLD">
        {{ otherMembersList }}
        <fl-online-indicator
          *ngIf="!isGroupChatThread"
          [isOnline]="isOnline"
          [flMarginRight]="Margin.SMALL"
        ></fl-online-indicator>
      </fl-text>
      <fl-text
        *ngIf="!isGroupChatThread && isOtherMemberSupportUser"
        i18n="Chatbox header staff indicator"
        [color]="FontColor.MID"
        [fontType]="FontType.PARAGRAPH"
        [size]="TextSize.XXSMALL"
      >
        Freelancer Staff
      </fl-text>
    </ng-container>
  `,
  styleUrls: ['./context-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextBoxComponent implements OnChanges, OnInit {
  ButtonSize = ButtonSize;
  FontType = FontType;
  FontColor = FontColor;
  TextSize = TextSize;
  FontWeight = FontWeight;
  HorizontalAlignment = HorizontalAlignment;
  LinkColor = LinkColor;
  LinkHoverColor = LinkHoverColor;
  Margin = Margin;
  VerticalAlignment = VerticalAlignment;

  @Input() state: ContextState;
  @Input() isOnline: boolean;
  @Input() isGroupChatThread: boolean;
  @Input() otherMembers: ReadonlyArray<User> = [];

  // FIXME: clean up the states here
  // chatBoxMode = true; extended = any => chat box mode (project link + button only)
  // chatBoxMode = false; extended = true => sidebar mode (shows long description, button below text)
  //   should be equivalent to desktop small +
  // chatBoxMode = false; extended = false => inbox header mode (project title only, button next to text)
  //   should be equivalent to mobile | tablet
  @Input() extended = false;
  @Input() chatBoxMode: boolean;

  buttonColor = ButtonColor.SECONDARY;
  buttonBusy = false;
  greenBtnStates: ReadonlyArray<ContextBoxStateName | 'hireme'> = [
    'projectAwardHourly',
    'projectAwardFixed',
    'projectAcceptFixed',
    'projectAcceptHourly',
    'projectAcceptRedirect',
  ];
  billingEnabled$: Rx.Observable<boolean>;
  otherMembersList: string;
  isOtherMemberSupportUser: boolean;

  constructor(
    private router: Router,
    private modalService: ModalService,
    private datastore: Datastore,
    private changeDetectorRef: ChangeDetectorRef,
    private featureFlagService: FeatureFlagsService,
  ) {}

  ngOnInit() {
    this.billingEnabled$ = this.featureFlagService.getFlag(Feature.BILLING);
  }

  handleButtonClick() {
    if (!this.state || !this.state.name) {
      return;
    }
    switch (this.state.name) {
      case 'hireme':
      case 'milestoneCreateRedirect':
      case 'projectAwardHourly':
      case 'projectAcceptRedirect':
      case 'setupBilling':
      case 'trackTime':
      case 'requestMilestoneRedirect':
      case 'payFailedInvoices':
        if (this.state.button && this.state.button.data.type === 'LINK') {
          this.goToUrl(
            this.state.button.data.buttonUrl,
            this.state.button.data.buttonExtras,
          );
        }
        break;
      case 'projectAwardFixed':
        this.awardFixed();
        break;
      case 'milestoneCreate':
      case 'milestoneCreateInitial':
      case 'milestoneCreateFromRequest':
        this.createMilestone();
        break;
      case 'requestMilestone':
        this.requestMilestone();
        break;
      case 'projectAcceptHourly':
      case 'projectAcceptFixed':
        this.accept();
        break;
      default:
        console.warn('Unknown context box state button clicked');
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.state && this.state.name) {
      this.buttonColor = this.greenBtnStates.includes(this.state.name)
        ? ButtonColor.SUCCESS
        : ButtonColor.SECONDARY;
    }

    if ('otherMembers' in changes) {
      const memberList = this.otherMembers
        .slice(0, 3)
        .map(user => user.displayName)
        .join(', ');

      if (this.otherMembers.length > 3) {
        const remainingMembers = this.otherMembers.length - 3;
        this.otherMembersList = `${memberList}, +${remainingMembers}`;
      } else {
        this.otherMembersList = memberList;
      }

      this.isOtherMemberSupportUser = !!this.otherMembers.find(user =>
        isSupportUser(user),
      );
    }
  }

  goToUrl(url: string, extras?: NavigationExtras) {
    if (extras) {
      this.router.navigate([url], extras);
    } else {
      this.router.navigate([url]);
    }
  }

  awardFixed() {
    if (
      this.state &&
      this.state.button &&
      this.state.button.data.type === 'AWARD_FIXED'
    ) {
      const { bidId, projectId } = this.state.button.data;
      this.buttonBusy = true;
      const modalRef = this.modalService.open(AwardModalComponent, {
        inputs: {
          bidId,
          projectId,
        },
        size: ModalSize.LARGE,
        edgeToEdge: true,
        mobileFullscreen: true,
      });
      // unbusy the button once modal is open
      modalRef
        .afterOpen()
        .toPromise()
        .then(_ => {
          this.buttonBusy = false;
          this.changeDetectorRef.markForCheck();
        });
      // redirect to PVP after successful award
      modalRef
        .afterClosed()
        .toPromise()
        .then(res => {
          if (res) {
            this.goToUrl(`/projects/${projectId}.html`, {
              fragment: '/management',
            });
          }
        });
    }
  }

  createMilestone() {
    if (
      this.state &&
      this.state.button &&
      this.state.button.data.type === 'CREATE_MILESTONE' &&
      this.state.name !== 'hireme'
    ) {
      this.buttonBusy = true;
      const {
        bidderId,
        bidId,
        projectId,
        currencyDetails,
      } = this.state.button.data;
      const username = this.state.otherUserName;
      this.modalService
        .open(MilestoneCreateModalComponent, {
          inputs: {
            bidId,
            projectId,
            currencyDetails,
            username,
            bidderId,
          },
          size: ModalSize.SMALL,
        })
        .afterOpen()
        .toPromise()
        .then(() => {
          this.changeDetectorRef.markForCheck();
          this.buttonBusy = false;
        });
    }
  }

  requestMilestone() {
    if (
      this.state &&
      this.state.button &&
      this.state.name !== 'hireme' &&
      this.state.button.data.type === 'REQUEST_MILESTONE'
    ) {
      this.buttonBusy = true;
      this.router.navigate(
        ['/projects', this.state.button.data.projectId, 'payments'],
        {
          queryParams: {
            request_milestone: 1,
          },
        },
      );
      this.buttonBusy = false;
    }
  }

  accept() {
    if (
      this.state &&
      this.state.button &&
      this.state.button.data.type === 'ACCEPT'
    ) {
      this.buttonBusy = true;
      // FIXME: WHy can't this be inline?
      const { projectId } = this.state.button.data;
      this.datastore
        .collection<BidsCollection>('bids', query =>
          query.where('projectId', '==', projectId),
        )
        .update(this.state.button.data.bidId, {
          awardStatus: BidAwardStatusApi.AWARDED,
        })
        .then(response => {
          this.buttonBusy = false;
          this.changeDetectorRef.markForCheck();

          if (
            response.status === 'error' &&
            (response.errorCode === ErrorCodeApi.ESCROWCOM_ACCOUNT_UNLINKED ||
              response.errorCode === ErrorCodeApi.PROFILE_INCOMPLETE ||
              response.errorCode === ErrorCodeApi.NDA_NOT_SIGNED)
          ) {
            this.goToUrl(`/projects/${projectId}`);
          }
        });
    }
  }
}
