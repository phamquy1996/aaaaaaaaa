import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import { Assets } from '../assets';

export enum LogoSize {
  MID = 'mid',
  SMALL = 'small',
  ICON = 'icon',
}

export enum BackgroundColor {
  DARK = 'dark',
  LIGHT = 'light',
}

@Component({
  selector: 'fl-logo',
  template: `
    <img
      class="LogoImg"
      alt="Freelancer logo"
      i18n-alt="Freelancer logo alt text"
      [src]="logo"
      [ngClass]="{
        Mid: size === LogoSize.MID,
        Small: size === LogoSize.SMALL,
        Icon: size === LogoSize.ICON
      }"
    />
  `,
  styleUrls: ['./logo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoComponent implements OnInit, OnChanges {
  LogoSize = LogoSize;

  @Input() size: LogoSize = LogoSize.MID;
  @Input() backgroundColor: BackgroundColor = BackgroundColor.LIGHT;

  logo: string;

  constructor(private assets: Assets) {}

  // FIXME: this shouldn't be necessary, but with OnPush ngOnChanges never
  // gets called on init if no input property is set (which is a valid use
  // case).
  ngOnInit() {
    this.updateLogo();
  }

  ngOnChanges() {
    this.updateLogo();
  }

  updateLogo() {
    if (this.size === LogoSize.ICON) {
      this.logo = this.assets.getUrl('freelancer-logo-icon.svg');
      return;
    }

    this.logo =
      this.backgroundColor === BackgroundColor.LIGHT
        ? this.assets.getUrl('freelancer-logo.svg')
        : this.assets.getUrl('freelancer-logo-light.svg');
  }
}
