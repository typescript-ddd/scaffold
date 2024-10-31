import { Project, Scope } from "ts-morph";
import { strings } from "../../utils";
import { GenerateContext } from "../shared";

export type GenerateTemplateOptions = {
  name: string;
};

export const generateTemplate = (
  options: GenerateTemplateOptions,
  context: GenerateContext
) => {
  const { name } = options;
  const className = strings.capitalize(name);

  const project = new Project();
  const sourceFile = project.createSourceFile(
    `${context.fileName}.ts`,
    `
export class ${className} {}    
`
  );

  context.addImportDeclaration({
    moduleSpecifier: `@typescript-ddd/core`,
    namedImports: ["Entity"],
  });

  context.writeSourceFileImports(sourceFile);

  const classDeclaration = sourceFile.getClass(className);
  classDeclaration.addJsDoc({
    description: `${strings.describe(name)}.`,
  });

  const constructorDeclaration = classDeclaration.addConstructor({
    scope: Scope.Private,
    parameters: [{ name: "value", type: "string" }],
  });
  constructorDeclaration.setBodyText(`super(value);`);
  constructorDeclaration.addJsDoc({
    description: `Initializes a new instance of ${strings.describe(
      name
    )} identifier.`,
    tags: [{ tagName: "param", text: "value The value of the identifier." }],
  });

  let output = sourceFile.getFullText();

  return output;
};
