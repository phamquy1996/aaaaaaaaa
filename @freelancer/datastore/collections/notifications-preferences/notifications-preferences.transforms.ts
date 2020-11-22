import { NotificationsPreferenceEntryAjax } from './notifications-preferences.backend-model';
import { NotificationsPreferenceEntry } from './notifications-preferences.model';

export function transformNotificationsPreferences(
  setting: NotificationsPreferenceEntryAjax,
): NotificationsPreferenceEntry {
  return {
    id: setting.channel,
    channel: setting.channel,
    name: setting.name,
    order: setting.order,
    enabled: setting.enabled,
    notify: setting.notify,
    header: setting.header,
    notificationType: setting.notificationType,
  };
}
