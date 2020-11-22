export * from './showcase.model';
export * from './showcase.module';
export * from './showcase.types';
// FIXME: This should be part of the transformation, not part of the application code
export { getSlugFromName as _getSlugFromName } from './showcase.transformers';
