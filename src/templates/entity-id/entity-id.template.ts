import { GenerateContext } from "../shared";
import { Template } from "../shared/template";
import { generateEntityId } from "./entity-id.generator";
import {
  EntityIdTemplateOptions,
  EntityIdTemplateValues,
} from "./entity-id.types";

export class EntityIdTemplate
  implements
    Template<EntityIdTemplateValues, EntityIdTemplateOptions>
{
  readonly name = "Entity ID";
  readonly description = "Generates an entity ID";
  readonly options: EntityIdTemplateOptions = {
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
  generate(values: EntityIdTemplateValues, context: GenerateContext): string {
    return generateEntityId(values, context);
  }
}
