import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Auth } from '@freelancer/auth';
import { Datastore } from '@freelancer/datastore';
import { UsersCollection } from '@freelancer/datastore/collections';
import { Feature } from '@freelancer/feature-flags';
import { ModalRef } from '@freelancer/ui';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { HeadingType, HeadingWeight } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, TextSize } from '@freelancer/ui/text';
import { toNumber } from '@freelancer/utils';
import { RoleApi } from 'api-typings/common/common';
import * as Rx from 'rxjs';
import { map, take } from 'rxjs/operators';

@Component({
  template: `
    <fl-bit class="SkillsEditModalContainer">
      <fl-bit class="SkillsHeadingSection">
        <fl-heading
          i18n="Select skills modal header"
          [flMarginBottom]="Margin.XSMALL"
          [headingType]="HeadingType.H2"
          [size]="TextSize.MID"
          [weight]="HeadingWeight.BOLD"
        >
          Select your skills and expertise
        </fl-heading>

        <fl-banner-alert
          *ngIf="showUndefinedMembershipError"
          i18n="Error updating membership message"
          [closeable]="false"
          [flMarginBottom]="Margin.SMALL"
          [type]="BannerAlertType.ERROR"
        >
          There was an issue updating membership. Please try again. If the
          problem persists
          <fl-link
            link="/support"
            flTrackingLabel="ErrorSavingSupportLink"
            flTrackingSection="{{ trackingSection }}"
          >
            contact support.
          </fl-link>
        </fl-banner-alert>
      </fl-bit>

      <fl-skills
        [maxSkillLimit]="maxSkillLimit"
        [trackingSection]="trackingSection"
        (showMaxSkillsLimit)="handleShowMaxSkillsLimit()"
        (saveSkills)="handleSaveSkills($event)"
      ></fl-skills>
    </fl-bit>

    <ng-container *flFeature="Feature.MEMBERSHIPS">
      <app-skills-limit-reached
        *ngIf="showMembershipModal"
        (close)="handleLimitReachedDialogCloseClicked($event)"
        (undefinedMembershipPackage)="handleUndefinedMembershipPackage()"
      ></app-skills-limit-reached>
    </ng-container>
  `,
  styleUrls: ['./skills-edit-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsEditModalComponent implements OnInit {
  BannerAlertType = BannerAlertType;
  Feature = Feature;
  FontColor = FontColor;
  HeadingType = HeadingType;
  HeadingWeight = HeadingWeight;
  Margin = Margin;
  TextSize = TextSize;

  isFreelancer$: Rx.Observable<boolean>;
  showExceededLimitErrorMessage$: Rx.Observable<boolean>;
  userId$: Rx.Observable<number>;

  maxSkillLimit?: number;
  showMembershipModal = false;
  showUndefinedMembershipError = false;
  trackingSection = 'SkillsEditModal';

  constructor(
    private auth: Auth,
    private datastore: Datastore,
    private modalRef: ModalRef<SkillsEditModalComponent>,
  ) {}

  ngOnInit() {
    this.userId$ = this.auth.getUserId().pipe(map(id => toNumber(id)));
    const userDocument = this.datastore.document<UsersCollection>(
      'users',
      this.userId$,
    );

    this.isFreelancer$ = userDocument
      .valueChanges()
      .pipe(map(user => user.role === RoleApi.FREELANCER));
  }

  handleUndefinedMembershipPackage(): void {
    this.showUndefinedMembershipError = true;
  }

  /**
   * Handles the membership upsell close and updates the maxSkillLimit
   *
   * @param newMaxSkillsLimit This is the new max skills limit
   *                          after updating the membership
   */
  handleLimitReachedDialogCloseClicked(newMaxSkillsLimit?: number): void {
    this.maxSkillLimit = newMaxSkillsLimit;
    this.showMembershipModal = false;
  }

  handleShowMaxSkillsLimit(): void {
    this.isFreelancer$
      .pipe(take(1))
      .toPromise()
      .then(isFreelancer => {
        if (isFreelancer) {
          this.showMembershipModal = true;
        }
      });
  }

  handleSaveSkills(changesMade: boolean): void {
    // Close the modal with a boolean of if any changes were made. This is used
    // to determine if the user profile top skills needs to be updated.
    this.modalRef.close(changesMade);
  }
}
