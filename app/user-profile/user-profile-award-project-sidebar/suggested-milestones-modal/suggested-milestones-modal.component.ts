import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Datastore } from '@freelancer/datastore';
import {
  MilestoneRequest,
  User,
  UsersCollection,
} from '@freelancer/datastore/collections';
import { ModalRef } from '@freelancer/ui';
import { ButtonColor } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, FontType, FontWeight, TextSize } from '@freelancer/ui/text';
import { AvatarSize } from '@freelancer/ui/user-avatar';
import { ContextTypeApi } from 'api-typings/messages/messages_types';
import { AwardProjectModel } from 'app/user-profile/user-profile-award-project.types';
import * as Rx from 'rxjs';

@Component({
  template: `
    <fl-bit flTrackingSection="SuggestedMilestonesModal">
      <ng-container *flModalTitle i18n="Suggested milestones modal title">
        Suggested Milestones
      </ng-container>
      <fl-sticky-footer-wrapper>
        <fl-sticky-footer-body>
          <fl-heading
            i18n="Suggested milestones modal title"
            [headingType]="HeadingType.H1"
            [size]="TextSize.MID"
            [flMarginBottom]="Margin.MID"
            [flHideMobile]="true"
          >
            Suggested Milestones
          </fl-heading>
          <fl-bit
            *ngIf="user$ | async as user"
            class="SuggestedMilestonesModal-user"
            [flMarginBottom]="Margin.MID"
          >
            <fl-user-avatar
              [users]="[user]"
              [flMarginRight]="Margin.SMALL"
              [size]="AvatarSize.LARGE"
            ></fl-user-avatar>
            <fl-bit>
              <fl-text [size]="TextSize.MID" [weight]="FontWeight.MEDIUM">
                {{ user.displayName }}
              </fl-text>
              <fl-text
                i18n="Username text"
                [size]="TextSize.MID"
                [color]="FontColor.MID"
              >
                @{{ user.username }}
              </fl-text>
            </fl-bit>
          </fl-bit>
          <fl-bit [flMarginBottom]="Margin.MID">
            <fl-text
              i18n="Total bid title"
              [weight]="FontWeight.BOLD"
              [color]="FontColor.MID"
              [flMarginBottom]="Margin.XXSMALL"
            >
              Total bid
            </fl-text>
            <fl-text
              i18n="Fixed project bid duration"
              [size]="TextSize.LARGE"
              [weight]="FontWeight.BOLD"
            >
              {{
                awardProjectModel.bidAmount
                  | flCurrency: awardProjectModel.currency.code
              }}
              <fl-text
                [fontType]="FontType.SPAN"
                [size]="TextSize.INHERIT"
                [weight]="FontWeight.NORMAL"
              >
                in {{ awardProjectModel.duration }} day(s)
              </fl-text>
            </fl-text>
          </fl-bit>
          <fl-bit [flMarginBottom]="Margin.MID">
            <fl-text
              [weight]="FontWeight.BOLD"
              [color]="FontColor.MID"
              [flMarginBottom]="Margin.XXSMALL"
            >
              <ng-container
                *ngIf="suggestedMilestones.length === 1; else pluralMilestones"
                i18n="Singular suggested milestone"
              >
                {{ suggestedMilestones.length }} suggested milestone
              </ng-container>
              <ng-template #pluralMilestones>
                <ng-container i18n="Plural suggested milestones">
                  {{ suggestedMilestones.length }} suggested milestones
                </ng-container>
              </ng-template>
            </fl-text>
            <fl-bit
              *ngFor="let milestone of suggestedMilestones"
              class="SuggestedMilestonesModal-item"
            >
              <fl-bit class="SuggestedMilestonesModal-content">
                <fl-text
                  [weight]="FontWeight.BOLD"
                  [flMarginBottom]="Margin.XXXSMALL"
                >
                  {{
                    milestone.amount
                      | flCurrency: awardProjectModel.currency.code
                  }}
                </fl-text>
                <fl-text [color]="FontColor.MID">
                  {{ milestone.description }}
                </fl-text>
              </fl-bit>
            </fl-bit>
          </fl-bit>
          <fl-bit
            class="SuggestedMilestonesModal-buttons"
            [flHideMobile]="true"
          >
            <fl-button
              i18n="Award award project sidebar button label"
              flTrackingLabel="SuggestedMilestonesModalAwardButton"
              [busy]="awardMeBusy"
              [color]="ButtonColor.SUCCESS"
              [flMarginRight]="Margin.SMALL"
              (click)="handleAwardMeClicked()"
            >
              Award
            </fl-button>
            <fl-chat-button
              flTrackingLabel="SuggestedMilestonesModalChatButton"
              [otherMemberIds]="[awardProjectModel.freelancerId]"
              [contextType]="ContextTypeApi.PROJECT"
              [contextId]="awardProjectModel.projectId"
              (click)="closeModal()"
            ></fl-chat-button>
          </fl-bit>
        </fl-sticky-footer-body>
        <fl-sticky-footer [flShowMobile]="true">
          <fl-bit class="SuggestedMilestonesModal-buttons">
            <fl-button
              i18n="Award award project sidebar button label"
              flTrackingLabel="SuggestedMilestonesModalAwardButton"
              [display]="'block'"
              [busy]="awardMeBusy"
              [color]="ButtonColor.SUCCESS"
              [flMarginRight]="Margin.SMALL"
              (click)="handleAwardMeClicked()"
            >
              Award
            </fl-button>
            <fl-chat-button
              flTrackingLabel="SuggestedMilestonesModalChatButton"
              [display]="'block'"
              [otherMemberIds]="[awardProjectModel.freelancerId]"
              [contextType]="ContextTypeApi.PROJECT"
              [contextId]="awardProjectModel.projectId"
              (click)="closeModal()"
            ></fl-chat-button>
          </fl-bit>
        </fl-sticky-footer>
      </fl-sticky-footer-wrapper>
    </fl-bit>
  `,
  styleUrls: ['./suggested-milestones-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuggestedMilestonesModalComponent implements OnInit {
  AvatarSize = AvatarSize;
  ButtonColor = ButtonColor;
  ContextTypeApi = ContextTypeApi;
  FontColor = FontColor;
  FontType = FontType;
  FontWeight = FontWeight;
  TextSize = TextSize;
  HeadingType = HeadingType;
  Margin = Margin;

  @Input() suggestedMilestones: ReadonlyArray<MilestoneRequest>;
  @Input() awardProjectModel: AwardProjectModel;

  user$: Rx.Observable<User>;
  awardMeBusy = false;

  constructor(
    private datastore: Datastore,
    private modalRef: ModalRef<SuggestedMilestonesModalComponent>,
    private router: Router,
  ) {}

  ngOnInit() {
    const userDocument = this.datastore.document<UsersCollection>(
      'users',
      this.awardProjectModel.freelancerId,
    );
    this.user$ = userDocument.valueChanges();
  }

  handleAwardMeClicked() {
    this.awardMeBusy = true;

    this.router.navigate([this.awardProjectModel.projectLink], {
      fragment: 'proposals',
      queryParams: {
        awardBid: this.awardProjectModel.bidId,
      },
    });
  }

  closeModal() {
    this.modalRef.close();
  }
}
