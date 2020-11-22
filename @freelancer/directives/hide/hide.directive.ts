import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: `
    [flHideMobileSmall],
    [flHideMobile],
    [flHideTablet],
    [flHideDesktop],
    [flHideDesktopLarge],
    [flHide],
    [flShowMobileSmall],
    [flShowMobile],
    [flShowTablet],
    [flShowDesktop],
    [flShowDesktopLarge],
  `,
})
export class HideDirective {
  @HostBinding('attr.data-hide')
  @Input()
  flHide?: boolean;

  @HostBinding('attr.data-hide-mobile-small')
  @Input()
  flHideMobileSmall?: boolean;

  @HostBinding('attr.data-hide-mobile')
  @Input()
  flHideMobile?: boolean;

  @HostBinding('attr.data-hide-tablet')
  @Input()
  flHideTablet?: boolean;

  @HostBinding('attr.data-hide-desktop')
  @Input()
  flHideDesktop?: boolean;

  @HostBinding('attr.data-hide-desktop-large')
  @Input()
  flHideDesktopLarge?: boolean;

  @HostBinding('attr.data-show-mobile-small')
  @Input()
  flShowMobileSmall?: boolean;

  @HostBinding('attr.data-show-mobile')
  @Input()
  flShowMobile?: boolean;

  @HostBinding('attr.data-show-tablet')
  @Input()
  flShowTablet?: boolean;

  @HostBinding('attr.data-show-desktop')
  @Input()
  flShowDesktop?: boolean;

  @HostBinding('attr.data-show-desktop-large')
  @Input()
  flShowDesktopLarge?: boolean;
}
