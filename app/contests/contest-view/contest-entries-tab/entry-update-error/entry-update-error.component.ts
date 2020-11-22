import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  BackendPushErrorResponse,
  BackendUpdateErrorResponse,
} from '@freelancer/datastore';
import {
  CartsCollection,
  ContestEntryAction,
  ContestViewEntriesCollection,
  ContestViewEntry,
  CONTEST_ENTRY_AWARD_STATUSES,
} from '@freelancer/datastore/collections';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { FontColor } from '@freelancer/ui/text';

@Component({
  selector: 'app-entry-update-error',
  template: `
    <!-- RATE errors -->
    <ng-container *ngIf="source === ContestEntryAction.RATE">
      <ng-container [ngSwitch]="response?.errorCode">
        <ng-container *ngSwitchCase="'BAD_REQUEST'">
          <fl-text
            i18n="Invalid rating error message"
            [color]="FontColor.ERROR"
          >
            <fl-icon
              [name]="'ui-warning-v2'"
              [color]="IconColor.ERROR"
              [size]="IconSize.SMALL"
              [flMarginBottom]="Margin.XXXSMALL"
            ></fl-icon>
            You can only rate an entry from 1 to 5 stars
          </fl-text>
        </ng-container>

        <ng-container *ngSwitchCase="'METHOD_NOT_ALLOWED'">
          <fl-text
            i18n="Invalid entry for rating error message"
            [color]="FontColor.ERROR"
          >
            <fl-icon
              [name]="'ui-warning-v2'"
              [color]="IconColor.ERROR"
              [size]="IconSize.SMALL"
              [flMarginBottom]="Margin.XXXSMALL"
            ></fl-icon>
            You must rate a valid entry
          </fl-text>
        </ng-container>

        <ng-container *ngSwitchCase="'FORBIDDEN'">
          <fl-text
            i18n="Invalid user for rating error message"
            [color]="FontColor.ERROR"
          >
            <fl-icon
              [name]="'ui-warning-v2'"
              [color]="IconColor.ERROR"
              [size]="IconSize.SMALL"
              [flMarginBottom]="Margin.XXXSMALL"
            ></fl-icon>
            You must be the contest holder or collaborator to rate an entry
          </fl-text>
        </ng-container>

        <ng-container *ngSwitchDefault>
          <fl-text
            i18n="Default rating error message"
            [color]="FontColor.ERROR"
          >
            <fl-icon
              [name]="'ui-warning-v2'"
              [color]="IconColor.ERROR"
              [size]="IconSize.SMALL"
              [flMarginBottom]="Margin.XXXSMALL"
            ></fl-icon>
            We encountered a problem while rating this entry. Please refresh or
            try again.
          </fl-text>
        </ng-container>
      </ng-container>
    </ng-container>

    <!-- LIKE/DISLIKE errors -->
    <ng-container
      *ngIf="
        source === ContestEntryAction.LIKE ||
        source === ContestEntryAction.DISLIKE
      "
    >
      <ng-container [ngSwitch]="response?.errorCode">
        <ng-container *ngSwitchCase="'BAD_REQUEST'">
          <ng-container *ngIf="!entry?.id">
            <fl-text
              i18n="Invalid entry to like/dislike error message"
              [color]="FontColor.ERROR"
            >
              <fl-icon
                [name]="'ui-warning-v2'"
                [color]="IconColor.ERROR"
                [size]="IconSize.SMALL"
                [flMarginBottom]="Margin.XXXSMALL"
              ></fl-icon>
              You must like/dislike a valid entry.
            </fl-text>
          </ng-container>
        </ng-container>

        <ng-container *ngSwitchCase="'CONFLICT'">
          <ng-container *ngIf="entry?.isLiked">
            <fl-text
              i18n="Entry already liked error message"
              [color]="FontColor.ERROR"
            >
              <fl-icon
                [name]="'ui-warning-v2'"
                [color]="IconColor.ERROR"
                [size]="IconSize.SMALL"
                [flMarginBottom]="Margin.XXXSMALL"
              ></fl-icon>
              You have already liked this entry.
            </fl-text>
          </ng-container>
          <ng-container *ngIf="!entry?.isLiked">
            <fl-text
              i18n="Entry already disliked error message"
              [color]="FontColor.ERROR"
            >
              <fl-icon
                [name]="'ui-warning-v2'"
                [color]="IconColor.ERROR"
                [size]="IconSize.SMALL"
                [flMarginBottom]="Margin.XXXSMALL"
              ></fl-icon>
              You can only dislike an entry you already liked.
            </fl-text>
          </ng-container>
        </ng-container>

        <ng-container *ngSwitchCase="'FORBIDDEN'">
          <fl-text
            i18n="Invalid user for liking/disliking error message"
            [color]="FontColor.ERROR"
          >
            <fl-icon
              [name]="'ui-warning-v2'"
              [color]="IconColor.ERROR"
              [size]="IconSize.SMALL"
              [flMarginBottom]="Margin.XXXSMALL"
            ></fl-icon>
            You are not allowed to like this entry.
          </fl-text>
        </ng-container>

        <ng-container *ngSwitchDefault>
          <fl-text
            i18n="Default like/dislike error message"
            [color]="FontColor.ERROR"
          >
            <fl-icon
              [name]="'ui-warning-v2'"
              [color]="IconColor.ERROR"
              [size]="IconSize.SMALL"
              [flMarginBottom]="Margin.XXXSMALL"
            ></fl-icon>
            We encountered a problem while liking/disliking this entry. Please
            refresh or try again.
          </fl-text>
        </ng-container>
      </ng-container>
    </ng-container>

    <!-- REJECT errors -->
    <ng-container *ngIf="source === ContestEntryAction.REJECT">
      <ng-container [ngSwitch]="response?.errorCode">
        <ng-container *ngSwitchCase="'FORBIDDEN'">
          <fl-text
            i18n="Invalid user for rejecting error message"
            [color]="FontColor.ERROR"
          >
            <fl-icon
              [name]="'ui-warning-v2'"
              [color]="IconColor.ERROR"
              [size]="IconSize.SMALL"
              [flMarginBottom]="Margin.XXXSMALL"
            ></fl-icon>
            You must be the contest holder or collaborator to reject an entry
          </fl-text>
        </ng-container>

        <ng-container *ngSwitchCase="'CONFLICT'">
          <ng-container *ngIf="isAwarded(); else otherStatuses">
            <fl-text
              i18n="Invalid awarded entry for rejecting error message"
              [color]="FontColor.ERROR"
            >
              <fl-icon
                [name]="'ui-warning-v2'"
                [color]="IconColor.ERROR"
                [size]="IconSize.SMALL"
                [flMarginBottom]="Margin.XXXSMALL"
              ></fl-icon>
              This entry is awarded. You can only reject active entries.
            </fl-text>
          </ng-container>

          <ng-template #otherStatuses>
            <ng-container [ngSwitch]="entry?.status">
              <ng-container *ngSwitchCase="'withdrawn'">
                <fl-text
                  i18n="Invalid withdrawn entry for rejecting error message"
                  [color]="FontColor.ERROR"
                >
                  <fl-icon
                    [name]="'ui-warning-v2'"
                    [color]="IconColor.ERROR"
                    [size]="IconSize.SMALL"
                    [flMarginBottom]="Margin.XXXSMALL"
                  ></fl-icon>
                  This entry is withdrawn. You can only reject active entries.
                </fl-text>
              </ng-container>

              <ng-container *ngSwitchCase="'withdrawn_eliminated'">
                <fl-text
                  i18n="
                     Invalid withdrawn/rejected entry for rejecting error
                    message
                  "
                  [color]="FontColor.ERROR"
                >
                  <fl-icon
                    [name]="'ui-warning-v2'"
                    [color]="IconColor.ERROR"
                    [size]="IconSize.SMALL"
                    [flMarginBottom]="Margin.XXXSMALL"
                  ></fl-icon>
                  This entry is withdrawn/rejected. You can only reject active
                  entries.
                </fl-text>
              </ng-container>

              <ng-container *ngSwitchCase="'eliminated'">
                <fl-text
                  i18n="Invalid rejected entry for rejecting error message"
                  [color]="FontColor.ERROR"
                >
                  <fl-icon
                    [name]="'ui-warning-v2'"
                    [color]="IconColor.ERROR"
                    [size]="IconSize.SMALL"
                    [flMarginBottom]="Margin.XXXSMALL"
                  ></fl-icon>
                  This entry is already rejected. You can only reject active
                  entries.
                </fl-text>
              </ng-container>

              <ng-container *ngSwitchCase="'bought'">
                <fl-text
                  i18n="Invalid bought entry for rejecting error message"
                  [color]="FontColor.ERROR"
                >
                  <fl-icon
                    [name]="'ui-warning-v2'"
                    [color]="IconColor.ERROR"
                    [size]="IconSize.SMALL"
                    [flMarginBottom]="Margin.XXXSMALL"
                  ></fl-icon>
                  This entry is bought. You can only reject active entries.
                </fl-text>
              </ng-container>

              <ng-container *ngSwitchDefault>
                <fl-text
                  i18n="Invalid non-active entry for rejecting error message"
                  [color]="FontColor.ERROR"
                >
                  <fl-icon
                    [name]="'ui-warning-v2'"
                    [color]="IconColor.ERROR"
                    [size]="IconSize.SMALL"
                    [flMarginBottom]="Margin.XXXSMALL"
                  ></fl-icon>
                  This entry is not active. You can only reject active entries.
                </fl-text>
              </ng-container>
            </ng-container>
          </ng-template>
        </ng-container>

        <ng-container *ngSwitchDefault>
          <fl-text
            i18n="Default reject error message"
            [color]="FontColor.ERROR"
          >
            <fl-icon
              [name]="'ui-warning-v2'"
              [color]="IconColor.ERROR"
              [size]="IconSize.SMALL"
              [flMarginBottom]="Margin.XXXSMALL"
            ></fl-icon>
            We encountered a problem while rejecting this entry. Please try
            again later.
          </fl-text>
        </ng-container>
      </ng-container>
    </ng-container>

    <!-- RECONSIDER errors -->
    <ng-container *ngIf="source === ContestEntryAction.RECONSIDER">
      <ng-container [ngSwitch]="response?.errorCode">
        <ng-container *ngSwitchCase="'FORBIDDEN'">
          <fl-text
            i18n="Invalid user for reconsider error message"
            [color]="FontColor.ERROR"
          >
            <fl-icon
              [name]="'ui-warning-v2'"
              [color]="IconColor.ERROR"
              [size]="IconSize.SMALL"
              [flMarginBottom]="Margin.XXXSMALL"
            ></fl-icon>
            You must be the contest holder or collaborator to reconsider an
            entry.
          </fl-text>
        </ng-container>

        <ng-container *ngSwitchCase="'CONFLICT'">
          <ng-container *ngIf="isAwarded(); else otherStatuses">
            <fl-text
              i18n="Invalid awarded entry for reconsider error message"
              [color]="FontColor.ERROR"
            >
              <fl-icon
                [name]="'ui-warning-v2'"
                [color]="IconColor.ERROR"
                [size]="IconSize.SMALL"
                [flMarginBottom]="Margin.XXXSMALL"
              ></fl-icon>
              This entry has been awarded. You can only reconsider rejected
              entries.
            </fl-text>
          </ng-container>
          <ng-template #otherStatuses>
            <ng-container [ngSwitch]="entry?.status">
              <ng-container *ngSwitchCase="'withdrawn'">
                <fl-text
                  i18n="Invalid withdrawn entry for reconsider error message"
                  [color]="FontColor.ERROR"
                >
                  <fl-icon
                    [name]="'ui-warning-v2'"
                    [color]="IconColor.ERROR"
                    [size]="IconSize.SMALL"
                    [flMarginBottom]="Margin.XXXSMALL"
                  ></fl-icon>
                  This entry is already withdrawn. You can only reconsider
                  rejected entries.
                </fl-text>
              </ng-container>

              <ng-container *ngSwitchCase="'withdrawn_eliminated'">
                <fl-text
                  i18n="
                     Invalid withdrawn/eliminated entry for reconsider error
                    message
                  "
                  [color]="FontColor.ERROR"
                >
                  <fl-icon
                    [name]="'ui-warning-v2'"
                    [color]="IconColor.ERROR"
                    [size]="IconSize.SMALL"
                    [flMarginBottom]="Margin.XXXSMALL"
                  ></fl-icon>
                  This entry is withdrawn/eliminated. You can only reconsider
                  rejected entries.
                </fl-text>
              </ng-container>

              <ng-container *ngSwitchCase="'active'">
                <fl-text
                  i18n="Invalid active entry for reconsider error message"
                  [color]="FontColor.ERROR"
                >
                  <fl-icon
                    [name]="'ui-warning-v2'"
                    [color]="IconColor.ERROR"
                    [size]="IconSize.SMALL"
                    [flMarginBottom]="Margin.XXXSMALL"
                  ></fl-icon>
                  This entry is already active. You can only reconsider rejected
                  entries.
                </fl-text>
              </ng-container>

              <ng-container *ngSwitchCase="'bought'">
                <fl-text
                  i18n="Invalid bought entry for reconsidering error message"
                  [color]="FontColor.ERROR"
                >
                  <fl-icon
                    [name]="'ui-warning-v2'"
                    [color]="IconColor.ERROR"
                    [size]="IconSize.SMALL"
                    [flMarginBottom]="Margin.XXXSMALL"
                  ></fl-icon>
                  This entry is bought. You can only reconsider rejected
                  entries.
                </fl-text>
              </ng-container>
              <ng-container *ngSwitchDefault>
                <fl-text
                  i18n="Invalid non-active entry for reconsider error message"
                  [color]="FontColor.ERROR"
                >
                  <fl-icon
                    [name]="'ui-warning-v2'"
                    [color]="IconColor.ERROR"
                    [size]="IconSize.SMALL"
                    [flMarginBottom]="Margin.XXXSMALL"
                  ></fl-icon>
                  This entry is not active. You can only reconsider rejected
                  entries.
                </fl-text>
              </ng-container>
            </ng-container>
          </ng-template>
        </ng-container>

        <ng-container *ngSwitchDefault>
          <fl-text
            i18n="Default reconsider error message"
            [color]="FontColor.ERROR"
          >
            <fl-icon
              [name]="'ui-warning-v2'"
              [color]="IconColor.ERROR"
              [size]="IconSize.SMALL"
              [flMarginBottom]="Margin.XXXSMALL"
            ></fl-icon>
            We encountered a problem while reconsidering this entry. Please try
            again later.
          </fl-text>
        </ng-container>
      </ng-container>
    </ng-container>

    <!-- AWARD errors -->
    <ng-container *ngIf="source === ContestEntryAction.AWARD">
      <ng-container [ngSwitch]="response?.errorCode">
        <ng-container *ngSwitchCase="'BAD_REQUEST'">
          <!-- FIXME: Add new errors so we can distinguish between different
          entry states -->
          <fl-text
            i18n="Bad request on award entry error message"
            [color]="FontColor.ERROR"
          >
            <fl-icon
              [name]="'ui-warning-v2'"
              [color]="IconColor.ERROR"
              [size]="IconSize.SMALL"
              [flMarginBottom]="Margin.XXXSMALL"
            ></fl-icon>
            Only active entries may be awarded. Please refresh or try again.
          </fl-text>
        </ng-container>

        <ng-container
          *ngSwitchCase="'CONFLICT'"
          flTrackingSection="ContestViewPage.EntryUpdateError"
        >
          <fl-text
            i18n="Contest already has a winner error message"
            [color]="FontColor.ERROR"
          >
            <fl-icon
              [name]="'ui-warning-v2'"
              [color]="IconColor.ERROR"
              [size]="IconSize.SMALL"
              [flMarginBottom]="Margin.XXXSMALL"
            ></fl-icon>
            You've already awarded a winner for this contest. Would you like to
            <fl-link
              flTrackingLabel="GoToEntryFullviewPage"
              flTrackingReferenceType="entry_id"
              flTrackingReferenceId="{{ entry?.id }}"
              [link]="'/contest/' + entry?.contestId + '-byentry-' + entry?.id"
            >
              buy this entry
            </fl-link>
            in addition?
          </fl-text>
        </ng-container>

        <ng-container *ngSwitchCase="'ENTRY_OWNER_ACCOUNT_CLOSED'">
          <fl-text
            i18n="Entry owner suspended error message"
            [color]="FontColor.ERROR"
          >
            <fl-icon
              [name]="'ui-warning-v2'"
              [color]="IconColor.ERROR"
              [size]="IconSize.SMALL"
              [flMarginBottom]="Margin.XXXSMALL"
            ></fl-icon>
            The freelancer who worked on this entry has closed their account.
            Please pick another winner or contact support.
          </fl-text>
        </ng-container>

        <ng-container *ngSwitchCase="'FORBIDDEN'">
          <fl-text i18n="No permission error message" [color]="FontColor.ERROR">
            <fl-icon
              [name]="'ui-warning-v2'"
              [color]="IconColor.ERROR"
              [size]="IconSize.SMALL"
              [flMarginBottom]="Margin.XXXSMALL"
            ></fl-icon>
            You must be logged in as the contest holder to award an entry.
            Please verify if you are using the right account.
          </fl-text>
        </ng-container>

        <ng-container
          *ngSwitchCase="'NOT_FOUND'"
          flTrackingSection="ContestViewPage.EntryUpdateError"
        >
          <fl-text
            i18n="Entry is deleted error message"
            [color]="FontColor.ERROR"
          >
            <fl-icon
              [name]="'ui-warning-v2'"
              [color]="IconColor.ERROR"
              [size]="IconSize.SMALL"
              [flMarginBottom]="Margin.XXXSMALL"
            ></fl-icon>
            This entry has been deleted. Please select another entry to award.
            You may
            <fl-link
              flTrackingLabel="GoToContactSupport"
              flTrackingReferenceType="entry_id"
              flTrackingReferenceId="{{ entry?.id }}"
              [link]="'/contact'"
            >
              contact support
            </fl-link>
            for clarifications.
          </fl-text>
        </ng-container>

        <ng-container *ngSwitchDefault>
          <fl-text i18n="Default award error message" [color]="FontColor.ERROR">
            <fl-icon
              [name]="'ui-warning-v2'"
              [color]="IconColor.ERROR"
              [size]="IconSize.SMALL"
              [flMarginBottom]="Margin.XXXSMALL"
            ></fl-icon>
            Sorry, we've encountered a problem awarding your entry. Please
            refresh or try again.
          </fl-text>
        </ng-container>
      </ng-container>
    </ng-container>

    <!-- BUY errors -->
    <ng-container *ngIf="source === ContestEntryAction.BUY">
      <ng-container *ngIf="entry">
        <ng-container [ngSwitch]="response?.errorCode">
          <ng-container *ngSwitchCase="'ENTRY_OWNER_ACCOUNT_CLOSED'">
            <fl-text
              i18n="Entry owner account closed error message"
              flTrackingSection="ContestViewPage.EntryBuyError"
              [color]="FontColor.ERROR"
            >
              <fl-icon
                [name]="'ui-warning-v2'"
                [color]="IconColor.ERROR"
                [size]="IconSize.SMALL"
                [flMarginBottom]="Margin.XXXSMALL"
              ></fl-icon>
              The freelancer who worked on this entry has closed their account.
              Please pick another winner or contact
              <fl-link
                flTrackingLabel="GoToContactSupport"
                [newTab]="true"
                [link]="'/support'"
              >
                support.
              </fl-link>
            </fl-text>
          </ng-container>

          <ng-container *ngSwitchCase="'CONFLICT'">
            <fl-text
              i18n="Entry is not active error message"
              [color]="FontColor.ERROR"
            >
              <fl-icon
                [name]="'ui-warning-v2'"
                [color]="IconColor.ERROR"
                [size]="IconSize.SMALL"
                [flMarginBottom]="Margin.XXXSMALL"
              ></fl-icon>
              This entry is not active. You can only buy active entries.
            </fl-text>
          </ng-container>

          <ng-container *ngSwitchCase="'BAD_REQUEST'">
            <fl-text
              i18n="Contest has no winner error message"
              [color]="FontColor.ERROR"
            >
              <fl-icon
                [name]="'ui-warning-v2'"
                [color]="IconColor.ERROR"
                [size]="IconSize.SMALL"
                [flMarginBottom]="Margin.XXXSMALL"
              ></fl-icon>
              You may only buy entries from awarded contests. Please award an
              entry first.
            </fl-text>
          </ng-container>

          <ng-container *ngSwitchCase="'FORBIDDEN'">
            <fl-text
              i18n="User has no permission to buy an entry error message"
              [color]="FontColor.ERROR"
            >
              <fl-icon
                [name]="'ui-warning-v2'"
                [color]="IconColor.ERROR"
                [size]="IconSize.SMALL"
                [flMarginBottom]="Margin.XXXSMALL"
              ></fl-icon>
              You must be the contest holder or collaborator to buy an entry.
            </fl-text>
          </ng-container>

          <ng-container *ngSwitchCase="'NO_LONGER_AVAILABLE'">
            <fl-text
              i18n="Buy deleted entry error message"
              [color]="FontColor.ERROR"
            >
              <fl-icon
                [name]="'ui-warning-v2'"
                [color]="IconColor.ERROR"
                [size]="IconSize.SMALL"
                [flMarginBottom]="Margin.XXXSMALL"
              ></fl-icon>
              This entry has been deleted. You may
              <fl-link
                flTrackingLabel="GoToContactSupport"
                flTrackingReferenceType="entry_id"
                flTrackingReferenceId="{{ entry?.id }}"
                [link]="'/contact'"
              >
                contact support
              </fl-link>
              for clarifications.
            </fl-text>
          </ng-container>

          <ng-container *ngSwitchDefault>
            <fl-text
              i18n="Default buy entry error message"
              [color]="FontColor.ERROR"
            >
              <fl-icon
                [name]="'ui-warning-v2'"
                [color]="IconColor.ERROR"
                [size]="IconSize.SMALL"
                [flMarginBottom]="Margin.XXXSMALL"
              ></fl-icon>
              We encountered a problem while buying this entry. Please refresh
              or try again.
            </fl-text>
          </ng-container>
        </ng-container>
      </ng-container>

      <!-- Generic error in multiaward modal when it fails to buy multiple entries -->
      <ng-container *ngIf="!entry">
        <fl-text
          i18n="Default buy entry error message"
          [color]="FontColor.ERROR"
        >
          <fl-icon
            [name]="'ui-warning-v2'"
            [color]="IconColor.ERROR"
            [size]="IconSize.SMALL"
            [flMarginBottom]="Margin.XXXSMALL"
          ></fl-icon>
          We encountered a problem while buying the selected entries for
          multi-award. Please refresh or try again.
        </fl-text>
      </ng-container>
    </ng-container>
  `,
  styleUrls: ['./entry-update-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntryUpdateErrorComponent {
  FontColor = FontColor;
  IconColor = IconColor;
  IconSize = IconSize;
  Margin = Margin;

  ContestEntryAction = ContestEntryAction;

  @Input() response:
    | BackendUpdateErrorResponse<ContestViewEntriesCollection>
    | BackendPushErrorResponse<CartsCollection>;

  @Input() source: ContestEntryAction;
  @Input() entry?: ContestViewEntry;

  isAwarded() {
    return this.entry
      ? CONTEST_ENTRY_AWARD_STATUSES.includes(this.entry.status)
      : false;
  }
}
