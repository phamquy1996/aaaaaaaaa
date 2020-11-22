import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CookieService } from '@laurentgoudet/ngx-cookie';
import { THREATMETRIX_CONFIG } from './threatmetrix.config';
import { ThreatmetrixConfig } from './threatmetrix.interface';

/**
 * Generate a string of 4 random numbers ranging from 0x10000 (65536) to
 * 0x20000 (131072).
 * Could be replaced with something else that is less ambiguous, but this is
 * a part of the legacy code for Threatmetrix user ID generation.
 */
export function random4CharString() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

@Injectable()
export class ThreatmetrixService {
  /**
   * This session ID will always try to check for a value in local storage first
   * (in case Threatmetrix has been initialised before or in somewhere else such
   * as the legacy stack).
   */
  private sessionId: string;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: HTMLDocument,
    private cookies: CookieService,
    private http: HttpClient,
    @Inject(THREATMETRIX_CONFIG) private config?: ThreatmetrixConfig,
  ) {}

  /**
   * Get a session ID from the local storage, also with catching for browser
   * support on local storage, and Safari private browsing mode guard.
   * @returns A session ID, or undefined if there is none.
   */
  private getSessionIdFromLocalStorage() {
    try {
      if (localStorage) {
        const tagsSessionId =
          localStorage.getItem('tags_session_id') || undefined;
        return tagsSessionId;
      }
    } catch (e) {
      return undefined;
    }
  }

  /**
   * Set the Threatmetrix session ID to local storage, also with catching for
   * browser support on local storage and Safari private browsing mode guard.
   * @param value The session ID value.
   * @returns True if successful, false if local storage is unavailable.
   */
  private setSessionIdToLocalStorage(value: string) {
    try {
      if (localStorage) {
        localStorage.setItem('tags_session_id', value);
        return true;
      }
    } catch (e) {
      return false;
    }

    return false;
  }

  /**
   * Get a session ID from local storage, or generate one if unavailable.
   * @returns The session ID.
   */
  private getSessionId() {
    const localStorageId = this.getSessionIdFromLocalStorage();
    if (!localStorageId) {
      const newId = this.generateSessionId();
      this.setSessionIdToLocalStorage(newId);
      return newId;
    }

    return localStorageId;
  }

  /**
   * Generate a session ID.
   * @returns A newly generated session ID.
   */
  private generateSessionId() {
    let sessionId = '';

    // 80 character long session id
    for (let i = 0; i < 20; i++) {
      sessionId += random4CharString();
    }

    return sessionId;
  }

  /**
   * Initialize Threatmetrix for fingerprinting by injecting the tags.js script.
   * Does nothing if already initialised anywhere (here or legacy)
   */
  load() {
    // Dev would not have a configuration for Threatmetrix, so we disable
    // Threatmetrix if the SSL base URL is empty.
    if (this.config) {
      if (isPlatformBrowser(this.platformId)) {
        if (!this.sessionId) {
          this.sessionId = this.getSessionId();
          this.honeypot();
        }

        // Load Threatmetrix if any part of the site (legacy as well) hasn't.
        // The legacy stack uses a script#external-threatmetrix element as an ID
        // for an injected tags.js.
        if (!this.document.getElementById('external-threatmetrix')) {
          const scriptElement = this.document.createElement('script');
          scriptElement.id = 'external-threatmetrix';
          scriptElement.type = 'text/javascript';
          scriptElement.defer = true;
          scriptElement.src = `${this.config.baseUrl}/fp/tags.js?org_id=${this.config.orgId}&session_id=${this.sessionId}`;

          this.document.body.appendChild(scriptElement);
        }

        this.cookies.put('session2', this.sessionId, {
          expires: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1),
          ),
        });
      }
    }
  }

  /**
   * Initialises Threatmetrix if necessary, then returns the session ID.
   */
  getSession() {
    this.load();
    return this.sessionId || '';
  }

  /**
   * Get query string value by name.
   * Exported out of @shared/url and cleaned up
   * @param name The query params name.
   */
  private getUrlQueryParamValue(name: string) {
    // This doesn't use the router because it doesn't work on compat mode, and
    // doesn't use window.location because it can't easily be mocked, hence the
    // type assertion :(.
    const params = new URLSearchParams(
      (this.document.location as any).search.substring(1),
    );
    return params.get(name);
  }

  /**
   * The following section of code with it's magic "token=..." is to enable
   * the security team to track various actors without their knowledge.
   * See also: /users/validate.php.
   * And by the way, yes, it's a side effect from actual "Threatmetrix".
   */
  private honeypot() {
    if (isPlatformBrowser(this.platformId)) {
      // This check doesn't use the router because it doesn't work on compat mode.
      if (
        this.getUrlQueryParamValue('token_2') ===
        '0m1ylLupUYLx6wJbA4AtiBIsOhHvyGDr'
      ) {
        const referenceTwoValue =
          this.getUrlQueryParamValue('reference_2') || 'unknown';
        this.http
          .get('/users/validate.php', {
            params: {
              t: '15021959098890.6790854098336039',
              en: 'referrer',
              url: '',
              q: '',
              new_user: 'true',
              language: 'en',
              page: '%2Flogin',
              token: 'login',
              location: 'http',
              edge: 'null',
              user_id: '',
              session_id: '83b1512e-0e44-666f-1ed2-8ce4882c3ed1',
              aqs: 'chrome..69i57j69i65l3j0l2.6351j0j7',
              sourceid: 'chrome',
              ie: 'UTF-8',
              reference: referenceTwoValue,
            },
            withCredentials: true,
          })
          .toPromise();
      }
    }
  }
}
