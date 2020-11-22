// FIXME: this hack is needed because some modules below (e.g. zone.js)
// have an AMD detection mechanism that breaks our shitty version of
// RequireJS on compat pages
/* eslint-disable-next-line */
const __HACK_CUR_DEFINE = window.define;
/* eslint-disable-next-line */
(window as any).define = undefined;

/* eslint-disable import/imports-first */
/* eslint-disable import/first */
/***************************************************************************************************
 * Load `$localize` onto the global scope - used if i18n tags appear in Angular templates.
 */
import '@angular/localize/init';
/* eslint prefer-rest-params: 0 */
/* eslint no-prototype-builtins: 0 */
/**
 * This file includes polyfills needed by Angular and is loaded before the app.
 * You can add your own extra polyfills to this file.
 *
 * This file is divided into 2 sections:
 *   1. Browser polyfills. These are applied before loading ZoneJS and are sorted by browsers.
 *   2. Application imports. Files imported after ZoneJS that should be loaded before your main
 *      file.
 *
 * The current setup is for so-called "evergreen" browsers; the last versions of browsers that
 * automatically update themselves. This includes Safari >= 10, Chrome >= 55 (including Opera),
 * Edge >= 13 on the desktop, and iOS 10 and Chrome on mobile.
 *
 * Learn more in https://angular.io/guide/browser-support
 */

/***************************************************************************************************
 * BROWSER POLYFILLS
 */

/* eslint padding-line-between-statements: 0 */
/* tslint:disable:ordered-imports-freelancer */

import 'core-js/es6/array';
import 'core-js/es6/date';
import 'core-js/es6/function';
import 'core-js/es6/map';
import 'core-js/es6/math';
import 'core-js/es6/number';
import 'core-js/es6/object';
import 'core-js/es6/parse-float';
import 'core-js/es6/parse-int';
import 'core-js/es6/regexp';
import 'core-js/es6/set';
import 'core-js/es6/string';
import 'core-js/es6/symbol';
import 'core-js/es6/weak-map';
import 'core-js/es7/array';
import 'core-js/es7/object';
import 'core-js/es7/string';
/***************************************************************************************************
 * Zone JS is required by Angular itself.
 */
import 'zone.js/dist/zone'; // Included with Angular CLI.
import 'zone.js/dist/task-tracking';

/***************************************************************************************************
 * APPLICATION IMPORTS
 */
// NOTE: TypeScript specific code to be able to import CommonJS packages.
// Ref: https://www.typescriptlang.org/docs/handbook/modules.html
import 'custom-event-polyfill';
import * as objectFitImages from 'object-fit-images';
import 'requestidlecallback';
import 'url-polyfill';
import 'window.requestanimationframe';
import * as smoothscroll from 'smoothscroll-polyfill';
import 'intersection-observer';
import 'hammerjs';
import 'first-input-delay';

objectFitImages(undefined, { watchMQ: true });

smoothscroll.polyfill();

// FIXME: see https://github.com/angular/angular-cli/issues/9827#issuecomment-386154063
// sockjs-client currently needs that
(window as any).global = window;

// TODO: conditional loading
// ChildNode.replaceWith() polyfill needed to support max-lines in IE11
[Element.prototype, CharacterData.prototype, DocumentType.prototype].forEach(
  item => {
    if (item.hasOwnProperty('replaceWith')) {
      return;
    }
    Object.defineProperty(item, 'replaceWith', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function replaceWith() {
        const parent = this.parentNode;

        let i = arguments.length;

        let currentNode;
        if (!parent) {
          return;
        }
        if (!i) {
          // if there are no arguments
          parent.removeChild(this);
          return;
        }
        while (i--) {
          // i-- decrements i and returns the value of i before the decrement
          currentNode = arguments[i];
          if (typeof currentNode !== 'object') {
            currentNode = this.ownerDocument.createTextNode(currentNode);
          } else if (currentNode.parentNode) {
            currentNode.parentNode.removeChild(currentNode);
          }
          // the value of "i" below is after the decrement
          if (!i) {
            // if currentNode is the first argument (currentNode === arguments[0])
            parent.replaceChild(currentNode, this);
            // if currentNode isn't the first
          } else {
            parent.insertBefore(currentNode, this.previousSibling);
          }
        }
      },
    });
  },
);

// ParentNode.append() polyfill needed to support max-lines in IE11
[Element.prototype, Document.prototype, DocumentFragment.prototype].forEach(
  item => {
    if (item.hasOwnProperty('append')) {
      return;
    }
    Object.defineProperty(item, 'append', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function append() {
        const argArr = Array.prototype.slice.call(arguments);

        const docFrag = document.createDocumentFragment();

        argArr.forEach(argItem => {
          const isNode = argItem instanceof Node;
          docFrag.appendChild(
            isNode ? argItem : document.createTextNode(String(argItem)),
          );
        });

        this.appendChild(docFrag);
      },
    });
  },
);

// ChildNode.after() polyfill needed to support max-lines in IE11
[Element.prototype, CharacterData.prototype, DocumentType.prototype].forEach(
  item => {
    if (item.hasOwnProperty('after')) {
      return;
    }
    Object.defineProperty(item, 'after', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function after() {
        const argArr = Array.prototype.slice.call(arguments);

        const docFrag = document.createDocumentFragment();

        argArr.forEach(argItem => {
          const isNode = argItem instanceof Node;
          docFrag.appendChild(
            isNode ? argItem : document.createTextNode(String(argItem)),
          );
        });

        this.parentNode.insertBefore(docFrag, this.nextSibling);
      },
    });
  },
);

// ChildNode.remove() polyfill needed to support max-lines in IE11
[Element.prototype, CharacterData.prototype, DocumentType.prototype].forEach(
  item => {
    if (item.hasOwnProperty('remove')) {
      return;
    }
    Object.defineProperty(item, 'remove', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function remove() {
        if (this.parentNode === null) {
          return;
        }
        this.parentNode.removeChild(this);
      },
    });
  },
);

// FIXME: https://github.com/angular/angularfire/issues/2296
// AngularFire currently needs that not to break IE11
if (!('Proxy' in window)) {
  (window as any).Proxy = function ProxyPonyfill(obj: any) {
    return obj;
  };
}

/* eslint-disable-next-line */
window.define = __HACK_CUR_DEFINE;
