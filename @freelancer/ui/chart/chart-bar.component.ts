import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { CdkPortal } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { TimeUtils } from '@freelancer/time-utils';
import * as Rx from 'rxjs';
import { debounceTime } from 'rxjs/operators';

export interface ChartData {
  value: number;
  label: string;
  data?: BarData;
}

export interface BarData {
  title: string;
  details: ReadonlyArray<BarDetail>;
}

export interface BarDetail {
  label: string;
  value: string | number;
}

@Component({
  selector: 'fl-chart-bar',
  template: `
    <svg class="Chart" #chart></svg>
    <ng-template cdkPortal>
      <fl-bit #chartTooltip></fl-bit>
    </ng-template>
  `,
  styleUrls: ['./chart-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartBarComponent implements OnChanges, OnDestroy {
  @Input() data: ChartData[];
  /** Y axis referencing line interval in numbers of the value */
  @Input() gridScale: number;
  /** Horizontal spacing between bars */
  @Input() barSpacing: number;
  /** Suffix(unit name) for values on Y axis */
  @Input() markerYSuffix?: string;

  readonly defaultMaxValue = 10;
  readonly gridIndentation = 20;
  readonly chartPadding = 24;
  readonly markerYLabelXOffset = -10;
  readonly markerYLabelYOffset = 3;
  readonly markerXLabelYOffset = 20;
  readonly tooltipYOffset = -20;

  private windowResize?: Rx.Subscription;
  private barMouseenter?: Rx.Subscription;
  private barMouseleave?: Rx.Subscription;

  @ViewChild('chart') chart: ElementRef;
  @ViewChild('chartTooltip') chartTooltip: ElementRef;
  @ViewChild(CdkPortal)
  portal: CdkPortal;

  private overlayRef?: OverlayRef;

  constructor(
    private timeUtils: TimeUtils,
    private overlay: Overlay,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnChanges() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.timeUtils.setTimeout(() => {
      const chart = this.chart.nativeElement as HTMLElement;
      this.deleteNodes(chart, chart.childElementCount);
      this.initializeChart();
    }, 0);
  }

  ngOnDestroy() {
    if (this.barMouseenter) {
      this.barMouseenter.unsubscribe();
    }

    if (this.barMouseleave) {
      this.barMouseleave.unsubscribe();
    }

    if (this.windowResize) {
      this.windowResize.unsubscribe();
    }
  }

  initializeChart() {
    if (this.chart && this.data) {
      const chart = this.chart.nativeElement as HTMLElement;
      this.drawChart(chart, this.data, this.barSpacing, this.gridScale);

      // relies on browser's window, cannot be SSR
      if (isPlatformBrowser(this.platformId)) {
        this.windowResize = Rx.fromEvent(window, 'resize')
          .pipe(debounceTime(500))
          .subscribe(() => {
            this.deleteNodes(chart, chart.childElementCount);
            this.drawChart(chart, this.data, this.barSpacing, this.gridScale);
          });
      }
    }
  }

  /*
   * Using any kind of loop will create an infinite adding/removing of nodes.
   * So we use recursive method to delete all nodes of the Chart.
   */
  deleteNodes(target: HTMLElement, targetCount: number): HTMLElement | void {
    if (target && target.childNodes && targetCount > 0) {
      const childIndex = targetCount - 1;
      this.renderer.removeChild(target, target.childNodes[childIndex]);
      return this.deleteNodes(target, targetCount - 1);
    }
  }

  getValues(data: ChartData[]) {
    const values = data.map((item: ChartData) => item.value);
    const minValue = Math.floor(Math.min.apply(null, values));
    const maxValue = Math.ceil(Math.max.apply(null, values));

    return { values, minValue, maxValue };
  }

  getCoordinates(data: ChartData[], chartWidth: number, chartHeight: number) {
    const { values, minValue, maxValue } = this.getValues(data);

    const yRatio = (maxValue - minValue) / chartHeight;
    const xRatio = chartWidth / values.length;

    return values.map((value, i) => {
      const y = yRatio !== 0 ? chartHeight - (value - minValue) / yRatio : 0;
      const x = xRatio * i;
      return { x, y };
    });
  }

  drawChart(
    chart: HTMLElement,
    data: ChartData[],
    barSpacing: number,
    gridScale: number,
  ) {
    const chartWidth = chart.clientWidth - this.chartPadding * 2;
    const chartHeight = chart.clientHeight - this.chartPadding * 2;

    this.drawGrids(chart, data, chartWidth, chartHeight, gridScale);
    this.drawBars(chart, data, chartWidth, chartHeight, barSpacing);
  }

  drawBars(
    chart: HTMLElement,
    data: ChartData[],
    chartWidth: number,
    chartHeight: number,
    barSpacing: number,
  ) {
    const { maxValue } = this.getValues(data);
    const actualChartWidth =
      chartWidth - (this.gridIndentation + this.chartPadding);
    const coordinates = this.getCoordinates(
      data,
      actualChartWidth,
      chartHeight,
    );
    const barWidth = actualChartWidth / data.length;
    let i = 0;

    coordinates.map(({ x, y }) => {
      const barXPos =
        x + this.gridIndentation + this.chartPadding + barSpacing / 2;
      const barYPos = maxValue === 0 ? chartHeight : y + this.chartPadding;
      const barActualWidth = barWidth - barSpacing;
      const barActualHeight = maxValue === 0 ? 0 : chartHeight - y;
      const markerXLabel = data[i].label;
      const markerXLabelXPos = barXPos + barActualWidth / 2;
      const markerXLabelYPos = chartHeight + this.chartPadding;

      this.drawBar(chart, barXPos, barYPos, barActualHeight, barActualWidth, i);
      this.drawMarkerX(
        chart,
        markerXLabelXPos,
        markerXLabelYPos,
        markerXLabel.toString(),
      );

      i++;
    });
  }

  drawBar(
    chart: HTMLElement,
    barXPos: number,
    barYPos: number,
    barActualHeight: number,
    barActualWidth: number,
    id: number,
  ) {
    const rect = this.renderer.createElement('rect', 'svg');

    this.renderer.setAttribute(rect, 'id', `bar-${id}`);
    this.renderer.setAttribute(rect, 'x', barXPos.toString());
    this.renderer.setAttribute(rect, 'y', barYPos.toString());
    this.renderer.setAttribute(rect, 'width', barActualWidth.toString());
    this.renderer.setAttribute(rect, 'height', barActualHeight.toString());

    this.barMouseenter = Rx.fromEvent(rect, 'mouseenter').subscribe(value =>
      this.showTooltip(value as MouseEvent),
    );

    this.barMouseleave = Rx.fromEvent(rect, 'mouseleave').subscribe(() =>
      this.hideTooltip(),
    );

    this.renderer.appendChild(chart, rect);
  }

  drawGrids(
    chart: HTMLElement,
    data: ChartData[],
    chartWidth: number,
    chartHeight: number,
    gridScale: number,
  ) {
    const maxValue = !this.getValues(data).maxValue
      ? this.defaultMaxValue
      : this.getValues(data).maxValue;
    const lineX1Pos = this.chartPadding + this.gridIndentation;
    const lineX2Pos = chartWidth;
    let gridValue = 0;

    while (gridValue <= maxValue) {
      const lineYPos =
        chartHeight * (1 - gridValue / maxValue) + this.chartPadding;

      if (gridValue > 0) {
        this.drawLine(chart, lineX1Pos, lineX2Pos, lineYPos);
        this.drawMarkerY(chart, lineX1Pos, lineYPos, gridValue.toString());
      }

      gridValue += gridScale;
    }
  }

  drawLine(
    chart: HTMLElement,
    lineX1Pos: number,
    lineX2Pos: number,
    lineYPos: number,
  ) {
    const line = this.renderer.createElement('line', 'svg');

    this.renderer.setAttribute(line, 'x1', lineX1Pos.toString());
    this.renderer.setAttribute(line, 'x2', lineX2Pos.toString());
    this.renderer.setAttribute(line, 'y1', lineYPos.toString());
    this.renderer.setAttribute(line, 'y2', lineYPos.toString());
    this.renderer.appendChild(chart, line);
  }

  drawMarkerY(
    chart: HTMLElement,
    markerXPos: number,
    markerYPos: number,
    label: string,
  ) {
    const markerActualXPos = markerXPos + this.markerYLabelXOffset;
    const markerActualYPos = markerYPos + this.markerYLabelYOffset;
    const markerLabel = `${label} ${this.markerYSuffix}`;

    this.drawMarker(
      chart,
      markerActualXPos,
      markerActualYPos,
      markerLabel,
      'end',
    );
  }

  drawMarkerX(
    chart: HTMLElement,
    markerXPos: number,
    markerYPos: number,
    label: string,
  ) {
    const markerActualXPos = markerXPos;
    const markerActualYPos = markerYPos + this.markerXLabelYOffset;
    const markerLabel = label;

    this.drawMarker(
      chart,
      markerActualXPos,
      markerActualYPos,
      markerLabel,
      'middle',
    );
  }

  drawMarker(
    chart: HTMLElement,
    markerXPos: number,
    markerYPos: number,
    label: string,
    textAnchor: string,
  ) {
    const marker = this.renderer.createElement('text', 'svg');
    const text = this.renderer.createText(label);
    this.renderer.appendChild(marker, text);

    this.renderer.setAttribute(marker, 'x', markerXPos.toString());
    this.renderer.setAttribute(marker, 'y', markerYPos.toString());
    this.renderer.setAttribute(marker, 'text-anchor', textAnchor);
    this.renderer.appendChild(chart, marker);
  }

  showTooltip(event: MouseEvent) {
    const overlayConfig = this.setTooltipConfig(event);

    this.overlayRef = this.overlay.create(overlayConfig);
    this.overlayRef.attach(this.portal);
  }

  setTooltipConfig(event: MouseEvent) {
    if (event && event.target) {
      const positionStrategy = this.overlay
        .position()
        .flexibleConnectedTo(event)
        .withPositions([
          {
            originX: 'center',
            originY: 'top',
            overlayX: 'center',
            overlayY: 'bottom',
          },
        ])
        .withDefaultOffsetY(this.tooltipYOffset);

      const overlayConfig = new OverlayConfig({ positionStrategy });

      return overlayConfig;
    }
  }

  hideTooltip() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = undefined;
    }
  }
}
