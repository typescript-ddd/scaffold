import { GenerateContext, Chunk } from "./generate-context";
import { Template, TemplateOption } from "./template";

export interface Bundle<
  TValues extends { [K in keyof TOptions]: any },
  TOptions extends { [key: string]: TemplateOption }
> extends Omit<Template<TValues, TOptions>, "generate"> {
  generate(value: TValues, context: GenerateContext): Chunk[];
}
