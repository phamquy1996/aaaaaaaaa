import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable()
export class Hotjar {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  insertScript() {
    const hotjarScript = this.document.getElementById('hotjar');
    if (isPlatformBrowser(this.platformId) && hotjarScript === null) {
      window.hj =
        window.hj ||
        function setHj(...args: any) {
          (window.hj.q = window.hj.q || []).push(args);
        };

      window._hjSettings = { hjid: 1223449, hjsv: 6 };

      const script = this.document.createElement('script');
      script.id = 'hotjar';
      script.async = true;
      script.src = `https://static.hotjar.com/c/hotjar-${window._hjSettings.hjid}.js?sv=${window._hjSettings.hjsv}`;

      this.document.head.appendChild(script);
    }
  }
}
