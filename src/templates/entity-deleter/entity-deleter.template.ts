import { Chunk, GenerateContext } from "../shared";
import { Template } from "../shared/template";
import { generateEntityDeleter } from "./entity-deleter.generator";
import {
  EntityDeleterTemplateOptions,
  EntityDeleterTemplateValues,
} from "./entity-deleter.types";

export class EntityDeleterTemplate
  implements
    Template<EntityDeleterTemplateValues, EntityDeleterTemplateOptions>
{
  readonly name = "Entity Deleter";
  readonly description = "Generates an entity deleter";
  readonly options: EntityDeleterTemplateOptions = {
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
  generate(values: EntityDeleterTemplateValues, context: GenerateContext, chunkName?: string): Chunk {
    return generateEntityDeleter(values, context, chunkName);
  }
}
