import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { HoverColor, IconColor, IconSize } from '@freelancer/ui/icon';
import { FontColor, FontType, FontWeight, TextSize } from '@freelancer/ui/text';
import * as Rx from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export enum FileSelectSize {
  COMPACT = 'compact',
  DEFAULT = 'default',
  LARGE = 'large',
}

export enum FileSelectMode {
  DRAGDROP = 'dragdrop',
  ICON = 'icon',
}

// FIXME: We can't directly use the DragEvent type as it breaks Safari in dev mode as
// TypeScript emits it on the method decorated param type. Maybe try to remove
// that hack later when we use Bazel or Ivy.
export type FlDragEvent = DragEvent;

@Component({
  selector: 'fl-file-select',
  template: `
    <ng-container
      *ngIf="contentProvided && fileSelectMode === FileSelectMode.DRAGDROP"
    >
      <fl-bit
        class="FileHoverOverlay"
        *ngIf="fileHover"
        (dragleave)="onDragLeave()"
      >
        <fl-icon
          class="FileHoverChild"
          [color]="IconColor.LIGHT"
          [size]="IconSize.MID"
          name="ui-drag-drop"
          label="Drop your file to send as attachment"
        ></fl-icon>
        <span class="FileHoverText FileHoverChild">
          Drop to attach your file
        </span>
      </fl-bit>
      <input
        class="HiddenInput"
        #fileInput
        title="Drop to attach your file"
        i18n-title="File input tooltip"
        type="file"
        [multiple]="multiple"
        [disabled]="control.disabled || null"
        (change)="onFileSelect(fileInput.files)"
      />
    </ng-container>

    <fl-bit [ngClass]="{ Content: contentProvided }" #content>
      <ng-content></ng-content>
    </fl-bit>

    <!-- Default content - displayed if there is no ng-content -->
    <ng-container *ngIf="!contentProvided">
      <fl-bit
        class="DefaultContent"
        *ngIf="fileSelectMode === FileSelectMode.DRAGDROP"
        [ngClass]="{ FileHover: fileHover }"
        [attr.data-size]="size"
      >
        <fl-bit class="DefaultContent-inner">
          <fl-icon
            class="DefaultContent-icon FileHoverChild"
            label="Select file to send as attachment"
            name="ui-upload"
            [color]="IconColor.INHERIT"
            [size]="
              size === FileSelectSize.LARGE ? IconSize.XLARGE : IconSize.MID
            "
          ></fl-icon>
          <fl-bit class="DefaultContent-text">
            <fl-text
              [color]="FontColor.DARK"
              [size]="
                size === FileSelectSize.LARGE ? TextSize.SMALL : TextSize.XSMALL
              "
              [weight]="FontWeight.BOLD"
            >
              <fl-text
                class="DefaultContent-highlight"
                [color]="FontColor.INHERIT"
                [fontType]="FontType.SPAN"
                [size]="TextSize.INHERIT"
                [weight]="FontWeight.BOLD"
              >
                Click
              </fl-text>
              or drag here to upload
            </fl-text>
            <fl-text
              *ngIf="note"
              [color]="FontColor.MID"
              [size]="
                size === FileSelectSize.LARGE
                  ? TextSize.XXSMALL
                  : TextSize.XXXSMALL
              "
            >
              {{ note }}
            </fl-text>
          </fl-bit>
        </fl-bit>
      </fl-bit>
      <fl-button
        *ngIf="fileSelectMode === FileSelectMode.ICON"
        [disabled]="!active"
      >
        <fl-icon
          label="Attach a file"
          [color]="control.disabled ? IconColor.MID : iconColor"
          [size]="IconSize.SMALL"
          [name]="'ui-attachment'"
        ></fl-icon>
      </fl-button>
      <input
        class="FileInput"
        #fileInput
        title="Click or drop to attach your file"
        i18n-title="File input tooltip"
        type="file"
        [multiple]="multiple"
        [disabled]="control.disabled || null"
        (change)="onFileSelect(fileInput.files)"
        (click)="handleClick()"
        (dragleave)="onDragLeave()"
        (mouseenter)="onMouseOver(true)"
        (mouseleave)="onMouseOver(false)"
      />
    </ng-container>
    <fl-text
      *ngIf="control.invalid && control.dirty"
      [color]="FontColor.ERROR"
      [size]="TextSize.XXSMALL"
    >
      {{ error }}
    </fl-text>
  `,
  styleUrls: ['./file-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileSelectComponent implements OnInit, OnDestroy {
  FileSelectMode = FileSelectMode;
  FileSelectSize = FileSelectSize;
  HoverColor = HoverColor;
  IconColor = IconColor;
  IconSize = IconSize;
  FontColor = FontColor;
  TextSize = TextSize;
  FontType = FontType;
  FontWeight = FontWeight;
  fileHover = false;
  contentProvided = false;
  iconColor = IconColor.DARK;
  error: string;
  errorSubscription?: Rx.Subscription;

  @Input() fileSelectMode = FileSelectMode.DRAGDROP;
  @Input() control = new FormControl();
  @Input() size = FileSelectSize.DEFAULT;
  @Input() note: string;

  /** Deprecated: set the disabled status on your control instead */
  @Input()
  set active(active: boolean) {
    console.warn(`Manually setting active status on fl-file-select is deprecated.
      Set the disabled status on your form control instead`);
    if (active) {
      this.control.enable();
    } else {
      this.control.disable();
    }
  }

  /** Native multiple attribute: allows multiple files at once */
  @Input() multiple = false;

  /** Deprecated: use control.valueChanges instead */
  @Output() onFileDropped = new EventEmitter<File>();

  @ViewChild('fileInput')
  nativeElement: ElementRef<HTMLInputElement>;

  @ViewChild('content', { read: ElementRef, static: true })
  content: ElementRef<HTMLDivElement>;

  @HostBinding('class.AsIcon') asIcon: Boolean;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.asIcon = this.fileSelectMode === FileSelectMode.ICON;
    this.contentProvided = !!(this.content.nativeElement.children.length > 0);
    this.errorSubscription = this.control.statusChanges
      .pipe(startWith(this.control.status))
      .subscribe(() => {
        [this.error] = Object.values(this.control.errors || {});
        this.cd.markForCheck();
      });
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: FlDragEvent): void {
    if (this.control.disabled) {
      return;
    }
    this.fileHover = true;
    event.preventDefault();
  }

  onDragLeave(): void {
    if (this.control.disabled) {
      return;
    }
    this.fileHover = false;
  }

  @HostListener('drop', ['$event'])
  onDrop(event: FlDragEvent): void {
    if (this.control.disabled) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer) {
      this.onFileSelect(event.dataTransfer.files);
    }
    this.fileHover = false;
  }

  onMouseOver(mouseOver: boolean) {
    if (mouseOver) {
      this.iconColor = IconColor.PRIMARY;
    } else {
      this.iconColor = IconColor.DARK;
    }
  }

  onFileSelect(fileList: FileList | null): void {
    if (fileList) {
      const files = Array.from(fileList);
      this.control.setValue(files);
      this.control.markAsDirty();
      files.forEach((file: File) => {
        this.onFileDropped.emit(file);
      });
    }

    this.resetInputValue();
  }

  ngOnDestroy() {
    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
    }
  }

  /**
   * Trigger the file select dialog
   * Can be called from outside this component.
   */
  triggerInput() {
    this.nativeElement.nativeElement.click();
  }

  handleClick() {
    this.resetInputValue();
  }

  resetInputValue() {
    // This re-sets the selected filename of the file input element to blank
    // To allow the change event to be triggered and detected in the file input
    // So that files with the same filename can successfully be re-selected
    this.nativeElement.nativeElement.value = '';
  }

  readFileAsDataURL(file: File): Rx.Observable<string | null> {
    const fileReader = new FileReader();

    fileReader.readAsDataURL(file);

    // We can cast to string here as we are using the `readAsDataURL` function,
    // the result will always be a string.
    return Rx.fromEvent(fileReader, 'load').pipe(
      map(() => fileReader.result as string),
    );
  }
}
