import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { UsersProfileImageCollection } from './users-profile-image.types';

export function usersProfileImageBackend(): Backend<
  UsersProfileImageCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query) => ({
      endpoint: 'users/0.1/self/profile_picture',
      isGaf: false,
      params: {},
    }),
    update: (authUid, delta, original) => {
      const { cropParams } = delta;

      if (!cropParams) {
        throw new Error(
          'You must pass in crop parameters to update users profile image',
        );
      }

      if (
        cropParams.height === undefined ||
        cropParams.width === undefined ||
        cropParams.x === undefined ||
        cropParams.y === undefined
      ) {
        throw new Error(
          'Each crop parameter must be set to update the profile image.',
        );
      }

      const originalCropParams = original.cropParams;
      if (
        originalCropParams &&
        cropParams.height === originalCropParams.height &&
        cropParams.width === originalCropParams.width &&
        cropParams.x === originalCropParams.x &&
        cropParams.y === originalCropParams.y
      ) {
        throw new Error(
          'You cannot update the image meta with the same crop params',
        );
      }

      return {
        endpoint: `users/0.1/self/profile_picture/meta`,
        method: 'PUT',
        payload: {
          height: cropParams.height,
          width: cropParams.width,
          x: cropParams.x,
          y: cropParams.y,
        },
      };
    },
    push: undefined,
    set: undefined,
    remove: undefined,
  };
}
