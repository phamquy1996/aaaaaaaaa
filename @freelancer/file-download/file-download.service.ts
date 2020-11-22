import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ResponseData } from '@freelancer/datastore';
import { FreelancerHttp } from '@freelancer/freelancer-http';
import { Pwa } from '@freelancer/pwa';
import { assertNever } from '@freelancer/utils';
import { AndroidPermissions } from '@laurentgoudet/ionic-native-android-permissions/ngx';
import {
  FileTransfer,
  FileTransferObject,
} from '@laurentgoudet/ionic-native-file-transfer/ngx';
import { File } from '@laurentgoudet/ionic-native-file/ngx';
import { BackendErrorTypes } from 'api-typings/error-distribution';
import * as Rx from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

export class DownloadTask {
  private downloadSubscription?: Rx.Subscription;

  constructor(private download$: Rx.Observable<FileDownloadEvent>) {
    // starts the download. call cancel() to cancel it.
    this.downloadSubscription = this.download$.subscribe();
  }

  /*
   * Emits the FileDownloadEvent as the file download progresses.
   * Completes when the download has completed (success or error),
   * i.e. you can use `last` to only get the download result.
   */
  changes(): Rx.Observable<FileDownloadEvent> {
    return this.download$;
  }

  /*
   * Emits the download progress as a number between 0 and 100, that can easily
   * be piped into a <progress> element's value or similar Bits component
   */
  percentageChanges(): Rx.Observable<number> {
    return this.download$.pipe(
      filter(
        e =>
          typeof e.transferedBytes === 'number' &&
          typeof e.totalBytes === 'number',
      ),
      map(
        e => ((e.transferedBytes as number) / (e.totalBytes as number)) * 100,
      ),
    );
  }

  /*
   * Cancel a download in progress.
   */
  cancel(): void {
    if (this.downloadSubscription) {
      this.downloadSubscription.unsubscribe();
    }
  }
}

export type FileDownloadEvent = {
  totalBytes?: number;
  transferedBytes?: number;
} & (
  | {
      status: 'running';
    }
  | {
      status: 'success';
    }
  | {
      status: 'error';
      errorCode:
        | FileDownloadError.UNKNOWN
        | FileDownloadError.PERMISSION_NOT_GRANTED;
    }
);

export enum FileDownloadError {
  UNKNOWN = 'file_download_unknown',
  PERMISSION_NOT_GRANTED = 'file_download_permission_not_granted',
}

interface DownloadURLSuccessResponseApi {
  readonly download_url: string;
}

export type DownloadUrlResponse = ResponseData<
  { downloadUrl: string },
  BackendErrorTypes['admin_messages_get']
>;

// Can extend by adding more types
export enum MessageAttachmentContextType {
  ADMIN = 'admin',
}

export interface MessageAttachmentContext {
  readonly type: MessageAttachmentContextType;
  readonly messageId: number;
  readonly filename: string;
}

/**
 * Service to download a file
 *
 * @remarks
 *
 * If this service does not trigger the file to download but instead displays it
 * in the browser, this is because the `Content-Disposition` header is wrong
 * on the backend response.
 *
 * WARNING: do not use `window.open` as a workaround, as it would break
 * PWA/TWA/Native mobile support.
 *
 * @export
 */
@Injectable({
  providedIn: 'root',
})
export class FileDownload {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private androidPermissions: AndroidPermissions,
    private file: File,
    private freelancerHttp: FreelancerHttp,
    private pwa: Pwa,
    private transfer: FileTransfer,
  ) {}

  /**
   * Download a file from a given URL
   */
  download(url: string, name: string): DownloadTask {
    if (isPlatformServer(this.platformId)) {
      throw new Error(
        'Cannot trigger file download on page rendering. Please check code logic.',
      );
    }
    return new DownloadTask(
      new Rx.Observable<FileDownloadEvent>(observer => {
        let fileTransfer: FileTransferObject;
        if (this.pwa.isNative()) {
          (async () => {
            if (this.pwa.getPlatform() === 'android') {
              const {
                hasPermission,
              } = await this.androidPermissions.checkPermission(
                this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
              );
              if (!hasPermission) {
                const {
                  hasPermission: hasAcceptedPermission,
                } = await this.androidPermissions.requestPermission(
                  this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
                );
                if (!hasAcceptedPermission) {
                  observer.next({
                    status: 'error',
                    errorCode: FileDownloadError.PERMISSION_NOT_GRANTED,
                  });
                  observer.complete();
                  return;
                }
              }
            }

            const destinationUrl =
              this.pwa.getPlatform() === 'android'
                ? `${this.file.externalRootDirectory}/Download/`
                : this.file.dataDirectory;
            fileTransfer = this.transfer.create();
            fileTransfer.onProgress(event => {
              observer.next({
                status: 'running',
                transferedBytes: event.loaded,
                totalBytes: event.total,
              });
            });
            fileTransfer
              .download(url, `${destinationUrl}${name}`)
              .then(async entry => {
                const { Share } = await this.pwa.capacitorPlugins();
                Share.share({
                  title: name,
                  url: entry.toURL(),
                });
                observer.next({
                  status: 'success',
                });
                observer.complete();
              })
              .catch(error => {
                // We do not want to track those errors as these are expected to
                // sometimes happen, e.g.  network failures
                console.error(error);
                // TODO: show file download error UI state
                observer.next({
                  status: 'error',
                  errorCode: FileDownloadError.UNKNOWN,
                });
                observer.complete();
              });
          })();
        } else {
          window.location.href = url;
          observer.next({
            status: 'success',
          });
          observer.complete();
        }
        return () => {
          if (fileTransfer) {
            fileTransfer.abort();
          }
        };
      }),
    );
  }

  /**
   * Download a blob, and rename with the given filename
   *
   * @privateRemarks
   *
   * For IE browsers, blobs are saved using the msSaveBlob method, whilst other
   * browsers will be saved by creating a blob, then creating an invisible
   * anchor, and then triggering a download with the given filename.
   */
  saveBlob(blob: Blob, filename: string): void {
    if (window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(blob, filename);
    } else {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
    }
  }

  /**
   * Get the download url for an attachment
   */
  getAttachmentPath(
    context: MessageAttachmentContext,
  ): Promise<DownloadUrlResponse> {
    let endpoint;
    switch (context.type) {
      case MessageAttachmentContextType.ADMIN:
        endpoint = `superuser/0.1/admin_messages/${
          context.messageId
        }/files/${encodeURIComponent(context.filename)}`;
        break;
      default:
        assertNever(context.type);
    }

    return this.freelancerHttp
      .get<DownloadURLSuccessResponseApi>(endpoint)
      .pipe(
        take(1),
        map(response => {
          if (response.status === 'success') {
            return {
              status: response.status,
              result: {
                downloadUrl: response.result.download_url,
              },
            };
          }
          return {
            status: response.status,
            errorCode: response.errorCode,
            requestId: response.requestId,
          };
        }),
      )
      .toPromise();
  }
}
