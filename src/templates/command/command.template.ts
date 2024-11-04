import { Chunk, GenerateContext } from "../shared";
import { Template } from "../shared/template";
import { generateCommand } from "./command.generator";
import { CommandTemplateOptions, CommandTemplateValues } from "./command.types";

export class CommandTemplate
  implements Template<CommandTemplateValues, CommandTemplateOptions>
{
  readonly name = "Command";
  readonly description = "Generates a command";
  readonly options: CommandTemplateOptions = {
    actionName: {
      name: "actionName",
      label: "Action Name",
      description: "The name of the action",
      optionType: "string",
    },
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
  };
  readonly defaultValues = {
    actionName: "Create",
    entityName: "User",
    properties: [],
  };
  generate(values: CommandTemplateValues, context: GenerateContext, chunkName?: string): Chunk {
    return generateCommand(values, context, chunkName);
  }
}
