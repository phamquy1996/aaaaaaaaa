import { Category } from '@freelancer/datastore/collections';

export enum SkillsButtonType {
  NEXT = 'next',
  SAVE = 'save',
}

const DEFAULT_ICON = 'ui-blocks';

const JOB_CATEGORY_ICON_MAP = new Map([
  [1, 'ui-computer-outline'], // Websites, IT & Software
  [2, 'ui-pentool'], // Writing & Content
  [3, 'ui-penbrush'], // Design, Media & Architecture
  [4, 'ui-keyboard'], // Data Entry & Admin
  [5, 'ui-beaker'], // Engineering & Science
  [6, 'ui-graph-increase'], // Sales & Marketing
  [7, 'ui-bank-v2'], // Business, Accounting, Human Resources & Legal
  [8, 'ui-factory'], // Product Sourcing & Manufacturing
  [9, 'ui-devices-v2'], // Mobile Phones & Computing
  [10, 'ui-chat-square-v2'], // Translation & Languages
  [12, 'ui-paintbrush'], // Local Jobs & Services
  [99, 'ui-show-more-h'], // Other
  [100, 'ui-truck'], // Freight, Shipping & Transportation
]);

/**
 * Gets the correct icon for each category from the category mappings.
 * @param category Category to get icon for.
 */
export function getSkillCategoryIcon(category: Category): string {
  return JOB_CATEGORY_ICON_MAP.get(category.id) || DEFAULT_ICON;
}
