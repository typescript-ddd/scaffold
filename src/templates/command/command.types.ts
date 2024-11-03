import {
  TemplatePropertiesOption,
  TemplatePropertyValue,
  TemplateStringOption,
} from "../shared/template";

export type CommandTemplateValues = {
  entityName: string;
  actionName: string;
  properties: TemplatePropertyValue[];
};
export type CommandTemplateOptions = {
  entityName: TemplateStringOption;
  actionName: TemplateStringOption;
  properties: TemplatePropertiesOption;
};
