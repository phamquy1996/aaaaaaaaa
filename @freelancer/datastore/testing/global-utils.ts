import { AuthServiceInterface } from '@freelancer/auth';
import { DatastoreFake } from './datastore';
import { DatastoreFakeConfig } from './datastore.config';

/** Make datastore methods available in the browser */
export function publishGlobalUtils(
  auth: AuthServiceInterface,
  datastore: DatastoreFake,
  config: DatastoreFakeConfig,
) {
  if (config.documentCreators) {
    putObjectsOnWindow({
      datastore: {
        collection: datastore.collection.bind(datastore),
        document: datastore.document.bind(datastore),
        createDocument: datastore.createDocument.bind(datastore),
      },
      ...config.documentCreators,
    });
  }
}

function putObjectsOnWindow(object: object) {
  Object.entries(object)
    /**
     * We'd like to only export the document creation functions
     * (the factories and their mixins).
     * The easiest way to approximate this is to export all the collections
     * and filter out obvious things that we don't want.
     */
    .filter(([name]) => !/^[A-Z]/.test(name)) // Type names
    .filter(([name]) => !name.startsWith('_')) // Private things
    .filter(([name]) => !name.startsWith('transform')) // transformers
    .filter(([name]) => !name.startsWith('generate')) // generate functions (use create instead)
    .filter(([name]) => !name.endsWith('Module')) // Probably caught by the type names filter

    .forEach(([name, fn]) => {
      (window as any)[name] = fn;
    });
}
