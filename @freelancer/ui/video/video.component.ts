import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { TimeUtils } from '@freelancer/time-utils';
import { Assets } from '../assets';

export enum VideoObjectFit {
  CONTAIN = 'contain',
  COVER = 'cover',
  NONE = 'none',
  SCALE_DOWN = 'scale-down',
}

@Component({
  selector: 'fl-video',
  template: `
    <ng-container *ngIf="isBrowser">
      <vg-player *ngIf="!disableControls; else nativeVideo">
        <vg-overlay-play></vg-overlay-play>
        <vg-buffering></vg-buffering>
        <vg-scrub-bar>
          <vg-scrub-bar-current-time></vg-scrub-bar-current-time>
          <vg-scrub-bar-buffering-time></vg-scrub-bar-buffering-time>
        </vg-scrub-bar>
        <vg-controls>
          <vg-play-pause></vg-play-pause>
          <vg-playback-button *ngIf="speedControls"></vg-playback-button>

          <vg-time-display
            vgProperty="current"
            vgFormat="mm:ss"
          ></vg-time-display>

          <vg-scrub-bar class="EmptyScrubBar"></vg-scrub-bar>

          <vg-mute></vg-mute>
          <vg-volume></vg-volume>
          <vg-fullscreen></vg-fullscreen>
        </vg-controls>

        <video
          #media
          class="Player"
          playsinline
          [attr.data-object-fit]="objectFit"
          [autoplay]="autoPlay"
          [muted]="disableControls"
          [ngClass]="{ Stretch: stretch }"
          [preload]="'auto'"
          [src]="videoSource"
          [vgMedia]="media"
          (canplay)="canPlay.emit($event)"
          (canplaythrough)="canPlayThroughHandler($event)"
          (ended)="videoEnd.emit()"
          (error)="error.emit()"
        ></video>
      </vg-player>
      <ng-template #nativeVideo>
        <video
          #media
          class="Player"
          playsinline
          [attr.data-object-fit]="objectFit"
          [autoplay]="autoPlay"
          [muted]="disableControls"
          [ngClass]="{ Stretch: stretch }"
          [preload]="'auto'"
          [src]="videoSource"
          (canplay)="canPlay.emit($event)"
          (canplaythrough)="canPlayThroughHandler($event)"
          (ended)="videoEnd.emit()"
          (error)="error.emit()"
        ></video>
      </ng-template>
    </ng-container>
  `,
  styleUrls: ['./video.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoComponent implements OnChanges, OnInit {
  @ViewChild('media', { read: ElementRef }) media: ElementRef<HTMLVideoElement>;

  @Input() src: string;

  /** Starts the video automatically as soon as it can */
  @Input() autoPlay = false;

  /** Whether the src is from an external source */
  @Input() isExternal = true;

  /** Whether or not to show the playback speed controls */
  @Input() speedControls = false;

  /** Allows you to stretch the video to the full width and height of the container.  CSS for the container is needed to achieve this */
  @Input() stretch = false;

  /** Disable controls as well as mute the video */
  @Input() disableControls = false;

  /** Time in ms before the request to download is aborted*/
  @Input() loadTimeout?: number;

  /** Change the object-fit of the video element inside the component */
  @Input() objectFit?: VideoObjectFit;

  /** Emits an event when the video element is ready to play */
  @Output() canPlay = new EventEmitter<Event>();

  /** Emits an event when the video encountered an error */
  @Output() error = new EventEmitter<void>();

  /** Emits an event when the video element is estimated to be able to play from start to end*/
  @Output() canPlayThrough = new EventEmitter<void>();

  /** Emits an event when the video element finished playing */
  @Output() videoEnd = new EventEmitter<void>();

  videoSource?: string;
  isBrowser: boolean;
  timeoutTimer?: NodeJS.Timeout;
  browserName?: string;

  constructor(
    private timeUtils: TimeUtils,
    private assets: Assets,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('src' in changes || 'isExternal' in changes) {
      this.updateSource();
    }
  }

  canPlayThroughHandler(event: Event) {
    this.canPlayThrough.emit();
    if (this.timeoutTimer) {
      clearTimeout(this.timeoutTimer);
    }
  }

  updateSource() {
    if (this.src) {
      this.videoSource = this.isExternal
        ? this.src
        : this.assets.getUrl(this.src);
      this.setTimerBeforeError();
    }
  }

  /*
   * Will create a setTimeout if loadTimeout is defined. Will trigger error
   * if the specified time was met.
   */
  setTimerBeforeError() {
    if (this.loadTimeout && isPlatformBrowser(this.platformId)) {
      if (this.timeoutTimer) {
        clearTimeout(this.timeoutTimer);
      }

      this.timeoutTimer = this.timeUtils.setTimeout(() => {
        this.videoSource = '';
        this.error.emit();
      }, this.loadTimeout);
    }
  }

  play(): Promise<{ status: 'success' | 'error' }> {
    const playPromise = this.media.nativeElement.play();
    // Older browsers may not return a value from play().
    if (!playPromise) {
      return Promise.resolve({
        status: 'success' as const,
      });
    }
    return playPromise
      .then(() =>
        Promise.resolve({
          status: 'success' as const,
        }),
      )
      .catch(() =>
        Promise.resolve({
          status: 'error' as const,
        }),
      );
  }

  pause() {
    if (this.isBrowser) {
      this.media.nativeElement.pause();
    }
  }
}
