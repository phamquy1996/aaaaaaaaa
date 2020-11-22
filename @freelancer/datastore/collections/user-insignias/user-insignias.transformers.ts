import { toNumber } from '@freelancer/utils';
import { InsigniaAjax } from './user-insignias.backend-model';
import { UserInsignias } from './user-insignias.model';

export function transformUserInsignias(insignia: InsigniaAjax): UserInsignias {
  return {
    id: `${insignia.userId}-${insignia.insigniaId}`,
    userId: toNumber(insignia.userId),
    insigniaId: toNumber(insignia.insigniaId),
    name: insignia.name,
    description: insignia.description,
  };
}
