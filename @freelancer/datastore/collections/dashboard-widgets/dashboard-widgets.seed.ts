import {
  DashboardWidget,
  DashboardWidgetType,
} from './dashboard-widgets.model';

export interface GenerateDashboardWidgetOptions {
  readonly type: DashboardWidgetType;
  readonly order?: number;
}

let orderCounter = 0;
export function generateDashboardWidgetObject({
  type,
  order,
}: GenerateDashboardWidgetOptions): DashboardWidget {
  if (!order) {
    orderCounter += 1;
  }

  return {
    id: type,
    order: order ?? orderCounter,
  };
}

export interface GenerateDashboardWidgetsOptions {
  readonly types?: ReadonlyArray<DashboardWidgetType>;
}

export function generateDashboardWidgetObjects({
  types = [DashboardWidgetType.MY_PROFILE, DashboardWidgetType.POLLS],
}: GenerateDashboardWidgetsOptions): ReadonlyArray<DashboardWidget> {
  return types.map((type, i) =>
    generateDashboardWidgetObject({ type, order: i }),
  );
}
