import { TemplateBooleanOption, TemplatePropertiesOption, TemplatePropertyValue, TemplateStringOption } from "../shared/template";

export type AggregateRootTemplateValues = {
  entityName: string;
  properties: TemplatePropertyValue[];
  trackable: boolean;
};

export type AggregateRootTemplateOptions = {
  entityName: TemplateStringOption;
  properties: TemplatePropertiesOption;
  trackable: TemplateBooleanOption;
};
