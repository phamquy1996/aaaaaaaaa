import { Component, Input, OnInit } from '@angular/core';
import { ErrorTracking } from '@freelancer/tracking';

@Component({
  selector: 'app-notification-template-default',
  template: ``,
})
export class NotificationTemplateDefaultComponent implements OnInit {
  @Input() error: string;

  constructor(private errorTracking: ErrorTracking) {}

  ngOnInit() {
    this.errorTracking.captureMessage(this.error.slice(0, 250));
  }
}
