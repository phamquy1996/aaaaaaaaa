import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Inject,
  Input,
  OnChanges,
  PLATFORM_ID,
  SimpleChanges,
} from '@angular/core';
import { Location } from '@freelancer/location';
import { Pwa } from '@freelancer/pwa';
import { SpinnerColor, SpinnerSize } from '@freelancer/ui/spinner';
import { UserAgent } from '@freelancer/user-agent';
import { isLinkWhitelisted } from '../helpers/helpers';

export enum ButtonColor {
  SECONDARY = 'secondary',
  DEFAULT = 'default',
  SUCCESS = 'success',
  DANGER = 'danger',
  TRANSPARENT_DARK = 'transparent-dark',
  TRANSPARENT_LIGHT = 'transparent-light',
  TRANSPARENT_SECONDARY = 'transparent-secondary',
  PRIMARY = 'primary',
  RECRUITER = 'recruiter',
  TRANSPARENT_RECRUITER = 'transparent-recruiter',
  CUSTOM = 'custom',
  PRIMARY_PINK = 'primary-pink',
}

export enum ButtonSize {
  MINI = 'mini',
  SMALL = 'small',
  LARGE = 'large',
  XLARGE = 'xlarge',
  XXLARGE = 'xxlarge',
}

export enum ButtonGroupPosition {
  FIRST = 'first',
  MIDDLE = 'middle',
  LAST = 'last',
}

@Component({
  selector: 'fl-button',
  template: `
    <a
      *ngIf="link && !external"
      class="ButtonElement"
      [routerLink]="link"
      [routerLinkActive]="linkActive || ''"
      [routerLinkActiveOptions]="linkActiveOptions || { exact: false }"
      [queryParams]="queryParams"
      [fragment]="fragment"
      [rel]="allRel"
      [target]="attrTarget"
      [attr.data-color]="color"
      [attr.data-display]="display"
      [attr.disabled]="attrDisabled || busy ? true : undefined"
      aria-live="assertive"
    >
      <ng-container *ngTemplateOutlet="content"></ng-container>
    </a>
    <a
      *ngIf="link && external"
      class="ButtonElement"
      [href]="link"
      [rel]="allRel"
      [target]="attrTarget"
      [attr.data-color]="color"
      [attr.data-display]="display"
      [attr.disabled]="attrDisabled || busy ? true : undefined"
      aria-live="assertive"
    >
      <ng-container *ngTemplateOutlet="content"></ng-container>
    </a>

    <button
      *ngIf="!link"
      class="ButtonElement"
      [type]="buttonType"
      [attr.data-color]="color"
      [attr.data-display]="display"
      [attr.disabled]="attrDisabled || busy ? true : undefined"
      aria-live="assertive"
    >
      <ng-container *ngTemplateOutlet="content"></ng-container>
    </button>

    <fl-spinner
      *ngIf="busy"
      class="LoadingSpinner"
      [size]="SpinnerSize.SMALL"
      [color]="spinnerColor"
    ></fl-spinner>

    <ng-template #content>
      <ng-content></ng-content>
    </ng-template>
  `,
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent implements OnChanges {
  SpinnerColor = SpinnerColor;
  SpinnerSize = SpinnerSize;

  spinnerColor: SpinnerColor;

  @Input() buttonGroupPosition?: ButtonGroupPosition;
  /** Url used for button link case */
  @Input() link?: string;
  @Input() fragment?: string;
  /**
   * Whether to open the link in a new tab in desktop.
   */
  @Input() newTab?: boolean;
  @Input() queryParams?: { [k: string]: any };
  @Input() linkActive?: string[] | string;
  @Input() linkActiveOptions?: { exact: boolean };

  @HostBinding('class.ButtonGroupFirst')
  @Input()
  buttonGroupFirst = false;
  @HostBinding('class.ButtonGroupMiddle')
  @Input()
  buttonGroupMiddle = false;
  @HostBinding('class.ButtonGroupLast')
  @Input()
  buttonGroupLast = false;
  @HostBinding('attr.data-busy')
  @Input()
  busy?: boolean;
  @HostBinding('attr.data-color')
  @Input()
  color: ButtonColor;
  @HostBinding('attr.data-display')
  @Input()
  display: 'block' | 'inline' | 'flex' = 'inline';
  @HostBinding('attr.data-size')
  @Input()
  size: ButtonSize;
  @HostBinding('attr.data-size-tablet')
  @Input()
  sizeTablet?: ButtonSize;
  @HostBinding('attr.data-size-desktop')
  @Input()
  sizeDesktop?: ButtonSize;
  @Input() buttonType: 'submit' | 'button' = 'button';
  @Input()
  set submit(value: boolean) {
    this.buttonType = value ? 'submit' : 'button';
  }

  @HostBinding('attr.disabled') attrDisabled: true | undefined;

  @Input() rel = '';

  @Input()
  set disabled(value: boolean) {
    this.attrDisabled = value ? true : undefined;
  }
  get disabled() {
    return !!this.attrDisabled;
  }

  allRel = '';
  attrTarget: string;
  external = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private location: Location,
    private pwa: Pwa,
    private userAgent: UserAgent,
  ) {}

  isExternalLink(link?: string) {
    // Check if the link is http(s) or protocol relative.
    return !!link && (link.startsWith('http') || link.startsWith('//'));
  }

  ngOnChanges(changes: SimpleChanges) {
    this.spinnerColor =
      this.color === ButtonColor.DEFAULT || ButtonColor.TRANSPARENT_DARK
        ? SpinnerColor.GRAY
        : SpinnerColor.LIGHT;

    if (this.buttonGroupPosition) {
      this.buttonGroupFirst =
        this.buttonGroupPosition === ButtonGroupPosition.FIRST;
      this.buttonGroupMiddle =
        this.buttonGroupPosition === ButtonGroupPosition.MIDDLE;
      this.buttonGroupLast =
        this.buttonGroupPosition === ButtonGroupPosition.LAST;
    }

    if ('link' in changes) {
      // Check if the link is http(s) or protocol relative.
      this.external = this.isExternalLink(this.link);

      if (this.external) {
        this.attrTarget = this.getExternalTarget();
      }

      if (!this.external) {
        this.attrTarget = this.getInternalTarget();
      }
    }

    if ('link' in changes || 'rel' in changes) {
      // Add noopener to rel if external link, due to security exploits
      // Ref: https://mathiasbynens.github.io/rel-noopener/
      if (this.isExternalLink(this.link) && !this.rel.includes('noopener')) {
        this.allRel = `${this.rel} noopener`;
      } else {
        this.allRel = this.rel;
      }
    }
  }

  private getExternalTarget() {
    // Never open in new tab on native as this bypasses Capacitor's own logic
    if (this.pwa.isNative()) {
      return '_self';
    }

    // Open in new tab on mobile unless whitelisted
    if (isPlatformBrowser(this.platformId) && this.userAgent.isMobileDevice()) {
      return this.isWhitelisted() ? '_self' : '_blank';
    }

    // Open on new tab by default on desktop
    if (this.newTab === undefined) {
      return '_blank';
    }

    return this.newTab ? '_blank' : '_self';
  }

  private getInternalTarget() {
    // Always open links inside the Capacitor app
    if (this.pwa.isNative()) {
      return '_self';
    }

    // Open in current tab on mobile browser unless whitelisted
    if (isPlatformBrowser(this.platformId) && this.userAgent.isMobileDevice()) {
      return this.isWhitelisted() ? '_blank' : '_self';
    }

    // Open on current tab by default on desktop
    if (this.newTab === undefined) {
      return '_self';
    }

    return this.newTab ? '_blank' : '_self';
  }

  private isWhitelisted() {
    if (!this.link) {
      return false;
    }

    return isLinkWhitelisted(
      {
        source: this.location.pathname,
        destination: this.link,
      },
      this.external,
    );
  }
}
