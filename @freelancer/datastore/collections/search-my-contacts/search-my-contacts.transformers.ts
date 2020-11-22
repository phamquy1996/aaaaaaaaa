import { toNumber } from '@freelancer/utils';
import { SearchMyContactsEntryAjax } from './search-my-contacts.backend-model';
import { SearchMyContactsEntry } from './search-my-contacts.model';

function handleProfileImageUnknowns(url: string) {
  return url.includes('img/unknown.png') ? undefined : url;
}

function getFlagCodeFromFlagIcon(url: string) {
  return (url.match(/img\/flags\/png\/(\w+)\.png/) || [])[1] || '';
}

export function transformSearchMyContacts(
  item: SearchMyContactsEntryAjax,
): SearchMyContactsEntry {
  return {
    flagIcon: item.flag_icon,
    flagCode: getFlagCodeFromFlagIcon(item.flag_icon),
    flagName: item.flag_name || undefined,
    id: toNumber(item.id),
    jobList: item.jobList,
    logoUrl: handleProfileImageUnknowns(item.logo_url),
    avatar: handleProfileImageUnknowns(item.profile_logo_url),
    publicName: item.public_name,
    reputation: item.reputation,
    username: item.username,
    won: toNumber(item.won),
  };
}
