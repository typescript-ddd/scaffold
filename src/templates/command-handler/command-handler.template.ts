import { GenerateContext } from "../shared";
import { Template } from "../shared/template";
import { generateCommandHandler } from "./command-handler.generator";
import {
  CommandHandlerTemplateOptions,
  CommandHandlerTemplateValues,
} from "./command-handler.types";

export class CommandHandlerTemplate
  implements
    Template<CommandHandlerTemplateValues, CommandHandlerTemplateOptions>
{
  readonly name = "Command";
  readonly description = "Generates a command";
  readonly options: CommandHandlerTemplateOptions = {
    actionName: {
      name: "actionName",
      label: "Action Name",
      description: "The name of the action",
      optionType: "enum",
      enum: { create: "Create", update: "Update", delete: "Delete" },
    },
    entityName: {
      name: "entityName",
      label: "Entity Name",
      description: "The name of the entity",
      optionType: "string",
    },
    actor: {
      name: "actor",
      label: "Actor",
      description: "The actor of the command",
      optionType: "string",
    },
    returnType: {
      name: "returnType",
      label: "Return Type",
      description: "The return type of the command",
      optionType: "string",
    },
    commandProperties: {
      name: "commandProperties",
      label: "Properties",
      description: "The properties of the command",
      optionType: "properties",
    },
    returnsView: {
      name: "returnsView",
      label: "Returns View",
      description: "Whether the command returns a view",
      optionType: "boolean",
    },
  };
  readonly defaultValues = {
    actionName: "create",
    entityName: "User",
    actor: "UserCreator",
    returnType: "UserView",
    commandProperties: [{ name: "name", valueType: "string" }],
    returnsView: true,
  };
  generate(values: CommandHandlerTemplateValues, context: GenerateContext): string {
    return generateCommandHandler(values, context);
  }
}
