import { Injectable, TemplateRef } from '@angular/core';
import * as Rx from 'rxjs';

export interface ViewHeaderTemplateConfig {
  fullReplacement: boolean;
  templateRef: TemplateRef<any>;
}

@Injectable({
  providedIn: 'root',
})
export class ViewHeaderTemplate {
  private templateConfigSubject$ = new Rx.BehaviorSubject<
    ViewHeaderTemplateConfig | undefined
  >(undefined);

  registerHeader(templateConfig: ViewHeaderTemplateConfig) {
    if (this.templateConfigSubject$.value?.templateRef) {
      throw new Error(
        'Could not register view header component: a view header already exists!',
      );
    }

    this.templateConfigSubject$.next(templateConfig);
  }

  deregisterHeader(templateConfig: ViewHeaderTemplateConfig) {
    if (
      this.templateConfigSubject$.value?.templateRef ===
      templateConfig.templateRef
    ) {
      this.templateConfigSubject$.next(undefined);
    }
  }

  templateChanges() {
    return this.templateConfigSubject$.asObservable();
  }
}
