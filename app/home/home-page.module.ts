import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TrackingModule } from '@freelancer/tracking';
import { UiModule } from '@freelancer/ui';
import { CompaniesTrustModule } from 'app/companies-trust/companies-trust.module';
import { HomePageApiEnterpriseRedesignComponent } from './api-enterprise-redesign/api-enterprise-redesign.component';
import { HomePageApiEnterpriseCardComponent } from './api-enterprise-v3/api-enterprise-card.component';
import { HomePageApiEnterpriseV3Component } from './api-enterprise-v3/api-enterprise-v3.component';
import { HomePageApiEnterpriseBladeComponent } from './api-enterprise/api-enterprise-blade.component';
import { HomePageApiUpsellCardComponent } from './api-enterprise/api-upsell-card.component';
import { HomePageEnterpriseUpsellCardComponent } from './api-enterprise/enterprise-upsell-card.component';
import { HomePageRedesignBenefitsComponent } from './benefits-redesign/benefits.component';
import { HomePageBenefitsComponent } from './benefits/benefits.component';
import { HomePageCompaniesTrustComponent } from './companies-trust/companies-trust.component';
import { CrowdFavoriteCarouselItemComponent } from './crowd-favorites-redesign/crowd-favorite-carousel-item/crowd-favorite-carousel-item.component';
import { CrowdFavoritesCarouselComponent } from './crowd-favorites-redesign/crowd-favorite-carousel/crowd-favorites-carousel.component';
import { HomePageCrowdFavoriteLoadingStateComponent } from './crowd-favorites-redesign/crowd-favorite-loading-state.component';
import { HomePageCrowdFavoritesRedesignComponent } from './crowd-favorites-redesign/crowd-favorites-redesign.component';
import { HomePageCrowdFavoriteCardComponent } from './crowd-favorites/crowd-favorite-card/crowd-favorite-card.component';
import { HomePageCrowdFavoritesComponent } from './crowd-favorites/crowd-favorites.component';
import { HeroImageCarouselComponent } from './hero/hero-image-carousel/hero-image-carousel.component';
import { HomePageHeroComponent } from './hero/home-page-hero.component';
import { HomePageVideoHeroComponent } from './hero/home-page-video-hero/home-page-video-hero.component';
import { HomePageHireCategoriesRedesignComponent } from './hire-categories-redesign/hire-categories-redesign.component';
import { HomePageHireCategoryItemRedesignComponent } from './hire-categories-redesign/hire-category-item-redesign.component';
import { HomePageHireCategoriesLoadingStateComponent } from './hire-categories/hire-categories-loading-state.component';
import { HomePageHireCategoriesComponent } from './hire-categories/hire-categories.component';
import { HomePageHireCategoryItemComponent } from './hire-categories/hire-category-item.component';
import { HomePageMetaWrapperComponent } from './home-page-meta-wrapper.component';
import { HomePageRoutingModule } from './home-page-routing.module';
import { HomePageComponent } from './home-page.component';
import { HomePageJobCategoriesRedesignComponent } from './job-categories-redesign/job-categories-redesign.component';
import { HomePageJobCategoriesLoadingComponent } from './job-categories/job-categories-loading.component';
import { HomePageJobCategoriesComponent } from './job-categories/job-categories.component';
import { HomePageJobCategoryItemComponent } from './job-categories/job-category-item.component';
import { HomePageNeedWorkDoneRedesignComponent } from './need-work-done-redesign/need-work-done-redesign.component';
import { HomePageNeedWorkDoneComponent } from './need-work-done/need-work-done.component';

@NgModule({
  imports: [
    CommonModule,
    CompaniesTrustModule,
    HomePageRoutingModule,
    TrackingModule,
    UiModule,
  ],
  exports: [HomePageMetaWrapperComponent, CrowdFavoriteCarouselItemComponent],
  declarations: [
    CrowdFavoriteCarouselItemComponent,
    CrowdFavoritesCarouselComponent,
    HeroImageCarouselComponent,
    HomePageApiEnterpriseBladeComponent,
    HomePageApiEnterpriseRedesignComponent,
    HomePageApiEnterpriseCardComponent,
    HomePageApiEnterpriseV3Component,
    HomePageApiUpsellCardComponent,
    HomePageBenefitsComponent,
    HomePageCompaniesTrustComponent,
    HomePageComponent,
    HomePageCrowdFavoriteCardComponent,
    HomePageCrowdFavoriteLoadingStateComponent,
    HomePageCrowdFavoritesComponent,
    HomePageCrowdFavoritesRedesignComponent,
    HomePageEnterpriseUpsellCardComponent,
    HomePageHeroComponent,
    HomePageHireCategoriesComponent,
    HomePageHireCategoriesLoadingStateComponent,
    HomePageHireCategoriesRedesignComponent,
    HomePageHireCategoryItemComponent,
    HomePageHireCategoryItemRedesignComponent,
    HomePageJobCategoriesComponent,
    HomePageJobCategoriesLoadingComponent,
    HomePageJobCategoriesRedesignComponent,
    HomePageJobCategoryItemComponent,
    HomePageMetaWrapperComponent,
    HomePageNeedWorkDoneComponent,
    HomePageNeedWorkDoneRedesignComponent,
    HomePageRedesignBenefitsComponent,
    HomePageVideoHeroComponent,
  ],
})
export class HomePageModule {}
