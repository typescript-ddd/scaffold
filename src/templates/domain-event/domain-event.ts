import { Project, Scope } from "ts-morph";
import { strings } from "../../utils";
import { GenerateContext } from "../shared";

export type GenerateDomainEventOptions = {
  entityName: string;
  eventAction: string;
  eventId?: string;
};

export const generateDomainEvent = (
  options: GenerateDomainEventOptions,
  context: GenerateContext
) => {
  const {
    entityName,
    eventAction,
    eventId = `${strings.lower(entityName)}/${strings.lower(eventAction)}`,
  } = options;
  const entityType = strings.capitalize(entityName);
  const actionType = strings.capitalize(eventAction);
  const className = [entityType, actionType, "Event"].join("");
  const entityIdType = `${entityType}Id`;
  const project = new Project();
  const sourceFile = project.createSourceFile(
    `${context.fileName}.ts`,
    `
export class ${className} extends DomainEvent<${entityType}> {}    
`
  );

  sourceFile.addImportDeclaration({
    moduleSpecifier: `@typescript-ddd/core`,
    namedImports: ["DomainEvent"],
  });
  sourceFile.addImportDeclaration({
    moduleSpecifier: context.resolveDir("domain"),
    namedImports: [entityType, entityIdType],
  });

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

  let output = sourceFile.getFullText();

  return output;
};
