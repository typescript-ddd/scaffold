import { Chunk, GenerateContext } from "../shared";
import { Template } from "../shared/template";
import { generateEntityRepositoryInterface } from "./entity-repository-interface.generator";
import {
  EntityRepositoryInterfaceTemplateOptions,
  EntityRepositoryInterfaceTemplateValues,
} from "./entity-repository-interface.types";

export class EntityRepositoryInterfaceTemplate
  implements
    Template<EntityRepositoryInterfaceTemplateValues, EntityRepositoryInterfaceTemplateOptions>
{
  readonly name = "Entity Repository Interface";
  readonly description = "Generates an entity repository interface";
  readonly options: EntityRepositoryInterfaceTemplateOptions = {
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
  generate(values: EntityRepositoryInterfaceTemplateValues, context: GenerateContext, chunkName?: string): Chunk {
    return generateEntityRepositoryInterface(values, context, chunkName);
  }
}
