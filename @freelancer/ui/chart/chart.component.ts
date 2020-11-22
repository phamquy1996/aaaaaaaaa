import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BarData } from './chart-bar.component';

export interface ChartData {
  value: number;
  label: string;
  data?: BarData;
}

export enum ChartType {
  BAR = 'bar',
}

@Component({
  selector: 'fl-chart',
  template: `
    <ng-container [ngSwitch]="type">
      <fl-chart-bar
        *ngSwitchCase="ChartType.BAR"
        [data]="data"
        [barSpacing]="barSpacing"
        [gridScale]="gridScale"
        [markerYSuffix]="markerYSuffix"
      ></fl-chart-bar>
    </ng-container>
  `,
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent {
  ChartType = ChartType;

  @Input() type: ChartType;
  @Input() data: ChartData[];
  @Input() gridScale = 2;
  @Input() barSpacing = 10;
  @Input() markerYSuffix = '';
}
