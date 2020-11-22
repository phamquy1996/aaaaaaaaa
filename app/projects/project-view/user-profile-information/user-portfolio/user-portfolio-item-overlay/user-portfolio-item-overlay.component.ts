import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Auth } from '@freelancer/auth';
import { DatastoreCollection } from '@freelancer/datastore';
import {
  FreelancerReputation,
  LocalHourlyRate,
  PortfolioItem,
  ProfileCategoriesCollection,
  ProfileCategory,
  ProfileViewUser,
  Skill,
  SkillsCollection,
} from '@freelancer/datastore/collections';
import { ModalService } from '@freelancer/ui';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { VerticalAlignment } from '@freelancer/ui/grid';
import { IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { ModalColor, ModalSize } from '@freelancer/ui/modal';
import { FontColor, FontWeight, ReadMore, TextSize } from '@freelancer/ui/text';
import { toNumber } from '@freelancer/utils';
import { ContentTypeApi } from 'api-typings/users/users';
import { HireMeWebappModalComponent } from 'app/hire-me/hire-me-webapp-modal/hire-me-webapp-modal.component';
import { HireMeUser } from 'app/hire-me/hire-me.component';
import {
  AwardProjectHireMeState,
  AwardProjectModel,
} from 'app/user-profile/user-profile-award-project.types';
import * as Rx from 'rxjs';
import { map, take } from 'rxjs/operators';

@Component({
  template: `
    <fl-grid
      *ngIf="portfolioItem$ | async as portfolioItem; else loading"
      class="PortfolioItemContainer"
      flTrackingSection="UserPortfolioModal"
      [vAlign]="VerticalAlignment.VERTICAL_STRETCH"
    >
      <fl-col
        class="ItemColumn"
        [ngClass]="{
          'ItemColumn--dark': darkBackground$ | async
        }"
        [col]="12"
        [colTablet]="8"
        [ngSwitch]="portfolioItem.contentType"
      >
        <app-user-portfolio-item-heading
          [categories]="itemCategories$ | async"
          [darkBackground]="darkBackground$ | async"
          [portfolioItem]="portfolioItem"
        >
        </app-user-portfolio-item-heading>
        <app-article-item
          *ngSwitchCase="'article'"
          [portfolioItem]="portfolioItem"
        ></app-article-item>
        <app-picture-item
          *ngSwitchCase="'picture'"
          [portfolioItem]="portfolioItem"
        ></app-picture-item>
        <app-video-item
          *ngSwitchCase="'video'"
          [portfolioItem]="portfolioItem"
        ></app-video-item>
        <app-audio-item
          *ngSwitchCase="'audio'"
          [portfolioItem]="portfolioItem"
        ></app-audio-item>
        <app-code-item
          *ngSwitchCase="'code'"
          [portfolioItem]="portfolioItem"
        ></app-code-item>
        <app-other-item
          *ngSwitchDefault
          [portfolioItem]="portfolioItem"
        ></app-other-item>
      </fl-col>
      <fl-col [colTablet]="4" [col]="12" class="SideUserColumn">
        <fl-bit class="SideUserDetails">
          <app-user-portfolio-user-details
            [flMarginBottom]="Margin.SMALL"
            [isOnline]="isOnline$ | async"
            [user]="user$ | async"
          >
          </app-user-portfolio-user-details>
          <app-user-portfolio-user-reputation
            [localRate]="localHourlyRate$ | async"
            [reputation]="reputation$ | async"
          >
          </app-user-portfolio-user-reputation>
          <app-user-profile-hire-me-action-state
            [awardProjectHireMeState$]="awardProjectHireMeState$"
          >
            <ng-container loading-state>
              <ng-template [ngTemplateOutlet]="loading"></ng-template>
            </ng-container>

            <ng-container award-project-state>
              <ng-container
                *ngIf="
                  awardProjectBid$ | async as awardProjectModel;
                  else loading
                "
              >
                <fl-button
                  display="block"
                  i18n="User Portfolio sidebar Award"
                  flTrackingLabel="PortfolioItemPreviewAwardMeButton"
                  [color]="ButtonColor.SUCCESS"
                  [flMarginBottom]="Margin.MID"
                  [fragment]="'proposals'"
                  [link]="awardProjectModel.projectLink"
                  [queryParams]="{ awardBid: awardProjectModel.bidId }"
                  [size]="ButtonSize.LARGE"
                >
                  Award
                </fl-button>
              </ng-container>
            </ng-container>

            <ng-container hire-me-state>
              <fl-button
                *ngIf="hireMeUser$ | async as hireMeUser"
                display="block"
                i18n="User Portfolio sidebar Hire Me"
                flTrackingLabel="PortfolioItemPreviewHireMeButton"
                [flMarginBottom]="Margin.MID"
                [color]="ButtonColor.SECONDARY"
                [size]="ButtonSize.LARGE"
                (click)="hiremeAction()"
              >
                Hire {{ hireMeUser.profileUserDisplayName }}
              </fl-button>
            </ng-container>

            <ng-template #loading>
              <fl-button
                display="block"
                flTrackingLabel="PortfolioItemPreviewLoadingButton"
                [flMarginBottom]="Margin.MID"
                [size]="ButtonSize.LARGE"
                [disabled]="true"
                [busy]="true"
              ></fl-button>
            </ng-template>
          </app-user-profile-hire-me-action-state>

          <fl-bit [flMarginBottom]="Margin.MID">
            <fl-text
              i18n="About title label"
              [size]="TextSize.XSMALL"
              [color]="FontColor.DARK"
              [weight]="FontWeight.BOLD"
              [flMarginBottom]="Margin.XSMALL"
            >
              About the project
            </fl-text>
            <fl-text
              class="SideUserDetails-projectDesc"
              [displayLineBreaks]="true"
              [size]="TextSize.XSMALL"
              [maxLines]="6"
              [readMore]="ReadMore.LINK"
            >
              {{ portfolioItem.description }}
            </fl-text>
          </fl-bit>

          <app-user-portfolio-item-skills
            *ngIf="!(skillsCollection.status$ | async)?.error"
            [itemSkills]="itemSkills$ | async"
          ></app-user-portfolio-item-skills>

          <fl-hr
            [flMarginBottom]="
              !(isViewerProfileOwner$ | async) ? Margin.MID : Margin.NONE
            "
          ></fl-hr>

          <app-user-portfolio-share-item
            *ngIf="!(isViewerProfileOwner$ | async)"
            [user]="user$ | async"
            [portfolioItem]="portfolioItem$ | async"
          ></app-user-portfolio-share-item>
        </fl-bit>
      </fl-col>
    </fl-grid>
    <ng-template #loading>
      <fl-grid>
        <fl-col [col]="8">
          <fl-loading-text [rows]="1" [padded]="false"></fl-loading-text>
        </fl-col>
        <fl-col [col]="4">
          <fl-loading-text
            *ngFor="let n of [0, 1, 2, 3]"
            [rows]="1"
            [padded]="false"
          ></fl-loading-text>
        </fl-col>
      </fl-grid>
    </ng-template>
  `,
  styleUrls: ['./user-portfolio-item-overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPortfolioItemOverlayComponent implements OnInit {
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  FontColor = FontColor;
  TextSize = TextSize;
  FontWeight = FontWeight;
  IconSize = IconSize;
  Margin = Margin;
  VerticalAlignment = VerticalAlignment;
  ReadMore = ReadMore;

  @Input() awardProjectBid$?: Rx.Observable<AwardProjectModel>;
  @Input() awardProjectHireMeState$?: Rx.Observable<AwardProjectHireMeState>;
  @Input() categoriesCollection: DatastoreCollection<
    ProfileCategoriesCollection
  >;
  @Input() hireMeUser$: Rx.Observable<HireMeUser>;
  @Input() isOnline$: Rx.Observable<boolean>;
  @Input() localHourlyRate$: Rx.Observable<LocalHourlyRate | undefined>;
  @Input() portfolioItem$: Rx.Observable<PortfolioItem>;
  @Input() reputation$: Rx.Observable<FreelancerReputation>;
  @Input() skillsCollection: DatastoreCollection<SkillsCollection>;
  @Input() user$: Rx.Observable<ProfileViewUser>;

  isViewerProfileOwner$: Rx.Observable<boolean>;
  itemCategories$: Rx.Observable<ReadonlyArray<ProfileCategory>>;
  itemSkills$: Rx.Observable<ReadonlyArray<Skill>>;
  darkBackground$: Rx.Observable<boolean>;

  constructor(private auth: Auth, private modalService: ModalService) {}

  ngOnInit() {
    this.itemSkills$ = Rx.combineLatest([
      this.skillsCollection.valueChanges(),
      this.portfolioItem$,
    ]).pipe(
      map(([skills, item]) => skills.filter(s => item.skillIds.includes(s.id))),
    );

    this.itemCategories$ = Rx.combineLatest([
      this.categoriesCollection.valueChanges(),
      this.portfolioItem$,
    ]).pipe(
      map(([categories, item]) =>
        categories.filter(c => item.categories.includes(c.id)),
      ),
    );

    this.darkBackground$ = this.portfolioItem$.pipe(
      map(
        item =>
          item.contentType === ContentTypeApi.AUDIO ||
          item.contentType === ContentTypeApi.VIDEO,
      ),
    );

    this.isViewerProfileOwner$ = Rx.combineLatest([
      this.user$.pipe(map(user => user.id)),
      this.auth.getUserId().pipe(map(toNumber)),
    ]).pipe(map(([profileUserId, userId]) => profileUserId === userId));
  }

  hiremeAction() {
    this.hireMeUser$
      .pipe(take(1))
      .toPromise()
      .then(hireMeUser => {
        const userId = hireMeUser.profileUserId;
        this.modalService.open(HireMeWebappModalComponent, {
          inputs: {
            profileUserId: userId,
          },
          color: ModalColor.DARK,
          size: ModalSize.XSMALL,
          edgeToEdge: true,
        });
      });
  }
}
