import { Component, Input } from '@angular/core';
import { ContainerSize } from '@freelancer/ui/container';

@Component({
  selector: 'app-bar',
  template: `
    <fl-container [size]="containerSize">
      <nav class="BarContainer">
        <a
          class="BarContainer-title"
          *ngIf="appBarTitle"
          flTrackingLabel="TitleLink"
          [routerLink]="link"
        >
          {{ appBarTitle }}
        </a>
        <perfect-scrollbar class="BarContainer-scrollbar">
          <div class="BarContainer-items" #items>
            <ng-content select="app-bar-item"></ng-content>
          </div>
        </perfect-scrollbar>
      </nav>
    </fl-container>
  `,
  styleUrls: ['./bar.component.scss'],
})
export class BarComponent {
  @Input() appBarTitle: string;
  @Input() link: string;

  @Input()
  containerSize: ContainerSize = ContainerSize.DESKTOP_LARGE;
}
