import { Project, Scope } from "ts-morph";
import { strings } from "../../utils";
import { Chunk, GenerateContext } from "../shared";
import { QueryTemplateValues } from "./query.types";

export const generateQuery = (
  values: QueryTemplateValues,
  context: GenerateContext,
  chunkName?: string
): Chunk => {
  const { entityName, actionName = "Find", properties } = values;
  const queryName = `${strings.capitalize(actionName)}${strings.capitalize(
    entityName
  )}Query`;
  const {
    fileName = `${strings.kebab("find", entityName, "query")}.ts`,
    projectPath = [],
  } = context.currentFile || {};
  const project = new Project();
  const sourceFile = project.createSourceFile(
    fileName,
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
        type: property.valueType,
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
      text: `{${property.valueType}} ${property.name} - The ${property.name}.`,
    })),
  });

  return {
    name: chunkName || "Query",
    fileName,
    projectPath,
    content: sourceFile.getFullText(),
    values,
  };
};
