import { generateId } from '@freelancer/datastore/testing';
import { AddressApi } from 'api-typings/common/common';
import { DateOfBirthApi } from 'api-typings/users/users';
import { Location } from '../project-view-users/location.model';
import { generateLocationObject } from '../project-view-users/location.seed';
import { generateUserSelfObject } from '../users-self/users-self.seed';
import { generateAvatar } from '../users/users.seed';
import { UsersProfile } from './users-profile.model';
import { isBiddingProfileCompleted } from './users-profile.transformers';

export interface GenerateUsersProfileOptions {
  readonly userId?: number;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly address?: AddressApi;
  readonly dateOfBirth?: DateOfBirthApi;
  readonly profileDescription?: string;
  readonly tagline?: string;
  readonly location?: Location;
  readonly hourlyRate?: number;
  readonly searchLanguages?: ReadonlyArray<string>;
  readonly avatar?: string;
  readonly avatarLarge?: string;
}

export function generateUserProfileObject({
  userId = generateId(),
  firstName,
  lastName,
  address,
  dateOfBirth,
  profileDescription,
  tagline,
  hourlyRate,
  searchLanguages = [],
  location = generateLocationObject(),
  avatar,
  avatarLarge,
}: GenerateUsersProfileOptions): UsersProfile {
  const userProfile: Omit<UsersProfile, 'biddingProfileCompleted'> = {
    ...generateUserSelfObject({
      userId,
      firstName,
      lastName,
      address,
      dateOfBirth,
    }),
    profileDescription,
    tagline,
    location,
    hourlyRate,
    searchLanguages, // TODO: these seem to be ISO 639 codes from the `language` table?
    avatar,
    avatarLarge,
  };

  return {
    ...userProfile,
    biddingProfileCompleted: isBiddingProfileCompleted(userProfile), // computed
  };
}

/**
 * The fields required to make a UserProfile complete for bidding purposes.
 * See `isBiddingProfileComplete` in the transformer.
 *
 * Mix this object in to allow the user to bid on projects.
 */
export function biddingCompleteUserProfile({
  firstName = 'Test',
  lastName = 'Name',
  profileDescription = 'This is a profile description.',
  tagline = 'I am me.',
  hourlyRate = 20,
  searchLanguages = ['en'],
}: Partial<UsersProfile> = {}): Pick<
  GenerateUsersProfileOptions,
  | 'firstName'
  | 'lastName'
  | 'profileDescription'
  | 'tagline'
  | 'hourlyRate'
  | 'searchLanguages'
  | 'avatar'
  | 'avatarLarge'
> {
  const id = generateId();

  // firstName and lastName are duplicated in `userSelf`, so may be overwritten
  return {
    firstName,
    lastName,
    profileDescription,
    tagline,
    hourlyRate,
    searchLanguages,
    avatar: generateAvatar(id),
    avatarLarge: generateAvatar(id, 280),
  };
}
