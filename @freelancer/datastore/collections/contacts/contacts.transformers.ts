import { isDefined } from '@freelancer/utils';
import { ContactApi } from 'api-typings/contacts/contacts';
import { transformBaseUser } from '../users/users.transformers';
import { Contact } from './contacts.model';

export function transformContact(contact: ContactApi): Contact {
  const weights = contact.relationships
    ? Object.values(contact.relationships)
        .filter(isDefined)
        .map(relationship => relationship.weight)
        .filter(isDefined)
    : [];

  return {
    ...transformBaseUser(contact.user),
    maxWeight: Math.max(0, ...weights),
  };
}
