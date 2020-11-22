import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { TimeUtils } from '@freelancer/time-utils';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { CameraComponent } from '@freelancer/ui/camera';
import { HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { PictureDisplay, PictureObjectFit } from '@freelancer/ui/picture';
import { FontColor, FontWeight, TextSize } from '@freelancer/ui/text';
import * as Rx from 'rxjs';
import { last, map, take } from 'rxjs/operators';
import { CameraInputComponent } from '../camera-input/camera-input.component';
import { ModalRef } from '../modal/modal.service';

@Component({
  template: `
    <fl-bit flTrackingSection="AppWebcam">
      <fl-heading
        i18n="Use your camera modal title"
        [flMarginBottom]="Margin.SMALL"
        [headingType]="HeadingType.H4"
        [size]="TextSize.MID"
      >
        Use your camera to take photo
      </fl-heading>
      <fl-bit>
        <ng-container [ngTemplateOutlet]="content"></ng-container>
      </fl-bit>
      <fl-bit
        class="CameraView"
        [flHide]="!showCamera"
        [flMarginBottom]="Margin.SMALL"
      >
        <fl-camera
          [videoDevices]="videoDevices"
          [videoConstraints]="videoConstraints"
        ></fl-camera>
        <fl-text
          class="CameraView-timer"
          *ngIf="showCameraTimer"
          i18n="Timer countdown when taking photo"
          [color]="FontColor.INHERIT"
          [size]="TextSize.INHERIT"
          [weight]="FontWeight.BOLD"
        >
          {{ cameraTimerValue$ | async }}
        </fl-text>
        <fl-button
          class="CameraView-switcher"
          *ngIf="showCameraSwitcher"
          flTrackingLabel="CameraSwitch"
          [color]="ButtonColor.DEFAULT"
          [disabled]="showCameraTimer"
          [size]="ButtonSize.SMALL"
          (click)="cycleDevice()"
        >
          <fl-icon [name]="'ui-camera-switch'"></fl-icon>
        </fl-button>
      </fl-bit>
      <fl-picture
        *ngIf="!showCamera"
        class="CameraView-picture"
        [alignCenter]="true"
        [display]="PictureDisplay.BLOCK"
        [externalSrc]="true"
        [flMarginBottom]="Margin.SMALL"
        [fullWidth]="true"
        [objectFit]="PictureObjectFit.CONTAIN"
        [src]="imagePreviewSrc"
      ></fl-picture>
      <fl-bit class="CameraView-footer">
        <fl-button
          class="CameraView-action"
          *ngIf="showCamera"
          i18n="Take photo button"
          flTrackingLabel="TakeAPhoto"
          [color]="ButtonColor.SECONDARY"
          [disabled]="showCameraTimer || isSwitchingCamera"
          [size]="ButtonSize.LARGE"
          [sizeTablet]="ButtonSize.XLARGE"
          (click)="takePhoto()"
        >
          Take Photo
        </fl-button>
        <fl-button
          class="CameraView-action"
          *ngIf="!showCamera"
          i18n="Retake button"
          flTrackingLabel="Retake"
          [color]="ButtonColor.DEFAULT"
          [flMarginRight]="Margin.SMALL"
          [size]="ButtonSize.LARGE"
          [sizeTablet]="ButtonSize.XLARGE"
          (click)="retakePhoto()"
        >
          Retake
        </fl-button>
        <fl-button
          class="CameraView-action"
          *ngIf="!showCamera"
          i18n="Upload button"
          flTrackingLabel="Upload"
          [color]="ButtonColor.SECONDARY"
          [flMarginBottom]="Margin.SMALL"
          [flMarginBottomTablet]="Margin.NONE"
          [size]="ButtonSize.LARGE"
          [sizeTablet]="ButtonSize.XLARGE"
          (click)="confirm()"
        >
          Upload
        </fl-button>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./camera-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CameraModalComponent implements AfterViewInit, OnDestroy {
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  FontColor = FontColor;
  TextSize = TextSize;
  FontWeight = FontWeight;
  HeadingType = HeadingType;
  Margin = Margin;
  PictureDisplay = PictureDisplay;
  PictureObjectFit = PictureObjectFit;

  cameraTimerValue$: Rx.Observable<number>;
  imagePreviewSrc: string | undefined = undefined;
  remainingCaptureTime = 0;
  showCamera = true;
  showCameraSwitcher = false;
  showCameraTimer = false;
  isSwitchingCamera = false;

  private cameraTimerSubscription?: Rx.Subscription;

  @Input() captureTimeout = 5; // in seconds
  @Input() content: TemplateRef<CameraInputComponent>;
  @Input() videoDevices: ReadonlyArray<MediaDeviceInfo>;
  @Input() videoConstraints: ReadonlyArray<MediaTrackConstraints>;

  @ViewChild(CameraComponent) camera: CameraComponent;

  constructor(
    private cd: ChangeDetectorRef,
    private modalRef: ModalRef<CameraModalComponent>,
    private timeUtils: TimeUtils,
  ) {}

  ngAfterViewInit() {
    this.cycleDevice();
  }

  ngOnDestroy() {
    if (this.cameraTimerSubscription) {
      this.cameraTimerSubscription.unsubscribe();
    }
  }

  cancel() {
    this.modalRef.close();
  }

  confirm() {
    this.modalRef.close(this.imagePreviewSrc);
  }

  cycleDevice() {
    this.isSwitchingCamera = true;

    this.camera.cycleDevice().then(() => {
      this.setShowCameraSwitcher(true);
      this.isSwitchingCamera = false;
      this.cd.detectChanges();
    });
  }

  retakePhoto() {
    this.setShowCameraSwitcher(true);
    this.setShowCamera(true);
  }

  setShowCamera(value: boolean) {
    this.showCamera = value;
  }

  setShowCameraSwitcher(value: boolean) {
    this.showCameraSwitcher = value && this.videoDevices.length > 1;
  }

  setShowCameraTimer(value: boolean) {
    this.showCameraTimer = value;
  }

  takePhoto() {
    if (!this.showCameraTimer) {
      this.setShowCameraTimer(true);
      this.setShowCameraSwitcher(false);
      this.cameraTimerValue$ = this.timeUtils.rxTimer(0, 1000).pipe(
        take(this.captureTimeout + 1),
        map(val => this.captureTimeout - val),
      );

      this.cameraTimerSubscription = this.cameraTimerValue$
        .pipe(last(val => val >= this.captureTimeout))
        .subscribe(val => {
          this.imagePreviewSrc = this.camera.getSnapshot();
          this.setShowCameraTimer(false);
          this.setShowCamera(false);
        });
    }
  }
}
