import { Project } from "ts-morph";
import { strings } from "../../utils";
import { Chunk, GenerateContext } from "../shared";
import { DomainEventTemplateValues } from "./domain-event.types";

export const generateDomainEvent = (
  values: DomainEventTemplateValues,
  context: GenerateContext,
  chunkName?: string
): Chunk => {
  const {
    entityName,
    eventAction,
    eventId = `${strings.lower(entityName)}/${strings.lower(eventAction)}`,
  } = values;
  const entityType = strings.capitalize(entityName);
  const actionType = strings.capitalize(eventAction);
  const className = [entityType, actionType, "Event"].join("");
  const entityIdType = `${entityType}Id`;
  const {
    fileName = `${strings.kebab(eventAction, entityName, "event")}.ts`,
    projectPath = ["domain", "event"],
  } = context.currentFile || {};
  const project = new Project();
  const sourceFile = project.createSourceFile(
    fileName,
    `
export class ${className} extends DomainEvent<${entityType}> {}    
`
  );

  context.addImportDeclaration({
    moduleSpecifier: `@typescript-ddd/core`,
    namedImports: ["DomainEvent"],
  });

  context.addImportDeclaration({
    moduleSpecifier: context.resolveDir("domain"),
    namedImports: [entityType, entityIdType],
  });

  context.writeSourceFileImports(sourceFile);

  const classDeclaration = sourceFile.getClass(className);
  classDeclaration.addJsDoc({
    description: `Represents ${strings.describe(className)}.`,
  });

  const constructorDeclaration = classDeclaration.addConstructor({
    parameters: [
      { name: "id", type: entityIdType },
      { name: "payload", type: entityType },
    ],
  });
  constructorDeclaration.setBodyText((writer) => {
    writer.writeLine(`super(id, "${eventId}", payload);`);
  });
  constructorDeclaration.addJsDoc({
    description: `Initializes a new instance of ${strings.describe(
      className
    )}.`,
    tags: [
      {
        tagName: "param",
        text: `{${entityIdType}} id - The identifier of the ${strings.lower(
          entityName
        )}.`,
      },
      {
        tagName: "param",
        text: `{${entityType}} payload - The ${strings.lower(
          entityName
        )} payload.`,
      },
    ],
  });

  return {
    name: chunkName || `Entity${actionType}DomainEvent`,
    content: sourceFile.getFullText(),
    fileName,
    projectPath,
    values,
  };
};
