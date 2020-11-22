import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
} from '@angular/core';
import { ContestInterestedFreelancer } from '@freelancer/datastore/collections';
import { ModalRef } from '@freelancer/ui';
import { ButtonColor } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { StickyBehaviour, StickyPosition } from '@freelancer/ui/sticky';
import { FontColor, FontType, TextSize } from '@freelancer/ui/text';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import * as Rx from 'rxjs';

@Component({
  selector: 'app-contest-interested-freelancers-modal',
  template: `
    <fl-sticky-footer-wrapper
      flTrackingSection="ContestViewPage.InterestedFreelancersModal"
    >
      <fl-sticky-footer-body>
        <fl-grid
          class="InterestedFreelancer-container"
          *ngIf="
            interestedFreelancers$ | async as interestedFreelancers;
            else loading
          "
        >
          <fl-col [col]="12" [flMarginBottom]="Margin.XSMALL">
            <fl-bit class="InterestedFreelancer-header">
              <fl-heading
                *ngIf="interestedFreelancers.length > 1; else singularTitle"
                i18n="Interested freelancers modal title"
                [headingType]="HeadingType.H2"
                [size]="TextSize.MID"
              >
                Interested Freelancers
              </fl-heading>
              <ng-template #singularTitle>
                <fl-heading
                  i18n="Interested freelancer modal title"
                  [headingType]="HeadingType.H2"
                  [size]="TextSize.MID"
                >
                  Interested Freelancer
                </fl-heading>
              </ng-template>
              <fl-bit>
                <fl-text
                  *ngIf="interestedFreelancers.length > 1; else singularUser"
                  i18n="interested freelancers description"
                  [color]="FontColor.MID"
                  [fontType]="FontType.SPAN"
                  [size]="TextSize.XXSMALL"
                >
                  These users are participating and may enter before your
                  contest ends:
                </fl-text>
                <ng-template #singularUser>
                  <fl-text
                    i18n="interested freelancer description"
                    [color]="FontColor.MID"
                    [fontType]="FontType.SPAN"
                    [size]="TextSize.XXSMALL"
                  >
                    This user is participating and may enter before your contest
                    ends:
                  </fl-text>
                </ng-template>
              </fl-bit>
            </fl-bit>
          </fl-col>

          <fl-col [col]="12">
            <perfect-scrollbar class="InterestedFreelancer-scrollbar">
              <fl-grid class="InterestedFreelancer-list">
                <fl-col
                  class="InterestedFreelancer-section"
                  *ngFor="let freelancer of interestedFreelancers"
                  [col]="6"
                  [colDesktopSmall]="4"
                  [flMarginBottom]="Margin.XXSMALL"
                >
                  <fl-username
                    displayName=""
                    flTrackingLabel="GoToFreelancerProfile"
                    flTrackingReferenceType="freelancer_id"
                    flTrackingReferenceId="{{ freelancer?.id }}"
                    [link]="freelancer?.profileUrl"
                    [newTab]="true"
                    [username]="freelancer?.username"
                  ></fl-username>
                </fl-col>
              </fl-grid>
            </perfect-scrollbar>
          </fl-col>
        </fl-grid>

        <fl-grid class="InterestedFreelancer-footer" [flHideMobile]="true">
          <fl-col [col]="3" [pull]="'right'">
            <fl-button
              i18n="Ok button"
              flTrackingLabel="CloseModal"
              [display]="'block'"
              [color]="ButtonColor.DEFAULT"
              [flMarginRight]="Margin.XSMALL"
              (click)="handleClose()"
            >
              OK
            </fl-button>
          </fl-col>
        </fl-grid>
      </fl-sticky-footer-body>
      <fl-sticky-footer [flShowMobile]="true">
        <fl-bit class="InterestedFreelancerMobile-footer">
          <fl-button
            class="InterestedFreelancerMobile-footer-button"
            i18n="Ok button"
            flTrackingLabel="CloseModal"
            [display]="'block'"
            [color]="ButtonColor.DEFAULT"
            (click)="handleClose()"
          >
            OK
          </fl-button>
        </fl-bit>
      </fl-sticky-footer>
    </fl-sticky-footer-wrapper>

    <ng-template #loading>
      <fl-bit class="InterestedFreelancer-loading">
        <fl-spinner
          flTrackingLabel="InterestedFreelancersLoadingSpinner"
          class="InterestedFreelancer-loading-spinner"
        ></fl-spinner>
      </fl-bit>
    </ng-template>
  `,
  styleUrls: ['./contest-interested-freelancers-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContestInterestedFreelancersModalComponent {
  ButtonColor = ButtonColor;
  FontColor = FontColor;
  TextSize = TextSize;
  FontType = FontType;
  HeadingType = HeadingType;
  IconColor = IconColor;
  IconSize = IconSize;
  Margin = Margin;
  StickyBehaviour = StickyBehaviour;
  StickyPosition = StickyPosition;

  @Input() interestedFreelancers$: Rx.Observable<
    ReadonlyArray<ContestInterestedFreelancer>
  >;

  @ViewChild(PerfectScrollbarComponent)
  psbComponent: PerfectScrollbarComponent;

  constructor(
    private modalRef: ModalRef<ContestInterestedFreelancersModalComponent>,
  ) {}

  handleClose() {
    this.modalRef.close();
  }
}
