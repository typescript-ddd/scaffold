import { GenerateContext } from "../shared";
import { Template } from "../shared/template";
import { generateValueObject } from "./value-object.generator";
import {
  ValueObjectTemplateOptions,
  ValueObjectTemplateValues,
} from "./value-object.types";

export class ValueObjectTemplate
  implements Template<ValueObjectTemplateValues, ValueObjectTemplateOptions>
{
  readonly name = "ValueObject";
  readonly description = "Generates a value object";
  readonly options: ValueObjectTemplateOptions = {
    name: {
      name: "name",
      label: "Name",
      description: "The name of the value object",
      optionType: "string",
    },
    valueType: {
      name: "valueType",
      label: "Value Type",
      description: "The value type of the value object",
      optionType: "string",
    },
    valueProps: {
      name: "valueProps",
      label: "Value Props",
      description: "The value props of the value object",
      optionType: "properties",
    },
    validationErrorMessage: {
      name: "validationErrorMessage",
      label: "Validation Error Message",
      description: "The validation error message of the value object",
      optionType: "string",
    },
    generateValueGetters: {
      name: "generateValueGetters",
      label: "Generate Value Getters",
      description: "Whether to generate value getters",
      optionType: "boolean",
    },
  };
  readonly defaultValues: ValueObjectTemplateValues = {
    name: "Phone",
    valueType: "PhoneProps",
    valueProps: [{ name: "number", valueType: "string" }],
    generateValueGetters: true,
    validationErrorMessage: "Invalid phone number",
  };
  generate(values: ValueObjectTemplateValues, context: GenerateContext): string {
    return generateValueObject(values, context);
  }
}
