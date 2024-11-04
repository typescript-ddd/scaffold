import { Chunk, GenerateContext } from "../shared";
import { Template } from "../shared/template";
import { generateEntityUpdater } from "./entity-updater.generator";
import {
  EntityUpdaterTemplateOptions,
  EntityUpdaterTemplateValues,
} from "./entity-updater.types";

export class EntityUpdaterTemplate
  implements
    Template<EntityUpdaterTemplateValues, EntityUpdaterTemplateOptions>
{
  readonly name = "Entity Updater";
  readonly description = "Generates an entity updater";
  readonly options: EntityUpdaterTemplateOptions = {
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
  generate(values: EntityUpdaterTemplateValues, context: GenerateContext): Chunk {
    return generateEntityUpdater(values, context);
  }
}
