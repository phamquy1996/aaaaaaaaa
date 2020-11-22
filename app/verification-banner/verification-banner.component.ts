import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Auth } from '@freelancer/auth';
import { Datastore } from '@freelancer/datastore';
import {
  Banner,
  BannerId,
  BannersCollection,
  BannerType,
} from '@freelancer/datastore/collections';
import { Feature } from '@freelancer/feature-flags';
import { ContainerSize } from '@freelancer/ui/container';
import * as Rx from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-verification-banner',
  template: `
    <ng-container *ngIf="(isLoggedIn$ | async) && (banner$ | async) as banner">
      <ng-container
        flTrackingSection="VerificationBanner"
        [ngSwitch]="banner.id"
      >
        <app-referral-bonus-banner
          *ngSwitchCase="BannerId.REFERRAL_BONUS"
          [banner]="banner"
          [containerSize]="containerSize"
        ></app-referral-bonus-banner>
        <app-partnership-payment-verification-banner
          *ngSwitchCase="BannerId.PARTNERSHIP_PAYMENT_VERIFICATION"
          [containerSize]="containerSize"
        ></app-partnership-payment-verification-banner>
        <app-email-verification-banner
          *ngSwitchCase="BannerId.EMAIL_VERIFICATION"
          [banner]="banner"
          [containerSize]="containerSize"
        ></app-email-verification-banner>
        <app-pending-information-request-banner
          *ngSwitchCase="BannerId.PENDING_INFORMATION_REQUEST"
          [banner]="banner"
          [containerSize]="containerSize"
        ></app-pending-information-request-banner>
        <app-vat-verification-banner
          *ngSwitchCase="BannerId.VAT_VERIFICATION"
          [containerSize]="containerSize"
        ></app-vat-verification-banner>
        <app-tcs-verification-banner
          *ngSwitchCase="BannerId.TCS_VERIFICATION"
          [containerSize]="containerSize"
        ></app-tcs-verification-banner>
        <app-credit-card-verification-banner
          *ngSwitchCase="BannerId.CREDIT_CARD_VERIFICATION"
          [containerSize]="containerSize"
        ></app-credit-card-verification-banner>
        <app-credit-card-verification-in-progress-banner
          *ngSwitchCase="BannerId.CREDIT_CARD_VERIFICATION_IN_PROGRESS"
          [containerSize]="containerSize"
        ></app-credit-card-verification-in-progress-banner>
        <app-secure-phone-verification-banner
          *ngSwitchCase="BannerId.SECURE_PHONE_SETUP"
          [containerSize]="containerSize"
          [forcePhoneVerification]="false"
        ></app-secure-phone-verification-banner>
        <app-secure-phone-verification-banner
          *ngSwitchCase="BannerId.FORCE_PHONE_VERIFICATION"
          [containerSize]="containerSize"
          [forcePhoneVerification]="true"
        ></app-secure-phone-verification-banner>
        <app-account-limited-banner
          *ngSwitchCase="BannerId.ACCOUNT_LIMITED"
          [containerSize]="containerSize"
        ></app-account-limited-banner>
        <app-kyc-banner
          *ngSwitchCase="BannerId.KYC"
          [containerSize]="containerSize"
        ></app-kyc-banner>
        <app-corporate-kyc-banner
          *ngSwitchCase="BannerId.CORPORATE_KYC"
          [containerSize]="containerSize"
        ></app-corporate-kyc-banner>
        <app-force-credit-card-verification-banner
          *ngSwitchCase="BannerId.FORCE_CREDIT_CARD_VERIFICATION"
          [containerSize]="containerSize"
        ></app-force-credit-card-verification-banner>
        <app-expiring-credit-card-banner
          *ngSwitchCase="BannerId.EXPIRING_CREDIT_CARD"
          [banner]="banner"
          [containerSize]="containerSize"
        ></app-expiring-credit-card-banner>
        <app-phone-verification-banner
          *ngSwitchCase="BannerId.PHONE_VERIFICATION"
          [banner]="banner"
          [containerSize]="containerSize"
        ></app-phone-verification-banner>
        <app-californian-verification-banner
          *ngSwitchCase="BannerId.CALIFORNIAN_VERIFICATION"
          [containerSize]="containerSize"
        ></app-californian-verification-banner>
      </ng-container>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerificationBannerComponent implements OnInit {
  BannerId = BannerId;
  Feature = Feature;

  @Input() containerSize: ContainerSize;

  banner$: Rx.Observable<Banner>;
  isLoggedIn$: Rx.Observable<boolean>;

  constructor(private auth: Auth, private datastore: Datastore) {}

  ngOnInit() {
    this.isLoggedIn$ = this.auth.authState$.pipe(map(state => !!state));

    const bannerCollection = this.datastore.collection<BannersCollection>(
      'banners',
      query => query.where('type', '==', BannerType.VERIFICATION),
    );

    this.banner$ = bannerCollection
      .valueChanges()
      .pipe(map(banners => banners[0]));
  }
}
