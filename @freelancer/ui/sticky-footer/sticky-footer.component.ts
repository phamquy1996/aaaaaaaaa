import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { KeyboardService } from '@freelancer/keyboard';
import * as Rx from 'rxjs';

@Component({
  selector: 'fl-sticky-footer',
  template: `
    <fl-bit
      class="StickyFooter"
      [ngClass]="{
        IsKeyboardOpen: isKeyboardOpen
      }"
    >
      <ng-content></ng-content>
    </fl-bit>
  `,
  styleUrls: ['./sticky-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StickyFooterComponent implements OnInit, OnDestroy {
  isKeyboardOpen = false;
  keyboardSubscription?: Rx.Subscription;

  constructor(
    private keyboardService: KeyboardService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.keyboardSubscription = this.keyboardService.isOpen().subscribe(val => {
      this.isKeyboardOpen = val;
      this.changeDetectorRef.detectChanges();
    });
  }

  ngOnDestroy() {
    if (this.keyboardSubscription) {
      this.keyboardSubscription.unsubscribe();
    }
  }
}
