import {
  ChangeDetectorRef,
  Directive,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import * as Rx from 'rxjs';
import { distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Feature } from './feature-flags.model';
import { FeatureFlagsService } from './feature-flags.service';

/**
 * Mark an element as related to a feature
 */
@Directive({ selector: '[flFeature]' })
export class FeatureFlagsDirective implements OnDestroy, OnInit {
  private featureChanges$ = new Rx.ReplaySubject<Feature>(1);
  private elseTemplateRef: TemplateRef<any>;
  private subscriptions: Rx.Subscription[] = [];

  constructor(
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private featureFlagService: FeatureFlagsService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.featureChanges$
        .pipe(
          switchMap(feature => this.featureFlagService.getFlag(feature)),
          distinctUntilChanged(),
        )
        .subscribe(flagState => {
          if (flagState) {
            this.viewContainer.clear();
            this.viewContainer.createEmbeddedView(this.templateRef);
          } else if (this.elseTemplateRef) {
            this.viewContainer.clear();
            this.viewContainer.createEmbeddedView(this.elseTemplateRef);
          }
          this.changeDetectorRef.markForCheck();
        }),
    );
  }

  @Input()
  set flFeature(feature: Feature) {
    this.featureChanges$.next(feature);
  }

  @Input()
  set flFeatureElse(templateRef: TemplateRef<any>) {
    this.elseTemplateRef = templateRef;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
