import { Maybe, TemplateStringOption } from "../shared/template";

export type CommandActionTemplateValues = {
  subject: string;
  method: string;
  path: string;
  requestType: Maybe<string>;
  responseType: Maybe<string>;
  contextType: Maybe<string>;
};

export type CommandActionTemplateOptions = {
  subject: TemplateStringOption;
  method: TemplateStringOption;
  path: TemplateStringOption;
  requestType: TemplateStringOption;
  responseType: TemplateStringOption;
  contextType: TemplateStringOption;
};
