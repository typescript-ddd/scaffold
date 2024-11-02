import {
  TemplateBooleanOption,
  TemplateEnumOption,
  TemplatePropertiesOption,
  TemplatePropertyValue,
  TemplateStringOption,
} from "../shared/template";

export type CommandHandlerTemplateValues = {
  entityName: string;
  actionName: string;
  actor: string;
  returnType: string;
  commandProperties: TemplatePropertyValue[];
  returnsView: boolean;
};

export type CommandHandlerTemplateOptions = {
  entityName: TemplateStringOption;
  actionName: TemplateEnumOption;
  actor: TemplateStringOption;
  returnType: TemplateStringOption;
  commandProperties: TemplatePropertiesOption;
  returnsView: TemplateBooleanOption;
};
