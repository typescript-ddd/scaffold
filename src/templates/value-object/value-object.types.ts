import {
  TemplateBooleanOption,
  TemplatePropertiesOption,
  TemplatePropertyValue,
  TemplateStringOption,
} from "../shared/template";

export type ValueObjectTemplateValues = {
  name: string;
  valueType: string;
  valueProps?: TemplatePropertyValue[];
  validationErrorMessage?: string;
  generateValueGetters?: boolean;
};

export type ValueObjectTemplateOptions = {
  name: TemplateStringOption;
  valueType: TemplateStringOption;
  valueProps?: TemplatePropertiesOption;
  validationErrorMessage?: TemplateStringOption;
  generateValueGetters?: TemplateBooleanOption;
};
