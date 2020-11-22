import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { UserAgent } from '@freelancer/user-agent';
import { isDefined } from '@freelancer/utils';
import ResizeObserver from 'resize-observer-polyfill';
import * as Rx from 'rxjs';
import {
  AutoCompleteObject,
  PasteObject,
  Selection,
} from '../auto-complete.types';

enum AcceptedNode {
  TEXTAREA = 'TEXTAREA',
}

enum KeyboardKey {
  ARROW_DOWN = 'arrowdown',
  ARROW_UP = 'arrowup',
  DOWN = 'down',
  UP = 'up',
  TAB = 'tab',
  ENTER = 'enter',
}

interface Coordinate {
  readonly top: number;
  readonly left: number;
  readonly height: number;
}

function camelCaseToDashCase(input: string): string {
  return input.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * The following component can mirror an input/textare html element
 * in order to determine the caret coordinates on the screen (relative
 * to the parent).
 *
 * Future plans with this componet:
 * - Display tags in richText div
 * - Support input element fully
 * (It couldn't be found in the DOM currently)
 */
@Component({
  selector: 'fl-auto-complete-rich-text',
  template: `
    <ng-content></ng-content>
    <div #richText class="RichText"></div>
  `,
  styleUrls: ['./auto-complete-rich-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutoCompleteRichTextComponent
  implements AfterViewInit, OnInit, OnDestroy {
  @Input() control: FormControl;

  @Input() disableKeys = false;

  @Input() selectedSuggestions: ReadonlyArray<AutoCompleteObject>;

  @Output() copyEvent = new EventEmitter<void>();
  @Output() cutEvent = new EventEmitter<void>();
  @Output() pasteEvent = new EventEmitter<PasteObject>();

  @ViewChild('richText', { read: ElementRef })
  richTextDiv: ElementRef<HTMLElement>;

  // We'll copy the properties below into the mirror div.
  // Note that some browsers, such as Firefox, do not concatenate properties
  // into their shorthand (e.g. padding-top, padding-bottom etc. -> padding),
  // so we have to list every single property explicitly.
  private readonly PROPERTIES: ReadonlyArray<string> = [
    'direction', // RTL support
    'boxSizing',
    'width', // on Chrome and IE, exclude the scrollbar, so the mirror div wraps exactly as the textarea does
    'height',
    'overflowX',
    'overflowY', // copy the scrollbar for IE

    'borderTopWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderLeftWidth',
    'borderStyle',
    'borderColor',

    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',

    // https://developer.mozilla.org/en-US/docs/Web/CSS/font
    'fontStyle',
    'fontVariant',
    'fontWeight',
    'fontStretch',
    'fontSize',
    'fontSizeAdjust',
    'lineHeight',
    'fontFamily',

    'textAlign',
    'textTransform',
    'textIndent',
    'textDecoration', // might not make a difference, but better be safe

    'letterSpacing',
    'wordSpacing',

    'tabSize',
    'MozTabSize',
  ];

  private acceptedNode: HTMLTextAreaElement;

  private contentChangedSubscription?: Rx.Subscription;
  private resizeObserver?: ResizeObserver;
  private unsubOnKeyDown?: () => void;
  private unsubCopy?: () => void;
  private unsubCut?: () => void;
  private unsubPaste?: () => void;

  private copiedObjects: ReadonlyArray<AutoCompleteObject>;

  constructor(
    private hostElement: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    private userAgent: UserAgent,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    this.contentChangedSubscription = this.control.valueChanges.subscribe(
      content => (this.element.textContent = content),
    );
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const acceptedNode = this.getAcceptedNode(this.hostElement.nativeElement);
      if (!acceptedNode) {
        throw new Error(
          `The given projection does not contain HTMLTextAreaElement.`,
        );
      }

      this.acceptedNode = acceptedNode;
      this.resizeObserver = new ResizeObserver(
        (entries: ResizeObserverEntry[]) => {
          entries.forEach(() => this.changeMirroredDivStyles());
        },
      );

      this.resizeObserver?.observe(this.acceptedNode);
      this.unsubOnKeyDown = this.renderer.listen(
        this.acceptedNode,
        'keydown',
        (event: KeyboardEvent) => {
          const key = event.key?.toLowerCase();
          if (
            this.disableKeys &&
            (key === KeyboardKey.ENTER ||
              key === KeyboardKey.UP ||
              key === KeyboardKey.DOWN ||
              key === KeyboardKey.TAB ||
              key === KeyboardKey.ARROW_UP ||
              key === KeyboardKey.ARROW_DOWN)
          ) {
            event.preventDefault();
          }
        },
      );

      this.unsubCopy = this.renderer.listen(this.acceptedNode, 'copy', () => {
        this.copySelectedObjects();
        this.copyEvent.emit();
      });

      this.unsubCut = this.renderer.listen(this.acceptedNode, 'cut', () => {
        this.copySelectedObjects();
        this.cutEvent.emit();
      });

      this.unsubPaste = this.renderer.listen(
        this.acceptedNode,
        'paste',
        (clipboard: ClipboardEvent) => {
          // Check one of the copied objects can be found in the clipboard copied text
          const clipboardData = clipboard.clipboardData || window.clipboardData;
          const copiedText = clipboardData?.getData('Text');
          let found = false;
          if (copiedText) {
            for (let i = 0; i < this.copiedObjects.length; i++) {
              const copiedObject = this.copiedObjects[i];
              if (
                copiedObject.completion &&
                copiedText.indexOf(copiedObject.completion) > -1
              ) {
                found = true;
              }
            }
          }

          // Emit copied suggestions
          if (found && copiedText) {
            this.pasteEvent.emit({
              text: copiedText,
              objects: this.copiedObjects,
            });
          } else if (copiedText) {
            this.pasteEvent.emit({
              text: copiedText,
            });
          }
        },
      );
    }
  }

  private copySelectedObjects() {
    const selectionLeft = this.getSelectionLeftPosition();
    const selectionRight = this.getSelectionRightPosition();

    this.copiedObjects = this.selectedSuggestions
      // Select objects that are in the selection range
      .filter(selectedSuggestion => {
        const { completion } = selectedSuggestion;
        if (completion) {
          const completionStartOffset = selectedSuggestion.offset;
          const completionEndOffset =
            completionStartOffset + completion.length + 1;

          return (
            completionStartOffset >= selectionLeft &&
            completionEndOffset <= selectionRight
          );
        }
      })
      .map(selectedSuggestion => ({ ...selectedSuggestion }));
  }

  changeMirroredDivStyles(): void {
    const computed = window.getComputedStyle(this.acceptedNode);

    // Transfer the element's properties to the div
    this.PROPERTIES.forEach(prop => {
      if (prop in computed) {
        const property = prop as keyof CSSStyleDeclaration;
        this.renderer.setStyle(
          this.element,
          camelCaseToDashCase(prop),
          computed[property],
        );
      }
    });

    const userAgent = this.userAgent.getUserAgent();
    const browser = userAgent.getBrowser();
    if (browser.name === 'Firefox' || browser.name === 'Mozilla') {
      this.fixForFirefox(computed);
    } else {
      // for Chrome to not render a scrollbar; IE keeps overflowY = 'scroll'
      this.renderer.setStyle(this.element, 'overflow', 'hidden');
    }
  }

  /**
   * Calculates the coordinates of the caret on the screen
   * relative to the component.
   *
   * @return Coordinate
   */
  getCaretCoordinates(): Coordinate {
    const caretOffset = this.getSelectionLeftPosition();
    const computed = window.getComputedStyle(this.acceptedNode);
    this.element.textContent = this.acceptedNode.value.substring(
      0,
      caretOffset,
    );

    const span = document.createElement('span');
    span.textContent = this.acceptedNode.value.substring(caretOffset);
    this.renderer.appendChild(this.element, span);

    const caretCoordinates = {
      top: span.offsetTop + parseInt(computed.borderTopWidth, 10),
      left: span.offsetLeft + parseInt(computed.borderTopWidth, 10),
      height: parseInt(computed.lineHeight, 10),
    };

    this.renderer.removeChild(this.element, span);

    return caretCoordinates;
  }

  /**
   * Calculates the selection in the text.
   *
   * @return Selection
   */
  getSelection(): Selection {
    if (
      !isDefined(this.acceptedNode.selectionStart) ||
      !isDefined(this.acceptedNode.selectionEnd)
    ) {
      return {
        left: 0,
        right: 0,
      };
    }

    // for texterea/input element
    if (this.acceptedNode.selectionStart >= this.acceptedNode.selectionEnd) {
      return {
        left: this.acceptedNode.selectionEnd,
        right: this.acceptedNode.selectionStart,
      };
    }

    return {
      left: this.acceptedNode.selectionStart,
      right: this.acceptedNode.selectionEnd,
    };
  }

  getSelectionLeftPosition(): number {
    const selection = this.getSelection();
    return selection.left;
  }

  getSelectionRightPosition(): number {
    const selection = this.getSelection();
    return selection.right;
  }

  focus(): void {
    this.acceptedNode.focus();
  }

  setCaretPosition(offset: number): void {
    this.acceptedNode.setSelectionRange(offset, offset);
  }

  get value(): string {
    return this.acceptedNode.value;
  }

  private get element() {
    return this.richTextDiv.nativeElement;
  }

  private getAcceptedNode(element: Node): HTMLTextAreaElement | undefined {
    if (element.hasChildNodes()) {
      const children = element.childNodes;

      for (let i = 0; i < children.length; i++) {
        const child = children.item(i);
        const node = this.getAcceptedNode(child);
        if (node) {
          return node;
        }
      }
    }

    if (element.nodeName === AcceptedNode.TEXTAREA) {
      return element as HTMLTextAreaElement;
    }

    return undefined;
  }

  private fixForFirefox(computed: CSSStyleDeclaration): void {
    // Firefox adds 2 pixels to the padding - https://bugzilla.mozilla.org/show_bug.cgi?id=753662
    this.renderer.setStyle(
      this.element,
      'width',
      `${parseInt(computed.width, 10) - 2}px`,
    );

    // Firefox lies about the overflow property for textareas: https://bugzilla.mozilla.org/show_bug.cgi?id=984275
    if (this.acceptedNode.scrollHeight > parseInt(computed.height, 10)) {
      this.renderer.setStyle(this.element, 'overflow-y', 'scroll');
    }
  }

  ngOnDestroy(): void {
    if (this.contentChangedSubscription) {
      this.contentChangedSubscription.unsubscribe();
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.unsubOnKeyDown) {
      this.unsubOnKeyDown();
    }
    if (this.unsubCopy) {
      this.unsubCopy();
    }
    if (this.unsubPaste) {
      this.unsubPaste();
    }
    if (this.unsubCut) {
      this.unsubCut();
    }
  }
}
