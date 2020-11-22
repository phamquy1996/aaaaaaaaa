import { Component } from '@angular/core';

@Component({
  selector: 'fl-tracking',
  template: `
    <fl-page-view-tracking></fl-page-view-tracking>
    <fl-navigation-performance-tracking></fl-navigation-performance-tracking>
    <fl-memory-leak-tracking></fl-memory-leak-tracking>
    <fl-synthetic-performance-tracking></fl-synthetic-performance-tracking>
    <fl-core-web-vitals-tracking></fl-core-web-vitals-tracking>
  `,
})
export class TrackingComponent {}
