import { Chunk, GenerateContext } from "../shared";
import { Template } from "../shared/template";
import { generateEntityFinder } from "./entity-finder.generator";
import {
  EntityFinderTemplateOptions,
  EntityFinderTemplateValues,
} from "./entity-finder.types";

export class EntityFinderTemplate
  implements Template<EntityFinderTemplateValues, EntityFinderTemplateOptions>
{
  readonly name = "Entity Finder";
  readonly description = "Generates an entity finder";
  readonly options: EntityFinderTemplateOptions = {
    entityName: {
      name: "entityName",
      label: "Entity Name",
      description: "The name of the entity",
      optionType: "string",
    },
  };
  readonly defaultValues = {
    entityName: "User",
  };
  generate(
    values: EntityFinderTemplateValues,
    context: GenerateContext,
    chunkName?: string
  ): Chunk {
    return generateEntityFinder(values, context, chunkName);
  }
}
