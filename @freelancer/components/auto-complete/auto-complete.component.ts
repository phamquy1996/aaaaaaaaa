import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Tracking } from '@freelancer/tracking';
import { FreelancerBreakpointValues } from '@freelancer/ui/breakpoints';
import {
  CalloutComponent,
  CalloutPlacement,
  CalloutSize,
} from '@freelancer/ui/callout';
import { ListItemPadding, ListItemType } from '@freelancer/ui/list-item';
import { SpinnerSize } from '@freelancer/ui/spinner';
import { StickyPosition } from '@freelancer/ui/sticky';
import * as Rx from 'rxjs';
import { take } from 'rxjs/operators';
import { AutoCompleteRichTextComponent } from './auto-complete-rich-text/auto-complete-rich-text.component';
import {
  AutoCompleteObject,
  PasteObject,
  Selection,
} from './auto-complete.types';

@Component({
  selector: 'fl-auto-complete-suggestion-template',
  template: `
    <ng-content></ng-content>
  `,
})
export class AutoCompleteSuggestionTemplateComponent {}

@Component({
  selector: 'fl-auto-complete-input',
  template: `
    <ng-content></ng-content>
  `,
})
export class AutoCompleteInputComponent {}

@Component({
  selector: 'fl-auto-complete',
  template: `
    <fl-auto-complete-rich-text
      #autoCompleteRichText
      [control]="control"
      [disableKeys]="disableKeys"
      [selectedSuggestions]="selectedSuggestions"
      (pasteEvent)="handlePasteEvent($event)"
    >
      <ng-content select="fl-auto-complete-input"></ng-content>
    </fl-auto-complete-rich-text>

    <fl-callout
      #suggestionsCallout
      [flShowDesktop]="true"
      [hideArrow]="true"
      [hideCloseButton]="true"
      [edgeToEdge]="true"
      [placement]="suggestionsCalloutPlacement"
      [size]="suggestionsCalloutSize"
      (calloutOpen)="handleOpenCloseEvent(true)"
      (calloutClose)="handleOpenCloseEvent(false)"
    >
      <fl-callout-trigger #suggestionsTrigger class="CalloutTrigger">
      </fl-callout-trigger>

      <fl-callout-content>
        <ng-container [ngTemplateOutlet]="suggestionsTemplate"></ng-container>
      </fl-callout-content>
    </fl-callout>

    <fl-bit
      class="SuggestionsContainer"
      [flHideDesktop]="true"
      [flSticky]="true"
      [flStickyPosition]="StickyPosition.BOTTOM"
    >
      <ng-container [ngTemplateOutlet]="suggestionsTemplate"></ng-container>
    </fl-bit>

    <ng-template #suggestionsTemplate>
      <ng-container *ngIf="suggestions; else spinnerTemaple">
        <fl-list
          *ngIf="suggestions.length > 0"
          [bodyEdgeToEdge]="true"
          [clickable]="true"
          [padding]="ListItemPadding.XXSMALL"
          [selectByKeyboard]="true"
          [type]="ListItemType.NON_BORDERED"
        >
          <fl-list-item
            *ngFor="let suggestion of suggestions; trackBy: trackByCompletion"
            [control]="selectedSuggestionControl"
            [radioValue]="suggestion"
          >
            <ng-container
              *ngIf="suggestion.completion; else loadingTemplate"
              [ngTemplateOutlet]="suggestionTemplate"
              [ngTemplateOutletContext]="{ $implicit: suggestion }"
            ></ng-container>
            <ng-template #loadingTemplate>
              <fl-loading-text [rows]="2" [padded]="false"></fl-loading-text>
            </ng-template>
          </fl-list-item>
        </fl-list>
      </ng-container>

      <ng-template #spinnerTemaple>
        <fl-bit class="Container">
          <fl-spinner [size]="SpinnerSize.SMALL"> </fl-spinner>
        </fl-bit>
      </ng-template>
    </ng-template>
  `,
  styleUrls: ['./auto-complete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutoCompleteComponent implements OnChanges, OnDestroy, OnInit {
  CalloutPlacement = CalloutPlacement;
  CalloutSize = CalloutSize;
  ListItemPadding = ListItemPadding;
  ListItemType = ListItemType;
  SpinnerSize = SpinnerSize;
  StickyPosition = StickyPosition;

  /**
   * It inserts the object into the caret position whenever it's passed
   */
  @Input() autoComplete?: AutoCompleteObject;
  @Input() control: FormControl;
  @Input() suggestions?: ReadonlyArray<AutoCompleteObject>;
  @Input() suggestionsCalloutSize = CalloutSize.MEDIUM;
  @Input() suggestionsCalloutPlacement = CalloutPlacement.BOTTOM_LEFT;
  @Input() trackingSection?: string;

  @Output() suggestionsUpdated = new EventEmitter<
    ReadonlyArray<AutoCompleteObject>
  >();

  @ContentChild(TemplateRef)
  suggestionTemplate: TemplateRef<AutoCompleteSuggestionTemplateComponent>;

  @ViewChild('suggestionsCallout')
  suggestionsCallout: CalloutComponent;

  @ViewChild('suggestionsTrigger', { read: ElementRef })
  suggestionsTrigger: ElementRef<HTMLElement>;

  @ViewChild('autoCompleteRichText')
  autoCompleteRichText: AutoCompleteRichTextComponent;

  selectedSuggestionControl = new FormControl();
  disableKeys = false;

  private selectedSuggestionSubscription?: Rx.Subscription;
  private contentChangedSubscription?: Rx.Subscription;
  private insertAutoCompleteObjectSubscription?: Rx.Subscription;

  private isOpenSubject$ = new Rx.BehaviorSubject<boolean>(false);
  private isOpen$ = this.isOpenSubject$.asObservable();

  selectedSuggestions: ReadonlyArray<AutoCompleteObject> = [];
  private previousText = '';

  private actualAutoCompleteObjectSubject$ = new Rx.Subject<
    AutoCompleteObject
  >();
  private actualAutoCompleteObject$ = this.actualAutoCompleteObjectSubject$.asObservable();
  private selectionAfterPaste?: Selection;

  constructor(private renderer: Renderer2, private tracking: Tracking) {}

  ngOnInit(): void {
    this.selectedSuggestionSubscription = this.selectedSuggestionControl.valueChanges.subscribe(
      selectedSuggestion => {
        this.actualAutoCompleteObjectSubject$.next(selectedSuggestion);
      },
    );

    this.insertAutoCompleteObjectSubscription = this.actualAutoCompleteObject$.subscribe(
      (autoCompleteObject: AutoCompleteObject) => {
        if (autoCompleteObject.completion) {
          if (!this.sameOffset(autoCompleteObject)) {
            this.selectedSuggestions = [
              ...this.selectedSuggestions,
              autoCompleteObject,
            ].sort((a, b) => a.offset - b.offset);
          }

          const caretPosisition = this.autoCompleteRichText.getSelectionLeftPosition();
          const startOffset = autoCompleteObject.offset + 1;
          const val = this.autoCompleteRichText.value;
          this.control.setValue(
            `${val.substring(0, startOffset)}${
              autoCompleteObject.completion
            } ${val.substring(caretPosisition)}`,
          );

          this.suggestionsCallout?.close();
          this.autoCompleteRichText.focus();
          this.autoCompleteRichText.setCaretPosition(
            startOffset + autoCompleteObject.completion.length + 1,
          );
          this.tracking.trackCustomEvent(
            'SelectedSuggestion',
            this.trackingSection,
            {
              reference_id: autoCompleteObject.referenceId,
              reference_type: autoCompleteObject.referenceType,
            },
          );
        }
      },
    );

    this.contentChangedSubscription = this.control.valueChanges.subscribe(
      content => {
        if (content?.length > 0 && !this.selectionAfterPaste) {
          const diffLength = content.length - this.previousText.length;
          const caretPosition = this.autoCompleteRichText.getSelectionLeftPosition();
          const previousCaretPosition = caretPosition - diffLength;

          // Remove previously selected suggestions from the array below
          // if the conditions negate are met.
          this.selectedSuggestions = this.selectedSuggestions.filter(
            suggestion => {
              if (suggestion.completion) {
                const { length } = suggestion.completion;
                const startOffset = suggestion.offset;
                const endOffset = startOffset + length + 1;
                return (
                  // Keeps the suggestion if it wasn't edited based on
                  // the current and the previous caret position
                  (startOffset <= caretPosition ||
                    endOffset >= previousCaretPosition) &&
                  (startOffset >= previousCaretPosition ||
                    endOffset <= caretPosition)
                );
              }
            },
          );

          // Maintaining the offsets of the selected suggestions
          for (
            let index = 0;
            diffLength !== 0 && index < this.selectedSuggestions.length;
            index++
          ) {
            const suggestion = this.selectedSuggestions[index];
            // Based on the content difference length we need the previous caret position
            //
            // If content was removed the `diffLength` is negative and the
            // previous caret position is caretPosition
            //
            // If content was added the `diffLength` is positive and the
            // previous caret position is previousCaretPosition
            if (caretPosition <= suggestion.offset + diffLength) {
              // Update the current offset of element
              const ret = this.selectedSuggestions.slice(0);
              ret[index] = {
                referenceId: suggestion.referenceId,
                referenceType: suggestion.referenceType,
                completion: suggestion.completion,
                offset: suggestion.offset + diffLength,
              };
              this.selectedSuggestions = ret;
            }
          }
        } else if (!this.selectionAfterPaste) {
          this.selectedSuggestions = [];
        }

        this.selectionAfterPaste = undefined;
        this.suggestionsUpdated.emit(this.selectedSuggestions);
        this.previousText = content ?? '';
      },
    );
  }

  ngOnDestroy(): void {
    if (this.selectedSuggestionSubscription) {
      this.selectedSuggestionSubscription.unsubscribe();
    }
    if (this.contentChangedSubscription) {
      this.contentChangedSubscription.unsubscribe();
    }
    if (this.insertAutoCompleteObjectSubscription) {
      this.insertAutoCompleteObjectSubscription.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('autoComplete' in changes && this.autoComplete) {
      this.actualAutoCompleteObjectSubject$.next(this.autoComplete);
    }
  }

  trackByCompletion(
    index: number,
    autoCompleteObject: AutoCompleteObject,
  ): string | undefined {
    return autoCompleteObject.completion;
  }

  handleOpenCloseEvent(open: boolean) {
    this.disableKeys = open;
    this.isOpenSubject$.next(open);
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.closeSuggestions();
    }
  }

  openSuggestions(): void {
    if (this.isMobileViewport()) {
      return;
    }

    this.isOpen$
      .pipe(take(1))
      .toPromise()
      .then(isOpen => {
        const oldTop = this.element.offsetTop;
        const caretCoordinates = this.autoCompleteRichText.getCaretCoordinates();

        this.renderer.setStyle(
          this.element,
          'top',
          `${caretCoordinates.top}px`,
        );
        this.renderer.setStyle(
          this.element,
          'left',
          `${caretCoordinates.left}px`,
        );

        if (!isOpen) {
          this.renderer.setStyle(
            this.element,
            'height',
            `${caretCoordinates.height}px`,
          );

          this.suggestionsCallout.open();
        } else if (oldTop !== caretCoordinates.top) {
          this.suggestionsCallout.updatePosition();
        }
      });
  }

  closeSuggestions(): void {
    this.suggestionsCallout?.close();
  }

  handlePasteEvent(pasteObject: PasteObject): void {
    this.selectionAfterPaste = this.autoCompleteRichText.getSelection();

    let updatedObjects = pasteObject.objects;
    if (updatedObjects) {
      const firstObject = updatedObjects[0];
      if (firstObject.completion) {
        // The firstObject may not starts at the beginning.
        // It finds the position of the first occurence of the string
        const adjustment = pasteObject.text.indexOf(firstObject.completion) - 1;

        // Recalculate the copied entities position
        for (let i = 0; i < updatedObjects.length; i++) {
          const copiedObject = { ...updatedObjects[i] };
          let calculatedOffset = this.selectionAfterPaste.left + adjustment;
          if (i > 0) {
            // Calculates the distance from the offset of thefirstObject
            // and adds to the calculatedOffset
            calculatedOffset += copiedObject.offset - firstObject.offset;
          }
          const ret = updatedObjects.slice(0);
          ret[i] = {
            referenceId: copiedObject.referenceId,
            referenceType: copiedObject.referenceType,
            completion: copiedObject.completion,
            offset: calculatedOffset,
          };
          updatedObjects = ret;
        }
      }
    }

    // Remove those that were in the selection
    this.selectedSuggestions = this.selectedSuggestions.filter(suggestion => {
      if (this.selectionAfterPaste && suggestion.completion) {
        const { length } = suggestion.completion;
        const startOffset = suggestion.offset;
        const endOffset = startOffset + length + 1;
        return (
          // Keeps the suggestion if it wasn't edited based on
          // the current and the previous caret position
          (startOffset <= this.selectionAfterPaste.left ||
            endOffset >= this.selectionAfterPaste.right) &&
          (startOffset >= this.selectionAfterPaste.right ||
            endOffset <= this.selectionAfterPaste.left)
        );
      }
    });

    // Adjust the rest
    for (let index = 0; index < this.selectedSuggestions.length; index++) {
      const suggestion = this.selectedSuggestions[index];
      if (this.selectionAfterPaste.left <= suggestion.offset) {
        // Update the current offset of element
        const ret = this.selectedSuggestions.slice(0);
        ret[index] = {
          referenceId: suggestion.referenceId,
          referenceType: suggestion.referenceType,
          completion: suggestion.completion,
          offset:
            pasteObject.text.length +
            suggestion.offset -
            this.selectionAfterPaste.right +
            this.selectionAfterPaste.left,
        };
        this.selectedSuggestions = ret;
      }
    }

    if (updatedObjects) {
      this.selectedSuggestions = [
        ...this.selectedSuggestions,
        ...updatedObjects,
      ].sort((a, b) => a.offset - b.offset);
    }
  }

  private get element() {
    return this.suggestionsTrigger.nativeElement;
  }

  /**
   * It determines if the given object's offset can be found amongst the array elements.
   *
   * @param selectedSuggestion
   */
  private sameOffset(selectedSuggestion: AutoCompleteObject): boolean {
    for (let index = 0; index < this.selectedSuggestions.length; index++) {
      const suggestion = this.selectedSuggestions[index];
      if (suggestion.offset === selectedSuggestion.offset) {
        return true;
      }
    }

    return false;
  }

  private isMobileViewport() {
    return window.innerWidth < parseInt(FreelancerBreakpointValues.TABLET, 10);
  }
}
