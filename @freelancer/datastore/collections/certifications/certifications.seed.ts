import { generateId } from '@freelancer/datastore/testing';
import { Certification } from './certifications.model';

export interface GenerateCertificationOptions {
  readonly userId: number;
  readonly certificate?: string;
  readonly organization?: string;
  readonly description?: string;
  readonly awardedDate?: number;
}

export function generateCertificationObject({
  userId,
  certificate = 'Webby Winner',
  organization = 'Webby',
  description = 'In recognition of excellence in web design.',
  awardedDate = new Date(2018, 0).getTime(),
}: GenerateCertificationOptions): Certification {
  return {
    id: generateId(),
    userId,
    certificate,
    organization,
    description,
    awardedDate,
  };
}
