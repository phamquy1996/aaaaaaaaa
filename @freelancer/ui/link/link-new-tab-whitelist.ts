/**
 * Match specific file types under directory starting with 'assets'
 */
const internalFiles = new RegExp(/^[/]?assets[-\w]*[/\w-]*(?:.pdf|.json)+$/);

/**
 * Forces links matching regex to open in a new tab
 */
export const LINK_NEW_TAB_REGEXP_WHITELIST: ReadonlyArray<RegExp> = [
  internalFiles,
];

export interface LinkTargetWhitelist {
  destination: string;
  source?: string; // when defined, usage must match both source and destination
}

/**
 * Forces internal links to open in a new tab
 */
export const LINK_NEW_TAB_WHITELIST: ReadonlyArray<LinkTargetWhitelist> = [
  // Bits button-link story
  {
    source: '/components/button/button-link',
    destination: '/components',
  },
  // Bits link story
  {
    source: '/components/link/default',
    destination: '/components/button',
  },
  {
    destination: '/contest/print-contest-invoice.php',
  },
  {
    destination: '/contest/nda_print.php',
  },
  {
    destination: '/users/kyc/kycKeycodePage.php',
  },
  {
    destination: '/NDA/NDAcreator.php',
  },
  {
    destination: '/NDA/NDA-print-contract.php',
  },
  {
    destination: '/ajax/project/contract/download-ip-contract.php',
  },
  {
    destination: '/ajax/project/contract/initialize-nda-contract.php',
  },
  {
    destination: '/ajax/project/contract/initialize-freelancer-ip-contract.php',
  },
  {
    destination: '/ajax/project/contract/preview-ip-contract.php',
  },
  {
    destination: '/ajax/project/contract/download-contract.php',
  },
];

/**
 * Forces external links to open in a same tab
 */
export const LINK_SAME_TAB_WHITELIST: ReadonlyArray<LinkTargetWhitelist> = [];
