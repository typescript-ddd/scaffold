import { Project, Scope } from "ts-morph";
import { strings } from "../../utils";
import { GenerateContext } from "../shared";

export type GenerateQueryOptions = {
  entityName: string;
  actionName?: string;
  properties: {
    name: string;
    type: string;
    nullable?: boolean;
    description?: string;
  }[];
};

export const generateQuery = (
  options: GenerateQueryOptions,
  context: GenerateContext
) => {
  const { entityName, actionName = "Find", properties } = options;
  const queryName = `${strings.capitalize(actionName)}${strings.capitalize(
    entityName
  )}Query`;

  const project = new Project();
  const sourceFile = project.createSourceFile(
    `${context.fileName}.ts`,
    `
export class ${queryName} implements Query {}    
`
  );

  context.addImportDeclaration({
    moduleSpecifier: `@typescript-ddd/core`,
    namedImports: ["Query"],
  });

  context.writeSourceFileImports(sourceFile);
  
  const classDeclaration = sourceFile.getClass(queryName);
  classDeclaration.addJsDoc({
    description: `Represents ${strings.describe(queryName)}.`,
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
      queryName
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
