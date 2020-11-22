import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  DatastoreBannersModule,
  DatastoreUserCalifornianStatusesModule,
  DatastoreUserInteractionsModule,
} from '@freelancer/datastore/collections';
import { FeatureFlagsModule } from '@freelancer/feature-flags';
import { PipesModule } from '@freelancer/pipes';
import { TrackingModule } from '@freelancer/tracking';
import { UiModule } from '@freelancer/ui';
import { AccountLimitedBannerComponent } from './banners/account-limited-banner.component';
import { CalifornianVerificationBannerComponent } from './banners/californian-verification-banner.component';
import { CorporateKycBannerComponent } from './banners/corporate-kyc-banner.component';
import { CreditCardVerificationBannerComponent } from './banners/credit-card-verification-banner.component';
import { CreditCardVerificationInProgressBannerComponent } from './banners/credit-card-verification-in-progress-banner.component';
import { EmailVerificationBannerComponent } from './banners/email-verification-banner.component';
import { ExpiringCreditCardBannerComponent } from './banners/expiring-credit-card-banner.component';
import { ForceCreditCardVerificationBannerComponent } from './banners/force-credit-card-verification-banner.component';
import { KycBannerComponent } from './banners/kyc-banner.component';
import { PartnershipPaymentVerificationBannerComponent } from './banners/partnership-payment-verification-banner.component';
import { PendingInformationRequestBannerComponent } from './banners/pending-information-request-banner.component';
import { PhoneVerificationBannerComponent } from './banners/phone-verification-banner.component';
import { ReferralBonusBannerComponent } from './banners/referral-bonus-banner.component';
import { SecurePhoneVerificationBannerComponent } from './banners/secure-phone-verification-banner.component';
import { TcsVerificationBannerComponent } from './banners/tcs-verification-banner.component';
import { VatVerificationBannerComponent } from './banners/vat-verification-banner.component';
import { VerificationBannerComponent } from './verification-banner.component';

@NgModule({
  declarations: [
    VerificationBannerComponent,
    ReferralBonusBannerComponent,
    PartnershipPaymentVerificationBannerComponent,
    EmailVerificationBannerComponent,
    PendingInformationRequestBannerComponent,
    VatVerificationBannerComponent,
    TcsVerificationBannerComponent,
    CreditCardVerificationBannerComponent,
    CreditCardVerificationInProgressBannerComponent,
    SecurePhoneVerificationBannerComponent,
    AccountLimitedBannerComponent,
    KycBannerComponent,
    CorporateKycBannerComponent,
    ForceCreditCardVerificationBannerComponent,
    ExpiringCreditCardBannerComponent,
    PhoneVerificationBannerComponent,
    CalifornianVerificationBannerComponent,
  ],
  imports: [
    CommonModule,
    UiModule,
    PipesModule,
    TrackingModule,
    DatastoreBannersModule,
    FeatureFlagsModule,
    DatastoreUserCalifornianStatusesModule,
    DatastoreUserInteractionsModule,
  ],
  exports: [VerificationBannerComponent],
})
export class VerificationBannerModule {}
