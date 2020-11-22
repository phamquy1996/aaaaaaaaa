import { Domain } from './domains.model';

export function generateDomainObject(): Domain {
  return {
    id: 62,
    domainName: 'localhost',
    region: 'North America',
    flagBig: 'us-big.png',
    flagSmall: 'us.png',
    info: 'Go to localhost',
    infoSelected: 'Stay in localhost',
    name: 'Local Development Server',
    pattern: '/localhost$/',
    sequence: 0,
    shortName: 'usa',
    url: 'https://www.syd1.fln-dev.net/dashboard?w=t&webapp_local',
  };
}
