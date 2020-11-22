import {
  HttpEventType,
  HttpProgressEvent,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BackendAllErrorCodes, ResponseData } from '@freelancer/datastore';
import { FreelancerHttp } from '@freelancer/freelancer-http';
import * as Rx from 'rxjs';
import { filter, map, share } from 'rxjs/operators';
import * as uuidv4 from 'uuid/v4';

export interface UploadStatus {
  id: string;
  filename: string;
  uuid?: string;
  progress$: Rx.Observable<HttpProgressEvent>;
  failed: boolean;
  backendId$?: Rx.Observable<string | number | undefined>;
}

export type UploadProgressEvent = HttpProgressEvent;

export class FileUploadSession {
  private _files: File[] = [];
  private _filesSubject$ = new Rx.BehaviorSubject<File[]>(this._files);
  files$ = this._filesSubject$.asObservable();

  private _uploads: UploadStatus[] = [];
  private _uploadsSubject$ = new Rx.BehaviorSubject<UploadStatus[]>(
    this._uploads,
  );
  uploads$ = this._uploadsSubject$.asObservable();

  constructor(private freelancerHttp: FreelancerHttp) {}

  /**
   * Add an file to the file list.
   */
  addFile(file: File) {
    // can be undefined due to browser shenanigans
    if (!file) {
      return;
    }

    if (this.containsFile(file)) {
      return;
    }

    const fixedFile = this.fixMatchingFiles(file);
    if (fixedFile !== undefined) {
      this._files = [...this._files, fixedFile];
      this._filesSubject$.next(this._files);
    }
  }

  /**
   * Remove an file from the file list.
   */
  removeFile(filename: string) {
    this._files = this._files.filter(file => file.name !== filename);
    this._filesSubject$.next(this._files);
  }

  /**
   * Upload files
   */
  send<T>({
    endpoint,
    isGaf = false,
    generateUuid = false,
    extraParams = {},
    getId,
  }: {
    endpoint: string;
    isGaf?: boolean;
    generateUuid?: boolean;
    extraParams?: { [k: string]: string };
    getId?(
      response: HttpResponse<ResponseData<T, BackendAllErrorCodes>>,
    ): string | number | undefined;
  }) {
    this._files.forEach(file => {
      if (file === undefined) {
        return;
      }
      const uploadId = Date.now().toString();
      const uuid = generateUuid ? uuidv4() : undefined;
      const data = new FormData();
      const filename = file.name || undefined;
      data.append('files[]', file, filename);
      Object.entries(extraParams).forEach(([key, value]) => {
        data.append(key, value);
      });

      const response$ = this.freelancerHttp
        .post(endpoint, data, {
          reportProgress: true,
          isGaf,
        })
        .pipe(share());

      const request$ = response$.pipe(
        filter(event => event.type === HttpEventType.UploadProgress),
        map(event => event as HttpProgressEvent),
        // Share so we can track when it finishes later in the chain
        // but we can pass it to the upload list for components to
        // observe the upload progress.
        share(),
      );

      // As discussed in D118072, this approach goes against modern file upload
      // services, such as S3 and Google Cloud Storage, where generating an
      // ID/key is handled in the application logic before storing the
      // file/object into a bucket. This also prevent features such as resumable
      // file uploads since the file has to be fully uploaded before getting its
      // ID back. As such, this is not the recommended approach. In order to
      // keep us from turning this service into a frankenstein of all File
      // Services, we have to at least map out the current flow of all existing
      // file services in GAF to give us better understanding on what to do next
      // https://phabricator.tools.flnltd.com/T77136.
      const backendId$ = getId
        ? response$.pipe(
            filter(event => event.type === HttpEventType.Response),
            map(response =>
              getId(
                response as HttpResponse<ResponseData<T, BackendAllErrorCodes>>,
              ),
            ),
          )
        : undefined;

      this._uploads = [
        ...this._uploads,
        {
          id: uploadId,
          filename: file.name,
          uuid,
          progress$: request$,
          failed: false,
          backendId$,
        },
      ];

      response$
        .toPromise()
        .then(response => {
          if (
            response.type === HttpEventType.Response &&
            response.body &&
            response.body.status &&
            response.body.status !== 'success'
          ) {
            this.setUploadFailed(uploadId);
          } else {
            this.removeUpload(uploadId);
          }
        })
        .catch(() => this.setUploadFailed(uploadId));
    });
    // Empty out files since they're being uploaded right now.
    this._files = [];
    this._uploadsSubject$.next(this._uploads);
    this._filesSubject$.next(this._files);
  }

  /**
   * Remove the upload from the upload list
   */
  removeUpload(id: string) {
    this._uploads = this._uploads.filter(upload => upload.id !== id);
    this._uploadsSubject$.next(this._uploads);
  }

  /**
   * Check if there is another file with the same name and same file size
   * already in the file list.
   */
  private containsFile(file: File): boolean {
    return (
      !!this._files &&
      this._files.some(f => f.name === file.name && f.size === file.size)
    );
  }

  /**
   * Fix files being uploaded when there are files in the file list with
   * the same name.
   */
  private fixMatchingFiles(file: File) {
    const filename = file.name.split('.');
    const extensions = filename.slice(1).join('.');
    const matchingFiles = this._files
      .filter(
        f => f.name.startsWith(filename[0]) && f.name.endsWith(extensions),
      )
      .sort((a, b) => (a.name < b.name ? -1 : 1));

    // only modify name if there's a match (also runs when there are no matchingFiles)
    if (matchingFiles.every(f => f.name !== file.name)) {
      return file;
    }

    const matchName = matchingFiles[matchingFiles.length - 1].name.split('.');
    const fileNumber =
      filename[0] !== matchName[0] ? Number(matchName[0].substr(-2, 2)) + 1 : 1;
    const fileNumberPad = `_${`0${fileNumber}`.slice(-2)}`;
    filename[0] += fileNumberPad;
    return new File([file.slice(0, file.size)], filename.join('.'));
  }

  /**
   * Mark an upload as failed.
   */
  private setUploadFailed(uploadId: string) {
    this._uploads = this._uploads.reduce<UploadStatus[]>((arr, upload) => {
      if (upload.id === uploadId) {
        return [...arr, { ...upload, failed: true }];
      }
      return [...arr, upload];
    }, []);
    this._uploadsSubject$.next(this._uploads);
  }
}

@Injectable()
export class FileUploadLegacy {
  constructor(private freelancerHttp: FreelancerHttp) {}

  createSession() {
    return new FileUploadSession(this.freelancerHttp);
  }
}
