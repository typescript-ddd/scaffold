import { Project } from "ts-morph";
import { strings } from "../../utils";
import { Chunk, GenerateContext } from "../shared";
import { DomainErrorTemplateValues } from "./domain-error.types";

export const generateDomainError = (
  values: DomainErrorTemplateValues,
  context: GenerateContext,
  chunkName?: string
): Chunk => {
  const { name, parameters = [], message = "An error has occurred." } = values;
  const entityName = strings.capitalize(name);
  const className = `${entityName}Error`;
  const { fileName = `${strings.kebab(name)}.ts`, projectPath = ["domain", "error"] } =
    context.currentFile || {};
  const project = new Project();
  const sourceFile = project.createSourceFile(
    fileName,
    `
export class ${className} extends DomainError {}    
`
  );

  context.addImportDeclaration({
    moduleSpecifier: `@typescript-ddd/core`,
    namedImports: ["DomainError"],
  });

  context.writeSourceFileImports(sourceFile);

  const classDeclaration = sourceFile.getClass(className);
  classDeclaration.addJsDoc({
    description: `Represents ${strings.describe(name)} error.`,
  });

  const constructorDeclaration = classDeclaration.addConstructor({
    parameters: parameters.map((property) => ({
      name: property.name,
      type: property.valueType,
      hasQuestionToken: property.nullable,
    })),
  });
  constructorDeclaration.setBodyText(
    `super(${context.tokenize(message, parameters)});`
  );
  constructorDeclaration.addJsDoc({
    description: `Initializes a new instance of ${strings.describe(name)}.`,
  });

  return {
    name: chunkName || `DomainError`,
    content: sourceFile.getFullText(),
    fileName,
    projectPath,
    values,
  };
};
