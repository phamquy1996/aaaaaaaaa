import { flatMap } from '@freelancer/datastore/core';
import { generateId } from '@freelancer/datastore/testing';
import {
  assertNever,
  flatten,
  isArray as isAnArray,
  isDefined,
} from '@freelancer/utils';
import { ResourceTypeApi } from 'api-typings/resources/metadata';
import { Enterprise } from '../enterprise/enterprise.model';
import {
  CustomFieldInfo,
  CustomFieldInfoConfiguration,
  CustomFieldValue,
  FieldType,
  FieldValue,
} from './custom-field-info-configurations.model';

// Generate Options

interface GenerateCustomFieldInfoOptions {
  readonly name: string;
  readonly fieldType: FieldType;
  readonly customFieldInfoId?: number;
  readonly isArray?: boolean;
  readonly description?: string;
  readonly resourceType?: ResourceTypeApi;
  readonly timeCreated?: number;
}

export type GenerateCustomFieldInfoConfigurationOptions = {
  readonly configurationId?: number;
  readonly enterpriseId?: number;
  readonly defaultValue?: FieldValue;
  readonly searchable?: boolean;
  readonly timeEnabled?: number;
} & GenerateCustomFieldInfoOptions;

export type GenerateCustomFieldValueOptions = {
  readonly resourceId: number;
  readonly customFieldInfoConfigurationId?: number;
  readonly isDefaultValue?: boolean;
} & FieldValue;

/**
 * Provides options to seed customFieldValue and customFieldInfoConfigurations
 * The custom field is a field and value by nature thus this model. It serves to encapsulate
 * the field's options and value's options of the custom field.
 */
export type CustomFieldValueAndConfigurationOptions = {
  /**
   * Used to seed the customFieldInfoConfigurations
   */
  readonly fieldOptions: GenerateCustomFieldInfoConfigurationOptions;
} & (
  | {
      /**
       * Used to seed the CustomFieldValue of a resource
       */
      readonly valueOptions?: GenerateCustomFieldValueOptions;
      readonly isArray: false;
    }
  | {
      /**
       * Used to seed the CustomFieldValue with array value of a resource
       */
      readonly valueOptions?: ReadonlyArray<GenerateCustomFieldValueOptions>;
      readonly isArray: true;
    }
);

function generateCustomFieldInfo({
  name,
  fieldType,
  customFieldInfoId,
  isArray = false,
  description = 'test field description',
  resourceType = ResourceTypeApi.USER,
  timeCreated = Date.now(),
}: GenerateCustomFieldInfoOptions): CustomFieldInfo {
  const id = customFieldInfoId !== undefined ? customFieldInfoId : generateId();

  return {
    id,
    name,
    isArray,
    description,
    resourceType,
    fieldType,
    timeCreated,
  };
}

export function generateCustomFieldInfoConfiguration({
  name,
  description,
  fieldType,
  defaultValue,
  configurationId,
  isArray = false,
  enterpriseId = Enterprise.DELOITTE_DC,
  resourceType = ResourceTypeApi.USER,
  searchable = false,
  timeCreated = Date.now(),
  timeEnabled = Date.now(),
}: GenerateCustomFieldInfoConfigurationOptions): CustomFieldInfoConfiguration {
  const id = configurationId !== undefined ? configurationId : generateId();

  return {
    id,
    enterpriseId,
    customFieldInfo: generateCustomFieldInfo({
      name,
      description,
      isArray,
      resourceType,
      fieldType,
    }),
    defaultValue,
    searchable,
    resourceType,
    timeCreated,
    timeEnabled,
  };
}

export function generateCustomFieldValue({
  type,
  value,
  customFieldInfoConfigurationId = generateId(),
  resourceId = generateId(),
  isDefaultValue = false,
}: GenerateCustomFieldValueOptions): CustomFieldValue {
  return {
    customFieldInfoConfigurationId,
    resourceId,
    isDefaultValue,
    type,
    value,
  } as CustomFieldValue;
}

export function generateCustomFieldValues(
  options: ReadonlyArray<GenerateCustomFieldValueOptions>,
): ReadonlyArray<CustomFieldValue> {
  return options.map(option => generateCustomFieldValue(option));
}

export function generateCustomFieldInfoConfigurationObjects(
  customFieldInfoConfigurationArray: ReadonlyArray<
    GenerateCustomFieldInfoConfigurationOptions
  >,
): ReadonlyArray<CustomFieldInfoConfiguration> {
  return customFieldInfoConfigurationArray.map(customFieldInfoConfiguration =>
    generateCustomFieldInfoConfiguration(customFieldInfoConfiguration),
  );
}
/**
 * Used to generate a real model CustomFieldValues from field and value pair.
 * It will then be used by seed to intialize a resource such as user.
 * CustomFieldsValue is the value of the CustomFieldInfoConfiguration.
 */
export function getCustomFieldValues(
  fieldAndValueOptions: ReadonlyArray<CustomFieldValueAndConfigurationOptions>,
): ReadonlyArray<CustomFieldValue> {
  return flatten(
    fieldAndValueOptions
      .map(options => {
        if (!options.valueOptions) {
          return undefined;
        }
        return options.isArray
          ? generateCustomFieldValues(options.valueOptions)
          : [generateCustomFieldValue(options.valueOptions)];
      })
      .filter(isDefined),
  );
}

/**
 * Grabs the CustomFieldInfoConfigurationOption from
 * the combined field and value option or CustomFieldValueAndConfigurationOptions.
 * Will be used to seed the CustomFieldInfoConfiguration.
 */
export function getCustomFieldInfoConfigurationOptions(
  fieldAndValueOptions: ReadonlyArray<CustomFieldValueAndConfigurationOptions>,
): ReadonlyArray<GenerateCustomFieldInfoConfigurationOptions> {
  return fieldAndValueOptions.map(options => options.fieldOptions);
}

// Mixins for CustomFieldValueAndConfigurationOptions

export function firstName(
  resourceId: number,
  value?: string,
): CustomFieldValueAndConfigurationOptions {
  const fieldType = FieldType.STRING;
  const customFieldInfoConfigurationId = generateId();
  return {
    isArray: false,
    fieldOptions: {
      configurationId: customFieldInfoConfigurationId,
      name: 'first_name',
      fieldType,
    },
    valueOptions: value
      ? {
          customFieldInfoConfigurationId,
          resourceId,
          value,
          type: fieldType,
        }
      : undefined,
  };
}

export function lastName(
  resourceId: number,
  value?: string,
): CustomFieldValueAndConfigurationOptions {
  const fieldType = FieldType.STRING;
  const customFieldInfoConfigurationId = generateId();
  return {
    isArray: false,
    fieldOptions: {
      configurationId: customFieldInfoConfigurationId,
      name: 'last_name',
      fieldType,
    },
    valueOptions: value
      ? {
          customFieldInfoConfigurationId,
          resourceId,
          value,
          type: fieldType,
        }
      : undefined,
  };
}

export function level(
  resourceId: number,
  value?: string,
): CustomFieldValueAndConfigurationOptions {
  const fieldType = FieldType.STRING;
  const customFieldInfoConfigurationId = generateId();
  return {
    isArray: false,
    fieldOptions: {
      configurationId: customFieldInfoConfigurationId,
      name: 'level',
      fieldType,
    },
    valueOptions: value
      ? {
          customFieldInfoConfigurationId,
          resourceId,
          value,
          type: fieldType,
        }
      : undefined,
  };
}

export function legalEntityAlignment(
  resourceId: number,
  value?: string,
): CustomFieldValueAndConfigurationOptions {
  const fieldType = FieldType.STRING;
  const customFieldInfoConfigurationId = generateId();
  return {
    isArray: false,
    fieldOptions: {
      configurationId: customFieldInfoConfigurationId,
      name: 'legal_entity_alignment',
      fieldType,
    },
    valueOptions: value
      ? {
          customFieldInfoConfigurationId,
          resourceId,
          value,
          type: fieldType,
        }
      : undefined,
  };
}

export function practice(
  resourceId: number,
  value?: string,
): CustomFieldValueAndConfigurationOptions {
  const fieldType = FieldType.STRING;
  const customFieldInfoConfigurationId = generateId();
  return {
    isArray: false,
    fieldOptions: {
      configurationId: customFieldInfoConfigurationId,
      name: 'practice',
      fieldType,
    },
    valueOptions: value
      ? {
          customFieldInfoConfigurationId,
          resourceId,
          value,
          type: fieldType,
        }
      : undefined,
  };
}

export function offeringPortfolio(
  resourceId: number,
  value?: string,
): CustomFieldValueAndConfigurationOptions {
  const fieldType = FieldType.STRING;
  const customFieldInfoConfigurationId = generateId();
  return {
    isArray: false,
    fieldOptions: {
      configurationId: customFieldInfoConfigurationId,
      name: 'offering_portfolio',
      fieldType,
    },
    valueOptions: value
      ? {
          customFieldInfoConfigurationId,
          resourceId,
          value,
          type: fieldType,
        }
      : undefined,
  };
}

export function independenceRuleset(
  resourceId: number,
  value?: string,
): CustomFieldValueAndConfigurationOptions {
  const fieldType = FieldType.STRING;
  const customFieldInfoConfigurationId = generateId();
  return {
    isArray: false,
    fieldOptions: {
      configurationId: customFieldInfoConfigurationId,
      name: 'independence_ruleset',
      fieldType,
    },
    valueOptions: value
      ? {
          customFieldInfoConfigurationId,
          resourceId,
          value,
          type: fieldType,
        }
      : undefined,
  };
}

export function phoneNumberWorkCell(
  resourceId: number,
  value?: string,
): CustomFieldValueAndConfigurationOptions {
  const fieldType = FieldType.STRING;
  const customFieldInfoConfigurationId = generateId();
  return {
    isArray: false,
    fieldOptions: {
      configurationId: customFieldInfoConfigurationId,
      name: 'phone_number_work_cell',
      fieldType,
    },
    valueOptions: value
      ? {
          customFieldInfoConfigurationId,
          resourceId,
          value,
          type: fieldType,
        }
      : undefined,
  };
}

export function phoneNumberSkype(
  resourceId: number,
  value?: string,
): CustomFieldValueAndConfigurationOptions {
  const fieldType = FieldType.STRING;
  const customFieldInfoConfigurationId = generateId();
  return {
    isArray: false,
    fieldOptions: {
      configurationId: customFieldInfoConfigurationId,
      name: 'phone_number_skype',
      fieldType,
    },
    valueOptions: value
      ? {
          customFieldInfoConfigurationId,
          resourceId,
          value,
          type: fieldType,
        }
      : undefined,
  };
}

export function memberFirmAlignment(
  resourceId: number,
  value?: string,
): CustomFieldValueAndConfigurationOptions {
  const fieldType = FieldType.STRING;
  const customFieldInfoConfigurationId = generateId();
  return {
    isArray: false,
    fieldOptions: {
      configurationId: customFieldInfoConfigurationId,
      name: 'member_firm_alignment',
      fieldType,
    },
    valueOptions: value
      ? {
          customFieldInfoConfigurationId,
          resourceId,
          value,
          type: fieldType,
        }
      : undefined,
  };
}

export function countryAlignment(
  resourceId: number,
  value?: string,
): CustomFieldValueAndConfigurationOptions {
  const fieldType = FieldType.STRING;
  const customFieldInfoConfigurationId = generateId();
  return {
    isArray: false,
    fieldOptions: {
      configurationId: customFieldInfoConfigurationId,
      name: 'country_alignment',
      fieldType,
    },
    valueOptions: value
      ? {
          customFieldInfoConfigurationId,
          resourceId,
          value,
          type: fieldType,
        }
      : undefined,
  };
}

export function emailAddress(
  resourceId: number,
  value?: string,
): CustomFieldValueAndConfigurationOptions {
  const fieldType = FieldType.STRING;
  const customFieldInfoConfigurationId = generateId();
  return {
    isArray: false,
    fieldOptions: {
      configurationId: customFieldInfoConfigurationId,
      name: 'email_address',
      fieldType,
    },
    valueOptions: value
      ? {
          customFieldInfoConfigurationId,
          resourceId,
          value,
          type: fieldType,
        }
      : undefined,
  };
}

export function certifications(
  resourceId: number,
  values?: ReadonlyArray<string>,
): CustomFieldValueAndConfigurationOptions {
  const fieldType = FieldType.STRING;
  const customFieldInfoConfigurationId = generateId();
  return {
    isArray: true,
    fieldOptions: {
      configurationId: customFieldInfoConfigurationId,
      isArray: true,
      name: 'certifications',
      fieldType,
    },
    valueOptions: values
      ? values.map(value => ({
          customFieldInfoConfigurationId,
          resourceId,
          value,
          type: fieldType,
        }))
      : undefined,
  };
}

interface NameAndValue {
  readonly name: string;
  readonly value: // The type list is not exahaustive. Please add as required.
  string | boolean | ReadonlyArray<string> | ReadonlyArray<boolean>;
}

/**
 * The function returns the Deloitte custom field configurations and values.
 *
 * Custom fields are split into the values of a field and metadata about these fields.
 * To keep the two in sync we generate both the fields and their metadata from a list of name/value pairs,
 * generating the other information like the customFieldInfoConfigurationId and type from this.
 * This keeps the two in perfect sync (as well as reduces the overhead from creating a new field).
 */
export function getDeloitteProjectCustomFieldsAndValues() {
  const rawNamesAndValues: ReadonlyArray<NameAndValue> = [
    { name: 'wbs_code', value: 'ABC00123-AB-01-01-1234' },
    { name: 'utilization', value: 'adjusted_utilization' },
    { name: 'business_line', value: 'tax' },
    { name: 'project_type', value: 'client_billable' },
    { name: 'practice', value: 'gps_operational_excellence' },
    { name: 'industry_group', value: 'consumer' },
    {
      name: 'industry_sector',
      value: 'automotive_transportation_hospitality_and_services',
    },
    { name: 'offering_portfolio', value: 'core_business_operations' },
    { name: 'market_offering', value: 'cbo_cross_consulting_group' },
    { name: 'clearance', value: 'Some clearance required.' },
    { name: 'itar', value: true },
    {
      name: 'limit_gig_worker_level',
      value: ['senior_manager', 'manager'],
    },
    {
      name: 'limit_offering_portfolio',
      value: ['mergers_and_acquisitions', 'core_business_operations'],
    },
    {
      name: 'limit_practices',
      value: ['gps_operational_excellence', 'commercial_core'],
    },
    {
      name: 'limit_certifications',
      value: ['Certification-1', 'Certification-2'],
    },
  ];

  const fieldsAndValues: ReadonlyArray<{
    readonly name: string;
    readonly customFieldInfoConfigurationId: number;
  } & (
    | {
        readonly type: FieldType.STRING;
        readonly isArray: true;
        readonly value: ReadonlyArray<string>;
      }
    | {
        readonly type: FieldType.STRING;
        readonly isArray: false;
        readonly value: string;
      }
    | {
        readonly type: FieldType.BOOLEAN;
        readonly isArray: false;
        readonly value: boolean;
      }
    | {
        readonly type: FieldType.BOOLEAN;
        readonly isArray: true;
        readonly value: ReadonlyArray<boolean>;
      }
  )> = rawNamesAndValues
    .map(({ name, value }) => ({
      name,
      value,
      customFieldInfoConfigurationId: generateId(),
    }))
    .map(({ name, value, customFieldInfoConfigurationId }) => {
      if (isAnArray(value)) {
        switch (typeof value[0]) {
          case 'string':
            return {
              name,
              value: value as string[],
              customFieldInfoConfigurationId,
              type: FieldType.STRING,
              isArray: true,
            } as const;
          case 'boolean':
            return {
              name,
              value: value as boolean[],
              customFieldInfoConfigurationId,
              type: FieldType.BOOLEAN,
              isArray: true,
            } as const;

          default:
            return assertNever(value[0]);
        }
      }

      switch (typeof value) {
        case 'string':
          return {
            name,
            value,
            customFieldInfoConfigurationId,
            type: FieldType.STRING,
            isArray: false,
          } as const;
        case 'boolean':
          return {
            name,
            value,
            customFieldInfoConfigurationId,
            type: FieldType.BOOLEAN,
            isArray: false,
          } as const;

        default:
          return assertNever(value);
      }
    });

  const values: ReadonlyArray<CustomFieldValue> = flatMap(
    fieldsAndValues,
    fieldAndValue => {
      if (fieldAndValue.isArray) {
        // We need 'as any[]' casting here. Please see https://github.com/microsoft/TypeScript/pull/31023 .
        return (fieldAndValue.value as any[]).map(value => ({
          customFieldInfoConfigurationId:
            fieldAndValue.customFieldInfoConfigurationId,
          value,
          type: fieldAndValue.type,
        }));
      }
      return [
        {
          customFieldInfoConfigurationId:
            fieldAndValue.customFieldInfoConfigurationId,
          value: fieldAndValue.value,
          type: fieldAndValue.type,
        },
      ];
    },
  ).map(value => ({
    ...value,
    isDefaultValue: false,
    resourceId: -1, // TODO: T213163 - Don't use -1 here
  }));

  const fields: ReadonlyArray<GenerateCustomFieldInfoConfigurationOptions> = fieldsAndValues.map(
    ({ name, type, isArray: isA, customFieldInfoConfigurationId }) => ({
      name,
      fieldType: type,
      resourceType: ResourceTypeApi.PROJECT,
      isArray: isA,
      configurationId: customFieldInfoConfigurationId,
    }),
  );

  return { values, fields };
}
