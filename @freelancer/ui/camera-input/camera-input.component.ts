import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  OnInit,
  Output,
  PLATFORM_ID,
  TemplateRef,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  CameraResultType,
  CameraSource,
  PermissionType,
} from '@capacitor/core';
import {
  BrowserPermissionResultStatus,
  BrowserPermissions,
  BrowserPermissionStates,
} from '@freelancer/browser-permissions';
import {
  MediaDeviceErrorCode,
  MediaDeviceResultStatus,
  MediaDevices,
} from '@freelancer/media-devices';
import { Pwa } from '@freelancer/pwa';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, FontType, TextAlign, TextSize } from '@freelancer/ui/text';
import { ToastAlertService, ToastAlertType } from '@freelancer/ui/toast-alert';
import { OpenNativeSettings } from '@laurentgoudet/ionic-native-open-native-settings/ngx';
import * as Rx from 'rxjs';
import { readImageDataIntoFile } from '../camera';
import { CameraModalComponent } from '../camera-modal/camera-modal.component';
import { ModalSize } from '../modal/modal-size';
import { ModalService } from '../modal/modal.service';

const DEFAULT_VIDEO_CONSTRAINTS = {
  aspectRatio: 1.142857143,
};

// TODO: Implement FAB on a separate component and use it here (T207128)
export enum CameraInputTriggerType {
  DEFAULT = 'default',
  FLOATING_ACTION_BUTTON = 'floating-action-button',
}

@Component({
  selector: 'fl-camera-input',
  template: `
    <fl-toast-alert
      [closeable]="true"
      [id]="'access-denied-toast'"
      [timeout]="undefined"
      [type]="ToastAlertType.ERROR"
    >
      <fl-text
        i18n="Grant camera permission message"
        [fontType]="FontType.SPAN"
        [flMarginRight]="Margin.XXSMALL"
      >
        Please grant camera access in order to take photo.
      </fl-text>

      <fl-link
        i18n="Grant camera permission link"
        (click)="openApplicationSettings()"
      >
        Grant access
      </fl-link>
    </fl-toast-alert>

    <fl-button
      *ngIf="triggerType === CameraInputTriggerType.DEFAULT"
      i18n="Take a photo button"
      class="PhotoBtn"
      [color]="ButtonColor.DEFAULT"
      [size]="ButtonSize.SMALL"
      [disabled]="disabled"
      (click)="initTakePhoto()"
    >
      <fl-icon [name]="'ui-camera-outline'" [size]="IconSize.MID"></fl-icon>
      Take Photo
    </fl-button>

    <fl-button
      *ngIf="triggerType === CameraInputTriggerType.FLOATING_ACTION_BUTTON"
      class="PhotoFloatingBtn"
      [size]="ButtonSize.XXLARGE"
      [disabled]="disabled"
      (click)="initTakePhoto()"
    >
      <fl-icon
        [color]="disabled ? IconColor.MID : IconColor.PRIMARY"
        [name]="'ui-camera-outline'"
        [size]="IconSize.LARGE"
      ></fl-icon>
    </fl-button>
  `,
  styleUrls: ['./camera-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CameraInputComponent implements OnInit {
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  CameraInputTriggerType = CameraInputTriggerType;
  FontColor = FontColor;
  FontType = FontType;
  IconColor = IconColor;
  IconSize = IconSize;
  Margin = Margin;
  TextAlign = TextAlign;
  TextSize = TextSize;
  ToastAlertType = ToastAlertType;

  fileSelectControl: FormControl;

  @Input() disabled = false;
  @Input() videoConstraints: MediaTrackConstraints = {};

  @HostBinding('attr.data-trigger-type')
  @Input()
  triggerType = CameraInputTriggerType.DEFAULT;

  @Output() canActivate = new EventEmitter<boolean>();
  @Output() onError = new EventEmitter<MediaDeviceErrorCode>();
  @Output() takePhoto = new EventEmitter<File>();
  @Output() cameraNeedsAccess = new EventEmitter<boolean>();

  hasVideoDevices = false;

  @ContentChild('content') content: TemplateRef<CameraInputComponent>;

  private videoDevices: ReadonlyArray<MediaDeviceInfo> = [];
  private videoDeviceConstraints: MediaTrackConstraints;
  private cameraFileSubject$ = new Rx.Subject<File>();

  cameraFile$ = this.cameraFileSubject$.asObservable();

  constructor(
    private mediaDevices: MediaDevices,
    private browserPermission: BrowserPermissions,
    private modalService: ModalService,
    private pwa: Pwa,
    private nativeSettings: OpenNativeSettings,
    private toastAlertService: ToastAlertService,
    @Inject(PLATFORM_ID) private platformId: string,
  ) {}

  ngOnInit() {
    this.videoDeviceConstraints = {
      ...DEFAULT_VIDEO_CONSTRAINTS,
      ...this.videoConstraints,
    };
    this.setVideoDevices();
  }

  private setVideoDevices() {
    if (this.pwa.isNative()) {
      this.handleCameraActivate(true);
      return;
    }

    if (isPlatformBrowser(this.platformId)) {
      this.mediaDevices
        .getVideoDevices()
        .then(result => {
          if (result.status === MediaDeviceResultStatus.SUCCESS) {
            this.videoDevices = result.devices;
            this.hasVideoDevices = result.devices.length > 0;
            this.handleCameraActivate(this.hasVideoDevices);
          }
        })
        .catch(() => {
          this.hasVideoDevices = false;
          this.handleCameraActivate(false);
        });
    }
  }

  initTakePhoto() {
    if (this.pwa.isNative()) {
      this.capacitorTakePicture();
    } else {
      this.showModal();
    }
  }

  showModal() {
    if (!this.hasVideoDevices || this.disabled) {
      return false;
    }

    let browserPermissionModalVisibile = false;
    const device = this.videoDevices[0];
    const videoConstraint = {
      video: {
        deviceId: device.deviceId,
      },
    };

    this.showBrowserPermissionModal()
      .then(result => {
        browserPermissionModalVisibile = result;
        return this.mediaDevices.getUserMedia(videoConstraint);
      })
      .then(result => {
        if (result.status === MediaDeviceResultStatus.SUCCESS) {
          return this.mediaDevices.stopMediaStream(result.stream);
        }

        throw new Error(result.error);
      })
      .then(() => {
        if (!browserPermissionModalVisibile) {
          this.handleCameraModal();
        }
      })
      .catch(error => {
        this.handleOnError(error);
        this.hasVideoDevices = false;
      });
  }

  private handleCameraActivate(canActivate: boolean) {
    this.canActivate.emit(canActivate);
  }

  private handleCameraModal() {
    this.modalService
      .open(CameraModalComponent, {
        inputs: {
          videoDevices: this.videoDevices,
          videoConstraints: this.videoDeviceConstraints,
          content: this.content,
        },
        mobileFullscreen: true,
        size: ModalSize.MID,
      })
      .afterClosed()
      .toPromise()
      .then(result => {
        if (result) {
          this.takePhoto.emit(readImageDataIntoFile(result));
        }
      });
  }

  private handleOnError(error: MediaDeviceErrorCode) {
    this.onError.emit(error);
  }

  private showBrowserPermissionModal(): Promise<boolean> {
    return this.browserPermission
      .getCameraPermissions()
      .then(result => {
        if (
          result.status === BrowserPermissionResultStatus.SUCCESS &&
          result.permissionStatus.state === BrowserPermissionStates.PROMPT
        ) {
          const permission = result.permissionStatus;
          permission.onchange = () => {
            if (permission.state === BrowserPermissionStates.GRANTED) {
              this.handleCameraModal();
            } else {
              this.modalService.close();
            }
          };
          return true;
        }
        return false;
      })
      .catch(() => false);
  }

  private async capacitorTakePicture() {
    const { Camera } = await this.pwa.capacitorPlugins();
    const cameraOptions = {
      quality: 90,
      allowEditing: true,
      source: CameraSource.Camera,
      resultType: CameraResultType.DataUrl,
    };

    Camera.getPhoto(cameraOptions)
      .then(result => {
        this.toggleAccessDeniedBanner(false);

        if (typeof result.dataUrl !== 'undefined') {
          this.takePhoto.emit(readImageDataIntoFile(result.dataUrl));
        }
      })
      .catch(() => {
        this.capacitorCheckPermission();
      });
  }

  private async capacitorCheckPermission() {
    const { Permissions } = await this.pwa.capacitorPlugins();

    Permissions.query({ name: PermissionType.Camera }).then(result => {
      this.toggleAccessDeniedBanner(result.state === 'denied');
    });
  }

  private toggleAccessDeniedBanner(val: boolean) {
    if (val) {
      this.toastAlertService.open('access-denied-toast');
    } else {
      this.toastAlertService.close('access-denied-toast');
    }
  }

  openApplicationSettings() {
    this.nativeSettings.open('application_details');
    this.toggleAccessDeniedBanner(false);
  }
}
