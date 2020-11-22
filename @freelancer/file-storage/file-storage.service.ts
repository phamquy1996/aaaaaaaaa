import { Injectable } from '@angular/core';
import {
  BackendAllErrorCodes,
  BackendErrorResponse,
} from '@freelancer/datastore';
import { FreelancerHttp, HttpEventType } from '@freelancer/freelancer-http';
import { isDefined } from '@freelancer/utils';
import * as Rx from 'rxjs';
import {
  filter,
  last,
  map,
  publishReplay,
  refCount,
  startWith,
  take,
} from 'rxjs/operators';
import * as uuidv4 from 'uuid/v4';
import {
  BackendGetDownloadURLReturnTypes,
  BackendUploadReturnTypes,
  configs,
} from './file-storage-backend.config';
import {
  FileId,
  FullMetadata,
  SettableMetadata,
  StorageBucket,
  UploadTaskEvent,
} from './file-storage.model';

export class UploadTask {
  private uploadSubscription?: Rx.Subscription;

  constructor(private upload$: Rx.Observable<UploadTaskEvent>) {
    // starts the upload. call cancel() to cancel it.
    this.uploadSubscription = this.upload$.subscribe();
  }

  /*
   * Emits the UploadTaskEvent as the file upload progresses.
   * Completes when the upload has completed (success or error),
   * i.e. you can use `last` to only get the upload result:
   * this.snapshot = this.task.changes().pipe(
   *   last(() =>  {
   *     this.downloadURL = fileRef.getDownloadURL() )
   */
  changes(): Rx.Observable<UploadTaskEvent> {
    return this.upload$;
  }

  /*
   * Emits the upload progress as a number between 0 and 100, that can easily
   * be piped into a <progress> element's value or similar Bits component
   */
  percentageChanges(): Rx.Observable<number> {
    return this.upload$.pipe(
      map(s => (s.bytesTransferred / s.totalBytes) * 100),
    );
  }

  /*
   * Emits the download URL of the file once the upload is completed.
   * Use that to pipe it to image source for instance
   * (<img [src]="profileUrl | async" />), but not for user-triggered
   * actions as there's no error handling (it'll just never emit).
   */
  getDownloadURL(): Rx.Observable<string> {
    return this.upload$.pipe(
      last(),
      map(s => (s.state !== 'error' ? s.downloadURL : undefined)),
      filter(isDefined),
    );
  }

  /*
   * Cancel an upload in progress.
   */
  cancel(): void {
    if (this.uploadSubscription) {
      this.uploadSubscription.unsubscribe();
    }
  }
}

export interface DownloadURLSuccessResponse {
  status: 'success';
  downloadURL: string;
}

export interface GetMetadataSuccessResponse {
  status: 'success';
  metadata: FullMetadata;
}

export interface ImageDimensionParams {
  readonly width: number;
  readonly height: number;
}

@Injectable({
  providedIn: 'root',
})
export class FileStorage {
  constructor(private freelancerHttp: FreelancerHttp) {}

  /*
   * Upload a new file to the storage bucket. The fileId gets randomly
   * generated and will be returned with the first `UploadTaskEvent`.
   *
   * DEPRECATED: for storage backends relying on awful backend file ids, the
   * randomly generated fileId won't be used and the backend id will be emitted
   * with the last `UploadTaskEvent`.
   */
  upload(
    bucket: StorageBucket,
    file: File,
    metadata?: SettableMetadata,
  ): UploadTask {
    if (!bucket) {
      throw new Error('Required parameter {bucket} is not defined!');
    }
    const id = uuidv4();
    return this._upload(bucket, id, file, metadata);
  }

  /*
   * Replace an existing file, specified by its file id, with a new one.
   */
  replace(
    bucket: StorageBucket,
    id: FileId,
    file: File,
    metadata?: SettableMetadata,
  ): UploadTask {
    return this._upload(bucket, id, file, metadata);
  }

  /*
   * Not implemented, but feel free to
   */
  delete(bucket: StorageBucket, id: FileId): Promise<void> {
    throw new Error('Not implemented');
  }

  /*
   * Returns an standard error object when the download fails, e.g. due to a
   * permission error. The FileStorage service has not and MUST not have any
   * concept of permisions, i.e. the DriveFile model is just plain wrong.
   */
  getDownloadURL(
    bucket: StorageBucket,
    id: FileId,
  ): Promise<
    DownloadURLSuccessResponse | BackendErrorResponse<BackendAllErrorCodes>
  > {
    const config = configs[bucket]({ bucket, id });

    if (!config.downloadURLEndpoint) {
      throw new Error(
        'Storage backend does not support getting the file download URL',
      );
    }

    return this.freelancerHttp
      .get<BackendGetDownloadURLReturnTypes[keyof typeof bucket]>(
        config.downloadURLEndpoint,
      )
      .pipe(take(1))
      .toPromise()
      .then(response => {
        if (response.status === 'success') {
          if (!config.downloadURL) {
            throw new Error(
              'No downloadURL parsing method has been defined for that storage',
            );
          }
          return {
            status: 'success' as const,
            downloadURL: config.downloadURL(response.result as any),
          };
        }
        return {
          status: 'error' as const,
          errorCode: response.errorCode,
          requestId: response.requestId,
        };
      });
  }

  /*
   * Returns the image dimensions of an image file. Taken from:
   * https://stackoverflow.com/a/7460303.
   */
  getImageDimensionsFromFile(file: File): Promise<ImageDimensionParams> {
    return new Promise(resolve => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        const image = new Image();
        image.src = fileReader.result as string;

        image.onload = () => {
          resolve({
            width: image.width,
            height: image.height,
          });
        };
      };
    });
  }

  /*
   * Not implemented, but feel free to
   */
  getMetadata(
    bucket: StorageBucket,
    id: FileId,
  ): Promise<
    GetMetadataSuccessResponse | BackendErrorResponse<BackendAllErrorCodes>
  > {
    throw new Error('Not implemented');
  }

  /*
   * Not implemented, but feel free to
   */
  updateMetadata(
    bucket: StorageBucket,
    id: FileId,
    metadata: SettableMetadata,
  ): Promise<
    GetMetadataSuccessResponse | BackendErrorResponse<BackendAllErrorCodes>
  > {
    throw new Error('Not implemented');
  }

  private _upload(
    bucket: StorageBucket,
    id: FileId,
    file: File,
    metadata?: SettableMetadata,
  ): UploadTask {
    const uploadMetadata = {
      ...(metadata || {}),
      bucket,
      id,
      name: file.name,
      size: file.size,
      timeCreated: Date.now(),
      updated: Date.now(),
    };
    const config = configs[bucket]({ bucket, id });

    const formData = new FormData();
    formData.append(config.fileParam, file);
    formData.append('metadata', JSON.stringify(uploadMetadata));
    if (config.DEPRECATED_extraParams) {
      Object.entries(config.DEPRECATED_extraParams(uploadMetadata)).forEach(
        ([key, value]) => {
          if (value !== undefined) {
            formData.append(key, value);
          }
        },
      );
    }

    const startEvent: UploadTaskEvent = {
      state: 'running' as const,
      ref: { bucket, id },
      metadata: uploadMetadata,
      bytesTransferred: 0,
      totalBytes: file.size,
    };

    const upload$ = this.freelancerHttp
      .post<BackendUploadReturnTypes[keyof typeof bucket]>(
        config.DEPRECATED_funkyChangingEndpoint
          ? config.DEPRECATED_funkyChangingEndpoint(uploadMetadata)
          : config.endpoint,
        formData,
        {
          reportProgress: true,
          isGaf: config.isGaf || false,
        },
      )
      .pipe(
        map(event => {
          if (event.type === HttpEventType.UploadProgress) {
            return {
              ...startEvent,
              bytesTransferred: event.loaded,
            } as UploadTaskEvent;
          }
          if (event.type === HttpEventType.Response && event.body) {
            if (event.body.status === 'success') {
              return {
                ...startEvent,
                state: 'success' as const,
                bytesTransferred: startEvent.totalBytes,
                downloadURL: config.downloadURL
                  ? config.downloadURL(event.body.result as any)
                  : undefined,
                ref: {
                  ...startEvent.ref,
                  DEPREACTED_DO_NOT_USE_backendId: config.DEPREACTED_DO_NOT_USE_backendId
                    ? config.DEPREACTED_DO_NOT_USE_backendId(
                        event.body.result as any,
                      )
                    : undefined,
                },
              };
            }
            return {
              ...startEvent,
              state: 'error' as const,
              bytesTransferred: startEvent.totalBytes,
              error: {
                errorCode: event.body.errorCode,
                requestId: event.body.requestId,
              },
            } as UploadTaskEvent;
          }
        }),
        filter(isDefined),
        startWith(startEvent),
        publishReplay(1),
        refCount(),
      );

    return new UploadTask(upload$);
  }
}
