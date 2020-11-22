import { ContentObserver } from '@angular/cdk/observers';
import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  SimpleChanges,
  SkipSelf,
} from '@angular/core';
import * as Rx from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { MaxLinesHelper } from './max-lines.helper';
import { FontColor, HighlightColor, ReadMore } from './text.model';

export enum FontType {
  PARAGRAPH = 'paragraph',
  SPAN = 'span',
  STRONG = 'strong',
  CONTAINER = 'container',
}

export enum TextSize {
  XXXSMALL = 'xxxsmall',
  XXSMALL = 'xxsmall',
  XSMALL = 'xsmall',
  SMALL = 'small',
  MARKETING_SMALL = 'marketing_small',
  MID = 'mid',
  LARGE = 'large',
  XLARGE = 'xlarge',
  XXLARGE = 'xxlarge',
  XXXLARGE = 'xxxlarge',
  MARKETING_MEGA = 'marketing_mega',
  MARKETING_XMEGA = 'marketing_xmega',
  INHERIT = 'inherit',
}

export enum FontWeight {
  BOLD = 'bold',
  MEDIUM = 'medium',
  NORMAL = 'normal',
  LIGHT = 'light',
  INHERIT = 'inherit',
}

export enum FontStyle {
  ITALIC = 'italic',
  NORMAL = 'normal',
}

export enum TextAlign {
  CENTER = 'center',
  LEFT = 'left',
  RIGHT = 'right',
}

export enum TextTransform {
  CAPITALIZE = 'capitalize',
  LOWERCASE = 'lowercase',
  UPPERCASE = 'uppercase',
}

@Component({
  selector: 'fl-text',
  template: `
    <ng-container [ngSwitch]="fontType">
      <div
        *ngSwitchCase="FontType.PARAGRAPH"
        class="NativeElement"
        role="paragraph"
        [attr.data-text-transform]="textTransform"
        [attr.data-color]="color"
        [attr.data-size]="size"
        [attr.data-size-tablet]="sizeTablet"
        [attr.data-size-desktop]="sizeDesktop"
        [attr.data-size-desktop-xlarge]="sizeDesktopXLarge"
        [attr.data-weight]="weight"
        [attr.data-style]="style"
        [attr.data-line-break]="displayLineBreaks"
      >
        <ng-container *ngTemplateOutlet="injectedContent"></ng-container>
      </div>
      <span
        *ngSwitchCase="FontType.SPAN"
        class="NativeElement"
        [attr.data-text-transform]="textTransform"
        [attr.data-color]="color"
        [attr.data-size]="size"
        [attr.data-size-tablet]="sizeTablet"
        [attr.data-size-desktop]="sizeDesktop"
        [attr.data-size-desktop-xlarge]="sizeDesktopXLarge"
        [attr.data-weight]="weight"
        [attr.data-style]="style"
        [attr.data-line-break]="displayLineBreaks"
      >
        <ng-container *ngTemplateOutlet="injectedContent"></ng-container>
      </span>
      <strong
        *ngSwitchCase="FontType.STRONG"
        class="NativeElement Strong"
        [attr.data-text-transform]="textTransform"
        [attr.data-color]="color"
        [attr.data-size]="size"
        [attr.data-size-tablet]="sizeTablet"
        [attr.data-size-desktop]="sizeDesktop"
        [attr.data-size-desktop-xlarge]="sizeDesktopXLarge"
        [attr.data-weight]="weight"
        [attr.data-style]="style"
        [attr.data-line-break]="displayLineBreaks"
      >
        <ng-container *ngTemplateOutlet="injectedContent"></ng-container>
      </strong>
      <!-- this one's also a div but doesn't have paragraph semantics -->
      <div
        *ngSwitchCase="FontType.CONTAINER"
        class="NativeElement"
        [attr.data-text-transform]="textTransform"
        [attr.data-color]="color"
        [attr.data-size]="size"
        [attr.data-size-tablet]="sizeTablet"
        [attr.data-size-desktop]="sizeDesktop"
        [attr.data-size-desktop-xlarge]="sizeDesktopXLarge"
        [attr.data-weight]="weight"
        [attr.data-style]="style"
        [attr.data-line-break]="displayLineBreaks"
      >
        <ng-container *ngTemplateOutlet="injectedContent"></ng-container>
      </div>
      <ng-template #injectedContent>
        <ng-content></ng-content>
      </ng-template>
    </ng-container>
  `,
  styleUrls: ['./text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextComponent
  implements AfterViewInit, OnDestroy, OnChanges, OnInit {
  FontType = FontType;

  @Input()
  @HostBinding('attr.data-color')
  color = FontColor.DARK;

  /**
   * Text selection color
   */
  @HostBinding('attr.data-highlight-color')
  @Input()
  highlightColor?: HighlightColor;

  /**
   * Font size for mobile and above
   */
  @Input() size: TextSize = TextSize.XSMALL;

  /**
   * Change the [size] from tablet and above
   */
  @Input() sizeTablet?: TextSize;

  /**
   * Change the [size] and/or [sizeTablet] from desktop and above
   */
  @Input() sizeDesktop?: TextSize;

  /** Change the [size], [sizeTablet] and [sizeDesktop] from desktop-xlarge and above */
  @Input() sizeDesktopXLarge?: TextSize;

  @Input() style = FontStyle.NORMAL;

  /** Change the text-align property (only works on fontType.PARAGRAPH) */
  @HostBinding('attr.data-text-align')
  @Input()
  textAlign?: TextAlign;

  @Input() textTransform?: TextTransform;

  @Input() weight = FontWeight.NORMAL;

  /** Defines the HTML node it will use e.g (<p>, <span>, <strong>)
   *  Note: This is for semantics usage which defaults to a <p> tag
   */
  @HostBinding('attr.data-type')
  @Input()
  fontType = FontType.PARAGRAPH;

  /**
   * Default false, true will parse the \n, <br> tags in the string to create a new line
   * Will break the line when maxLines=false, or maxLines=true and readmore clicked
   */
  @Input()
  displayLineBreaks = false;

  /*
   * Maximum number of lines of text to display before truncating
   */
  @Input()
  @HostBinding('attr.data-max-lines')
  maxLines: number;

  /*
   * Paired with [maxLines].
   * Displays "Read more" link or icon.
   */
  @Input()
  @HostBinding('attr.data-read-more')
  readMore = ReadMore.NONE;

  /**
   * Paired with [maxLines].
   * Limit the height to prevent UI flickering during truncation in initialization.
   * This is an optional field when maxLines is set. However, it is recommended when using TextSize.INHERIT
   * to supply a custom value depending on the text size and line height we inherit from.
   */
  @Input()
  @HostBinding('style.max-height')
  maxHeight: string;

  @HostBinding('style.overflow')
  overflow: string;

  private maxLinesHelper: MaxLinesHelper;
  private container: HTMLElement;
  private windowSize: { width?: number; height?: number } = {};
  private originalContainer: Node;
  private mutationSub?: Rx.Subscription;
  private isInTransition: boolean;
  private isExpanded: boolean;
  private unsubResize?: () => void;

  constructor(
    private element: ElementRef,
    private ngZone: NgZone,
    private obs: ContentObserver,
    @SkipSelf() protected renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit() {
    // Set the max height to prevent UI flickering before the text is truncated.
    if (this.maxLines && !this.maxHeight) {
      // FIXME: share CSS variables with JS
      let lineHeightUi: number;
      let fontSizeUi: number;

      switch (this.size) {
        case TextSize.SMALL:
          lineHeightUi = 1.5;
          fontSizeUi = 16;
          break;
        case TextSize.XXSMALL:
          lineHeightUi = 1.2;
          fontSizeUi = 13;
          break;
        default:
          lineHeightUi = 1.43;
          fontSizeUi = 14;
      }

      this.maxHeight = `${this.maxLines * lineHeightUi * fontSizeUi}px`;
      this.overflow = 'hidden';
    }
  }

  ngAfterViewInit() {
    if (this.maxLines && isPlatformBrowser(this.platformId)) {
      [this.container] = this.element.nativeElement.children;
      this.ngZone.onStable
        .asObservable()
        .pipe(
          filter(() => !!this.container.scrollHeight),
          take(1),
        )
        .toPromise()
        .then(() => {
          this.truncate();
        });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      this.maxLines &&
      isPlatformBrowser(this.platformId) &&
      this.container &&
      'maxLines' in changes
    ) {
      this.truncate();
    }
  }

  ngOnDestroy() {
    this.destroyListeners();
  }

  destroyListeners() {
    if (this.mutationSub) {
      this.mutationSub.unsubscribe();
    }
    if (this.unsubResize) {
      this.unsubResize();
    }
  }

  truncate() {
    this.isExpanded = false;
    this.destroyListeners();
    [this.container] = this.element.nativeElement.children;
    // save original content
    this.originalContainer = this.container.cloneNode(true);
    this.maxLinesHelper = new MaxLinesHelper(this.container, isTruncated => {
      // The container has been truncated or restored. The result of either
      // actions require a transition period when we are in ReadMore.ICON mode.
      if (this.readMore === ReadMore.ICON) {
        this.isInTransition = true;
      }

      if (!isTruncated) {
        this.isInTransition = true;
        this.isExpanded = true;
        this.renderer.setStyle(
          this.element.nativeElement,
          'max-height',
          'none',
        );

        this.restoreContainer();
      }

      // This indicates that the transition is completed.
      requestAnimationFrame(() => {
        this.isInTransition = false;
      });
    });

    // Check if the text content fits within the container.
    // Truncate text if it exceeds the maximum line limit.
    // Append a "Read more" link or toggle icon to the end of the text block if specified.
    this.maxLinesHelper.truncate(this.maxLines, this.readMore, this.color);

    // listen for changes of content
    this.mutationSub = this.obs.observe(this.container).subscribe(() => {
      // do nothing if the mutation is the result of the element expanding
      if (!this.isInTransition) {
        this.truncate();
      }
    });

    // listen for resize events
    this.unsubResize = this.renderer.listen('window', 'resize', () => {
      // make sure the element is displayed
      if (
        this.container &&
        (this.container.offsetWidth ||
          this.container.offsetHeight ||
          this.container.getClientRects().length)
      ) {
        const newSizes = {
          width: window.innerWidth,
          height: window.innerHeight,
        };
        // only do something if the actual window size has changed
        if (
          this.windowSize.width !== newSizes.width ||
          this.windowSize.height !== newSizes.height
        ) {
          this.windowSize = newSizes;
          if (!this.isExpanded) {
            this.reTruncate();
          }
        }
      }
    });
  }

  private restoreContainer() {
    let lastIndex = 0;
    const originalChildNodes = this.originalContainer.childNodes;
    this.container.childNodes.forEach(childNode => {
      if (
        originalChildNodes.length <= lastIndex ||
        childNode.nodeType === Node.COMMENT_NODE
      ) {
        return;
      }

      const newChild = originalChildNodes[lastIndex].cloneNode(true);
      this.container.replaceChild(newChild, childNode);
      lastIndex++;
    });
    for (let i = lastIndex + 1; i < originalChildNodes.length; i++) {
      this.container.appendChild(originalChildNodes[i].cloneNode(true));
    }
  }

  private reTruncate() {
    // Restore the original content.
    this.restoreContainer();
    // Perform truncation again.
    this.truncate();
  }
}
