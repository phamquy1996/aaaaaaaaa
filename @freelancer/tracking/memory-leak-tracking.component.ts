import { Component, OnInit } from '@angular/core';
import { MemoryLeakTracking } from './memory-leak-tracking.service';

@Component({
  selector: 'fl-memory-leak-tracking',
  template: `
    <ng-container></ng-container>
  `,
})
export class MemoryLeakTrackingComponent implements OnInit {
  constructor(private memoryLeakTracking: MemoryLeakTracking) {}

  ngOnInit() {
    if (!(window.performance && (window.performance as any).memory)) {
      return;
    }
    this.memoryLeakTracking.monitor();
  }
}
