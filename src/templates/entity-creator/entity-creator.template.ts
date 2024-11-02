import { GenerateContext } from "../shared";
import { Template } from "../shared/template";
import { generateEntityCreator } from "./entity-creator.generator";
import {
  EntityCreatorTemplateOptions,
  EntityCreatorTemplateValues,
} from "./entity-creator.types";

export class EntityCreatorTemplate
  implements
    Template<EntityCreatorTemplateValues, EntityCreatorTemplateOptions>
{
  readonly name = "Entity Creator";
  readonly description = "Generates an entity creator";
  readonly options: EntityCreatorTemplateOptions = {
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
  generate(values: EntityCreatorTemplateValues, context: GenerateContext): string {
    return generateEntityCreator(values, context);
  }
}
