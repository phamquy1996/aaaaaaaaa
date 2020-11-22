import { SearchFreelancersEntryAjax } from './search-freelancers.backend-model';
import { SearchFreelancersEntry } from './search-freelancers.model';

function handleUrlImageUnknowns(url: string): string | undefined {
  return url.includes('img/unknown.png') ? undefined : url;
}

function getFlagCodeFromFlagIcon(url: string): string | undefined {
  return (url.match(/img\/flags\/png\/(\w+)\.png/) || [])[1] || undefined;
}

export function transformSearchFreelancer(
  freelancer: SearchFreelancersEntryAjax,
): SearchFreelancersEntry {
  return {
    completion: freelancer.completion,
    flagIcon: handleUrlImageUnknowns(freelancer.flag_icon),
    flagCode: getFlagCodeFromFlagIcon(freelancer.flag_icon),
    flagName: freelancer.flag_name || undefined,
    id: freelancer.id,
    jobList: freelancer.jobList,
    avatar: handleUrlImageUnknowns(freelancer.profile_logo_url),
    publicName: freelancer.public_name,
    reputation: freelancer.reputation,
    reviews: freelancer.reviews,
    username: freelancer.username,
  };
}
