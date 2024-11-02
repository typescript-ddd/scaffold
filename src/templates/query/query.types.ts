import {
  TemplatePropertiesOption,
  TemplatePropertyValue,
  TemplateStringOption,
} from "../shared/template";

export type QueryTemplateValues = {
  entityName: string;
  actionName: string;
  properties: TemplatePropertyValue[];
};

export type QueryTemplateOptions = {
  entityName: TemplateStringOption;
  actionName: TemplateStringOption;
  properties: TemplatePropertiesOption;
};
