import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import {
  CustomFieldType,
  ResourceCustomField,
} from '@freelancer/custom-fields';
import * as Rx from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import {
  DeloitteProjectRequirements,
  DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_STRING_MAP,
  DELOITTE_PRACTICE_DISPLAY_NAME_STRING_MAP,
  DELOITTE_WORKER_LEVEL_DISPLAY_NAME_STRING_MAP,
} from './deloitte-custom-fields.model';

@Injectable({
  providedIn: 'root',
})
export class DeloitteCustomFieldsService {
  /**
   * Takes a FormControl and formats the value into: (ABC00123-AB-01-01-0000)
   *
   * @param control
   */
  formatDeloitteBillingCodeFormControl(control: AbstractControl) {
    return control.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(value => {
        if (value) {
          let billingCode = value
            .toUpperCase()
            .replace(/[^A-Z\d]/g, '')
            .split('');
          const separatorIndexes = [14, 12, 10, 8];
          const separator = '-';
          separatorIndexes.forEach(index => {
            if (billingCode.length > index) {
              billingCode.splice(index, 0, separator);
            }
          });
          billingCode = billingCode.join('').substr(0, 22);
          control.setValue(billingCode, {
            emitEvent: false,
          });

          control.updateValueAndValidity();
        }
      });
  }

  /**
   * Returns a set of deloitte project requirements each with a list of custom
   * field values with the frontend display names, to be shown to the user.
   */
  getDisplayNameDeloitteProjectRequirements(
    resourceCustomField$: Rx.Observable<ResourceCustomField>,
  ): DeloitteProjectRequirements {
    const limitPractices$ = resourceCustomField$.pipe(
      map(resourceCustomField => {
        if (
          resourceCustomField.customField.limit_practices?.type ===
            CustomFieldType.STRING_ARRAY &&
          resourceCustomField.customField.limit_practices.value[0]
        ) {
          return resourceCustomField.customField.limit_practices.value
            .map(
              practice => DELOITTE_PRACTICE_DISPLAY_NAME_STRING_MAP[practice],
            )
            .join(', ');
        }
        return undefined;
      }),
    );

    const limitOfferingPortfolios$ = resourceCustomField$.pipe(
      map(resourceCustomField => {
        if (
          resourceCustomField.customField.limit_offering_portfolio?.type ===
            CustomFieldType.STRING_ARRAY &&
          resourceCustomField.customField.limit_offering_portfolio.value[0]
        ) {
          return resourceCustomField.customField.limit_offering_portfolio.value
            .map(
              offeringPortfolio =>
                DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_STRING_MAP[
                  offeringPortfolio
                ],
            )
            .join(', ');
        }
        return undefined;
      }),
    );

    const limitGigWorkerLevel$ = resourceCustomField$.pipe(
      map(resourceCustomField => {
        if (
          resourceCustomField.customField.limit_gig_worker_level?.type ===
            CustomFieldType.STRING_ARRAY &&
          resourceCustomField.customField.limit_gig_worker_level.value[0]
        ) {
          return resourceCustomField.customField.limit_gig_worker_level.value
            .map(
              workerLevel =>
                DELOITTE_WORKER_LEVEL_DISPLAY_NAME_STRING_MAP[workerLevel],
            )
            .join(', ')
            .concat(' or equivalent');
        }
        return undefined;
      }),
    );

    const limitCertifications$ = resourceCustomField$.pipe(
      map(resourceCustomField => {
        if (
          resourceCustomField.customField.limit_certifications?.type ===
            CustomFieldType.STRING_ARRAY &&
          resourceCustomField.customField.limit_certifications.value[0]
        ) {
          return resourceCustomField.customField.limit_certifications.value;
        }
        return undefined;
      }),
    );

    return {
      limitPractices$,
      limitCertifications$,
      limitGigWorkerLevel$,
      limitOfferingPortfolios$,
    };
  }
}
