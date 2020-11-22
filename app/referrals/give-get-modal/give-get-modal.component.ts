import { Component, OnInit } from '@angular/core';
import { Auth } from '@freelancer/auth';
import { Datastore, DatastoreDocument } from '@freelancer/datastore';
import { UserGiveGetDetailsCollection } from '@freelancer/datastore/collections';
import { ModalRef } from '@freelancer/ui';
import { ButtonColor } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { ListItemType } from '@freelancer/ui/list-item';
import { Margin } from '@freelancer/ui/margin';
import { TextSize } from '@freelancer/ui/text';
import * as Rx from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  styleUrls: ['./give-get-modal.component.scss'],
  template: `
    <fl-bit class="SpinnerContainer">
      <fl-spinner
        *ngIf="!(isLoaded$ | async)"
        flTrackingLabel="GiveGetModalInitialisationSpinner"
      ></fl-spinner>
    </fl-bit>
    <fl-bit *ngIf="isLoaded$ | async">
      <ng-container
        *ngIf="userGiveGetDetailsDoc.valueChanges() | async as giveGetUser"
      >
        <ng-container
          *ngIf="
            giveGetUser.isEmailVerified && giveGetUser.isPhoneVerified;
            else unverifiedUser
          "
        >
          <fl-list [type]="ListItemType.NON_BORDERED">
            <fl-list-item [flMarginBottom]="Margin.SMALL">
              <fl-heading
                i18n="Giveget modal title"
                [size]="TextSize.XLARGE"
                [headingType]="HeadingType.H1"
                [flMarginBottom]="Margin.XXSMALL"
              >
                Refer a friend, get
                {{
                  giveGetUser.localizedBonus
                    | flCurrency: giveGetUser.userCurrency.code
                }}
              </fl-heading>
              <fl-text i18n="Giveget modal subtitle" [size]="TextSize.SMALL">
                Friends who sign up via the link below get
                {{
                  giveGetUser.localizedBonus
                    | flCurrency: giveGetUser.userCurrency.code
                }}. Once they spend
                {{
                  giveGetUser.localizedBonusRequirement
                    | flCurrency: giveGetUser.userCurrency.code
                }}
                you get
                {{
                  giveGetUser.localizedBonus
                    | flCurrency: giveGetUser.userCurrency.code
                }}
                in free credit.
              </fl-text>
            </fl-list-item>
            <fl-list-item>
              <app-give-get-link-share
                [referralLink]="giveGetUser.referralLink"
                [localizedBonus]="giveGetUser.localizedBonus"
                [localizedBonusRequirement]="
                  giveGetUser.localizedBonusRequirement
                "
                [userCurrency]="giveGetUser.userCurrency"
                [flTrackingSection]="'GiveGetModal.linkshare'"
                [flMarginBottom]="Margin.SMALL"
              ></app-give-get-link-share>
              <fl-bit class="Footlinks" flTrackingSection="GiveGetModal">
                <fl-link
                  i18n="Giveget modal link to Terms and Conditions"
                  [flMarginRight]="Margin.SMALL"
                  [link]="'/about/terms'"
                  [flTrackingLabel]="'GiveGetModal.gotoTermsAndConditions'"
                >
                  Terms Apply
                </fl-link>
                <fl-link
                  i18n="Giveget modal link to /give page"
                  [link]="'/give'"
                  [flTrackingLabel]="'GiveGetModal.gotoGivePage'"
                >
                  See Your Referrals
                </fl-link>
              </fl-bit>
            </fl-list-item>
          </fl-list>
        </ng-container>
        <ng-template #unverifiedUser>
          <fl-list [type]="ListItemType.NON_BORDERED">
            <fl-list-item [flMarginBottom]="Margin.SMALL">
              <fl-heading
                i18n="Giveget modal title"
                [size]="TextSize.XLARGE"
                [headingType]="HeadingType.H1"
                [flMarginBottom]="Margin.XXSMALL"
              >
                Want free credit?
              </fl-heading>
              <fl-text i18n="Giveget modal subtitle" [size]="TextSize.SMALL">
                Share Freelancer.com with your friends and we'll give them
                {{
                  giveGetUser.localizedBonus
                    | flCurrency: giveGetUser.userCurrency.code
                }}
                when they sign up. You get
                {{
                  giveGetUser.localizedBonus
                    | flCurrency: giveGetUser.userCurrency.code
                }}
                in free credit once they spend
                {{
                  giveGetUser.localizedBonusRequirement
                    | flCurrency: giveGetUser.userCurrency.code
                }}
                on a project or contest.
              </fl-text>
            </fl-list-item>
            <fl-list-item>
              <fl-button
                i18n="Giveget modal link to /give page"
                [link]="'/give'"
                [color]="ButtonColor.SECONDARY"
                [flTrackingSection]="'GiveGetModal.actions'"
                [flTrackingLabel]="'GiveGetModal.gotoGivePageUnverified'"
              >
                Claim my Free Credit
              </fl-button>
            </fl-list-item>
          </fl-list>
        </ng-template>
      </ng-container>
    </fl-bit>
  `,
})
export class GiveGetModalComponent implements OnInit {
  ButtonColor = ButtonColor;
  TextSize = TextSize;
  HeadingType = HeadingType;
  ListItemType = ListItemType;
  Margin = Margin;

  userGiveGetDetailsDoc: DatastoreDocument<UserGiveGetDetailsCollection>;
  isLoaded$: Rx.Observable<boolean>;

  constructor(
    private auth: Auth,
    private modalRef: ModalRef<GiveGetModalComponent>,
    private datastore: Datastore,
  ) {}

  ngOnInit() {
    const userId$ = this.auth.getUserId();

    this.userGiveGetDetailsDoc = this.datastore.document<
      UserGiveGetDetailsCollection
    >('userGiveGetDetails', userId$);

    this.isLoaded$ = this.userGiveGetDetailsDoc
      .valueChanges()
      .pipe(map(giveGetData => !!giveGetData));
  }

  handleClose() {
    this.modalRef.close();
  }
}
