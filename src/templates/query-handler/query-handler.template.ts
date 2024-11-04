import { Chunk, GenerateContext } from "../shared";
import { Template } from "../shared/template";
import { generateQueryHandler } from "./query-handler.generator";
import {
  QueryHandlerTemplateOptions,
  QueryHandlerTemplateValues,
} from "./query-handler.types";

export class QueryHandlerTemplate
  implements Template<QueryHandlerTemplateValues, QueryHandlerTemplateOptions>
{
  readonly name = "Query Handler";
  readonly description = "Generates a query handler";
  readonly options: QueryHandlerTemplateOptions = {
    entityName: {
      name: "entityName",
      label: "Entity Name",
      description: "The name of the entity",
      optionType: "string",
    },
    actionName: {
      name: "action",
      label: "Action",
      description: "The action of the query handler",
      optionType: "string",
    },
    actor: {
      name: "actor",
      label: "Actor",
      description: "The actor of the query handler",
      optionType: "string",
    },
    queryProperties: {
      name: "queryProperties",
      label: "Query Properties",
      description: "The query properties of the query handler",
      optionType: "properties",
    },
    returnType: {
      name: "returnType",
      label: "Return Type",
      description: "The return type of the query handler",
      optionType: "string",
    },
    returnsView: {
      name: "returnsView",
      label: "Returns View",
      description: "Whether the query handler returns a view",
      optionType: "boolean",
    },
  };
  readonly defaultValues = {
    entityName: "User",
    actionName: "findAll",
    actor: "UserFinder",
    returnType: "UserView[]",
    returnsView: true,
    queryProperties: [{ name: "name", valueType: "string" }],
  };
  generate(values: QueryHandlerTemplateValues, context: GenerateContext): Chunk {
    return generateQueryHandler(values, context);
  }
}
