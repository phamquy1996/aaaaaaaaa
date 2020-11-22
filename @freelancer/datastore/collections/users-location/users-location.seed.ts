import { Location } from '../project-view-users/location.model';
import { LocationPreset } from '../project-view-users/location.seed';
import { projectViewUserLocations } from '../project-view-users/project-view-users.seed';
import { UsersLocation } from './users-location.model';

export interface GenerateUsersLocationOptions {
  readonly userId: number;
  readonly location?: Location;
}

export function generateUsersLocationObject({
  location = projectViewUserLocations[LocationPreset.SEATTLE],
  userId,
}: GenerateUsersLocationOptions): UsersLocation {
  return {
    id: userId,
    location,
  };
}
