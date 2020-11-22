import { ComponentType } from '@angular/cdk/portal';
import {
  Compiler,
  ComponentRef,
  ErrorHandler,
  Inject,
  Injectable,
  Injector,
  NgModuleFactory,
  Optional,
  Provider,
  SkipSelf,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { ROUTES, Routes } from '@angular/router';
import { Location } from '@freelancer/location';
import { ModalColor, ModalSize } from '@freelancer/ui/modal';
import { retryBackoff } from 'backoff-rxjs';
import * as Rx from 'rxjs';
import { catchError, first, retryWhen, switchMap, tap } from 'rxjs/operators';
import { TESTING_MODAL_CLOSE_ANIMATION_DISABLED } from './modal.config';

/**
 * Custom injector to be used when providing custom
 * injection tokens to components inside a portal.
 */
export class PortalInjector implements Injector {
  constructor(
    private _parentInjector: Injector,
    private _customTokens: WeakMap<any, any>,
  ) {}

  get(token: any, notFoundValue?: any): any {
    const value = this._customTokens.get(token);

    if (typeof value !== 'undefined') {
      return value;
    }

    return this._parentInjector.get<any>(token, notFoundValue);
  }
}

export interface ModalConfig {
  inputs?: Object; // the @Input() values to pass to the component
  color?: ModalColor;
  size?: ModalSize;
  closeable?: boolean;
  showBackdrop?: boolean; // TODO: remove once webapp modals created: T46290
  edgeToEdge?: boolean;
  mobileFullscreen?: boolean;
}

export interface ModalLoadingStatus {
  ready: boolean;
  errorMessage?: string;
}

export type ModalResult = any;

export interface ModalCloseConfig {
  /** whether the modal was closed automatically as a result of a route change */
  fromRouteChange?: boolean;
}

export class ModalRef<T> {
  /** Subject that emits when the modal finishes opening. */
  private _afterOpenSubject$ = new Rx.ReplaySubject<void>();
  /** Subject that emits before the modal closes */
  private _beforeClosedSubject$ = new Rx.Subject<any>();
  /** Subject that emits after the modal finishes closing and returns a result */
  private _afterClosedSubject$: Rx.ReplaySubject<
    ModalResult
  > = new Rx.ReplaySubject();
  private componentRef: ComponentRef<T>;
  private closed = false;

  private modalPopCloseSubscription?: Rx.SubscriptionLike;
  private result: ModalResult;
  private fromRouteChange: boolean;

  constructor(
    private _openStreamSubject$: Rx.Subject<any>,
    private location: Location,
  ) {}

  open() {
    this.modalPopCloseSubscription = this.location._createBackButtonState({
      onPop: () => this.close(undefined, { fromRouteChange: true }),
    });
  }

  set(componentRef: ComponentRef<T>) {
    this.componentRef = componentRef;
    this._afterOpenSubject$.next();
    this._afterOpenSubject$.complete();
  }

  close(
    result?: ModalResult,
    { fromRouteChange = false }: ModalCloseConfig = {},
  ): void {
    // already closed: don't close again.
    if (this.closed) {
      return;
    }
    this.closed = true;
    this.fromRouteChange = fromRouteChange;
    this.result = result;
    this._beforeClosedSubject$.next();
  }

  _destroy(): void {
    // if the modal failed to load (e.g. network error), we might not have a
    // componentRef
    if (this.componentRef) {
      this.componentRef.destroy();
    }

    if (this.modalPopCloseSubscription) {
      this.modalPopCloseSubscription.unsubscribe();
    }

    // close `openStreamSubject` immediately
    this._openStreamSubject$.next(false);

    if (!this.fromRouteChange) {
      this.location.back().then(() => {
        // emit to afterClosed after back-navigation completes
        this._afterClosedSubject$.next(this.result);
        this._afterClosedSubject$.complete();
      });
      return;
    }

    this._afterClosedSubject$.next(this.result);
    this._afterClosedSubject$.complete();
  }

  /**
   * Observable to tell the modal component to start running the hide animation
   * NOTE: This is private and should not be used by app code
   */
  _beforeClose(): Rx.Observable<void> {
    return this._beforeClosedSubject$.asObservable();
  }

  afterOpen(): Rx.Observable<void> {
    return this._afterOpenSubject$.asObservable();
  }

  afterClosed(): Rx.Observable<ModalResult> {
    return this._afterClosedSubject$.asObservable();
  }
}

@Injectable()
export class ModalService {
  private _openStreamSubject$ = new Rx.Subject<any>();
  openStream$ = this._openStreamSubject$.asObservable();
  private _statusStreamSubject$ = new Rx.Subject<ModalLoadingStatus>();
  statusStream$ = this._statusStreamSubject$.asObservable();
  private _beforeCloseStreamSubject$ = new Rx.Subject<any>();
  beforeCloseStream$ = this._beforeCloseStreamSubject$.asObservable();
  private retryStreamSubject$: Rx.Subject<undefined>;
  private _titleStreamSubject$ = new Rx.ReplaySubject<
    TemplateRef<any> | undefined
  >();
  titleStream$ = this._titleStreamSubject$.asObservable();

  // rendering container
  private injector: Injector;
  private viewContainerRef: ViewContainerRef;
  private openModalRef?: ModalRef<any>;
  private modalConfig: ModalConfig;

  constructor(
    private compiler: Compiler,
    @Inject(ROUTES) private readonly loadableRoutes: Routes[],
    private errorHandler: ErrorHandler,
    private location: Location,
    /** This should only be injected in UI tests */
    @Optional()
    @Inject(TESTING_MODAL_CLOSE_ANIMATION_DISABLED)
    private readonly testingCloseAnimationDisabled?: boolean,
  ) {}

  close(config: ModalCloseConfig = {}) {
    if (this.openModalRef) {
      this.openModalRef.close(undefined, config);
    }
  }

  /**
   * Destroys the component after running the hide animation in the modal component
   * NOTE: This is private and should not be used by app code, call .close() instead
   */
  _destroy() {
    if (this.openModalRef) {
      this.openModalRef._destroy();
      this.openModalRef = undefined;
    }
    if (this.retryStreamSubject$) {
      this.retryStreamSubject$.complete();
    }
  }

  open<T>(
    component: ComponentType<T>,
    modalConfig: ModalConfig,
  ): ModalRef<any> {
    this.modalConfig = modalConfig;

    const modalRef = new ModalRef(this._openStreamSubject$, this.location);
    this._titleStreamSubject$.next(undefined);

    // close any open modals and wait for them to close
    let ready$ = Rx.of(true);
    if (this.openModalRef) {
      ready$ = this.openModalRef.afterClosed();
      this.close();
    }

    this.retryStreamSubject$ = new Rx.Subject<undefined>();
    // asynchronously set the componentRef in the modal
    // we return immediately to make the API nicer.
    ready$
      .pipe(
        tap(() => {
          // mark modal as open after closing previous one
          this._openStreamSubject$.next(
            modalConfig.showBackdrop !== undefined
              ? modalConfig.showBackdrop
              : true,
          );
          this.openModalRef = modalRef;
          modalRef.open();
          this.openModalRef
            ._beforeClose()
            .pipe(first())
            // FIXME
            // eslint-disable-next-line rxjs/no-nested-subscribe
            .subscribe(_ => {
              if (this.testingCloseAnimationDisabled) {
                // Immediately destroys the open modal rather than waiting for
                // the `animationDone` callback. Animations are currently broken
                // in UI tests, specifically the timing of animation callbacks
                // being later than expected.
                this._destroy();
              } else {
                this._beforeCloseStreamSubject$.next();
              }
            });
        }),
        // reset the loading status
        tap(() => this._statusStreamSubject$.next({ ready: false })),
        switchMap(() => this.getModalNgModule(component)),
        switchMap(module => this.compiler.compileModuleAsync(module)),
        // on failure retry twice with exponential backoff
        retryBackoff({
          initialInterval: 200,
          maxRetries: 2,
        }),
        catchError(err => {
          // report the error to Sentry since it failed 3 times
          this.errorHandler.handleError(err);
          // inform the modal component that the modal couldn't be loaded
          this._statusStreamSubject$.next({
            ready: true,
            errorMessage: err.message,
          });
          throw err;
        }),
        // this subject allows the user to manual retry on errors
        retryWhen(() => this.retryStreamSubject$.asObservable()),
      )
      .subscribe((ngModuleFactory: NgModuleFactory<any>) => {
        // if the modal has changed (most likely closed), don't inject the old component
        if (this.openModalRef !== modalRef) {
          return;
        }

        // inform modal component that loading succeeded
        this._statusStreamSubject$.next({ ready: true });
        // get component factory
        const componentFactory = ngModuleFactory
          .create(this.injector) // ngModuleRef
          .componentFactoryResolver.resolveComponentFactory(component);

        // create custom injector
        const injectionTokens = new WeakMap();
        injectionTokens.set(ModalRef, modalRef);
        const customInjector = new PortalInjector(
          this.injector,
          injectionTokens,
        );

        // create component
        const componentRef = this.viewContainerRef.createComponent(
          componentFactory,
          0,
          customInjector,
        );
        if (modalConfig.inputs) {
          Object.entries(modalConfig.inputs).forEach(([key, value]) => {
            // FIXME: ComponentType<T> has no index signature.
            (componentRef as any).instance[key] = value;
          });
        }
        modalRef.set(componentRef);
      });
    return modalRef;
  }

  retryOpen() {
    this.retryStreamSubject$.next(undefined);
  }

  setContainer(viewContainerRef: ViewContainerRef, injector: Injector) {
    this.viewContainerRef = viewContainerRef;
    this.injector = injector;
  }

  getCurrentConfig() {
    return this.modalConfig;
  }

  setTitleTemplate(template?: TemplateRef<any>) {
    this._titleStreamSubject$.next(template);
  }

  private async getModalNgModule<T>(component: ComponentType<T>): Promise<any> {
    // each modal component in `app-modal-routes` is a dynamic import
    // so we need to call the imports and wait for them to all resolve
    const resolvedRoutes = await Promise.all(
      this.loadableRoutes
        .reduce((acc, list) => [...acc, ...list], []) // flatten
        .map(route =>
          route.data?.loadModal
            ? (route.data.loadModal as Promise<ComponentType<T>>).then(c => ({
                ...route,
                component: c,
              }))
            : route,
        ),
    );
    const componentRoute = resolvedRoutes.find(
      entry => entry.component === component,
    );
    if (
      componentRoute &&
      componentRoute.loadChildren &&
      typeof componentRoute.loadChildren !== 'string'
    ) {
      return componentRoute.loadChildren();
    }
    throw new Error(`missing modal module configuration for ${component.name}`);
  }
}

/**
 * Provider factory for Modal Service
 *
 * @export
 * @param {ModalService} parentRegistry The parent registry
 * @returns {ModalService} The singleton instance or a new one
 */
export function MODAL_SERVICE_PROVIDER_FACTORY(
  parentRegistry: ModalService,
  compiler: Compiler,
  loadableRoutes: Routes[],
  errorHandler: ErrorHandler,
  location: Location,
  testingCloseAnimationDisabled?: boolean,
) {
  return (
    parentRegistry ||
    new ModalService(
      compiler,
      loadableRoutes,
      errorHandler,
      location,
      testingCloseAnimationDisabled,
    )
  );
}

/**
 * Create a service provider that acts as a singleton.
 */
export const MODAL_SERVICE_PROVIDER: Provider = {
  // If there is already an ModalService available, use that.
  // Otherwise, provide a new one.
  provide: ModalService,
  deps: [
    [new Optional(), new SkipSelf(), ModalService],
    Compiler,
    ROUTES,
    ErrorHandler,
    Location,
    [new Optional(), TESTING_MODAL_CLOSE_ANIMATION_DISABLED],
  ],
  useFactory: MODAL_SERVICE_PROVIDER_FACTORY,
};
