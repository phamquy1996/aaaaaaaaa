import { Directive, ElementRef, HostListener } from '@angular/core';
import { Focus } from '@freelancer/ui/focus';

@Directive({
  selector: '[appAutoGrow]',
  exportAs: 'autogrow',
})
export class AutoGrowDirective {
  private MAX_HEIGHT = 72;
  private MIN_HEIGHT = 32;

  constructor(
    public element: ElementRef<HTMLElement>,
    private focusService: Focus,
  ) {}

  @HostListener('input', ['$event.target'])
  onInput(textArea: HTMLTextAreaElement): void {
    this.adjust();
  }

  public adjust(): void {
    const { nativeElement } = this.element;
    // snap to text to determine the proper height
    nativeElement.style.overflow = 'hidden';
    nativeElement.style.height = 'auto';
    nativeElement.style.overflowY = 'auto';
    // limit height between MIN and MAX
    nativeElement.style.height = `${Math.max(
      this.MIN_HEIGHT,
      Math.min(nativeElement.scrollHeight, this.MAX_HEIGHT),
    )}px`;
    // remove scrollbar
    if (nativeElement.scrollHeight < this.MAX_HEIGHT) {
      nativeElement.style.overflow = 'hidden';
    }
  }

  focus() {
    this.focusService.focusElement(this.element);
  }
}
