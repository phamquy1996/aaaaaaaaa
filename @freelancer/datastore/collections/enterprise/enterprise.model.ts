import { PoolApi } from 'api-typings/common/common';

/**
 * This enum only contains enterprises that used in Webapp
 * This is a temporary solution will get it from backend in T153666
 */
export enum Enterprise {
  DELOITTE_DC = 1,
  ARROW = 2,
  FACEBOOK = 3,
  PMI = 4,
  FLNLTD = 5,
  YARA = 7,
}

/**
 * Pool IDs
 * This is a temporary solution will get it from backend in T214768
 */
export enum Pool {
  FREELANCER = 1,
  DELOITTE_DC = 2,
  ARROW_PRIVATE = 3,
  FACEBOOK = 4,
  API_E2E = 5,
  FLNLTD = 6,
  NOKIA = 7,
  JOHNSON_AND_JOHNSON = 8,
  IBM = 9,
  FREIGHTLANCER = 10,
}

/**
 * Converts an integer Pool ID to the corresponding string.
 * This is a temporary solution until we deprecate Pool enums entirely T214768
 */
export const POOL_ID_TO_POOL_API_MAP: {
  readonly [k in Pool]: PoolApi;
} = {
  [Pool.FREELANCER]: PoolApi.FREELANCER,
  [Pool.DELOITTE_DC]: PoolApi.DELOITTE_DC,
  [Pool.ARROW_PRIVATE]: PoolApi.ARROW_PRIVATE,
  [Pool.FACEBOOK]: PoolApi.FACEBOOK,
  [Pool.API_E2E]: PoolApi.API_E2E,
  [Pool.FLNLTD]: PoolApi.FLNLTD,
  [Pool.NOKIA]: PoolApi.NOKIA,
  [Pool.JOHNSON_AND_JOHNSON]: PoolApi.JOHNSON_AND_JOHNSON,
  [Pool.IBM]: PoolApi.IBM,
  [Pool.FREIGHTLANCER]: PoolApi.FREIGHTLANCER,
};
