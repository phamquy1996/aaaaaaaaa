import { Component, HostListener, Input, OnInit } from '@angular/core';
import { User } from '@freelancer/datastore/collections';
import { FileDownload } from '@freelancer/file-download';
import { FileStorage, StorageBucket } from '@freelancer/file-storage';
import { HorizontalAlignment } from '@freelancer/ui/grid';
import { HoverColor, IconColor, IconSize } from '@freelancer/ui/icon';
import { LinkColor, LinkHoverColor, LinkWeight } from '@freelancer/ui/link';
import { Margin } from '@freelancer/ui/margin';
import {
  FontColor,
  FontWeight,
  TextAlign,
  TextSize,
} from '@freelancer/ui/text';
import * as Rx from 'rxjs';

export interface MediaFile {
  readonly alt?: string;
  readonly id: string;
  readonly mediaType: MediaType;
  readonly name: string;
  readonly owner: User;
  readonly size: number;
  readonly sources: {
    readonly raw?: string;
    readonly small: string;
    readonly medium: string;
    readonly large: string;
  };
}

export enum MediaType {
  AUDIO,
  IMAGE,
  VIDEO,
  FILE,
}

@Component({
  selector: 'app-file-attachments-modal',
  template: `
    <fl-bit class="FileAttachmentModal" flTrackingSection="FileAttachmentModal">
      <fl-bit
        class="FileAttachmentModal-header"
        [flMarginRight]="Margin.NONE"
        [flMarginBottom]="Margin.SMALL"
      >
        <fl-grid [hAlign]="HorizontalAlignment.HORIZONTAL_CENTER">
          <fl-col [col]="12" [colTablet]="10">
            <fl-grid class="FileAttachmentModal-header-grid">
              <fl-col
                class="FileAttachmentModal-header-info"
                [col]="12"
                [colTablet]="6"
              >
                <fl-bit
                  *ngIf="currentFile$ | async as currentFile"
                  class="FileInfo"
                  [flMarginBottom]="
                    mediaFiles.length > 1 ? Margin.XSMALL : Margin.NONE
                  "
                  [flMarginBottomTablet]="Margin.NONE"
                >
                  <fl-icon
                    class="FileInfo-logo"
                    [name]="'ui-bird'"
                    [size]="IconSize.XXLARGE"
                    [color]="IconColor.LIGHT"
                    [flHideMobile]="true"
                    [flMarginRight]="Margin.SMALL"
                  ></fl-icon>
                  <fl-bit class="FileInfo-details">
                    <fl-text
                      class="FileInfo-details-title"
                      [color]="FontColor.LIGHT"
                      [size]="TextSize.MID"
                      [sizeDesktop]="TextSize.LARGE"
                      [weight]="FontWeight.LIGHT"
                    >
                      {{ currentFile.name | truncateFilename: 25 }}
                    </fl-text>
                    <fl-bit class="FileInfo-details-user">
                      <fl-text
                        i18n="Byline text"
                        [color]="FontColor.LIGHT"
                        [size]="TextSize.SMALL"
                      >
                        posted by&nbsp;
                      </fl-text>
                      <fl-link
                        i18n="Portfolio item owner username"
                        [color]="LinkColor.LIGHT"
                        [size]="TextSize.SMALL"
                        [weight]="LinkWeight.BOLD"
                        [link]="'/u/' + currentFile.owner.username"
                        [hoverColor]="LinkHoverColor.INHERIT"
                        [flTrackingLabel]="'Header-Username'"
                        [flTrackingReferenceId]="currentFile.owner.id"
                        [flTrackingReferenceType]="'user_id'"
                      >
                        {{ currentFile.owner.displayName }}
                      </fl-link>
                    </fl-bit>
                    <fl-button
                      class="FileInfo-details-download"
                      flTrackingLabel="FileDownload"
                      flTrackingReferenceType="file_id"
                      [flTrackingReferenceId]="currentFile.id"
                      (click)="handleDownload(currentFile)"
                    >
                      <fl-icon
                        [color]="IconColor.LIGHT"
                        [name]="'ui-download-v2'"
                        [flMarginRight]="Margin.XSMALL"
                      ></fl-icon>
                      <fl-text
                        [color]="FontColor.LIGHT"
                        [size]="TextSize.SMALL"
                      >
                        {{ currentFile.size | fileSize }}
                      </fl-text>
                    </fl-button>
                  </fl-bit>
                </fl-bit>
              </fl-col>
              <fl-col
                *ngIf="mediaFiles.length > 1"
                class="FileCarousel"
                [col]="12"
                [colTablet]="6"
                [colDesktopLarge]="5"
                [flexContainer]="true"
                [pull]="'right'"
              >
                <app-file-attachments-carousel
                  [flHideTablet]="true"
                  [flHideDesktopLarge]="true"
                  [currentIndex$]="currentIndex$"
                  [files]="mediaFiles"
                  (indexChange)="changeIndex($event)"
                ></app-file-attachments-carousel>
                <app-file-attachments-carousel
                  [flShowTablet]="true"
                  [currentIndex$]="currentIndex$"
                  [files]="mediaFiles"
                  [itemAlignment]="TextAlign.RIGHT"
                  (indexChange)="changeIndex($event)"
                ></app-file-attachments-carousel>
                <app-file-attachments-carousel
                  [flShowDesktopLarge]="true"
                  [currentIndex$]="currentIndex$"
                  [files]="mediaFiles"
                  [numberOfElements]="5"
                  [itemAlignment]="TextAlign.RIGHT"
                  (indexChange)="changeIndex($event)"
                ></app-file-attachments-carousel>
              </fl-col>
            </fl-grid>
          </fl-col>
        </fl-grid>
      </fl-bit>
      <fl-hr
        class="FileAttachmentModal-divider"
        [flMarginBottom]="Margin.SMALL"
      ></fl-hr>
      <fl-bit class="FileAttachmentModal-body">
        <fl-bit
          *ngIf="currentFile$ | async as currentFile"
          class="FileAttachmentModal-media"
        >
          <fl-grid
            class="FileAttachmentModal-body-grid"
            [hAlign]="HorizontalAlignment.HORIZONTAL_CENTER"
          >
            <fl-col
              class="FileAttachmentModal-body-grid-col"
              [col]="1"
              [flexContainer]="true"
              [flHideMobile]="true"
            >
              <fl-icon
                *ngIf="index > 0"
                class="FileAttachmentModal-body-grid-col-nav"
                flTrackingLabel="MediaView-left-navigation"
                [name]="'ui-arrow-left-alt'"
                [color]="IconColor.LIGHT"
                [size]="IconSize.MID"
                (click)="moveSliderLeft()"
              ></fl-icon>
            </fl-col>
            <fl-col
              class="FileAttachmentModal-body-grid-col"
              [col]="12"
              [colTablet]="10"
              (swipeleft)="moveSliderLeft()"
              (swiperight)="moveSliderRight()"
            >
              <app-file-attachments-preview
                class="FileAttachmentModal-media-item"
                [currentIndex$]="currentIndex$"
                [bucket]="bucket"
                [file]="currentFile"
                [refreshUrl]="refreshUrl"
                (onImageError)="handleImageError($event)"
                (onImageRefresh)="handleImageRefresh($event)"
              ></app-file-attachments-preview>
            </fl-col>
            <fl-col
              class="FileAttachmentModal-body-grid-col"
              [col]="1"
              [flexContainer]="true"
              [flHideMobile]="true"
            >
              <fl-icon
                *ngIf="index < mediaFiles.length - 1"
                class="FileAttachmentModal-body-grid-col-nav"
                flTrackingLabel="MediaView-right-navigation"
                [name]="'ui-arrow-right-alt'"
                [color]="IconColor.LIGHT"
                [size]="IconSize.MID"
                (click)="moveSliderRight()"
              ></fl-icon>
            </fl-col>
          </fl-grid>
        </fl-bit>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./file-attachments-modal.component.scss'],
})
export class FileAttachmentsModalComponent implements OnInit {
  FontColor = FontColor;
  FontWeight = FontWeight;
  HorizontalAlignment = HorizontalAlignment;
  HoverColor = HoverColor;
  IconColor = IconColor;
  IconSize = IconSize;
  LinkColor = LinkColor;
  LinkHoverColor = LinkHoverColor;
  LinkWeight = LinkWeight;
  Margin = Margin;
  MediaType = MediaType;
  TextAlign = TextAlign;
  TextSize = TextSize;

  @Input() bucket: StorageBucket;
  @Input() index: number;
  @Input() mediaFiles: ReadonlyArray<MediaFile>;
  @Input() refreshUrl: string;

  private currentIndexSubject$ = new Rx.BehaviorSubject<number>(0);
  currentIndex$ = this.currentIndexSubject$.asObservable();

  private currentFileSubject$ = new Rx.BehaviorSubject<MediaFile | null>(null);
  currentFile$ = this.currentFileSubject$.asObservable();

  errorImageIds: ReadonlyArray<string> = [];

  constructor(
    private fileDownload: FileDownload,
    private fileStorage: FileStorage,
  ) {}

  ngOnInit(): void {
    this.updateCurrentIndex();
    this.updateCurrentFile();
  }

  @HostListener('document:keyup.arrowleft')
  keyLeft() {
    this.moveSliderLeft();
  }

  @HostListener('document:keyup.arrowright')
  keyRight() {
    this.moveSliderRight();
  }

  moveSliderLeft() {
    const nextIndex = this.index - 1;
    if (nextIndex >= 0) {
      this.changeIndex(nextIndex);
    }
  }

  moveSliderRight() {
    const nextIndex = this.index + 1;
    if (nextIndex < this.mediaFiles.length) {
      this.changeIndex(nextIndex);
    }
  }

  changeIndex(index: number): void {
    this.index = index;
    this.updateCurrentIndex();
    this.updateCurrentFile();
  }

  handleImageError(id: string) {
    this.errorImageIds = [...this.errorImageIds, id];
  }

  handleImageRefresh(id: string) {
    this.errorImageIds = this.errorImageIds.filter(itemId => itemId !== id);
  }

  handleDownload(currentFile: MediaFile): void {
    const filePath = currentFile.sources.raw;
    if (filePath) {
      this.fileDownload.download(filePath, currentFile.name);
      return;
    }

    this.fileStorage
      .getDownloadURL(this.bucket, currentFile.id)
      .then(response => {
        if (response.status === 'success') {
          this.fileDownload.download(response.downloadURL, currentFile.name);
        }
      });
  }

  private updateCurrentIndex() {
    this.currentIndexSubject$.next(this.index);
  }

  private updateCurrentFile() {
    this.currentFileSubject$.next(this.mediaFiles[this.index]);
  }
}
