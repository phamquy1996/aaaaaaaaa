import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import {
  ToastAlertColor,
  ToastAlertService,
  ToastAlertType,
} from '@freelancer/ui/toast-alert';
import * as Rx from 'rxjs';
import { Network } from './network.service';

@Component({
  selector: 'fl-network-alert',
  template: `
    <fl-toast-alert
      [id]="'fl-network-alert'"
      [timeout]="undefined"
      [closeable]="true"
      [color]="ToastAlertColor.DARK"
      [type]="ToastAlertType.ERROR"
    >
      There is no internet connection
    </fl-toast-alert>
  `,
})
export class NetworkAlertComponent implements OnInit, OnDestroy {
  ToastAlertType = ToastAlertType;
  ToastAlertColor = ToastAlertColor;

  private offlineSubscription?: Rx.Subscription;

  constructor(
    private network: Network,
    private toastAlertService: ToastAlertService,
    @Inject(PLATFORM_ID) private platformId: string,
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.offlineSubscription = this.network.isOnline$.subscribe(isOnline => {
        if (!isOnline) {
          this.toastAlertService.open('fl-network-alert');
        } else {
          this.toastAlertService.close('fl-network-alert');
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.offlineSubscription) {
      this.offlineSubscription.unsubscribe();
    }
  }
}
