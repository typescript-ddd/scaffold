import { GenerateContext } from "./generate-context";

export type TemplateEnum = Record<string, string>;
export type TemplatePropertyValueType =
  | "string"
  | "number"
  | "boolean"
  | "date";

export type TemplateEnumOption = {
  name: string;
  label: string;
  description: string;
  enum: TemplateEnum;
  optionType: "enum";
};

export type TemplateStringOption = {
  name: string;
  label: string;
  description: string;
  optionType: "string";
};

export type TemplateTokenStringOption = {
  name: string;
  label: string;
  description: string;
  optionType: "tokenString";
};

export type TemplateBooleanOption = {
  name: string;
  label: string;
  description: string;
  optionType: "boolean";
};

export type TemplateNumberOption = {
  name: string;
  label: string;
  description: string;
  optionType: "number";
};

export type TemplateDateOption = {
  name: string;
  label: string;
  description: string;
  optionType: "date";
};

export type TemplatePropertyOption = {
  name: string;
  valueType: TemplatePropertyValueType;
  nullable?: boolean;
  prop?: string;
};

export type TemplatePropertyValue = {
  name: string;
  valueType: string;
  nullable?: boolean;
  prop?: string;
};

export type TemplatePropertiesOption = {
  name: string;
  label: string;
  description: string;
  optionType: "properties";
};

export type TemplateOption =
  | TemplateEnumOption
  | TemplateStringOption
  | TemplateBooleanOption
  | TemplateNumberOption
  | TemplateDateOption
  | TemplatePropertiesOption
  | TemplateTokenStringOption;

export type Maybe<T> = T | null | undefined;

export interface Template<
  TValues extends { [K in keyof TOptions]: any},
  TOptions extends { [key: string]: TemplateOption }
> {
  name: string;
  description: string;
  options: TOptions;
  defaultValues: TValues;
  generate(values: TValues, context: GenerateContext): string;
}