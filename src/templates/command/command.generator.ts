import { Project, Scope } from "ts-morph";
import { strings } from "../../utils";
import { Chunk, GenerateContext } from "../shared";
import { CommandTemplateValues } from "./command.types";

export const generateCommand = (
  values: CommandTemplateValues,
  context: GenerateContext,
  chunkName?: string
): Chunk => {
  const { entityName, actionName, properties } = values;
  const commandName = `${strings.capitalize(actionName)}${strings.capitalize(
    entityName
  )}Command`;
  const {
    fileName = `${strings.kebab(actionName, entityName, "command")}.ts`,
    projectPath = ["application", strings.lower(actionName)],
  } = context.currentFile || {};
  const project = new Project();
  const sourceFile = project.createSourceFile(
    fileName,
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
      commandName
    )}.`,
    tags: properties.map((property) => ({
      tagName: "param",
      text: `{${property.valueType}} ${property.name} - The ${property.name}.`,
    })),
  });

  const content = sourceFile.getFullText();

  return {
    name: chunkName || `${strings.capitalize(actionName)}EntityCommand`,
    fileName,
    projectPath,
    content,
    values,
  };
};
