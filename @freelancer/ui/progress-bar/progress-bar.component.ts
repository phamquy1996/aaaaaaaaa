import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

export enum ProgressSize {
  SMALL = 'small',
  LARGE = 'large',
}

export enum ProgressFill {
  DEFAULT = 'default',
  GRADIENT = 'gradient',
}

export enum ProgressOrientation {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
}

@Component({
  selector: 'fl-progress-bar',
  template: `
    <fl-bit
      #progressHighlight
      class="ProgressHighlight"
      [attr.data-orientation]="orientation"
    ></fl-bit>
  `,
  styleUrls: ['./progress-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressBarComponent implements OnChanges {
  @Input() progressPercentage: number;
  @Input() fill: ProgressFill = ProgressFill.DEFAULT;

  @HostBinding('attr.data-size')
  @Input()
  size: ProgressSize = ProgressSize.SMALL;

  @HostBinding('attr.data-size-tablet')
  @Input()
  sizeTablet?: ProgressSize;

  @HostBinding('attr.data-size-desktop')
  @Input()
  sizeDesktop?: ProgressSize;

  @HostBinding('attr.data-orientation')
  @Input()
  orientation: ProgressOrientation = ProgressOrientation.HORIZONTAL;

  /**
   * Set the input to false if you need the progress bar to be edge to edge
   * within pages, modals, etc. (i.e take up the full width of the container)
   */
  @HostBinding('attr.data-rounded-corners')
  @Input()
  roundedCorners = true;

  /**
   * Progress bar's aria label for screen readers
   */
  @HostBinding('attr.aria-label')
  @Input()
  label: string;

  @HostBinding('attr.role')
  role = 'progressbar';

  @HostBinding('attr.aria-valuemin')
  valueMin = '0';

  @HostBinding('attr.aria-valuemax')
  valueMax = '100';

  @HostBinding('attr.aria-valuenow')
  get progressValue(): number {
    return this.progressPercentage;
  }

  @ViewChild('progressHighlight', { read: ElementRef, static: true })
  progressHighlight: ElementRef<HTMLDivElement>;

  constructor(private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges) {
    if ('orientation' in changes) {
      this.cleanupView();
    }

    this.updateView();
  }

  updateView() {
    const progress = Math.min(Math.max(this.progressPercentage / 100, 0), 1);
    const progressStyle = this.progressHighlight.nativeElement;
    const property =
      this.orientation === ProgressOrientation.HORIZONTAL ? 'width' : 'height';

    this.renderer.setStyle(progressStyle, property, `${progress * 100}%`);

    if (this.fill === ProgressFill.GRADIENT) {
      const gradientOrientation =
        this.orientation === ProgressOrientation.HORIZONTAL
          ? 'right'
          : 'bottom';
      /**
       * Sets background gradient with offset to retain color positions when width is changed
       * SASS variables: $blue to $aqua-light
       */
      const gradientOffset = progress ? `${(1 / progress) * 100}%` : null;
      this.progressHighlight.nativeElement.style.background = `linear-gradient(to ${gradientOrientation}, #139ff0, #30dbe3 ${gradientOffset})`;
    }
  }

  cleanupView() {
    const progressStyle = this.progressHighlight.nativeElement;

    this.renderer.removeStyle(progressStyle, 'width');
    this.renderer.removeStyle(progressStyle, 'height');
  }
}
