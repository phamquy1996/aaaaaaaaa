import { Directive, HostBinding, Input } from '@angular/core';

export enum Margin {
  NONE = 'none',
  XXXSMALL = 'xxxsmall',
  XXSMALL = 'xxsmall',
  XSMALL = 'xsmall',
  SMALL = 'small',
  MID = 'mid',
  LARGE = 'large',
  XLARGE = 'xlarge',
  XXLARGE = 'xxlarge',
  XXXLARGE = 'xxxlarge',
  XXXXLARGE = 'xxxxlarge',
}

@Directive({
  selector: `
    [flMarginRight],
    [flMarginBottom],
    [flMarginRightTablet],
    [flMarginBottomTablet],
    [flMarginRightDesktop],
    [flMarginBottomDesktop],
  `,
})
export class MarginDirective {
  @HostBinding('attr.data-margin-right')
  @Input()
  flMarginRight?: Margin;

  @HostBinding('attr.data-margin-bottom')
  @Input()
  flMarginBottom?: Margin;

  @HostBinding('attr.data-margin-right-tablet')
  @Input()
  flMarginRightTablet?: Margin;

  @HostBinding('attr.data-margin-bottom-tablet')
  @Input()
  flMarginBottomTablet?: Margin;

  @HostBinding('attr.data-margin-right-desktop')
  @Input()
  flMarginRightDesktop?: Margin;

  @HostBinding('attr.data-margin-bottom-desktop')
  @Input()
  flMarginBottomDesktop?: Margin;
}
