import { generateSkills } from '../project-view-users/project-view-users.seed';
import { Skill } from '../skills/skills.model';
import { NotificationsPreferenceEntry } from './notifications-preferences.model';

export interface GenerateNotificationPreferenceObjectsOptions {
  readonly skills?: ReadonlyArray<Skill>;
}

export function generateNotificationPreferenceObjects({
  skills = generateSkills(),
}: GenerateNotificationPreferenceObjectsOptions): ReadonlyArray<
  NotificationsPreferenceEntry
> {
  return [
    {
      id: 'popups',
      channel: 'popups',
      name: 'Show pop-ups',
      order: 0,
      enabled: true,
      notify: true,
      notificationType: 'both',
    },
    {
      id: 'openInNewWindow',
      channel: 'openInNewWindow',
      name: 'Open links in new window',
      order: 1,
      enabled: false,
      notify: true,
      notificationType: 'both',
    },
    {
      id: 'chat_sound',
      channel: 'chat_sound',
      name: 'Play Chat Sound',
      order: 2,
      enabled: true,
      notify: false,
      notificationType: 'messages',
    },
    {
      id: 'bids',
      channel: 'bids',
      name: 'New Bids',
      order: 3,
      enabled: false,
      notify: true,
      notificationType: 'notification',
    },
    {
      id: 'contests',
      channel: 'contests',
      name: 'New Contests',
      order: 4,
      enabled: true,
      notify: true,
      notificationType: 'live',
    },
    {
      id: 'contestEntrys',
      channel: 'contestEntrys',
      name: 'New Entries',
      order: 5,
      enabled: true,
      notify: true,
      notificationType: 'notification',
    },

    ...skills.map(
      (skill, index) =>
        ({
          id: `job_${skill.id}`,
          channel: `job_${skill.id}`,
          name: skill.name,
          order: 6 + index,
          enabled: true,
          notify: true,
          header: { name: 'projects', title: 'New Projects', expanded: true },
          notificationType: 'live',
        } as const),
    ),
  ];
}
