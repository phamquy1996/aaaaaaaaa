export type MessageEventFilter = (event: MessageEvent) => boolean;

export enum InterframeDepositResponseType {
  SUCCESS = 'success',
  PENDING = 'pending',
  CANCELLED = 'cancel',
  FAILURE = 'failure',
  ERROR = 'error',
  ERROR_DETAILED = 'error_detailed',
  ERROR_BIN = 'binError',
  ERROR_CART = 'cartError',
  ERROR_AUTH = 'authError',
  BAD_BIN = 'badBinError',
}

export const methodSelectionRadioControl = 'RadioControl';

export enum DepositForm {
  NATIVE_CHARGE_TOGGLE = 'nativeChargeToggleFormControl',
  CONFIRMATION = 'confirmationFormGroup',
  RADIO = 'methodSelectionFormGroup',
  METHODS = 'methodsFormGroup',
}
