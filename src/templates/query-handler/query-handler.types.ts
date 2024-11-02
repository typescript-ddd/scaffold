import {
  TemplateBooleanOption,
  TemplatePropertiesOption,
  TemplatePropertyValue,
  TemplateStringOption,
} from "../shared/template";

export type QueryHandlerTemplateValues = {
  entityName: string;
  actionName?: string;
  actor: string;
  returnType: string;
  queryProperties: TemplatePropertyValue[];
  returnsView: boolean;
};

export type QueryHandlerTemplateOptions = {
  entityName: TemplateStringOption;
  actionName?: TemplateStringOption;
  actor: TemplateStringOption;
  returnType: TemplateStringOption;
  queryProperties: TemplatePropertiesOption;
  returnsView: TemplateBooleanOption;
};
