import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

/**
 * Add the template content to the DOM `n` times.
 *
 * ### Example
 *
 * - <ng-container *flRepeat="3; index as i; repeats as r">
 *     <fl-text>{{ i + 1 }}/{{ r }}</fl-text>
 *   </ng-container>`
 *
 * Should resolve to
 * - <fl-text>1/3</fl-text>
 *   <fl-text>2/3</fl-text>
 *   <fl-text>3/3</fl-text>
 */
@Directive({ selector: '[flRepeat]' })
export class RepeatDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
  ) {}

  @Input() set flRepeat(repeats: number) {
    for (let index = 0; index < repeats; index++) {
      this.viewContainer.createEmbeddedView(this.templateRef, {
        $implicit: [repeats, index],
        index,
        repeats,
      });
    }
  }
}
