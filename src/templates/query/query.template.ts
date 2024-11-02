import { GenerateContext } from "../shared";
import { Template } from "../shared/template";
import { generateQuery } from "./query.generator";
import {
  QueryTemplateOptions,
  QueryTemplateValues,
} from "./query.types";

export class QueryTemplate
  implements
    Template<QueryTemplateValues, QueryTemplateOptions>
{
  readonly name = "Query";
  readonly description = "Generates a query";
  readonly options: QueryTemplateOptions = {
    entityName: {
      name: "entityName",
      label: "Entity Name",
      description: "The name of the entity",
      optionType: "string",
    },
    actionName: {
        name: "actionName",
        label: "Action Name",
        description: "The name of the action",
        optionType: "string",
    },
    properties: {
        name: "properties",
        label: "Properties",
        description: "The properties of the entity",
        optionType: "properties",
    }
  };
  readonly defaultValues = {
    entityName: "User",
    actionName: "find",
    properties: [],
  };
  generate(values: QueryTemplateValues, context: GenerateContext): string {
    return generateQuery(values, context);
  }
}
