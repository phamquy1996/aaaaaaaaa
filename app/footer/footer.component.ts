import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnInit,
} from '@angular/core';
import { ContainerSize } from '@freelancer/ui/container';
import { UI_CONFIG } from '@freelancer/ui/ui.config';
import { UiConfig } from '@freelancer/ui/ui.interface';

@Component({
  selector: 'app-footer',
  template: `
    <ng-container [ngSwitch]="theme">
      <app-footer-arrow
        *ngSwitchCase="'arrow'"
        [containerSize]="containerSize"
      ></app-footer-arrow>
      <app-footer-deloitte
        *ngSwitchCase="'deloitte'"
        [containerSize]="containerSize"
      ></app-footer-deloitte>
      <app-footer-freelancer
        *ngSwitchDefault
        [containerSize]="containerSize"
      ></app-footer-freelancer>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent implements OnInit {
  theme?: string;

  @Input() containerSize: ContainerSize;

  constructor(@Inject(UI_CONFIG) private uiConfig: UiConfig) {}

  ngOnInit() {
    this.theme = this.uiConfig.theme;
  }
}
