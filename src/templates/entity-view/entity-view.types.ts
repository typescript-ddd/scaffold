import {
  TemplatePropertiesOption,
  TemplatePropertyValue,
  TemplateStringOption,
} from "../shared/template";

export type EntityViewTemplateValues = {
  entityName: string;
  properties: TemplatePropertyValue[];
};

export type EntityViewTemplateOptions = {
  entityName: TemplateStringOption;
  properties: TemplatePropertiesOption;
};
