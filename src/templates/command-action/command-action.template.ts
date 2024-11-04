import { Chunk, GenerateContext } from "../shared";
import { Template } from "../shared/template";
import { generateCommandAction } from "./command-action.generator";
import {
  CommandActionTemplateOptions,
  CommandActionTemplateValues,
} from "./command-action.types";

export class CommandActionTemplate
  implements
    Template<CommandActionTemplateValues, CommandActionTemplateOptions>
{
  readonly name = "Command Action";
  readonly description = "Generates a command action";
  readonly options: CommandActionTemplateOptions = {
    subject: {
      name: "subject",
      label: "Subject",
      description: "The subject of the command action",
      optionType: "string",
    },
    method: {
      name: "method",
      label: "Method",
      description: "The method of the command action",
      optionType: "string",
    },
    path: {
      name: "path",
      label: "Path",
      description: "The path of the event",
      optionType: "string",
    },
    contextType: {
      name: "contextType",
      label: "Context Type",
      description: "The type of the context",
      optionType: "string",
    },
    requestType: {
      name: "requestType",
      label: "Request Type",
      description: "The type of the request",
      optionType: "string",
    },
    responseType: {
      name: "responseType",
      label: "Response Type",
      description: "The type of the response",
      optionType: "string",
    },
  };
  readonly defaultValues = {
    subject: "User",
    method: "create",
    path: "UserCreated",
    requestType: "CreateUserRequest",
    responseType: "CreateUserResponse",
    contextType: "UserContext",
  };
  generate(values: CommandActionTemplateValues, context: GenerateContext, chunkName?: string): Chunk {
    return generateCommandAction(values, context, chunkName);
  }
}
