import {
  AnimationEvent,
  transition,
  trigger,
  useAnimation,
} from '@angular/animations';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Inject,
  Injector,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  SkipSelf,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { slideIn, slideOut } from '@freelancer/animations';
import { FreelancerBreakpointValues } from '@freelancer/ui/breakpoints';
import { HeadingColor, HeadingType } from '@freelancer/ui/heading';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { StickyBehaviour } from '@freelancer/ui/sticky';
import { TextSize } from '@freelancer/ui/text';
import { ViewHeaderType } from '@freelancer/ui/view-header';
import * as Rx from 'rxjs';
import { filter } from 'rxjs/operators';
import { ModalColor } from './modal-color';
import { ModalSize } from './modal-size';
import { ModalLoadingStatus, ModalService } from './modal.service';

@Component({
  selector: 'fl-modal',
  template: `
    <fl-bit
      class="ModalContainer"
      #modalContainer
      cdkScrollable
      [attr.data-backdrop]="backdropActive"
      [attr.data-color]="color"
      [attr.data-mobile-fullscreen]="mobileFullscreen"
      [@.disabled]="!isFullscreenMode"
      [@paneAnimation]="state"
      (@paneAnimation.done)="animationDone($event)"
      (mousedown)="handleMousedown($event)"
      (mouseup)="handleMouseup($event)"
      (click)="handleClick()"
    >
      <fl-bit
        class="ModalDialog"
        [attr.data-size]="size"
        [attr.data-mobile-fullscreen]="mobileFullscreen"
      >
        <fl-bit
          class="ModalContent"
          [attr.data-edge-to-edge]="edgeToEdge"
          [attr.data-color]="color"
        >
          <fl-bit
            class="ModalHeader"
            [attr.data-edge-to-edge]="edgeToEdge"
            [flShowMobile]="mobileFullscreen"
            [flHide]="!mobileFullscreen"
          >
            <fl-bit
              class="ModalHeader-inner"
              [flSticky]="true"
              [flStickyStatic]="true"
              [flStickyBehaviour]="StickyBehaviour.ALWAYS"
            >
              <fl-view-header>
                <fl-heading
                  *ngIf="titleTemplate"
                  [color]="HeadingColor.INHERIT"
                  [headingType]="HeadingType.H1"
                  [size]="TextSize.MID"
                  [truncate]="true"
                >
                  <ng-container
                    [ngTemplateOutlet]="titleTemplate"
                  ></ng-container>
                </fl-heading>
              </fl-view-header>
              <fl-container *ngIf="(statusStream$ | async)?.ready === true">
                <fl-toast-alert-container></fl-toast-alert-container>
              </fl-container>
            </fl-bit>
          </fl-bit>
          <fl-icon
            class="ModalCloseButton"
            *ngIf="closeable && (statusStream$ | async)?.ready === true"
            label="Close"
            i18n-label="Close Modal clickable icon"
            [flHideMobile]="mobileFullscreen"
            [color]="
              color === ModalColor.LIGHT ? IconColor.DARK : IconColor.LIGHT
            "
            [name]="'ui-close'"
            [size]="IconSize.SMALL"
            (click)="handleEscape()"
          ></fl-icon>
          <ng-container #modalContent></ng-container>

          <ng-container *ngIf="(statusStream$ | async)?.ready === false">
            <fl-spinner [overlay]="true"></fl-spinner>
          </ng-container>

          <ng-container
            *ngIf="(statusStream$ | async)?.errorMessage; let error"
          >
            <fl-modal-error
              [color]="color"
              [edgeToEdge]="edgeToEdge"
              [errorMessage]="error"
              (retry)="retryOpen()"
            ></fl-modal-error>
          </ng-container>
        </fl-bit>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('paneAnimation', [
      transition('* => visible', [useAnimation(slideIn)]),
      transition('* => hidden', [useAnimation(slideOut)]),
    ]),
  ],
})
export class ModalComponent implements OnInit, OnDestroy {
  readonly sizeDefault = ModalSize.LARGE;
  readonly closeableDefault = true;
  readonly edgeToEdgeDefault = false;
  readonly mobileFullscreenDefault = false;
  readonly colorDefault = ModalColor.LIGHT;

  HeadingColor = HeadingColor;
  HeadingType = HeadingType;
  IconColor = IconColor;
  IconSize = IconSize;
  ModalSize = ModalSize;
  ModalColor = ModalColor;
  StickyBehaviour = StickyBehaviour;
  TextSize = TextSize;
  ViewHeaderType = ViewHeaderType;

  @ViewChild('modalContent', { read: ViewContainerRef, static: true })
  modalContent: ViewContainerRef;
  @ViewChild('modalContainer', { read: ElementRef, static: true })
  modalContainer: ElementRef<HTMLDivElement>;
  @HostBinding('class.IsActive') backdropActive = false;

  // To be set by modal service at `open`
  color = this.colorDefault;
  size = this.sizeDefault;
  closeable = this.closeableDefault;

  // TODO When edgeToEdge property will be removed, delete "&& (statusStream$ | async)?.ready === true" in the fl-icon (line 60)
  edgeToEdge = this.edgeToEdgeDefault;
  mobileFullscreen = this.mobileFullscreenDefault;

  openStreamSubscription?: Rx.Subscription;
  beforeCloseStreamSubscription?: Rx.Subscription;
  statusStreamSubscription?: Rx.Subscription;
  routeChangeSubscription?: Rx.Subscription;
  titleStreamSubscription?: Rx.Subscription;
  statusStream$: Rx.Observable<ModalLoadingStatus>;
  titleTemplate?: TemplateRef<any>;

  isBackdropClickedOnMousedown = false;
  isBackdropClickedOnMouseup = false;
  isFullscreenMode = false;
  state = 'hidden';

  constructor(
    private modalService: ModalService,
    @SkipSelf() private injector: Injector,
    private router: Router,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.modalService.setContainer(this.modalContent, this.injector);
    this.openStreamSubscription = this.modalService.openStream$.subscribe(
      open => {
        this.backdropActive = !!open;
        // new modal being opened: read config from modalService
        if (open) {
          const {
            color = this.colorDefault,
            size = this.sizeDefault,
            closeable = this.closeableDefault,
            edgeToEdge = this.edgeToEdgeDefault,
            mobileFullscreen = this.mobileFullscreenDefault,
          } = this.modalService.getCurrentConfig();
          this.color = color;
          this.size = size;
          this.closeable = closeable;
          this.edgeToEdge = edgeToEdge;
          this.mobileFullscreen = mobileFullscreen;
          this.isFullscreenMode = this.isMobileView() && this.mobileFullscreen;
        }
        this.togglePageScrollState(open);
        this.changeDetectorRef.detectChanges();
      },
    );

    this.statusStreamSubscription = this.modalService.statusStream$.subscribe(
      () => {
        this.state = 'visible';
        this.changeDetectorRef.detectChanges();
      },
    );

    this.beforeCloseStreamSubscription = this.modalService.beforeCloseStream$.subscribe(
      () => {
        if (this.isFullscreenMode) {
          this.state = 'hidden';
          this.changeDetectorRef.detectChanges();
        } else {
          this.modalService._destroy();
        }
      },
    );

    this.statusStream$ = this.modalService.statusStream$;
    this.titleStreamSubscription = this.modalService.titleStream$.subscribe(
      title => {
        this.titleTemplate = title;
        this.changeDetectorRef.detectChanges();
      },
    );

    // automatically close modal on route change
    this.routeChangeSubscription = this.router.events
      .pipe(
        filter(event => {
          // only close on page changes, and replacing the URL usually is not a full navigation
          const isReplaceUrl =
            this.router.getCurrentNavigation()?.extras?.replaceUrl ?? false;
          return event instanceof NavigationStart && !isReplaceUrl;
        }),
      )
      .subscribe(() => {
        this.modalService.close({ fromRouteChange: true });
      });
  }

  ngOnDestroy() {
    if (this.openStreamSubscription) {
      this.openStreamSubscription.unsubscribe();
    }
    if (this.routeChangeSubscription) {
      this.routeChangeSubscription.unsubscribe();
    }
    if (this.statusStreamSubscription) {
      this.statusStreamSubscription.unsubscribe();
    }
    if (this.beforeCloseStreamSubscription) {
      this.beforeCloseStreamSubscription.unsubscribe();
    }
  }

  handleMousedown(event: MouseEvent) {
    this.isBackdropClickedOnMousedown =
      event.target === this.modalContainer.nativeElement;
  }

  handleMouseup(event: MouseEvent) {
    this.isBackdropClickedOnMouseup =
      event.target === this.modalContainer.nativeElement;
  }

  handleClick() {
    // Close only when pressed and released on the backdrop
    if (
      this.closeable &&
      this.isBackdropClickedOnMousedown &&
      this.isBackdropClickedOnMouseup
    ) {
      this.modalService.close();
    }
  }

  animationDone(event: AnimationEvent) {
    if (event.toState === 'hidden') {
      this.modalService._destroy();
    }
  }

  retryOpen() {
    this.modalService.retryOpen();
  }

  togglePageScrollState(isModalOpen: boolean) {
    const target = this.document.body;

    if (isModalOpen) {
      this.renderer.setStyle(target, 'overflow', 'hidden');
    } else {
      this.renderer.removeStyle(target, 'overflow');
    }
  }

  private isMobileView(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    return window.innerWidth < parseInt(FreelancerBreakpointValues.TABLET, 10);
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(e?: KeyboardEvent) {
    if (this.closeable) {
      this.modalService.close();
    }
  }
}
