import { PackageApi } from 'api-typings/memberships/memberships_types';
import { Package } from '../recommended-membership/recommended-membership.model';
import {
  transformMembershipPackageBenefit,
  transformMembershipPackagePrice,
} from '../recommended-membership/recommended-membership.transformers';

export function transformMembershipPackage(packageApi: PackageApi): Package {
  return {
    id: packageApi.id,
    internalName: packageApi.internal_name,
    displayName: packageApi.display_name,
    enabled: packageApi.enabled,
    categoryId: packageApi.category_id,
    order: packageApi.order,
    benefits:
      packageApi.benefits &&
      packageApi.benefits.map(benefit =>
        transformMembershipPackageBenefit(benefit),
      ),
    prices:
      packageApi.prices &&
      packageApi.prices.map(price => transformMembershipPackagePrice(price)),
  };
}
