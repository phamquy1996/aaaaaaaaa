import { ObserversModule } from '@angular/cdk/observers';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HammerModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { DirectivesModule } from '@freelancer/directives';
import { GoogleMapsModule } from '@freelancer/google-maps';
import { PipesModule } from '@freelancer/pipes';
import { OpenNativeSettings } from '@laurentgoudet/ionic-native-open-native-settings/ngx';
import { ImageCropperModule } from 'ngx-image-cropper';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  SatDatepickerModule,
} from 'saturn-datepicker';
import { AnchorScrollModule } from './anchor-scroll/anchor-scroll.module';
import { AnnotationIndicatorComponent } from './annotation-indicator/annotation-indicator.component';
import { BadgeComponent } from './badge/badge.component';
import { BannerAlertComponent } from './banner-alert/banner-alert.component';
import {
  BannerAnnouncementButtonsComponent,
  BannerAnnouncementComponent,
  BannerAnnouncementMessageComponent,
} from './banner-announcement/banner-announcement.component';
import {
  BannerUpsellButtonComponent,
  BannerUpsellComponent,
  BannerUpsellDescriptionComponent,
  BannerUpsellDisclaimerComponent,
  BannerUpsellPictureComponent,
  BannerUpsellSmallTitleComponent,
  BannerUpsellTitleComponent,
} from './banner-upsell/banner-upsell.component';
import { BitComponent } from './bit/bit.component';
import {
  BreadcrumbsComponent,
  BreadcrumbsItemComponent,
} from './breadcrumbs/breadcrumbs.component';
import { BudgetComponent } from './budget.component';
import { ButtonComponent } from './button/button.component';
import { CalloutContentComponent } from './callout/callout-content.component';
import { CalloutTriggerComponent } from './callout/callout-trigger.component';
import { CalloutComponent } from './callout/callout.component';
import { CameraInputComponent } from './camera-input/camera-input.component';
import { CameraComponent } from './camera/camera.component';
import {
  CardListComponent,
  CardListItemComponent,
} from './card-list/card-list.component';
import {
  CardComponent,
  CardHeaderRightComponent,
  CardHeaderSecondaryComponent,
  CardHeaderTitleComponent,
} from './card/card.component';
import {
  CarouselComponent,
  CarouselItemComponent,
  CarouselNextButtonComponent,
  CarouselPrevButtonComponent,
} from './carousel/carousel.component';
import { ChartBarComponent } from './chart/chart-bar.component';
import { ChartComponent } from './chart/chart.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { ColumnComponent } from './column/column.component';
import { ContainerComponent } from './container/container.component';
import { CurrencyComponent } from './currency/currency.component';
import {
  DateFnsDateAdapter,
  MAT_DATEFNS_DATE_FORMATS,
} from './date-fns-date-adapter.service';
import { DirectoryItemComponent } from './directory-item/directory-item.component';
import {
  DisplayCardComponent,
  DisplayCardContentComponent,
  DisplayCardFooterLeftComponent,
  DisplayCardFooterRightComponent,
  DisplayCardHeaderLeftComponent,
  DisplayCardHeaderRightComponent,
  DisplayCardImageComponent,
} from './display-card/display-card.component';
import { DrawerComponent } from './drawer/drawer.component';
import { DropdownFilterComponent } from './dropdown-filter/dropdown-filter.component';
import { EarningsComponent } from './earnings/earnings.component';
import { EmojiPickerComponent } from './emoji-picker/emoji-picker.component';
import { EmojiComponent } from './emoji/emoji.component';
import { FileDisplayComponent } from './file-display/file-display.component';
import { FileSelectComponent } from './file-select/file-select.component';
import { FlagComponent } from './flag/flag.component';
import { FloatingActionComponent } from './floating-action/floating-action.component';
import { GalleryComponent } from './gallery/gallery.component';
import { GridComponent } from './grid/grid.component';
import { HeadingComponent } from './heading/heading.component';
import { HighlightTextComponent } from './highlight-text/highlight-text.component';
import { HrComponent } from './hr/hr.component';
import { IconModule } from './icon/icon.module';
import { ImageCropperComponent } from './image-cropper/image-cropper.component';
import { InfiniteScrollContainerDirective } from './infinite-scroll/infinite-scroll-container.directive';
import { InfiniteScrollComponent } from './infinite-scroll/infinite-scroll.component';
import { InputComponent } from './input/input.component';
import { LabelComponent } from './label/label.component';
import { LinkModule } from './link/link.module';
import {
  ListItemBodyComponent,
  ListItemComponent,
  ListItemHeaderComponent,
} from './list-item/list-item.component';
import { ListComponent } from './list/list.component';
import { LoadingTextComponent } from './loading-text/loading-text.component';
import { LocalizedDateFns } from './localized-date-fns.service';
import { LocationInputComponent } from './location-input/location-input.component';
import { LogoComponent } from './logo/logo.component';
import { MapComponent, MapInfoWindowComponent } from './map/map.component';
import { MarginModule } from './margin/margin.module';
import { ModalTitleDirective } from './modal/modal-title.directive';
import {
  MoreOptionsComponent,
  MoreOptionsItemComponent,
} from './more-options/more-options.component';
import { MultiSelectComponent } from './multi-select/multi-select.component';
import { MultipleLocationInputComponent } from './multiple-location-input/multiple-location-input.component';
import { NotificationIndicatorComponent } from './notification-indicator/notification-indicator.component';
import { OnlineIndicatorComponent } from './online-indicator/online-indicator.component';
import {
  PageLayoutComponent,
  PageLayoutPrimaryComponent,
  PageLayoutSecondaryComponent,
  PageLayoutSingleComponent,
} from './page-layout/page-layout.component';
import { PaginationComponent } from './pagination/pagination.component';
import { PictureComponent } from './picture/picture.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import {
  ProgressStepCalloutComponent,
  ProgressStepContentComponent,
  ProgressStepItemComponent,
} from './progress-steps/progress-step-item.component';
import { ProgressStepsComponent } from './progress-steps/progress-steps.component';
import { ProgressSubstepComponent } from './progress-steps/progress-substep.component';
import { RadioComponent } from './radio/radio.component';
import { RatingComponent } from './rating/rating.component';
import { RelativeTimeComponent } from './relative-time/relative-time.component';
import { RibbonComponent } from './ribbon/ribbon.component';
import { SearchComponent } from './search/search.component';
import {
  SectionArticleComponent,
  SectionArticleDescriptionComponent,
  SectionArticleEntryComponent,
  SectionArticleEntryDetailComponent,
  SectionArticleEntryHeadingComponent,
  SectionArticleTitleComponent,
} from './section-article/section-article.component';
import {
  SectionFeatureBodyComponent,
  SectionFeatureComponent,
  SectionFeatureDetailComponent,
  SectionFeatureHeadingComponent,
  SectionFeatureSubheadingComponent,
} from './section-feature/section-feature.component';
import {
  SectionHeroComponent,
  SectionHeroDescriptionComponent,
  SectionHeroDetailTextComponent,
  SectionHeroLogoComponent,
  SectionHeroTitleComponent,
} from './section-hero/section-hero.component';
import { SelectComponent } from './select/select.component';
import { SliderComponent } from './slider/slider.component';
import { SocialButtonsArrowComponent } from './social-buttons/social-buttons-arrow.component';
import { SocialButtonsComponent } from './social-buttons/social-buttons.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { SplitButtonOptionComponent } from './split-button/split-button-option.component';
import { SplitButtonPrimaryComponent } from './split-button/split-button-primary.component';
import { SplitButtonComponent } from './split-button/split-button.component';
import { StickyFooterBodyComponent } from './sticky-footer/sticky-footer-body.component';
import { StickyFooterWrapperComponent } from './sticky-footer/sticky-footer-wrapper.component';
import { StickyFooterComponent } from './sticky-footer/sticky-footer.component';
import { StickyModule } from './sticky/sticky.module';
import {
  TableColumnComponent,
  TableComponent,
  TableExpandableContentComponent,
} from './table/table.component';
import { TabItemComponent } from './tabs/tab-item.component';
import { TabsComponent } from './tabs/tabs.component';
import { TagStatusComponent } from './tag-status/tag-status.component';
import { TagComponent } from './tag/tag.component';
import { TextComponent } from './text/text.component';
import { TextareaComponent } from './textarea/textarea.component';
import {
  ThumbnailViewerComponent,
  ThumbnailViewerImageComponent,
} from './thumbnail-viewer/thumbnail-viewer.component';
import { ToastAlertContainerComponent } from './toast-alert/toast-alert-container.component';
import { ToastAlertComponent } from './toast-alert/toast-alert.component';
import {
  ToggleButtonsComponent,
  ToggleButtonsOptionComponent,
} from './toggle-buttons/toggle-buttons.component';
import { ToggleComponent } from './toggle/toggle.component';
import { TooltipContentComponent } from './tooltip/tooltip-content.component';
import { TooltipComponent } from './tooltip/tooltip.component';
import { UI_CONFIG } from './ui.config';
import { UiConfig } from './ui.interface';
import { UnreadIndicatorComponent } from './unread-indicator/unread-indicator.component';
import { UpgradeTagComponent } from './upgrade-tag/upgrade-tag.component';
import { UserAvatarComponent } from './user-avatar/user-avatar.component';
import { UsernameComponent } from './username/username.component';
import { ValidationErrorComponent } from './validation-error/validation-error.component';
import { VideoModule } from './video/video.module';
import { ViewHeaderComponent } from './view-header/view-header.component';
import { WorkedTimeComponent } from './worked-time/worked-time.component';

@NgModule({
  declarations: [
    AnnotationIndicatorComponent,
    BadgeComponent,
    BannerAlertComponent,
    BannerAnnouncementButtonsComponent,
    BannerAnnouncementComponent,
    BannerAnnouncementMessageComponent,
    BannerUpsellButtonComponent,
    BannerUpsellComponent,
    BannerUpsellDescriptionComponent,
    BannerUpsellDisclaimerComponent,
    BannerUpsellPictureComponent,
    BannerUpsellSmallTitleComponent,
    BannerUpsellTitleComponent,
    BitComponent,
    BreadcrumbsComponent,
    BreadcrumbsItemComponent,
    BudgetComponent,
    ButtonComponent,
    CalloutComponent,
    CalloutContentComponent,
    CalloutTriggerComponent,
    CameraComponent,
    CameraInputComponent,
    CardComponent,
    CardHeaderRightComponent,
    CardHeaderSecondaryComponent,
    CardHeaderTitleComponent,
    CardListComponent,
    CardListItemComponent,
    CarouselComponent,
    CarouselItemComponent,
    CarouselNextButtonComponent,
    CarouselPrevButtonComponent,
    ChartBarComponent,
    ChartComponent,
    CheckboxComponent,
    ColumnComponent,
    ContainerComponent,
    CurrencyComponent,
    DirectoryItemComponent,
    DisplayCardComponent,
    DisplayCardContentComponent,
    DisplayCardFooterLeftComponent,
    DisplayCardFooterRightComponent,
    DisplayCardHeaderLeftComponent,
    DisplayCardHeaderRightComponent,
    DisplayCardImageComponent,
    DrawerComponent,
    DropdownFilterComponent,
    EarningsComponent,
    EmojiComponent,
    EmojiPickerComponent,
    FileDisplayComponent,
    FileSelectComponent,
    FlagComponent,
    FloatingActionComponent,
    GalleryComponent,
    GridComponent,
    HeadingComponent,
    HighlightTextComponent,
    HrComponent,
    ImageCropperComponent,
    InfiniteScrollComponent,
    InfiniteScrollContainerDirective,
    InputComponent,
    LabelComponent,
    ListComponent,
    ListItemBodyComponent,
    ListItemComponent,
    ListItemComponent,
    ListItemHeaderComponent,
    LoadingTextComponent,
    LocationInputComponent,
    LogoComponent,
    MapComponent,
    MapInfoWindowComponent,
    ModalTitleDirective,
    MoreOptionsComponent,
    MoreOptionsItemComponent,
    MultipleLocationInputComponent,
    MultiSelectComponent,
    NotificationIndicatorComponent,
    OnlineIndicatorComponent,
    PageLayoutComponent,
    PageLayoutPrimaryComponent,
    PageLayoutSecondaryComponent,
    PageLayoutSingleComponent,
    PaginationComponent,
    PictureComponent,
    ProgressBarComponent,
    ProgressStepCalloutComponent,
    ProgressStepContentComponent,
    ProgressStepItemComponent,
    ProgressStepsComponent,
    ProgressSubstepComponent,
    RadioComponent,
    RatingComponent,
    RelativeTimeComponent,
    RibbonComponent,
    SearchComponent,
    SectionArticleComponent,
    SectionArticleDescriptionComponent,
    SectionArticleEntryComponent,
    SectionArticleEntryDetailComponent,
    SectionArticleEntryHeadingComponent,
    SectionArticleTitleComponent,
    SectionFeatureBodyComponent,
    SectionFeatureComponent,
    SectionFeatureDetailComponent,
    SectionFeatureHeadingComponent,
    SectionFeatureSubheadingComponent,
    SectionHeroComponent,
    SectionHeroDescriptionComponent,
    SectionHeroDetailTextComponent,
    SectionHeroLogoComponent,
    SectionHeroTitleComponent,
    SelectComponent,
    SliderComponent,
    SocialButtonsArrowComponent,
    SocialButtonsComponent,
    SpinnerComponent,
    SplitButtonComponent,
    StickyFooterBodyComponent,
    StickyFooterComponent,
    StickyFooterWrapperComponent,
    SplitButtonOptionComponent,
    SplitButtonPrimaryComponent,
    TabItemComponent,
    TableColumnComponent,
    TableComponent,
    TableExpandableContentComponent,
    TabsComponent,
    TagComponent,
    TagStatusComponent,
    TextareaComponent,
    TextComponent,
    ThumbnailViewerComponent,
    ThumbnailViewerImageComponent,
    ToastAlertComponent,
    ToastAlertContainerComponent,
    ToggleButtonsComponent,
    ToggleButtonsOptionComponent,
    ToggleComponent,
    TooltipComponent,
    TooltipContentComponent,
    UnreadIndicatorComponent,
    UpgradeTagComponent,
    UserAvatarComponent,
    UsernameComponent,
    ValidationErrorComponent,
    ViewHeaderComponent,
    WorkedTimeComponent,
  ],
  exports: [
    AnchorScrollModule,
    AnnotationIndicatorComponent,
    BadgeComponent,
    BannerAlertComponent,
    BannerAnnouncementButtonsComponent,
    BannerAnnouncementComponent,
    BannerAnnouncementMessageComponent,
    BannerUpsellButtonComponent,
    BannerUpsellComponent,
    BannerUpsellDescriptionComponent,
    BannerUpsellDisclaimerComponent,
    BannerUpsellPictureComponent,
    BannerUpsellSmallTitleComponent,
    BannerUpsellTitleComponent,
    BitComponent,
    BreadcrumbsComponent,
    BreadcrumbsItemComponent,
    BudgetComponent,
    ButtonComponent,
    CalloutComponent,
    CalloutContentComponent,
    CalloutTriggerComponent,
    CameraComponent,
    CameraInputComponent,
    CardComponent,
    CardHeaderRightComponent,
    CardHeaderSecondaryComponent,
    CardHeaderTitleComponent,
    CardListComponent,
    CardListItemComponent,
    CarouselComponent,
    CarouselItemComponent,
    CarouselNextButtonComponent,
    CarouselPrevButtonComponent,
    ChartBarComponent,
    ChartComponent,
    CheckboxComponent,
    ColumnComponent,
    ContainerComponent,
    CurrencyComponent,
    DirectivesModule,
    DirectoryItemComponent,
    DisplayCardComponent,
    DisplayCardContentComponent,
    DisplayCardFooterLeftComponent,
    DisplayCardFooterRightComponent,
    DisplayCardHeaderLeftComponent,
    DisplayCardHeaderRightComponent,
    DisplayCardImageComponent,
    DrawerComponent,
    DropdownFilterComponent,
    EarningsComponent,
    EmojiComponent,
    EmojiPickerComponent,
    FileDisplayComponent,
    FileSelectComponent,
    FlagComponent,
    FloatingActionComponent,
    GalleryComponent,
    GridComponent,
    HeadingComponent,
    HighlightTextComponent,
    HrComponent,
    IconModule,
    ImageCropperComponent,
    InfiniteScrollComponent,
    InfiniteScrollContainerDirective,
    InputComponent,
    LabelComponent,
    LinkModule,
    ListComponent,
    ListItemBodyComponent,
    ListItemComponent,
    ListItemHeaderComponent,
    LoadingTextComponent,
    LocationInputComponent,
    LogoComponent,
    MapComponent,
    MapInfoWindowComponent,
    MarginModule,
    ModalTitleDirective,
    MoreOptionsComponent,
    MoreOptionsItemComponent,
    MultipleLocationInputComponent,
    MultiSelectComponent,
    NotificationIndicatorComponent,
    OnlineIndicatorComponent,
    PageLayoutComponent,
    PageLayoutPrimaryComponent,
    PageLayoutSecondaryComponent,
    PageLayoutSingleComponent,
    PaginationComponent,
    PictureComponent,
    ProgressBarComponent,
    ProgressStepCalloutComponent,
    ProgressStepContentComponent,
    ProgressStepItemComponent,
    ProgressStepsComponent,
    ProgressSubstepComponent,
    RadioComponent,
    RatingComponent,
    ReactiveFormsModule,
    RelativeTimeComponent,
    RibbonComponent,
    SearchComponent,
    SectionArticleComponent,
    SectionArticleDescriptionComponent,
    SectionArticleEntryComponent,
    SectionArticleEntryDetailComponent,
    SectionArticleEntryHeadingComponent,
    SectionArticleTitleComponent,
    SectionFeatureBodyComponent,
    SectionFeatureComponent,
    SectionFeatureDetailComponent,
    SectionFeatureHeadingComponent,
    SectionFeatureSubheadingComponent,
    SectionHeroComponent,
    SectionHeroDescriptionComponent,
    SectionHeroDetailTextComponent,
    SectionHeroLogoComponent,
    SectionHeroTitleComponent,
    SelectComponent,
    SliderComponent,
    SocialButtonsArrowComponent,
    SocialButtonsComponent,
    SpinnerComponent,
    SplitButtonComponent,
    StickyFooterBodyComponent,
    StickyFooterComponent,
    StickyFooterWrapperComponent,
    SplitButtonOptionComponent,
    SplitButtonPrimaryComponent,
    StickyModule,
    TabItemComponent,
    TableColumnComponent,
    TableComponent,
    TableExpandableContentComponent,
    TabsComponent,
    TagComponent,
    TagStatusComponent,
    TextareaComponent,
    TextComponent,
    ThumbnailViewerComponent,
    ThumbnailViewerImageComponent,
    ToastAlertComponent,
    ToastAlertContainerComponent,
    ToggleButtonsComponent,
    ToggleButtonsOptionComponent,
    ToggleComponent,
    TooltipComponent,
    TooltipContentComponent,
    UnreadIndicatorComponent,
    UpgradeTagComponent,
    UserAvatarComponent,
    UsernameComponent,
    ValidationErrorComponent,
    VideoModule,
    ViewHeaderComponent,
    WorkedTimeComponent,
  ],
  imports: [
    AnchorScrollModule,
    GoogleMapsModule,
    CommonModule,
    DirectivesModule,
    HammerModule,
    IconModule,
    ImageCropperModule,
    LinkModule,
    MarginModule,
    ObserversModule,
    OverlayModule,
    PerfectScrollbarModule,
    PipesModule,
    PortalModule,
    ReactiveFormsModule,
    RouterModule,
    StickyModule,
    SatDatepickerModule,
    VideoModule,
    ScrollingModule,
  ],
  // /!\ DO NOT ADD PROVIDERS HERE
})
export class UiModule {
  static initialize(config: UiConfig): ModuleWithProviders<UiModule> {
    return {
      ngModule: UiModule,
      providers: [
        { provide: UI_CONFIG, useValue: config },
        LocalizedDateFns,
        {
          provide: DateAdapter,
          useClass: DateFnsDateAdapter,
          deps: [LocalizedDateFns],
        },
        {
          provide: MAT_DATE_FORMATS,
          useValue: MAT_DATEFNS_DATE_FORMATS,
        },
        OpenNativeSettings,
      ],
    };
  }
}
