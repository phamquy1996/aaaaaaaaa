import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as Rx from 'rxjs';
import { take } from 'rxjs/operators';
import { Assets } from '../assets';
import { IconService } from './icon.service';

export enum IconColor {
  DARK = 'dark',
  INHERIT = 'inherit',
  LIGHT = 'light',
  MID = 'mid',
  PRIMARY = 'primary',
  WHITE = 'white',
  CONTEST = 'contest',
  ERROR = 'error',
  SUCCESS = 'success',
  RECRUITER_LIGHT = 'recruiter-light',
}

export enum HoverColor {
  CURRENT = 'currentColor',
  LIGHT = 'light',
  PRIMARY = 'primary',
}

export enum IconSize {
  XXLARGE = 'xxlarge',
  XLARGE = 'xlarge',
  LARGE = 'large',
  MID = 'mid',
  SMALL = 'small',
  XSMALL = 'xsmall',
}

export enum IconBackdrop {
  FREEMARKET = 'freemarket',
  PRIMARY = 'primary',
  PRIMARY_DARK = 'primary-dark',
  RECRUITER = 'recruiter',
  TERTIARY = 'tertiary',
  TRANSPARENT = 'transparent',
  WARRIOR_FORUM = 'warrior-forum',
  ERROR = 'error',
  SUCCESS = 'success',
}

@Component({
  selector: 'fl-icon',
  template: `
    <div class="IconInner" [attr.tabindex]="clickable ? '-1' : null">
      <div
        #container
        class="IconContainer"
        [attr.data-color]="color"
        [attr.data-drop-shadow]="dropShadow"
        [attr.data-hover-color]="hoverColor"
        [attr.data-name]="name"
        [attr.data-size]="size"
        [attr.data-size-tablet]="sizeTablet"
        [attr.data-size-desktop]="sizeDesktop"
        [attr.data-legacy]="attrLegacy"
        [attr.aria-label]="label"
        [attr.title]="label"
        [attr.aria-hidden]="!attrAriaHidden"
      ></div>
    </div>
  `,
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent implements OnChanges, OnDestroy {
  attrLegacy?: true;
  attrAriaHidden?: true;
  iconSubscription?: Rx.Subscription;

  @Input() color = IconColor.DARK;
  @Input() name: string;
  @Input() label: string;
  @Input() hoverColor?: HoverColor;
  @Input() clickable = false;
  @Input() dropShadow = false;

  /** Change the icon backdrop */
  @HostBinding('attr.data-backdrop')
  @Input()
  backdrop?: IconBackdrop = undefined;

  /** Icon size for mobile and above */
  @HostBinding('attr.data-size')
  @Input()
  size = IconSize.MID;

  /** Change the [size] from tablet and above */
  @HostBinding('attr.data-size-tablet')
  @Input()
  sizeTablet?: IconSize;

  /** Change the [size] from desktop and above */
  @HostBinding('attr.data-size-desktop')
  @Input()
  sizeDesktop?: IconSize;

  /** flicon/legacy icon system compatibility layer for the new stack
   *  Note: This is temporary for navigation. DO NOT USE
   */
  @Input()
  set legacy(value: boolean) {
    this.attrLegacy = value ? true : undefined;
  }

  @HostBinding('attr.role')
  get iconRole(): string {
    return this.clickable ? 'button' : 'img';
  }

  @HostBinding('attr.tabindex')
  get iconTabIndex(): number | null {
    return this.clickable ? 0 : null;
  }

  @ViewChild('container', { static: true }) container: any;
  constructor(
    private renderer: Renderer2,
    private iconService: IconService,
    private assets: Assets,
  ) {}

  private setElement(element: Element) {
    const layoutElement: Element = this.container.nativeElement;
    // Detach all views of the child nodes of the root element.
    // NOTE: This wouldn't work in IE 11 because there's a bug there that
    // causes SVG to not be included in the list.
    // We've polyfilled it though.
    // Ref: https://github.com/angular/angular/issues/6327
    Array.from(layoutElement.childNodes).forEach((node: Node) => {
      this.renderer.removeChild(layoutElement, node);
    });
    // Put the new icon SVG in.
    this.renderer.appendChild(layoutElement, element);
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('name' in changes) {
      // Check if the new value is not an empty string or undefined.
      if (changes.name.currentValue) {
        this.iconSubscription = this.iconService
          .getIcon(
            this.assets.getUrl(`icons/${changes.name.currentValue}.svg`),
            this.renderer,
            this.label || this.name,
          )
          .pipe(take(1))
          .subscribe(element => {
            this.setElement(element);
          });
      }

      if ('label' in changes) {
        this.attrAriaHidden = changes.name.currentValue ? undefined : true;
      }
    }
  }

  ngOnDestroy() {
    if (this.iconSubscription !== undefined) {
      this.iconSubscription.unsubscribe();
    }
  }
}
