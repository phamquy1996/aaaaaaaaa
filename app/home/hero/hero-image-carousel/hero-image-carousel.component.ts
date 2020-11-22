import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { TimeUtils } from '@freelancer/time-utils';
import { Assets } from '@freelancer/ui/assets';
import { ContainerSize } from '@freelancer/ui/container';
import { PictureObjectFit } from '@freelancer/ui/picture';
import * as Rx from 'rxjs';
import { HeroData } from '../home-page-hero.component';

@Component({
  selector: 'app-hero-image-carousel',
  template: `
    <fl-bit *ngFor="let hero of heroes; let i = index; trackBy: trackById">
      <fl-bit *ngIf="i <= nextIndex">
        <fl-bit [flShowMobile]="true">
          <fl-bit
            *ngIf="isRedesign; else oldDesign"
            class="BackgroundImage"
            [ngStyle]="{
              background:
                'linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.0) 25%, rgb(0, 0, 0) 100%), url(' +
                hero.mobileImage +
                ') no-repeat center / cover'
            }"
            [ngClass]="{ IsShown: i === currentIndex }"
          ></fl-bit>
          <ng-template #oldDesign>
            <fl-bit
              class="BackgroundImage"
              [ngStyle]="{
                background:
                  'url(' + hero.mobileImage + ') no-repeat center / cover'
              }"
              [ngClass]="{ IsShown: i === currentIndex }"
            ></fl-bit>
          </ng-template>
        </fl-bit>
        <fl-bit *ngIf="startPlaying || i === 0">
          <fl-bit
            [flHideMobile]="true"
            [flShowTablet]="true"
            [flHideDesktop]="true"
          >
            <fl-bit
              class="BackgroundImage"
              [ngStyle]="{
                background:
                  'url(' + hero.tabletImage + ') no-repeat center / cover'
              }"
              [ngClass]="{ IsShown: i === currentIndex }"
            ></fl-bit>
          </fl-bit>
          <fl-bit [flShowDesktop]="true" [flHideDesktopLarge]="true">
            <fl-bit
              class="BackgroundImage"
              [ngStyle]="{
                background:
                  'url(' + hero.desktopSmallImage + ') no-repeat center / cover'
              }"
              [ngClass]="{ IsShown: i === currentIndex }"
            ></fl-bit>
          </fl-bit>
          <fl-bit [flShowDesktopLarge]="true">
            <fl-bit
              class="BackgroundImage"
              [ngStyle]="{
                background:
                  'url(' + hero.desktopLargeImage + ') no-repeat center / cover'
              }"
              [ngClass]="{ IsShown: i === currentIndex }"
            ></fl-bit>
          </fl-bit>
        </fl-bit>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./hero-image-carousel.component.scss'],
})
export class HeroImageCarouselComponent
  implements OnInit, OnChanges, OnDestroy {
  ContainerSize = ContainerSize;
  PictureObjectFit = PictureObjectFit;

  @Input()
  heroes: ReadonlyArray<HeroData>;

  @Input()
  startPlaying: boolean;

  @Input()
  isRedesign: boolean;

  @Output()
  indexChanged = new EventEmitter<number>();

  timer$: Rx.Observable<number>;
  currentIndexSubscription?: Rx.Subscription;
  currentIndex = 0;
  nextIndex = 0;

  constructor(private assets: Assets, private timeUtils: TimeUtils) {}

  ngOnInit() {
    this.timer$ = Rx.of(0);

    this.heroes = this.heroes.map(hero => ({
      ...hero,
      mobileImage: this.assets.getUrl(hero.mobileImage),
      tabletImage: this.assets.getUrl(hero.tabletImage),
      desktopSmallImage: this.assets.getUrl(hero.desktopSmallImage),
      desktopLargeImage: this.assets.getUrl(hero.desktopLargeImage),
    }));

    if (this.startPlaying) {
      this.startTimer();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('startPlaying' in changes) {
      if (this.startPlaying) {
        this.startTimer();
      }
    }
  }

  ngOnDestroy() {
    this.unsubscribeToCurrentIndex();
  }

  trackById(index: number, value: HeroData) {
    return value.id;
  }

  startTimer() {
    this.unsubscribeToCurrentIndex();
    this.timer$ = this.timeUtils.rxInterval(5000);
    this.subscribeToCurrentIndex();
  }

  subscribeToCurrentIndex() {
    this.currentIndexSubscription = this.timer$.subscribe(index => {
      this.currentIndex = index % this.heroes.length;
      if (this.nextIndex < 3) {
        this.nextIndex = this.currentIndex + 1;
      }
      this.indexChanged.emit(this.currentIndex);
    });
  }

  unsubscribeToCurrentIndex() {
    if (this.currentIndexSubscription) {
      this.currentIndexSubscription.unsubscribe();
    }
  }
}
