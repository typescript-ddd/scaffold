import { Maybe, TemplateStringOption } from "../shared/template";

export type QueryActionTemplateValues = {
  subject: string;
  path: string;
  requestType: Maybe<string>;
  responseType: Maybe<string>;
  contextType: Maybe<string>;
};

export type QueryActionTemplateOptions = {
    subject: TemplateStringOption;
    path: TemplateStringOption;
    requestType: TemplateStringOption;
    responseType: TemplateStringOption;
    contextType: TemplateStringOption;
}