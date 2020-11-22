import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';
import { ContainerSize } from '@freelancer/ui/container';

export enum BackgroundColor {
  DARK = 'dark',
  LIGHT = 'light',
}

export enum LayoutType {
  SINGLE = 'single',
  SPLIT = 'split',
}

export enum LayoutMinHeight {
  MID = 'mid',
  FULL = 'full',
}

@Component({
  selector: 'fl-page-layout-single',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageLayoutSingleComponent {}

@Component({
  selector: 'fl-page-layout-primary',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageLayoutPrimaryComponent {}

@Component({
  selector: 'fl-page-layout-secondary',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageLayoutSecondaryComponent {}

@Component({
  selector: 'fl-page-layout',
  template: `
    <main class="PageContainer">
      <fl-container [size]="pageSize">
        <fl-grid *ngIf="layoutType === LayoutType.SPLIT">
          <fl-col [colDesktopSmall]="8">
            <ng-content select="fl-page-layout-primary"></ng-content>
          </fl-col>
          <fl-col [colDesktopSmall]="4">
            <ng-content select="fl-page-layout-secondary"></ng-content>
          </fl-col>
        </fl-grid>

        <ng-content
          *ngIf="layoutType === LayoutType.SINGLE"
          select="fl-page-layout-single"
        ></ng-content>
      </fl-container>
    </main>
  `,
  styleUrls: ['./page-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageLayoutComponent {
  LayoutMinHeight = LayoutMinHeight;
  LayoutType = LayoutType;

  @HostBinding('attr.data-background')
  @Input()
  backgroundColor = BackgroundColor.LIGHT;
  @Input() layoutType = LayoutType.SINGLE;
  @HostBinding('attr.data-minheight')
  @Input()
  layoutMinHeight = LayoutMinHeight.FULL;
  @Input() pageSize = ContainerSize.DESKTOP_LARGE;
}
