import { Project } from "ts-morph";
import { strings } from "../../utils";
import { Chunk, GenerateContext } from "../shared";
import { QueryActionTemplateValues } from "./query-action.types";

export const generateQueryAction = (
  values: QueryActionTemplateValues,
  context: GenerateContext,
  chunkName?: string
): Chunk => {
  const { subject, path, requestType, responseType, contextType } = values;
  const methodType = "Get";
  const className = `${methodType}${strings.capitalize(subject)}Action`;
  const {
    fileName = `${strings.kebab("get", subject, "action")}.ts`,
    projectPath = ["presentation", "get"],
  } = context.currentFile || {};
  const project = new Project();
  const sourceFile = project.createSourceFile(
    fileName,
    `
export class ${className} extends QueryAction {}    
`
  );

  context.addImportDeclaration({
    moduleSpecifier: `@typescript-ddd/core`,
    namedImports: ["QueryAction", "QueryBus"],
  });

  context.writeSourceFileImports(sourceFile);

  const classDeclaration = sourceFile.getClass(className);
  classDeclaration.addJsDoc({
    description: `Represents ${strings.describe(className)}.`,
  });

  const constructorDeclaration = classDeclaration.addConstructor({
    parameters: [{ name: "queryBus", type: "QueryBus", isReadonly: true }],
  });
  constructorDeclaration.setBodyText((writer) => {
    writer.writeLine(`super(queryBus);`);
  });
  constructorDeclaration.addJsDoc({
    description: `Initializes a new instance of ${strings.describe(
      className
    )}.`,
    tags: [{ tagName: "param", text: `{QueryBus} queryBus - The query bus.` }],
  });

  classDeclaration.addProperty({
    name: "method",
    type: "string",
    initializer: '"GET"',
    isReadonly: true,
  });

  classDeclaration.addProperty({
    name: "path",
    type: "string",
    initializer: `"${path}"`,
    isReadonly: true,
  });

  const executeDeclaration = classDeclaration.addMethod({
    name: "execute",
    parameters: [
      { name: "req", type: requestType || "any" },
      { name: "res", type: responseType || "any" },
      { name: "ctx", type: contextType || "any" },
    ],
    returnType: "Promise<void>",
    isAsync: true,
  });

  executeDeclaration.setBodyText((writer) => {
    writer.writeLine(`// TODO: Implement action logic.`);
    writer.writeLine(`res.json({ message: "Hello, World!" });`);
  });

  executeDeclaration.addJsDoc({
    description: `Executes the ${strings.describe(className)}.`,
    tags: [
      {
        tagName: "param",
        text: `{${requestType || "any"}} req - The request object.`,
      },
      {
        tagName: "param",
        text: `{${responseType || "any"}} res - The response object.`,
      },
      {
        tagName: "param",
        text: `{${contextType || "any"}} ctx - The context object.`,
      },
    ],
  });

  return {
    name: chunkName || `QueryAction`,
    fileName,
    projectPath,
    content: sourceFile.getFullText(),
    values,
  };
};
