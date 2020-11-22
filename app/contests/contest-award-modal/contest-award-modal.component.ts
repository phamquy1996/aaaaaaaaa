import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BackendUpdateResponse, Datastore } from '@freelancer/datastore';
import {
  ContestEntryAction,
  ContestViewEntriesCollection,
  ContestViewEntry,
  User,
} from '@freelancer/datastore/collections';
import { ModalRef } from '@freelancer/ui';
import { ButtonColor } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { PictureDisplay, PictureObjectFit } from '@freelancer/ui/picture';
import { TextSize } from '@freelancer/ui/text';
import { EntryStatusApi } from 'api-typings/contests/contests';
import { ContestAwardModalResponseType } from './contest-award-modal.types';

@Component({
  selector: 'app-contest-award-modal',
  template: `
    <fl-bit class="AwardModal" flTrackingSection="ContestViewPage.AwardModal">
      <fl-heading
        i18n="Award modal title"
        [headingType]="HeadingType.H2"
        [size]="TextSize.MID"
        [flMarginBottom]="Margin.SMALL"
      >
        Award this Entry
      </fl-heading>

      <fl-bit class="ModalEntryDetails" [flMarginBottom]="Margin.SMALL">
        <fl-text
          i18n="Award modal entry number"
          [flMarginRight]="Margin.XXXSMALL"
        >
          #{{ entry.number }}
        </fl-text>
        <fl-username
          displayName=""
          flTrackingLabel="GoToFreelancerProfile"
          flTrackingReferenceType="freelancer_id"
          flTrackingReferenceId="{{ freelancer?.id }}"
          [link]="freelancer?.profileUrl"
          [newTab]="true"
          [username]="freelancer?.username"
        ></fl-username>
      </fl-bit>

      <fl-bit class="EntryImageContainer" [flMarginBottom]="Margin.MID">
        <fl-picture
          alt="Entry image"
          i18n-alt="Alt text for an contest entry thumbnail"
          class="EntryImageContainer-image"
          [boundedWidth]="true"
          [display]="PictureDisplay.BLOCK"
          [externalSrc]="true"
          [src]="entry.files[0]?.thumbnail900Url"
          [objectFit]="PictureObjectFit.SCALE_DOWN"
        ></fl-picture>
      </fl-bit>
      <fl-button
        i18n="Award modal award button label"
        flTrackingLabel="AwardEntry"
        flTrackingReferenceType="entry_id"
        flTrackingReferenceId="{{ entry.id }}"
        flTrackingConversion="Award Contest Entry"
        [busy]="awardBusy"
        [color]="ButtonColor.PRIMARY_PINK"
        [display]="'block'"
        [flMarginBottom]="Margin.XSMALL"
        (click)="onAwardEntry()"
      >
        Award
      </fl-button>

      <fl-text
        class="AwardMultipleText"
        *ngIf="canMultiAward"
        i18n="Award modal select multiple entries contest"
        [flMarginBottom]="Margin.XSMALL"
      >
        or
        <fl-link
          flTrackingLabel="AwardMultipleEntries"
          flTrackingReferenceType="contest_id"
          flTrackingReferenceId="{{ entry.contestId }}"
          (click)="onMultiAwardEntries()"
        >
          select multiple winners for this contest
        </fl-link>
      </fl-text>

      <ng-container *ngIf="entryUpdateStatus$ | async as response">
        <app-entry-update-error
          *ngIf="response.status !== 'success' && response.errorCode"
          [response]="response"
          [source]="ContestEntryAction.AWARD"
          [entry]="entry"
        ></app-entry-update-error>
      </ng-container>
    </fl-bit>
  `,
  styleUrls: ['./contest-award-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContestAwardModalComponent {
  ButtonColor = ButtonColor;
  TextSize = TextSize;
  HeadingType = HeadingType;
  Margin = Margin;
  PictureDisplay = PictureDisplay;
  PictureObjectFit = PictureObjectFit;

  ContestEntryAction = ContestEntryAction;

  entryUpdateStatus$: Promise<
    BackendUpdateResponse<ContestViewEntriesCollection>
  >;
  awardBusy = false;

  @Input() entry: ContestViewEntry;
  @Input() freelancer: User;
  @Input() canMultiAward: boolean;

  constructor(
    private modalRef: ModalRef<ContestAwardModalComponent>,
    private router: Router,
    private datastore: Datastore,
  ) {}

  onAwardEntry() {
    this.awardBusy = true;

    const entryDoc = this.datastore.document<ContestViewEntriesCollection>(
      'contestViewEntries',
      this.entry.id,
    );

    this.entryUpdateStatus$ = entryDoc.update({ status: EntryStatusApi.WON });

    this.entryUpdateStatus$.then(response => {
      this.awardBusy = false;
      if (response.status === 'success') {
        this.router.navigate(['/contest/handover.php'], {
          queryParams: {
            entry_id: this.entry.id,
            from_webapp: true,
          },
        });
      } else {
        this.modalRef.close({
          type: ContestAwardModalResponseType.ERROR,
          errorCode: response.errorCode,
        });
      }
    });
  }

  onMultiAwardEntries() {
    this.modalRef.close({ type: ContestAwardModalResponseType.AWARD_MULTIPLE });
  }
}
