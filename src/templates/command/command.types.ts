import {
  TemplatePropertiesOption,
  TemplatePropertyOption,
  TemplateStringOption,
} from "../shared/template";

export type CommandTemplateValues = {
  entityName: string;
  actionName: string;
  properties: TemplatePropertyOption[];
};
export type CommandTemplateOptions = {
  entityName: TemplateStringOption;
  actionName: TemplateStringOption;
  properties: TemplatePropertiesOption;
};
