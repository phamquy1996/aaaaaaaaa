/**
 * This service functions similarly to the Navigator.permissions API for utilizing
 * browser permission states for hardware usage such as camera, microphone, bluetooth, etc.
 * This service was designed as a wrapper for Navigator.permissions for now since the API is
 * still in beta phase.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API
 */
import { Injectable } from '@angular/core';

export enum BrowserPermissionStates {
  DENIED = 'denied',
  GRANTED = 'granted',
  PROMPT = 'prompt',
}

export enum BrowserPermissionResultStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}

export interface BrowserPermissionQuery {
  name?: string;
  userVisibleOnly?: boolean;
  sysex?: boolean;
}

export interface BrowserPermissionStatus {
  state: BrowserPermissionStates;
  status?: BrowserPermissionStates;
  onchange: Function | null;
}

export type BrowserPermissionResult =
  | {
      status: BrowserPermissionResultStatus.SUCCESS;
      permissionStatus: BrowserPermissionStatus;
    }
  | {
      status: BrowserPermissionResultStatus.ERROR;
      error: BrowserPermissionStatusErrorCode;
    };

export enum BrowserPermissionStatusErrorCode {
  CANNOT_RETRIEVE_CAMERA_PERMISSION = 'CANNOT_RETRIEVE_CAMERA_PERMISSION',
  PERMISSION_STATUS_NOT_SUPPORTED = 'PERMISSION_STATUS_NOT_SUPPORTED',
}

@Injectable({
  providedIn: 'root',
})
export class BrowserPermissions {
  getCameraPermissions() {
    const permissionQuery = { name: 'camera' };
    return this.getPermissions(permissionQuery);
  }

  private getPermissions(
    query: BrowserPermissionQuery,
  ): Promise<BrowserPermissionResult> {
    if (!this.isPermissionStatusSupported()) {
      return Promise.resolve(
        this.getErrorResult(
          BrowserPermissionStatusErrorCode.PERMISSION_STATUS_NOT_SUPPORTED,
        ),
      );
    }

    return (window.navigator as any).permissions
      .query(query)
      .then((state: BrowserPermissionStatus) => this.getSuccessResult(state))
      .catch(() => {
        Promise.resolve(
          this.getErrorResult(
            BrowserPermissionStatusErrorCode.CANNOT_RETRIEVE_CAMERA_PERMISSION,
          ),
        );
      });
  }

  private getErrorResult(
    error: BrowserPermissionStatusErrorCode,
  ): BrowserPermissionResult {
    return {
      status: BrowserPermissionResultStatus.ERROR,
      error,
    };
  }

  private getSuccessResult(
    permissionStatus: BrowserPermissionStatus,
  ): BrowserPermissionResult {
    return {
      status: BrowserPermissionResultStatus.SUCCESS,
      permissionStatus,
    };
  }

  private isPermissionStatusSupported(): boolean {
    // navigator.permissions is not fully supported by all browsers since it's in beta at the moment
    const nav = window.navigator as any;
    return !!nav && !!nav.permissions && !!nav.permissions.query;
  }
}
