import { Chunk, GenerateContext } from "../shared";
import { Template } from "../shared/template";
import { generateEntity } from "./entity.generator";
import { EntityTemplateOptions, EntityTemplateValues } from "./entity.types";

export class EntityTemplate
  implements Template<EntityTemplateValues, EntityTemplateOptions>
{
  readonly name = "Command";
  readonly description = "Generates a command";
  readonly options: EntityTemplateOptions = {
    entityName: {
      name: "entityName",
      label: "Entity Name",
      description: "The name of the entity",
      optionType: "string",
    },
    properties: {
      name: "properties",
      label: "Properties",
      description: "The properties of the command",
      optionType: "properties",
    },
    trackable: {
      name: "trackable",
      label: "Trackable",
      description: "Whether the entity is trackable",
      optionType: "boolean",
    },
  };
  readonly defaultValues = {
    entityName: "User",
    properties: [{ name: "name", valueType: "string" }],
    trackable: false,
  };
  generate(values: EntityTemplateValues, context: GenerateContext, chunkName?: string): Chunk {
    return generateEntity(values, context, chunkName);
  }
}
