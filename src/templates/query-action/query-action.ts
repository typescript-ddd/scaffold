import { Project } from "ts-morph";
import { strings } from "../../utils";
import { GenerateContext } from "../shared";

export type GenerateQueryActionOptions = {
  subject: string;
  path: string;
  requestType?: string;
  responseType?: string;
  contextType?: string;
};

export const generateQueryAction = (
  options: GenerateQueryActionOptions,
  context: GenerateContext
) => {
  const {
    subject,
    path,
    requestType,
    responseType,
    contextType,
  } = options;
  const methodType = "Get";
  const className = `${methodType}${strings.capitalize(subject)}Action`;

  const project = new Project();
  const sourceFile = project.createSourceFile(
    `${context.fileName}.ts`,
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
    tags: [
      { tagName: "param", text: `{QueryBus} queryBus - The query bus.` },
    ],
  });

  classDeclaration.addProperty({
    name: "method",
    type: "string",
    initializer: "\"GET\"",
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

  let output = sourceFile.getFullText();

  return output;
};
