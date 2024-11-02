import { GenerateContext } from "../shared";
import { Template } from "../shared/template";
import { generateAggregateRoot } from "./aggregate-root.generator";
import {
  AggregateRootTemplateValues,
  AggregateRootTemplateOptions,
} from "./aggregate-root.types";

export class AggregateRootTemplate
  implements
    Template<AggregateRootTemplateValues, AggregateRootTemplateOptions>
{
  readonly name = "Aggregate Root";
  readonly description = "Generates an aggregate root";
  readonly options: AggregateRootTemplateOptions = {
    entityName: {
      name: "entityName",
      label: "Entity Name",
      description: "The name of the aggregate",
      optionType: "string",
    },
    properties: {
      name: "properties",
      label: "Properties",
      description: "The properties of the aggregate",
      optionType: "properties",
    },
    trackable: {
      name: "trackable",
      label: "Trackable",
      description: "Whether the aggregate is trackable",
      optionType: "boolean",
    },
  };
  readonly defaultValues = {
    entityName: "User",
    properties: [{ name: "name", valueType: "string" }],
    trackable: false,
  };
  generate(
    values: AggregateRootTemplateValues,
    context: GenerateContext
  ): string {
    return generateAggregateRoot(values, context);
  }
}
