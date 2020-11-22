import { DatastoreFakeConfig } from './datastore.config';

let debugEnabled = false;

export function debugConsoleLog(
  config: DatastoreFakeConfig,
  message?: unknown,
  ...optionalParams: unknown[]
) {
  if (config.debug || debugEnabled) {
    console.log(message, ...optionalParams);
  }
}

export function debugConsoleWarn(
  config: DatastoreFakeConfig,
  message?: unknown,
  ...optionalParams: unknown[]
) {
  if (config.debug || debugEnabled) {
    console.warn(message, ...optionalParams);
  }
}

export function isDebugMode() {
  return debugEnabled;
}

/** @deprecated For test development only */
export function enableDebugMode() {
  debugEnabled = true;
}
