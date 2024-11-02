import {
  TemplateBooleanOption,
  TemplatePropertiesOption,
  TemplatePropertyValue,
  TemplateStringOption,
} from "../shared/template";

export type EntityTemplateValues = {
  entityName: string;
  properties: TemplatePropertyValue[];
  trackable: boolean;
};

export type EntityTemplateOptions = {
  entityName: TemplateStringOption;
  properties: TemplatePropertiesOption;
  trackable: TemplateBooleanOption;
};
