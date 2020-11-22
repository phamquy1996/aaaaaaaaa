/**
 * This service interacts with the Navigator.mediaDevices API which is used for
 * retrieving and utilizing devices supported for the user's browser
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/Navigator/mediaDevices
 */
import { Injectable } from '@angular/core';

export const MEDIADEVICES_TYPE = {
  AUDIO: 'audioinput',
  VIDEO: 'videoinput',
};

export enum MediaDeviceResultStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}

export enum MediaDeviceErrorCode {
  MEDIA_DEVICE_API_NOT_SUPPORTED = 'MEDIA_DEVICE_API_NOT_SUPPORTED',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  NOT_FOUND = 'NOT_FOUND',
  UNSUPPORTED_BROWSER = 'UNSUPPORTED_BROWSER',
  OVERCONSTRAINED = 'OVERCONSTRAINED',
  FAILED_TO_LOAD = 'FAILED_TO_LOAD',
}

export interface MediaDeviceErrorResult {
  status: MediaDeviceResultStatus.ERROR;
  error: MediaDeviceErrorCode;
}

export type MediaDeviceResult =
  | {
      status: MediaDeviceResultStatus.SUCCESS;
      devices: MediaDeviceInfo[];
    }
  | MediaDeviceErrorResult;

export type MediaDeviceStreamResult =
  | {
      status: MediaDeviceResultStatus.SUCCESS;
      stream: MediaStream;
    }
  | MediaDeviceErrorResult;

@Injectable({
  providedIn: 'root',
})
export class MediaDevices {
  isVideoAvailable(): Promise<boolean> {
    if (!this.isMediaDeviceApiSupported()) {
      return Promise.resolve(false);
    }

    return window.navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => true)
      .catch(() => false);
  }

  getAudioDevices(): Promise<MediaDeviceResult> {
    if (!this.isMediaDeviceApiSupported()) {
      return Promise.resolve(
        this.getErrorResult(
          MediaDeviceErrorCode.MEDIA_DEVICE_API_NOT_SUPPORTED,
        ),
      );
    }

    return this.getDevices().then(devices => {
      const audioDevices = devices.filter(
        (device: MediaDeviceInfo) => device.kind === MEDIADEVICES_TYPE.AUDIO,
      );

      return this.getSuccessDevicesResult(audioDevices);
    });
  }

  getVideoDevices(): Promise<MediaDeviceResult> {
    if (!this.isMediaDeviceApiSupported()) {
      return Promise.resolve(
        this.getErrorResult(
          MediaDeviceErrorCode.MEDIA_DEVICE_API_NOT_SUPPORTED,
        ),
      );
    }

    return this.getDevices().then(devices => {
      const videoDevices = devices.filter(
        (device: MediaDeviceInfo) => device.kind === MEDIADEVICES_TYPE.VIDEO,
      );

      return this.getSuccessDevicesResult(videoDevices);
    });
  }

  getUserMedia(
    constraints: MediaStreamConstraints = {},
  ): Promise<MediaDeviceStreamResult> {
    if (!this.isMediaDeviceApiSupported()) {
      return Promise.resolve(
        this.getErrorResult(
          MediaDeviceErrorCode.MEDIA_DEVICE_API_NOT_SUPPORTED,
        ),
      );
    }

    return window.navigator.mediaDevices
      .getUserMedia(constraints)
      .then(stream => this.getSuccessStreamResult(stream))
      .catch(error => {
        let errorCode;

        switch (error.name) {
          case 'PermissionDeniedError':
            errorCode = MediaDeviceErrorCode.PERMISSION_DENIED;
            break;
          case 'NotFoundError':
            errorCode = MediaDeviceErrorCode.NOT_FOUND;
            break;
          case 'UnsupportedBrowserError':
            errorCode = MediaDeviceErrorCode.UNSUPPORTED_BROWSER;
            break;
          case 'OverconstrainedError':
            errorCode = MediaDeviceErrorCode.OVERCONSTRAINED;
            break;
          default:
            errorCode = MediaDeviceErrorCode.FAILED_TO_LOAD;
        }

        return Promise.resolve(this.getErrorResult(errorCode));
      });
  }

  stopMediaStream(mediaStream: MediaStream) {
    mediaStream.getTracks().forEach(track => track.stop());
  }

  private getDevices(): Promise<MediaDeviceInfo[]> {
    return window.navigator.mediaDevices.enumerateDevices();
  }

  private getErrorResult(error: MediaDeviceErrorCode): MediaDeviceErrorResult {
    return {
      status: MediaDeviceResultStatus.ERROR,
      error,
    };
  }

  private getSuccessDevicesResult(
    devices: MediaDeviceInfo[],
  ): MediaDeviceResult {
    return {
      status: MediaDeviceResultStatus.SUCCESS,
      devices,
    };
  }

  private getSuccessStreamResult(stream: MediaStream): MediaDeviceStreamResult {
    return {
      status: MediaDeviceResultStatus.SUCCESS,
      stream,
    };
  }

  private isMediaDeviceApiSupported(): boolean {
    const nav = window.navigator;
    return (
      !!nav &&
      !!nav.mediaDevices &&
      !!nav.mediaDevices.enumerateDevices &&
      !!nav.mediaDevices.getUserMedia
    );
  }
}
