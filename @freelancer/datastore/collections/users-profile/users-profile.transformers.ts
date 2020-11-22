import { RecursivePartial } from '@freelancer/datastore/core';
import { LocationApi } from 'api-typings/common/common';
import { UserApi } from 'api-typings/users/users';
import { isCountry } from '../countries/countries.model';
import { transformCurrency } from '../currencies/currencies.transformers';
import { Location } from '../project-view-users/location.model';
import { transformUsersSelf } from '../users-self/users-self.transformers';
import { transformLocation } from '../users/users-location.transformers';
import { transformUserImage } from '../users/users.transformers';
import { UsersProfile } from './users-profile.model';

export function transformUsersProfile(user: UserApi): UsersProfile {
  if (!user.primary_currency) {
    throw new ReferenceError('User without primary currency!');
  }

  const userProfile = {
    ...transformUsersSelf(user),
    avatar: user.avatar_cdn && transformUserImage(user.avatar_cdn),
    avatarLarge:
      user.avatar_large_cdn && transformUserImage(user.avatar_large_cdn),
    location: user.location ? transformLocation(user.location) : undefined,
    primaryCurrency: transformCurrency(user.primary_currency),
    profileDescription: user.profile_description,
    tagline: user.tagline,
    searchLanguages: user.search_languages || [],
    hourlyRate: user.hourly_rate,
  };

  return {
    ...userProfile,
    // computed field
    biddingProfileCompleted: isBiddingProfileCompleted(userProfile),
  };
}

export function transformLocationToLocationApi(
  location: RecursivePartial<Location>,
): LocationApi {
  const { country } = location;

  if (!country || !isCountry(country)) {
    throw new ReferenceError(`Missing a required location field.`);
  }

  return {
    full_address: location.fullAddress,
    vicinity: location.vicinity,
    country,
    longitude: location.mapCoordinates
      ? location.mapCoordinates.longitude
      : undefined,
    latitude: location.mapCoordinates
      ? location.mapCoordinates.latitude
      : undefined,
    administrative_area: location.administrativeArea,
    city: location.city,
  };
}

export function isBiddingProfileCompleted({
  firstName,
  lastName,
  profileDescription,
  tagline,
  avatar,
  avatarLarge,
  searchLanguages,
  hourlyRate,
}: Partial<UsersProfile>): boolean {
  return (
    !!firstName &&
    !!lastName &&
    !!profileDescription &&
    !!tagline &&
    // In old PVP we only check `large avatar`
    // however, profile upload endpoint only return `avatar` url
    // so we need to check avatar OR avatarLarge for now.
    // will remove the avatarCDN if we fixed T107000
    ((!!avatar && !!transformUserImage(avatar)) ||
      (!!avatarLarge && !!transformUserImage(avatarLarge))) &&
    !!searchLanguages &&
    !!searchLanguages.length &&
    !!hourlyRate
  );
}
