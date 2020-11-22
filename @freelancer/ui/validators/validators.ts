import {
  AbstractControl,
  AsyncValidatorFn,
  FormArray,
  FormControl,
  FormGroup,
  ValidatorFn,
} from '@angular/forms';
import {
  DocumentFileType,
  ImageFileType,
  VideoFileType,
} from '@freelancer/ui/helpers';
import * as Rx from 'rxjs';
import { map, take } from 'rxjs/operators';

export const validUsernameRegex = /^[a-z][a-z0-9]{2,15}$/i;

export const validEmailRegex = new RegExp(
  `^(([^<>()\\[\\]\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$`,
);

export const containsContactDetailsRegex = new RegExp(
  [
    /([\w\-+!#%*=?^{}|~]+(?:\.[\w\-+!#%*=?^{}|~]+)*)/,
    /@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,10}(?:\.[a-z]{2})?)/i,
  ]
    .map(r => r.source)
    .join(''),
  'i',
);

/**
 * Only use this with datepicker inputs
 * This will pass validation if the value is undefined or null, etc.
 * If your control is required, please use the `required` validator.
 */
export const dateFormat = (errorText: string): ValidatorFn => (
  control: AbstractControl,
): { [key: string]: any } | null => {
  if (
    control.value === null ||
    control.value === '' ||
    control.value === undefined
  ) {
    return null;
  }

  if (typeof control.value === 'number') {
    // ignore timestamps because it can be confusing UX.
    return { DATE_FORMAT_ERROR: errorText };
  }

  // control.value should already be a date thanks to Material
  const date = new Date(control.value);
  return Number.isNaN(date.getTime()) ? { DATE_FORMAT_ERROR: errorText } : null;
};

export const dateRangeFormat = (errorText: string): ValidatorFn => (
  control: AbstractControl,
): { [key: string]: any } | null => {
  if (typeof control.value === 'number' || control.value === null) {
    return { DATE_RANGE_FORMAT_ERROR: errorText };
  }
  const { begin, end } = control.value;

  return Number.isNaN(begin.getTime()) ||
    Number.isNaN(end.getTime()) ||
    begin > end
    ? { DATE_RANGE_FORMAT_ERROR: errorText }
    : null;
};

/**
 * Only use this with datepicker inputs
 * Checks that the date is a current or future date
 * This will pass validation if the value is undefined or null, etc.
 * If your control is required, please use the `required` validator.
 */
export const currentOrFutureDate = (errorText: string): ValidatorFn => (
  control: AbstractControl,
): { [key: string]: any } | null => {
  if (
    control.value === null ||
    control.value === '' ||
    control.value === undefined
  ) {
    return null;
  }

  // Assuming that control.value is of a correct date format
  const date = new Date(control.value);
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  return currentDate > date
    ? { CURRENT_OR_FUTURE_DATE_ERROR: errorText }
    : null;
};

/**
 * Only use this with datepicker inputs
 * Checks that the date is before a given date
 */
export const maxDate = (endDate: number, errorText: string): ValidatorFn => (
  control: AbstractControl,
): { [key: string]: any } | null => {
  const date = new Date(control.value);
  return endDate < date.getTime() ? { MAX_DATE_ERROR: errorText } : null;
};

/**
 * Only use this with datepicker inputs
 * Checks that the date is after a given date
 */
export const minDate = (startDate: number, errorText: string): ValidatorFn => (
  control: AbstractControl,
): { [key: string]: any } | null => {
  const date = new Date(control.value);
  return startDate > date.getTime() ? { MIN_DATE_ERROR: errorText } : null;
};

/**
 * This will pass validation if the value is undefined or null, etc.
 * If your control is required, please use the `required` validator.
 */
export const minLength = (length: number, errorText: string): ValidatorFn => (
  control: AbstractControl,
): { [key: string]: any } | null =>
  control.value !== undefined &&
  control.value !== null &&
  typeof control.value.length === 'number' &&
  control.value.length < length
    ? { MIN_LENGTH_ERROR: errorText }
    : null;

/**
 * This will pass validation if the value is undefined or null, etc.
 * If your control is required, please use the `required` validator.
 */
export const maxLength = (length: number, errorText: string): ValidatorFn => (
  control: AbstractControl,
): { [key: string]: any } | null =>
  control.value !== undefined &&
  control.value !== null &&
  typeof control.value.length === 'number' &&
  control.value.length > length
    ? { MAX_LENGTH_ERROR: errorText }
    : null;

export const required = (errorText: string): ValidatorFn => (
  control: AbstractControl,
): { [key: string]: any } | null =>
  control.value !== undefined &&
  control.value !== null &&
  !(Array.isArray(control.value) && control.value.length === 0) &&
  control.value.toString().trim() !== ''
    ? null
    : { REQUIRED_ERROR: errorText };

export const someRequired = (errorText: string): ValidatorFn => (
  control: AbstractControl,
): { [key: string]: any } | null =>
  hasControls(control) &&
  control.controls &&
  Object.values(control.controls).find(c => c.value)
    ? null
    : { SOME_REQUIRED_ERROR: errorText };

export const requiredTruthy = (errorText: string): ValidatorFn => (
  control: AbstractControl,
): { [key: string]: any } | null =>
  !control.value ? { REQUIRED_TRUTHY_ERROR: errorText } : null;

export const minValue = (value: number, errorText: string): ValidatorFn => (
  control: AbstractControl,
): { [key: string]: any } | null =>
  control.value >= value ? null : { MIN_VALUE_ERROR: errorText };

export const maxValue = (value: number, errorText: string): ValidatorFn => (
  control: AbstractControl,
): { [key: string]: any } | null =>
  control.value <= value ? null : { MAX_VALUE_ERROR: errorText };

export const minValueExclusive = (
  value: number,
  errorText: string,
): ValidatorFn => (control: AbstractControl): { [key: string]: any } | null =>
  control.value > value ? null : { MIN_VALUE_EXCLUSIVE_ERROR: errorText };

export const maxValueExclusive = (
  value: number,
  errorText: string,
): ValidatorFn => (control: AbstractControl): { [key: string]: any } | null =>
  control.value < value ? null : { MAX_VALUE_EXCLUSIVE_ERROR: errorText };

export const wholeNumber = (errorText: string): ValidatorFn => (
  control: AbstractControl,
): { [key: string]: any } | null => {
  const error = { WHOLE_NUMBER_ERROR: errorText };

  if (!['string', 'number'].includes(typeof control.value)) {
    return error;
  }

  const wholeNumberRegex = new RegExp(/^[-+]?\d+\.?0*$/);

  return wholeNumberRegex.test(control.value.toString()) ? null : error;
};

export const pattern = (regExp: RegExp, errorText: string): ValidatorFn => (
  control: AbstractControl,
): { [key: string]: any } | null =>
  regExp.test(control.value) ? null : { PATTERN_ERROR: errorText };

export const notPattern = (
  regExp: RegExp | undefined,
  errorText: string,
): ValidatorFn => (control: AbstractControl): { [key: string]: any } | null =>
  !regExp || !regExp.test(control.value) ? null : { PATTERN_ERROR: errorText };

// This is for multiple regex patterns with OR statements between them
export const somePatterns = (
  regexArray: RegExp[],
  errorText: string,
): ValidatorFn => (control: AbstractControl): { [key: string]: any } | null =>
  regexArray.some(regex => regex.test(control.value))
    ? null
    : { PATTERNS_ERROR: errorText };

/**
 * This is to make sure that the user doesn't upload a file with the same name
 * since we use the filename as an identifier for contest files. :'(
 *
 * Also, note that the control in filenamesUnique validator is only compared to
 * a static list of files. In order to compare against a running  list of files,
 * use filenamesUniqueAsync instead.
 */
export const filenamesUnique = (
  uploadedFiles: ReadonlyArray<File>,
  errorText: string,
): ValidatorFn => (control: AbstractControl): { [key: string]: any } | null =>
  control.value &&
  control.value.some((newFile: File) =>
    uploadedFiles.find(uploadedFile => uploadedFile.name === newFile.name),
  )
    ? { FILENAMES_UNIQUE_ERROR: errorText }
    : null;

/**
 * File upload validators. Note that the controls for filesUnique, maxFileSize,
 * and minFileSize expect an array of File objects, not a single file.
 *
 * Also, note that the control in filesUnique validator is only compared to a
 * static list of files. In order to compare against a running  list of files,
 * use filesUniqueAsync instead.
 */
export const filesUnique = (
  uploadedFiles: ReadonlyArray<File>,
  errorText: string,
): ValidatorFn => (control: AbstractControl): { [key: string]: any } | null =>
  control.value &&
  control.value.some((newFile: File) =>
    uploadedFiles.find(
      uploadedFile =>
        uploadedFile.name === newFile.name &&
        uploadedFile.size === newFile.size,
    ),
  )
    ? { FILES_UNIQUE_ERROR: errorText }
    : null;

/**
 * This expects an array of File objects.
 * NOTE: This validates the file's MIME type rather than extenstion.
 */
export const allowedFileTypes = (
  fileTypes: ReadonlyArray<ImageFileType | DocumentFileType | VideoFileType>,
  errorText: string,
): ValidatorFn => (control: AbstractControl): { [key: string]: any } | null =>
  control.value
    ? control.value.some(
        (file: File) => !fileTypes.includes(file.type.split('/')[1] as any),
      )
      ? { ALLOWED_FILE_TYPE_ERROR: errorText }
      : null
    : null;

// This expects an array of File objects.
export const maxFileSize = (size: number, errorText: string): ValidatorFn => (
  control: AbstractControl,
): { [key: string]: any } | null =>
  control.value
    ? control.value.some((file: File) => size < file.size)
      ? { MAX_FILE_SIZE_ERROR: errorText }
      : null
    : null;

// This expects an array of File objects.
export const minFileSize = (size: number, errorText: string): ValidatorFn => (
  control: AbstractControl,
): { [key: string]: any } | null =>
  control.value
    ? control.value.some((file: File) => size > file.size)
      ? { MIN_FILE_SIZE_ERROR: errorText }
      : null
    : null;

/**
 * This validator errors if the subject text matches at least one term from ALL of the blacklists given.
 * For example, if two blacklists are given, but the text only matches a term in one of them, the validation passes.
 * However, if the text matches a term in both lists, the validation errors.
 * The terms of each blacklist can either be a string literal ('foo') or a regular expression ('foo.*bar').
 */
export const noBlacklistTerms = (
  blacklists: ReadonlyArray<ReadonlyArray<string>>,
  // allows a customised error key to distinguish between different blacklists
  errorKey: string,
  errorText: string,
): ValidatorFn => (control: AbstractControl): { [key: string]: any } | null => {
  if (blacklists.length === 0) {
    return null;
  }

  const subjectText = control.value.toLowerCase();

  const hasBlacklistTerm = blacklists
    .map(blacklist =>
      blacklist.some(term => {
        const matches = subjectText.match(term);
        return matches && matches.length > 0;
      }),
    )
    .every(hasTerm => hasTerm);

  return hasBlacklistTerm ? { [errorKey]: errorText } : null;
};

export const notEqualOtherControl = (
  otherControl: AbstractControl,
  errorText: string,
): ValidatorFn => (control: AbstractControl): { [key: string]: any } | null =>
  control.value
    ? control.value === otherControl.value
      ? { NOT_EQUAL_OTHER_CONTROL_ERROR: errorText }
      : null
    : null;

export const equalOtherControl = (
  otherControl: AbstractControl,
  errorText: string,
): ValidatorFn => (control: AbstractControl): { [key: string]: any } | null => {
  const ret = control.value
    ? control.value !== otherControl.value
      ? { EQUAL_OTHER_CONTROL_ERROR: errorText }
      : null
    : null;
  return ret;
};

/**
 * Checks the given parameter is not equal to control's value.
 * @param other
 * @param errorText
 */
export const notEqual = <T>(other: T, errorText: string): ValidatorFn => (
  control: AbstractControl,
): { [key: string]: any } | null =>
  control?.value === other ? { EQUALS_TO_OTHER_ERROR: errorText } : null;

/**
 * Recursively validates the control and all its children
 * @param control AbstractControl
 */
export function dirtyAndValidate(
  control: FormControl | FormGroup | FormArray | AbstractControl,
) {
  control.markAsDirty();
  control.updateValueAndValidity();
  if (hasControls(control) && control.controls) {
    Object.values(control.controls).forEach(c => {
      if (control.enabled) {
        dirtyAndValidate(c);
      }
    });
  }
}

/**
 * This validator checks if a form group has the minimum required number of form controls that are TRUE.
 * Example: Given a list of checkbox each having its own form control and belonging to one form group,
 * we can validate if at least one check box has been ticked/checked using this validator.
 */
export const minNumOfTrue = (
  minTrue: number = 1,
  errorText: string,
): ValidatorFn => (control: AbstractControl): { [key: string]: any } | null => {
  let trueControls: AbstractControl[] = [];
  if (hasControls(control) && control.controls) {
    trueControls = Object.values(control.controls).filter(
      c => c.value === true,
    );
  }

  return trueControls.length < minTrue
    ? { MIN_NUM_OF_TRUE_ERROR: errorText }
    : null;
};

/**
 * This validator checks if all controls passed to the validator
 * are valid agains specified validator.
 * Example usecase - if either attachment or comment is required.
 */
export const atLeastOne = (
  validator: ValidatorFn,
  controls: ReadonlyArray<string>,
  errorText: String,
) => (control: FormGroup): { [key: string]: any } | null =>
  control &&
  hasControls(control) &&
  control.controls &&
  (controls || Object.keys(control.controls)).some(
    k => !validator(control.controls[k]),
  )
    ? null
    : { AT_LEAST_ONE_ERROR: errorText };

function hasControls(
  c: FormControl | FormGroup | FormArray | AbstractControl,
): c is FormGroup | FormArray {
  return 'controls' in c;
}

/**
 * A function that takes in another validator generator,
 * and creates an async validator generator called in the same way.
 * Use this to allow a validator with an extra argument to be called as an AsyncValidator
 *
 * Note: observables passed into this must complete!
 * Treat these async validators like toPromise()
 */
export function asyncValidatorOf<T>(
  baseValidator: (value: T, errorText: string) => ValidatorFn,
): (
  value$: Rx.Observable<T>,
  errorText$: string | Rx.Observable<string>,
) => AsyncValidatorFn {
  return (value$, errorText$) => control => {
    const _errorTextSubject$ = Rx.isObservable(errorText$)
      ? errorText$
      : Rx.of(errorText$);
    return Rx.combineLatest([value$, _errorTextSubject$]).pipe(
      take(1),
      map(([value, errorTextString]) =>
        baseValidator(value, errorTextString)(control),
      ),
    );
  };
}

/**
 * Async version of filenamesUnique.
 * Note: observable argument must complete, similar to toPromise()
 */
export const filenamesUniqueAsync = asyncValidatorOf(filenamesUnique);
/**
 * Async version of filesUnique.
 * Note: observable argument must complete, similar to toPromise()
 */
export const filesUniqueAsync = asyncValidatorOf(filesUnique);
/**
 * Async version of minLength.
 * Note: observable argument must complete, similar to toPromise()
 */
export const minLengthAsync = asyncValidatorOf(minLength);
/**
 * Async version of maxLength.
 * Note: observable argument must complete, similar to toPromise()
 */
export const maxLengthAsync = asyncValidatorOf(maxLength);
/**
 * Async version of minValue.
 * Note: observable argument must complete, similar to toPromise()
 */
export const minValueAsync = asyncValidatorOf(minValue);
/**
 * Async version of maxValue.
 * Note: observable argument must complete, similar to toPromise()
 */
export const maxValueAsync = asyncValidatorOf(maxValue);
/**
 * Async version of minValueExclusive.
 * Note: observable argument must complete, similar to toPromise()
 */
export const minValueExclusiveAsync = asyncValidatorOf(minValueExclusive);
/**
 * Async version of maxValueExclusive.
 * Note: observable argument must complete, similar to toPromise()
 */
export const maxValueExclusiveAsync = asyncValidatorOf(maxValueExclusive);
/**
 * Async version of pattern.
 * Note: observable argument must complete, similar to toPromise()
 */
export const patternAsync = asyncValidatorOf(pattern);
/**
 * Async version of notPatter.
 * Note: observable argument must complete, similar to toPromise()
 */
export const notPatternAsync = asyncValidatorOf(notPattern);
/**
 * Async version of somePatterns.
 * Note: observable argument must complete, similar to toPromise()
 */
export const somePatternsAsync = asyncValidatorOf(somePatterns);
/**
 * Async version of minDate.
 * Note: observable argument must complete, similar to toPromise()
 */
export const minDateAsync = asyncValidatorOf(minDate);
/**
 * Async version of maxDate.
 * Note: observable argument must complete, similar to toPromise()
 */
export const maxDateAsync = asyncValidatorOf(maxDate);
/**
 * Async version of notEqual.
 * Note: observable argument must complete, similar to toPromise()
 */
export const notEqualAsync = asyncValidatorOf(notEqual);
