import {
  TemplatePropertiesOption,
  TemplatePropertyValue,
  TemplateStringOption,
  TemplateTokenStringOption,
} from "../shared/template";

export type DomainErrorTemplateValues = {
  name: string;
  message: string;
  parameters: TemplatePropertyValue[];
};

export type DomainErrorTemplateOptions = {
  name: TemplateStringOption;
  message: TemplateTokenStringOption;
  parameters: TemplatePropertiesOption;
};
