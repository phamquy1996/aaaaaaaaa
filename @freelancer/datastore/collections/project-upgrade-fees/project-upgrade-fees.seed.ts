import { assertNever } from '@freelancer/utils';
import {
  CurrencyCode,
  generateCurrencyObject,
} from '../currencies/currencies.seed';
import { ProjectUpgradeFees } from './project-upgrade-fees.model';

export interface GenerateProjectUpgradeFeesOptions {
  readonly projectId?: number;
  readonly currencyCodes?: ReadonlyArray<CurrencyCode.USD | CurrencyCode.AUD>;
}

export function generateProjectUpgradeFeeObjects({
  projectId,
  currencyCodes = [CurrencyCode.USD],
}: GenerateProjectUpgradeFeesOptions = {}): ReadonlyArray<ProjectUpgradeFees> {
  return currencyCodes.map(code => {
    const currency = generateCurrencyObject(code);
    const id = projectId ? `${currency.id}_${projectId}` : `${currency.id}`;
    switch (code) {
      case CurrencyCode.USD:
        return {
          id,
          assistedPrice: 9.5,
          assistedFullPrice: 19,
          deletePrice: 5,
          extendPrice: 9,
          featuredPrice: 9,
          freeAssisted: false,
          freeExtend: true,
          freeNda: false,
          freePfOnly: false,
          freeSealed: false,
          freePrivate: false,
          freeUrgent: false,
          freeFeatured: false,
          freeIpContract: false,
          fulltimeCommissionThreshold: 5000,
          fulltimePrice: 199,
          ipContractPrice: 19,
          isTaxIncluded: false,
          ndaPrice: 19,
          nonCompetePrice: 29,
          nonPublicPrice: 19,
          pfOnlyPrice: 9,
          projectManagementPrice: 25,
          sealedPrice: 9,
          successBundlePrice: 23.9,
          urgentPrice: 9,
          currency,
          currencyId: currency.id,
        };

      case CurrencyCode.AUD:
        return {
          id,
          assistedPrice: 9.5,
          assistedFullPrice: 19,
          deletePrice: 5,
          extendPrice: 9,
          featuredPrice: 9,
          freeAssisted: false,
          freeExtend: true,
          freeNda: false,
          freePfOnly: false,
          freeSealed: false,
          freePrivate: false,
          freeUrgent: false,
          freeFeatured: false,
          freeIpContract: false,
          fulltimeCommissionThreshold: 4700,
          fulltimePrice: 199,
          ipContractPrice: 19,
          isTaxIncluded: false,
          ndaPrice: 19,
          nonCompetePrice: 40,
          nonPublicPrice: 19,
          pfOnlyPrice: 9,
          projectManagementPrice: 30,
          sealedPrice: 9,
          successBundlePrice: 29,
          urgentPrice: 9,
          currency,
          currencyId: currency.id,
        };
      default:
        return assertNever(code);
    }
  });
}
