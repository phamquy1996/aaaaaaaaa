import { isPlatformBrowser } from '@angular/common';
import { ElementRef, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TimeUtils } from '@freelancer/time-utils';
import { UserAgent } from '@freelancer/user-agent';

export interface FocusOptions {
  selector?: string;
  /**
   *  There are some specific cases when we want to enable focusing on mobile
   *  like replying to a comment or composing a post in group.
   *
   *  Discuss with UI Eng if you want to use this.
   */
  allowMobile?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class Focus {
  constructor(
    @Inject(PLATFORM_ID) private platformId: string,
    private userAgent: UserAgent,
    private timeUtils: TimeUtils,
  ) {}

  /**
   * Focuses the native element of a given ElementRef,
   * or the first child that matches a selector if specified.
   */
  focusElement(
    ref: ElementRef<HTMLElement>,
    focusOptions: FocusOptions = { allowMobile: false },
  ) {
    const { selector, allowMobile } = focusOptions;
    if (
      // Do not focus on the server because it doesn't make sense
      isPlatformBrowser(this.platformId) &&
      // Do not focus on mobile browsers because the keyboard UX except when
      // allowMobile is explicitly enabled
      (allowMobile || !this.userAgent.isMobileDevice())
    ) {
      const elementToFocus = selector
        ? ref.nativeElement.querySelector<HTMLElement>(selector)
        : ref.nativeElement;

      if (elementToFocus) {
        this.timeUtils.setTimeout(() => {
          elementToFocus.focus();
        });
      }
    }
  }
}
