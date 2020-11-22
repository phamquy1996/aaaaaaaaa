import { Injectable, OnDestroy } from '@angular/core';
import { Pwa } from '@freelancer/pwa';
import * as Rx from 'rxjs';
import { startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class KeyboardService implements OnDestroy {
  private _isOpenSubject$ = new Rx.Subject<boolean>();
  private listenersAdded = false;

  constructor(private pwa: Pwa) {}

  isOpen(): Rx.Observable<boolean> {
    if (!this.listenersAdded && this.pwa.isNative()) {
      this.addListeners();
    }

    return this._isOpenSubject$.asObservable().pipe(startWith(false));
  }

  async addListeners() {
    const { Keyboard } = await this.pwa.capacitorPlugins();

    Keyboard.addListener('keyboardWillShow', () => {
      this._isOpenSubject$.next(true);
    });

    Keyboard.addListener('keyboardDidHide', () => {
      this._isOpenSubject$.next(false);
    });

    this.listenersAdded = true;
  }

  async removeListeners() {
    const { Keyboard } = await this.pwa.capacitorPlugins();

    Keyboard.removeAllListeners();
  }

  ngOnDestroy() {
    if (this.listenersAdded && this.pwa.isNative()) {
      this.removeListeners();
    }
  }
}
