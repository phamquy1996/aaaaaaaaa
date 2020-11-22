import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ToastAlertService } from './toast-alert.service';

@Component({
  selector: 'fl-toast-alert-container',
  template: `
    <fl-bit class="ToastAlertContainer" #container></fl-bit>
  `,
  styleUrls: ['./toast-alert-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastAlertContainerComponent implements OnInit, OnDestroy {
  @ViewChild('container', { read: ElementRef })
  container: ElementRef<HTMLDivElement>;

  constructor(
    private element: ElementRef,
    private toastAlertService: ToastAlertService,
  ) {}

  ngOnInit() {
    this.toastAlertService.registerContainer(this);
  }

  isElementVisible() {
    const { nativeElement } = this.element;

    return nativeElement.offsetWidth > 0 || nativeElement.offsetHeight > 0;
  }

  ngOnDestroy() {
    this.toastAlertService.unregisterContainer(this);
  }
}
