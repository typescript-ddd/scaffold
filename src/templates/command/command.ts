import { Project, Scope } from "ts-morph";
import { strings } from "../../utils";
import { GenerateContext } from "../shared";

export type GenerateCommandOptions = {
  entityName: string;
  actionName: string;
  properties: {
    name: string;
    type: string;
    nullable?: boolean;
    description?: string;
  }[];
};

export const generateCommand = (
  options: GenerateCommandOptions,
  context: GenerateContext
) => {
  const { entityName, actionName, properties } = options;
  const commandName = `${strings.capitalize(actionName)}${strings.capitalize(
    entityName
  )}Command`;

  const project = new Project();
  const sourceFile = project.createSourceFile(
    `${context.fileName}.ts`,
    `
export class ${commandName} implements Command {}    
`
  );

  context.addImportDeclaration({
    moduleSpecifier: `@typescript-ddd/core`,
    namedImports: ["Command"],
  });

  context.writeSourceFileImports(sourceFile);

  const classDeclaration = sourceFile.getClass(commandName);
  classDeclaration.addJsDoc({
    description: `Represents ${strings.describe(commandName)}.`,
  });

  const constructorDeclaration = classDeclaration.addConstructor({
    parameters: [
      ...properties.map((property) => ({
        name: property.name,
        type: property.type,
        hasQuestionToken: property.nullable,
        scope: Scope.Public,
        isReadonly: true,
      })),
    ],
  });
  constructorDeclaration.setBodyText(`// TODO: Add validation`);
  constructorDeclaration.addJsDoc({
    description: `Initializes a new instance of ${strings.describe(
      commandName
    )}.`,
    tags: properties.map((property) => ({
      tagName: "param",
      text: `{${property.type}} ${property.name} ${
        property.description ? `- ${property.description}` : ""
      }`,
    })),
  });

  let output = sourceFile.getFullText();

  return output;
};
