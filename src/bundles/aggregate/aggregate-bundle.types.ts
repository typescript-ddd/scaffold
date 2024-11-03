import { TemplateBooleanOption, TemplatePropertiesOption, TemplatePropertyValue, TemplateStringOption } 
  from "../../templates/shared";

export type AggregateBundleTemplateValues = {
  entityName: string;
  properties: TemplatePropertyValue[];
  trackable: boolean;
};

export type AggregateBundleTemplateOptions = {
  entityName: TemplateStringOption;
  properties: TemplatePropertiesOption;
  trackable: TemplateBooleanOption;
};