import { Chunk, GenerateContext } from "../shared";
import { Template } from "../shared/template";
import { generateDomainError } from "./domain-error.generator";
import {
  DomainErrorTemplateOptions,
  DomainErrorTemplateValues,
} from "./domain-error.types";

export class DomainErrorTemplate
  implements Template<DomainErrorTemplateValues, DomainErrorTemplateOptions>
{
  readonly name = "Command";
  readonly description = "Generates a command";
  readonly options: DomainErrorTemplateOptions = {
    name: {
      name: "name",
      label: "Error Name",
      description: "The name of the error",
      optionType: "string",
    },
    message: {
      name: "message",
      label: "Message",
      description: "The default message of the error",
      optionType: "tokenString",
    },
    parameters: {
      name: "parameters",
      label: "Parameters",
      description: "The parameters of the command",
      optionType: "properties",
    },
  };
  readonly defaultValues = {
    name: "UserAlreadyExists",
    message: "User for {{id}} already exists.",
    parameters: [{ name: "id", valueType: "UserId" }],
  };
  generate(
    values: DomainErrorTemplateValues,
    context: GenerateContext,
    chunkName?: string
  ): Chunk {
    return generateDomainError(values, context, chunkName);
  }
}
