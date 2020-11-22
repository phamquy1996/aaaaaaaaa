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
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { HighlightColor, TextSize } from '@freelancer/ui/text';
import { UserAgent } from '@freelancer/user-agent';
import { isLinkWhitelisted } from '../helpers/helpers';

export enum LinkColor {
  INHERIT = 'inherit',
  LIGHT = 'light',
  MID = 'mid',
  DARK = 'dark',
  DEFAULT = 'default',
}

export enum LinkHoverColor {
  INHERIT = 'inherit',
  LIGHT = 'light',
  DEFAULT = 'default',
}

export enum LinkUnderline {
  ALWAYS = 'always',
  NEVER = 'never',
  HOVER = 'hover',
}

export enum LinkWeight {
  INHERIT = 'inherit',
  BOLD = 'bold',
}

export enum LinkIconPosition {
  LEFT = 'left',
  RIGHT = 'right',
}

export interface QueryParams {
  [k: string]: any;
}

@Component({
  selector: 'fl-link',
  template: `
    <a
      class="LinkElement"
      *ngIf="link && !external && !mailto"
      [routerLink]="link"
      [queryParams]="queryParams"
      [fragment]="fragment"
      [target]="attrTarget"
      [attr.itemprop]="itemprop"
      [attr.itemtype]="itemtype"
      [rel]="allRel"
      [attr.data-underline]="underline"
    >
      <ng-container [ngTemplateOutlet]="content"></ng-container>
    </a>
    <a
      class="LinkElement"
      *ngIf="link && external && !mailto"
      [href]="link"
      [target]="attrTarget"
      [rel]="allRel"
      [attr.itemprop]="itemprop"
      [attr.itemtype]="itemtype"
      [attr.data-underline]="underline"
    >
      <ng-container [ngTemplateOutlet]="content"></ng-container>
    </a>
    <a
      class="LinkElement"
      *ngIf="link && mailto && !external"
      [href]="link"
      [target]="'_blank'"
      [rel]="mailto"
      [attr.itemprop]="itemprop"
      [attr.itemtype]="itemtype"
      [attr.data-underline]="underline"
    >
      <ng-container [ngTemplateOutlet]="content"></ng-container>
    </a>
    <button
      *ngIf="!link"
      class="LinkElement"
      type="button"
      [attr.disabled]="disabled ? true : null"
      [attr.data-underline]="underline"
    >
      <ng-container [ngTemplateOutlet]="content"></ng-container>
    </button>

    <ng-template #content>
      <div
        class="LinkInner"
        [attr.data-icon]="iconName ? true : false"
        [attr.data-icon-position]="iconPosition"
      >
        <div
          class="LinkIcon"
          *ngIf="iconName"
          [attr.data-icon-position]="iconPosition"
        >
          <fl-icon
            [name]="iconName"
            [color]="iconColor"
            [size]="iconSize"
          ></fl-icon>
        </div>
        <div class="LinkText"><ng-content></ng-content></div>
      </div>
    </ng-template>
  `,
  styleUrls: ['./link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkComponent implements OnChanges {
  TextSize = TextSize;
  IconSize = IconSize;
  IconColor = IconColor;
  LinkIconPosition = LinkIconPosition;

  /** Microdata | For search engines to identify the property of the element */
  @Input() itemprop: string;

  /** Microdata | Specifies the URL of the vocabulary that will be used to define itemprop */
  @Input() itemtype: string;

  @Input() link?: string;
  @Input() queryParams: QueryParams;
  /** Anchor Fragment */
  @Input() fragment?: string;

  @Input() rel = '';

  /**
   * Whether to open the link in a new tab in desktop.
   */
  @Input() newTab?: boolean;

  @Input() underline = LinkUnderline.HOVER;

  @HostBinding('attr.data-color')
  @Input()
  color = LinkColor.DEFAULT;
  /**
   * Text selection color
   */
  @HostBinding('attr.data-highlight-color')
  @Input()
  highlightColor?: HighlightColor;
  @HostBinding('attr.data-hover-color')
  @Input()
  hoverColor = LinkHoverColor.DEFAULT;
  @HostBinding('attr.data-weight')
  @Input()
  weight = LinkWeight.INHERIT;

  @HostBinding('attr.data-size')
  @Input()
  size: TextSize = TextSize.XSMALL;
  @Input() iconName?: string;
  @Input() iconColor?: IconColor = IconColor.PRIMARY;
  @Input() iconPosition = LinkIconPosition.LEFT;
  @Input() iconSize?: IconSize = IconSize.SMALL;
  @Input() disabled?: boolean;

  external = false;
  mailto = false;
  allRel = '';
  attrTarget: string;

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

  isMailLink(link?: string) {
    // Check if the link is an email or protocol relative.
    return !!link && (link.startsWith('mailto') || link.startsWith(':'));
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('link' in changes) {
      // Check if the link is http(s) or protocol relative.
      this.external = this.isExternalLink(this.link);
      // Check if the link is an email or protocol relative.
      this.mailto = this.isMailLink(this.link);

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
      if (
        (this.isExternalLink(this.link) && !this.rel.includes('noopener')) ||
        (this.isMailLink(this.link) && !this.rel.includes('noopener'))
      ) {
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
