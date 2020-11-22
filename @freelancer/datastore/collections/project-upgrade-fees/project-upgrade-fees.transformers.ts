import { ProjectUpgradeFeesApi } from 'api-typings/projects/projects';
import { transformCurrency } from '../currencies/currencies.transformers';
import { ProjectUpgradeFees } from './project-upgrade-fees.model';

export function transformProjectUpgradeFees(
  projectUpgradeFees: ProjectUpgradeFeesApi,
  projectId?: number,
): ProjectUpgradeFees {
  if (
    !projectUpgradeFees.currency ||
    projectUpgradeFees.assisted_price === undefined ||
    projectUpgradeFees.featured_price === undefined ||
    projectUpgradeFees.urgent_price === undefined ||
    projectUpgradeFees.nonpublic_price === undefined ||
    projectUpgradeFees.is_tax_included === undefined ||
    projectUpgradeFees.extend_price === undefined ||
    projectUpgradeFees.fulltime_price === undefined ||
    projectUpgradeFees.ip_contract_price === undefined ||
    projectUpgradeFees.nda_price === undefined ||
    projectUpgradeFees.pf_only_price === undefined ||
    projectUpgradeFees.project_management_price === undefined ||
    projectUpgradeFees.sealed_price === undefined ||
    projectUpgradeFees.success_bundle_price === undefined
  ) {
    throw new ReferenceError(`Missing a required project upgrade fees field.`);
  }

  const currencyId = projectUpgradeFees.currency.id;

  return {
    // There is no ID but some project fees are specific to projects so we
    // make the ID unique here for the Datastore to support that.
    id: projectId ? `${currencyId}_${projectId}` : `${currencyId}`,
    assistedPrice: projectUpgradeFees.assisted_price,
    // T47604 - Promotion for 50% off Recruiter upgrade
    assistedFullPrice: projectUpgradeFees.assisted_price * 2,
    deletePrice: projectUpgradeFees.delete_price,
    extendPrice: projectUpgradeFees.extend_price,
    featuredPrice: projectUpgradeFees.featured_price,
    fulltimeCommissionThreshold:
      projectUpgradeFees.fulltime_commission_threshold,
    fulltimePrice: projectUpgradeFees.fulltime_price,
    ipContractPrice: projectUpgradeFees.ip_contract_price,
    isTaxIncluded: projectUpgradeFees.is_tax_included,
    ndaPrice: projectUpgradeFees.nda_price,
    nonCompetePrice: projectUpgradeFees.non_compete_price,
    nonPublicPrice: projectUpgradeFees.nonpublic_price,
    pfOnlyPrice: projectUpgradeFees.pf_only_price,
    projectManagementPrice: projectUpgradeFees.project_management_price,
    sealedPrice: projectUpgradeFees.sealed_price,
    successBundlePrice: projectUpgradeFees.success_bundle_price,
    urgentPrice: projectUpgradeFees.urgent_price,
    currency: transformCurrency(projectUpgradeFees.currency),
    currencyId,
    projectId,
    taxType: projectUpgradeFees.tax_type,
    freeFeaturedCouponId: projectUpgradeFees.free_featured_coupon_id,
    freeAssisted: projectUpgradeFees.free_assisted || false,
    freeExtend: projectUpgradeFees.free_extend || false,
    freeNda: projectUpgradeFees.free_nda || false,
    freePfOnly: projectUpgradeFees.free_pf_only || false,
    freeSealed: projectUpgradeFees.free_sealed || false,
    freePrivate: projectUpgradeFees.free_private || false,
    freeUrgent: projectUpgradeFees.free_urgent || false,
    freeFeatured: projectUpgradeFees.free_featured || false,
    freeIpContract: projectUpgradeFees.free_ip_contract || false,
  };
}
