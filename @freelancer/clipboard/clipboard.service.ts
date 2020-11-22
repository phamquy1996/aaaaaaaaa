import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

/**
 * Clipboard service used for clipboard modification actions like copying and pasting.
 */
@Injectable({
  providedIn: 'root',
})
export class Clipboard {
  constructor(@Inject(PLATFORM_ID) private platformId: string) {}

  copy(text: string) {
    if (isPlatformBrowser(this.platformId)) {
      if (window.clipboardData && window.clipboardData.setData) {
        return window.clipboardData.setData('Text', text);
      }

      /**
       * Fallback if clipboardData.setData isn't supported by
       * creating a textarea and executing a copy command manually
       */
      if (
        document.queryCommandSupported &&
        document.queryCommandSupported('copy')
      ) {
        const textarea = document.createElement('textarea');
        textarea.textContent = text;
        textarea.setAttribute('readonly', 'readonly'); // Prevent zoom and focus scrolling in IOS
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);

        /**
         * Run both .select() and .setSelectionRange()
         * .select() only works for most of the browsers but not in IOS12
         * .setSelectionRange() works for IOS12 but not in other browsers
         */
        textarea.select();
        textarea.setSelectionRange(0, 999999);

        try {
          return document.execCommand('copy');
        } catch (ex) {
          console.warn('Copy to clipboard failed.', ex);
          return false;
        } finally {
          document.body.removeChild(textarea);
        }
      }
    }
  }

  getSelectedText(): Selection | undefined {
    if (isPlatformBrowser(this.platformId)) {
      return window.getSelection() ?? undefined;
    }
  }
}
