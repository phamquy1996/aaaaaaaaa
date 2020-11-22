import { CertificationApi } from 'api-typings/users/users';
import { Certification } from './certifications.model';

export function transformCertification(
  certification: CertificationApi,
): Certification {
  return {
    id: certification.id,
    userId: certification.user_id,
    certificate: certification.certificate,
    organization: certification.organization,
    description: certification.description,
    awardedDate: certification.awarded_date * 1000,
  };
}
