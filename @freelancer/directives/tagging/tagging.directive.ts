import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import * as Rx from 'rxjs';

/**
 * Detect `#` or `@` tags and render those as tags.
 */
export enum TagType {
  AT = '@',
  HASH_TAG = '#',
}

enum AcceptedNode {
  TEXTAREA = 'TEXTAREA',
  INPUT = 'INPUT',
}

export interface Tag {
  // The identified tag
  content: string;
  // Tag offset in the text
  offset: number;
  // Type of the tag
  type: TagType;
}

export interface TagResult {
  current?: Tag;
  tags: ReadonlyArray<Tag>;
}

@Directive({ selector: '[flTagging]' })
export class TaggingDirective implements AfterViewInit, OnDestroy {
  @Input() flTagging: FormControl;
  @Input() flTaggingTypes: ReadonlyArray<TagType> = [
    TagType.AT,
    TagType.HASH_TAG,
  ];
  @Input() flTaggingLimit = 100;
  @Output() flTaggingResult = new EventEmitter<TagResult>();

  private pattern: RegExp;
  private formValueChangesSubscription?: Rx.Subscription;
  private tags: ReadonlyArray<Tag> = [];

  private acceptedNode: HTMLInputElement | HTMLTextAreaElement;

  constructor(private _element: ElementRef) {}

  ngAfterViewInit(): void {
    this.pattern = this.buildTaggingPattern();
    const acceptedNode = this.getAcceptedNode(this._element.nativeElement);
    if (!acceptedNode) {
      throw new Error('Unsupported element');
    }
    this.acceptedNode = acceptedNode;
    this.formValueChangesSubscription = this.flTagging.valueChanges.subscribe(
      content => this.collectTags(content),
    );
  }

  ngOnDestroy(): void {
    if (this.formValueChangesSubscription) {
      this.formValueChangesSubscription.unsubscribe();
    }
  }

  private collectTags(text: string): void {
    this.tags = [];
    let match = this.pattern.exec(text);
    while (match !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (match.index === this.pattern.lastIndex) {
        this.pattern.lastIndex++;
      }

      const offset = match.index;
      const taggingSymbol = text.charAt(offset - 1);

      this.tags = [
        ...this.tags,
        {
          content: match[0],
          offset: offset - 1,
          type: this.getTagType(taggingSymbol),
        },
      ];

      if (this.tags.length > this.flTaggingLimit) {
        break;
      }

      match = this.pattern.exec(text);
    }

    const caretPosition = this.getCaretPosition();
    this.flTaggingResult.emit({
      current: caretPosition ? this.getTagByPosition(caretPosition) : undefined,
      tags: this.tags,
    });
  }

  private getTagType(taggingSymbol: string): TagType {
    switch (taggingSymbol) {
      case TagType.AT:
        return TagType.AT;

      case TagType.HASH_TAG:
        return TagType.HASH_TAG;

      default:
        throw new Error(`Unexpected tagging symbol: ${taggingSymbol}`);
    }
  }

  private buildTaggingPattern(flags = 'gm') {
    // Positive look behind: Include match if we find a tagging symbol prefixed with whitespace or is the
    // start of the text
    const lookbehind = `(?<=\\s${this.flTaggingTypes.join(
      '|',
    )}|^${this.flTaggingTypes.join('|^')})`;

    const content = '[\\da-zA-Z]*';

    // Positive look ahead: Include match if we end with a non-word character or is the end of
    // the text
    const lookahead = '(?=[^\\da-zA-Z]|$)';

    return new RegExp(`${lookbehind}${content}${lookahead}`, flags);
  }

  private getTagByPosition(offset: number): Tag | undefined {
    const result = this.tags.find(
      tag =>
        tag.offset < offset && tag.offset + tag.content.length + 1 >= offset,
    );
    if (!result) {
      return undefined;
    }
    this.tags = [...this.tags.filter(tag => tag !== result)];
    return result;
  }

  /**
   * Calculates the caret position in the acceptedNode.
   * This position is the offset in the text.
   *
   * @return number|null
   */
  private getCaretPosition(): number | null {
    // for texterea/input element
    return this.acceptedNode.selectionStart;
  }

  private getAcceptedNode(
    element: Node,
  ): HTMLInputElement | HTMLTextAreaElement | undefined {
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

    if (element.nodeName === AcceptedNode.INPUT) {
      return element as HTMLInputElement;
    }

    return undefined;
  }
}
