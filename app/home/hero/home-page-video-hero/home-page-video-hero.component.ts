import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { VideoComponent, VideoObjectFit } from '@freelancer/ui/video';

@Component({
  selector: 'app-home-page-video-hero',
  template: `
    <fl-video
      [hidden]="currentIndex !== 0"
      class="HeroVideo"
      [ngClass]="{ Loading: videoPlayers.length === 0 }"
      [disableControls]="true"
      [objectFit]="VideoObjectFit.COVER"
      [isExternal]="false"
      [src]="'home/video/nasa-v2.mp4'"
      [loadTimeout]="loadTimeout"
      (canPlayThrough)="videoLoaded(0)"
      (error)="detectedError()"
      (videoEnd)="videoEnded()"
      #nasaPlayer
    >
    </fl-video>
    <fl-video
      *ngIf="this.videoPlayers.length > 0"
      [hidden]="currentIndex !== 1"
      class="HeroVideo"
      [disableControls]="true"
      [objectFit]="VideoObjectFit.COVER"
      [isExternal]="false"
      [src]="'home/video/mobile-phone-v2.mp4'"
      [loadTimeout]="loadTimeout"
      (canPlayThrough)="videoLoaded(1)"
      (error)="detectedError()"
      (videoEnd)="videoEnded()"
      #mobilePlayer
    >
    </fl-video>
    <fl-video
      *ngIf="this.videoPlayers.length > 1"
      [hidden]="currentIndex !== 2"
      class="HeroVideo"
      [disableControls]="true"
      [objectFit]="VideoObjectFit.COVER"
      [isExternal]="false"
      [src]="'home/video/house-v2.mp4'"
      [loadTimeout]="loadTimeout"
      (canPlayThrough)="videoLoaded(2)"
      (error)="detectedError()"
      (videoEnd)="videoEnded()"
      #housePlayer
    >
    </fl-video>
    <fl-video
      *ngIf="this.videoPlayers.length > 2"
      [hidden]="currentIndex !== 3"
      class="HeroVideo"
      [disableControls]="true"
      [objectFit]="VideoObjectFit.COVER"
      [isExternal]="false"
      [src]="'home/video/magazine-v2.mp4'"
      [loadTimeout]="loadTimeout"
      (canPlayThrough)="videoLoaded(3)"
      (error)="detectedError()"
      (videoEnd)="videoEnded()"
      #magazinePlayer
    >
    </fl-video>
  `,
  styleUrls: ['./home-page-video-hero.component.scss'],
})
export class HomePageVideoHeroComponent {
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  VideoObjectFit = VideoObjectFit;
  currentIndex = 0;
  numberofVideos = 4;
  loadTimeout = 10000;

  @ViewChild('nasaPlayer') nasaPlayer: VideoComponent;
  @ViewChild('mobilePlayer') mobilePlayer: VideoComponent;
  @ViewChild('housePlayer') housePlayer: VideoComponent;
  @ViewChild('magazinePlayer') magazinePlayer: VideoComponent;

  @Output()
  indexChanged = new EventEmitter<number>();

  @Output() errorDetected = new EventEmitter<void>();
  videoPlayers: ReadonlyArray<VideoComponent> = [];

  /**
   * Will only trigger `errorDetected` if no video was able to load.
   * If any video has been loaded before the error will used videos to loop
   */
  detectedError() {
    if (this.videoPlayers.length === 0) {
      this.errorDetected.emit();
    }
  }

  // This will add to the list of already loaded video tags
  videoLoaded(index: number) {
    if (this.videoPlayers[index] === undefined) {
      switch (index) {
        case 0: {
          this.nasaPlayer.play().then(response => {
            if (response.status === 'success') {
              this.videoPlayers = [this.nasaPlayer];
            } else if (response.status === 'error') {
              this.detectedError();
            }
          });
          break;
        }
        case 1:
          this.videoPlayers = [...this.videoPlayers, this.mobilePlayer];
          break;
        case 2:
          this.videoPlayers = [...this.videoPlayers, this.housePlayer];
          break;
        case 3:
          this.videoPlayers = [...this.videoPlayers, this.magazinePlayer];
          break;
        default:
          break;
      }
    }
  }

  // This will determine what video will play next once the previous video has finished
  videoEnded() {
    this.currentIndex++;
    if (
      this.currentIndex >= this.numberofVideos ||
      this.currentIndex >= this.videoPlayers.length
    ) {
      this.currentIndex = 0;
    }

    this.videoPlayers[this.currentIndex].play().then(response => {
      if (response.status === 'success') {
        this.indexChanged.emit(this.currentIndex);
      } else if (response.status === 'error') {
        this.errorDetected.emit();
      }
    });
  }
}
