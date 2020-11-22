import {
  animate,
  AnimationEvent,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  ViewRef,
} from '@angular/core';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { SpinnerColor, SpinnerSize } from '@freelancer/ui/spinner';
import { FontColor, TextSize } from '@freelancer/ui/text';
import * as Rx from 'rxjs';
import { debounceTime, startWith } from 'rxjs/operators';
import { ToastAlertService } from './toast-alert.service';

export enum ToastAlertType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  LOADING = 'loading',
}

export enum ToastAlertColor {
  LIGHT = 'light',
  DARK = 'dark',
}

@Component({
  selector: 'fl-toast-alert',
  template: `
    <fl-bit
      class="ToastAlert"
      [attr.data-type]="type"
      [attr.data-color]="color"
      [@toggleElement]="state"
      (@toggleElement.done)="handleAnimationDone($event)"
    >
      <ng-container [ngSwitch]="type">
        <fl-icon
          class="ToastAlert-icon"
          *ngSwitchCase="ToastAlertType.INFO"
          [name]="'ui-info-v2'"
          [color]="IconColor.INHERIT"
          [flMarginRight]="Margin.XXSMALL"
        ></fl-icon>
        <fl-icon
          class="ToastAlert-icon"
          *ngSwitchCase="ToastAlertType.ERROR"
          [name]="'ui-warning-v2'"
          [color]="IconColor.INHERIT"
          [flMarginRight]="Margin.XXSMALL"
        ></fl-icon>
        <fl-icon
          class="ToastAlert-icon"
          *ngSwitchCase="ToastAlertType.SUCCESS"
          [name]="'ui-check-in-circle-v2'"
          [color]="IconColor.INHERIT"
          [flMarginRight]="Margin.XXSMALL"
        ></fl-icon>
        <fl-icon
          class="ToastAlert-icon"
          *ngSwitchCase="ToastAlertType.WARNING"
          [name]="'ui-warning-alt-v2'"
          [color]="IconColor.INHERIT"
          [flMarginRight]="Margin.XXSMALL"
        ></fl-icon>
        <fl-spinner
          class="ToastAlert-loader"
          *ngSwitchCase="ToastAlertType.LOADING"
          [size]="SpinnerSize.SMALL"
          [flMarginRight]="Margin.XXSMALL"
          [color]="
            color === ToastAlertColor.LIGHT
              ? SpinnerColor.GRAY
              : SpinnerColor.LIGHT
          "
        ></fl-spinner>
      </ng-container>
      <fl-text
        class="ToastAlert-content"
        [flMarginRight]="closeable ? Margin.MID : Margin.NONE"
        [attr.data-closeable]="closeable"
        [color]="
          color === ToastAlertColor.LIGHT ? FontColor.DARK : FontColor.LIGHT
        "
      >
        <ng-content></ng-content>
      </fl-text>
      <fl-button
        class="ToastAlert-closeBtn"
        *ngIf="closeable"
        (click)="close()"
      >
        <fl-icon
          [name]="'ui-close'"
          [color]="IconColor.MID"
          [size]="IconSize.SMALL"
        ></fl-icon>
      </fl-button>
    </fl-bit>
  `,
  styleUrls: ['./toast-alert.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('toggleElement', [
      state(
        'visible',
        style({
          opacity: '1',
          transform: 'translateY(0)',
        }),
      ),
      state(
        'hidden',
        style({
          opacity: '0',
          transform: 'translateY(-12px)',
        }),
      ),
      transition(
        'visible => hidden',
        animate('200ms cubic-bezier(0.25, 0.8, 0.25, 1)'),
      ),
      transition(
        '* => visible',
        animate('200ms cubic-bezier(0.25, 0.8, 0.25, 1)'),
      ),
    ]),
  ],
})
export class ToastAlertComponent implements OnInit, OnDestroy {
  FontColor = FontColor;
  TextSize = TextSize;
  IconColor = IconColor;
  IconSize = IconSize;
  Margin = Margin;
  SpinnerColor = SpinnerColor;
  SpinnerSize = SpinnerSize;
  ToastAlertColor = ToastAlertColor;
  ToastAlertType = ToastAlertType;

  element: HTMLElement;
  state: string;

  private timer?: Rx.Subscription;
  private resetTimerSubject$: Rx.Subject<undefined> = new Rx.Subject();

  @Input() closeable = false;
  @Input() color = ToastAlertColor.LIGHT;
  @Input() id: string;
  @Input() timeout? = 3000;
  @Input() type = ToastAlertType.INFO;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private el: ElementRef,
    private toastAlertService: ToastAlertService,
    private renderer: Renderer2,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (!this.id) {
      console.error('Toast alert must have an id');
      return;
    }

    this.element = this.el.nativeElement;
    this.toastAlertService.add(this, this.id);
    this.state = 'hidden';
  }

  close() {
    this.toastAlertService.close(this.id);
  }

  move(position: number) {
    this.renderer.setStyle(this.element, 'top', `${position}px`);
  }

  startTimer() {
    if (this.timeout) {
      this.timer = this.resetTimerSubject$
        .pipe(startWith(undefined), debounceTime(this.timeout))
        .subscribe(() => this.toastAlertService.close(this.id));
    }
  }

  resetTimer() {
    this.resetTimerSubject$.next(undefined);
  }

  unsubscribeTimer() {
    if (this.timer) {
      this.timer.unsubscribe();
    }
  }

  toggleVisibility(visibility: string) {
    this.state = visibility;

    if (!(this.changeDetectorRef as ViewRef).destroyed) {
      this.changeDetectorRef.detectChanges();
    }
  }

  handleAnimationDone(event: AnimationEvent) {
    if (event.fromState === 'visible') {
      this.unsubscribeTimer();
      this.toastAlertService.removeElement(this.id);
    }
  }

  ngOnDestroy() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.toastAlertService.close(this.id);
    this.toastAlertService.removeElement(this.id);
    this.toastAlertService.remove(this.id);
    this.unsubscribeTimer();
  }
}
