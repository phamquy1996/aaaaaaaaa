import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID, Renderer2 } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import * as Rx from 'rxjs';
import { catchError, finalize, first, map, share, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class IconService {
  private inProgressUrlFetches = new Map<string, Rx.Observable<string>>();
  private cachedIconsByUrl = new Map<string, SVGElement>();

  constructor(
    private http: HttpClient,
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  /**
   * Fetch a URL to get an icon SVG string
   *
   * @private
   * @param {string} url The URL to the SVG
   * @returns {string} The SVG markup
   *
   * @memberof IconService
   */
  private fetchUrl(url: string): Rx.Observable<string> {
    // Store in-progress fetches to avoid sending a duplicate
    // request for a URL when there is already a request in progress for that
    //  URL. It's necessary to call share() on the Rx.Observable returned by
    // http.get() so that multiple subscribers don't cause multiple XHRs.
    const inProgressUrlFetch$ = this.inProgressUrlFetches.get(url);
    if (inProgressUrlFetch$) {
      return inProgressUrlFetch$;
    }

    const request$ = this.http.get(url, { responseType: 'text' }).pipe(
      first(),
      finalize(() => {
        this.inProgressUrlFetches.delete(url);
      }),
      share(),
    );

    this.inProgressUrlFetches.set(url, request$);

    return request$;
  }

  /**
   * Create an SVG element from an SVG markup
   *
   * @private
   * @param {string} svgString The SVG markup
   * @returns {SVGElement} The SVGElement Node rendered
   *
   * @memberof IconService
   */
  private createSvgElement(markup: string, renderer: Renderer2) {
    const div = renderer.createElement('div') as HTMLDivElement;
    // TODO T37429 Is there a better way than innerHTML? Renderer doesn't appear
    // to have a method for creating an element from an HTML string.
    div.innerHTML = markup;
    const svg = div.querySelector('svg') as SVGElement;

    if (!svg) {
      throw Error(`<svg> tag not found. Markup is ${markup.slice(0, 100)}.`);
    }

    return svg;
  }

  /**
   * Set the necessary SVG attributes.
   *
   * @private
   * @param {SVGElement} svg The SVG element
   * @memberof IconService
   */
  private setSvgAttributes(svg: SVGElement) {
    if (!svg.getAttribute('xmlns')) {
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    }

    svg.removeAttribute('class');
    svg.setAttribute('fit', '');
    svg.setAttribute('height', '100%');
    svg.setAttribute('width', '100%');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    // Disable IE11 default behavior to make SVGs focusable.
    svg.setAttribute('focusable', 'false');

    return svg;
  }

  /** Creates a placeholder text node for when svgs aren't loadable */
  private createPlaceholder(renderer: Renderer2, fallback: string) {
    const div = renderer.createElement('div') as HTMLDivElement;
    div.setAttribute('title', fallback);
    renderer.setStyle(div, 'height', '100%');
    renderer.setStyle(div, 'width', '100%');
    renderer.setStyle(div, 'background-color', '#dedede');
    renderer.setStyle(div, 'border-radius', '50%');
    return div;
  }

  /**
   * Get an icon SVG element
   *
   * @param {string} url The URL of the SVG element
   * @param {string} fallback The alt text to display if the URL is unfetchable
   * @returns {SVGElement} The SVG element.
   *
   * @memberof IconService
   */
  getIcon(
    url: string,
    renderer: Renderer2,
    fallback: string,
  ): Rx.Observable<Element> {
    const cachedIcon = this.cachedIconsByUrl.get(url);
    if (cachedIcon) {
      return Rx.of(cloneSvg(cachedIcon));
    }

    const serverCacheKey = makeStateKey(`ICON_CACHE_${url}`);
    let iconHtml$: Rx.Observable<string>;
    if (
      isPlatformBrowser(this.platformId) &&
      this.transferState.hasKey<string>(serverCacheKey)
    ) {
      iconHtml$ = Rx.of(this.transferState.get<string>(serverCacheKey, ''));
    } else {
      iconHtml$ = this.fetchUrl(url);
    }

    return iconHtml$.pipe(
      tap(markup => {
        if (isPlatformServer(this.platformId)) {
          this.transferState.onSerialize(serverCacheKey, () => markup);
        }
      }),
      map(markup => this.createSvgElement(markup, renderer)),
      map(svg => this.setSvgAttributes(svg)),
      tap(svg => {
        this.cachedIconsByUrl.set(url, svg);
      }),
      map(svg => cloneSvg(svg)),
      catchError((err: Error) => {
        // put a placeholder for network errors
        if (err instanceof HttpErrorResponse) {
          console.error('Failed to load icon', err.message);
          return Rx.of(this.createPlaceholder(renderer, fallback));
        }
        throw err;
      }),
    );
  }
}

/** Clones an SVGElement while preserving type information. */
function cloneSvg(svg: SVGElement) {
  return svg.cloneNode(true) as SVGElement;
}
