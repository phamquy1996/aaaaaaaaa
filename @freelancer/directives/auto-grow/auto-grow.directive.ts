import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as Rx from 'rxjs';

@Directive({
  selector: '[flAutoGrow]',
  exportAs: 'autogrow',
})
export class AutoGrowDirective implements OnDestroy, OnInit {
  @Input() flAutoGrow: FormControl;
  @Input() flAutoGrowMaxHeight = 72;
  @Input() flAutoGrowMinHeight = 48;

  private valueChangeSubscription?: Rx.Subscription;

  constructor(public element: ElementRef<HTMLElement>) {}

  ngOnInit() {
    this.valueChangeSubscription = this.flAutoGrow.valueChanges.subscribe(_ =>
      this.adjust(),
    );
  }

  ngOnDestroy() {
    if (this.valueChangeSubscription) {
      this.valueChangeSubscription.unsubscribe();
    }
  }

  public adjust(): void {
    let textArea: HTMLElement;
    if (this.element.nativeElement instanceof HTMLTextAreaElement) {
      textArea = this.element.nativeElement;
    } else if (this.element.nativeElement.tagName === 'FL-TEXTAREA') {
      textArea = this.element.nativeElement.children.item(0) as HTMLElement;
    } else {
      throw new Error('Not supported element!');
    }

    // Snap to text to determine the proper height
    textArea.style.overflow = 'hidden';
    textArea.style.height = 'auto';
    textArea.style.overflowY = 'auto';
    // Limit height between MIN and MAX
    textArea.style.height = `${Math.max(
      this.flAutoGrowMinHeight,
      Math.min(textArea.scrollHeight, this.flAutoGrowMaxHeight),
    )}px`;
    // Remove scrollbar
    if (textArea.scrollHeight < this.flAutoGrowMaxHeight) {
      textArea.style.overflow = 'hidden';
    }
  }
}
