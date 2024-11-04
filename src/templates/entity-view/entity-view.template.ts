import { Chunk, GenerateContext } from "../shared";
import { Template } from "../shared/template";
import { generateEntityView } from "./entity-view.generator";
import {
  EntityViewTemplateOptions,
  EntityViewTemplateValues,
} from "./entity-view.types";

export class EntityViewTemplate
  implements
    Template<EntityViewTemplateValues, EntityViewTemplateOptions>
{
  readonly name = "Entity View";
  readonly description = "Generates an entity view";
  readonly options: EntityViewTemplateOptions = {
    entityName: {
      name: "entityName",
      label: "Entity Name",
      description: "The name of the entity",
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
    properties: []
  };
  generate(values: EntityViewTemplateValues, context: GenerateContext, chunkName?: string): Chunk {
    return generateEntityView(values, context, chunkName);
  }
}
