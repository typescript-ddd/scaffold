import { GenerateContext } from "../shared";
import { Template } from "../shared/template";
import { generateQueryAction } from "./query-action.generator";
import {
  QueryActionTemplateOptions,
  QueryActionTemplateValues,
} from "./query-action.types";

export class QueryActionTemplate
  implements Template<QueryActionTemplateValues, QueryActionTemplateOptions>
{
  readonly name = "Query Action";
  readonly description = "Generates a query action";
  readonly options: QueryActionTemplateOptions = {
    subject: {
      name: "subject",
      label: "Subject",
      description: "The subject of the query action",
      optionType: "string",
    },
    path: {
      name: "path",
      label: "Path",
      description: "The path of the query action",
      optionType: "string",
    },
    requestType: {
      name: "requestType",
      label: "Request Type",
      description: "The request type of the query action",
      optionType: "string",
    },
    responseType: {
      name: "responseType",
      label: "Response Type",
      description: "The response type of the query action",
      optionType: "string",
    },
    contextType: {
      name: "contextType",
      label: "Context Type",
      description: "The context type of the query action",
      optionType: "string",
    },
  };
  readonly defaultValues = {
    subject: "",
    path: "",
    requestType: null,
    responseType: null,
    contextType: null,
  };
  generate(values: QueryActionTemplateValues, context: GenerateContext): string {
    return generateQueryAction(values, context);
  }
}
