import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnInit,
} from '@angular/core';
import { UI_CONFIG } from '@freelancer/ui/ui.config';
import { UiConfig } from '@freelancer/ui/ui.interface';

export enum LanguageSwitcherTheme {
  DARK = 'dark',
  LIGHT = 'light',
}

@Component({
  selector: 'fl-language-switcher',
  template: `
    <ng-container [ngSwitch]="theme">
      <fl-language-switcher-arrow
        *ngSwitchCase="'arrow'"
        [color]="color"
      ></fl-language-switcher-arrow>
      <fl-language-switcher-freelancer
        *ngSwitchDefault
        [color]="color"
      ></fl-language-switcher-freelancer>
    </ng-container>
  `,
  styleUrls: ['./language-switcher.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcherComponent implements OnInit {
  theme?: string;

  @Input() color = LanguageSwitcherTheme.DARK;

  constructor(@Inject(UI_CONFIG) private uiConfig: UiConfig) {}

  ngOnInit() {
    this.theme = this.uiConfig.theme;
  }
}
