import { AcademyPriceTierAjax } from './academy-price-tiers.backend-model';
import { AcademyPriceTier } from './academy-price-tiers.model';

export function transformAcademyPriceTier(
  priceTier: AcademyPriceTierAjax,
): AcademyPriceTier {
  return {
    id: priceTier.id,
    code: priceTier.code,
    display: priceTier.display,
    price: {
      currency: {
        id: priceTier.currency_id,
        code: priceTier.currency_code,
        sign: priceTier.currency_sign,
      },
      amount: priceTier.amount,
    },
  };
}
