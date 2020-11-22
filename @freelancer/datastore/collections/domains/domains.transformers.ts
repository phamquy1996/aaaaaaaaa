import { DomainAjax } from './domains.backend-model';
import { Domain } from './domains.model';

export function transformDomain(domain: DomainAjax): Domain {
  return {
    id: domain.id,
    domainName: domain.domain_name,
    region: domain.domain_switcher_region_name,
    flagBig: domain.flag_big,
    flagSmall: domain.flag_small,
    info: domain.info,
    infoSelected: domain.info_selected,
    name: domain.name,
    pattern: domain.pattern,
    sequence: domain.sequence,
    shortName: domain.short_name,
    url: domain.url,
  };
}
