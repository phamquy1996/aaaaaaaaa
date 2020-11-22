import { Injectable } from '@angular/core';
import * as Rx from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StickyService {
  private activeTop: HTMLElement[] = [];
  private activeBottom: HTMLElement[] = [];
  private _topStackHeightSubject$ = new Rx.Subject<void>();
  private _bottomStackHeightSubject$ = new Rx.Subject<void>();

  add(element: HTMLElement, isStickyTop: boolean, order: number) {
    if (isStickyTop) {
      this.activeTop = this.addActiveElement(this.activeTop, element, order);
      this._topStackHeightSubject$.next();
    } else {
      this.activeBottom = this.addActiveElement(
        this.activeBottom,
        element,
        order,
      );
      this._bottomStackHeightSubject$.next();
    }
  }

  remove(element: HTMLElement, isStickyTop: boolean) {
    if (isStickyTop) {
      this.activeTop = this.activeTop.filter(el => el !== element);
      this._topStackHeightSubject$.next();
    } else {
      this.activeBottom = this.activeBottom.filter(el => el !== element);
      this._bottomStackHeightSubject$.next();
    }
  }

  getOffset(target: HTMLElement, isStickyTop: boolean): number {
    const activeElements = isStickyTop ? this.activeTop : this.activeBottom;
    let offset = 0;
    let index;

    for (index = 0; index < activeElements.length; index++) {
      if (activeElements[index] === target) {
        return offset;
      }

      offset += activeElements[index].offsetHeight;
    }

    return offset;
  }

  stackHeightChange(isStickyTop: boolean): Rx.Observable<void> {
    return isStickyTop
      ? this._topStackHeightSubject$.asObservable()
      : this._bottomStackHeightSubject$.asObservable();
  }

  private addActiveElement(
    activeElements: HTMLElement[],
    element: HTMLElement,
    order: number,
  ): HTMLElement[] {
    const position = order !== undefined ? order : activeElements.length;
    activeElements.splice(position, 0, element);

    return activeElements;
  }
}
