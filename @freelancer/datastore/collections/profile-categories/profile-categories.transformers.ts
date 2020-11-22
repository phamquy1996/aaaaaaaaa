import { ProfileCategoryApi } from 'api-typings/users/users';
import { ProfileCategory } from './profile-categories.model';

export function transformProfileCategory(
  profileCategory: ProfileCategoryApi,
): ProfileCategory {
  // Ignoring as we don't need for now:
  // - profileCategory.portfolio_items
  // - profileCategory.skills

  // These fields are always set in database but optional in thrift definitions
  if (profileCategory.id === undefined) {
    throw new Error('`id` is not defined for profile category');
  }
  if (profileCategory.user_id === undefined) {
    throw new Error('`user_id` is not defined for profile category');
  }
  if (profileCategory.name === undefined) {
    throw new Error('`name` is not defined for profile category');
  }
  if (profileCategory.last_updated === undefined) {
    throw new Error('`last_updated` is not defined for profile category');
  }
  if (profileCategory.position === undefined) {
    throw new Error('`position` is not defined for profile category');
  }

  return {
    id: profileCategory.id,
    userId: profileCategory.user_id,
    name: profileCategory.name,
    lastUpdated: profileCategory.last_updated * 1000,
    position: profileCategory.position,
    portfolioItemsCount: profileCategory.portfolio_items_count || 0,
  };
}
