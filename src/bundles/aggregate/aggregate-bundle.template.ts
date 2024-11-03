import { GenerateContext } from "../../templates/shared";
import { Template } from "../../templates/shared/template";
import { generateAggregateBundle } from "./aggregate-bundle.generator";
import {
  AggregateBundleTemplateValues,
  AggregateBundleTemplateOptions,
} from "./aggregate-bundle.types";

export class AggregateBundleTemplate
  implements
    Template<AggregateBundleTemplateValues, AggregateBundleTemplateOptions>
{
  readonly name = "Aggregate Root Bundle";
  readonly description = "Generates an aggregate root bundle";
  readonly options: AggregateBundleTemplateOptions = {
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
    values: AggregateBundleTemplateValues,
    context: GenerateContext
  ): string {
    const templates = generateAggregateBundle(values, context.rootDir);
    return Object.values(templates).join("\n");
  }
}
