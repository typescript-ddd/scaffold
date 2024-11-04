import { Project } from "ts-morph";
import { strings } from "../../utils";
import { Chunk, GenerateContext } from "../shared";
import { DomainEventSubscriberTemplateValues } from "./domain-event-subscriber.types";

export const generateDomainEventSubscriber = (
  values: DomainEventSubscriberTemplateValues,
  context: GenerateContext,
  chunkName?: string
): Chunk => {
  const { eventName } = values;
  const eventType = strings.capitalize(eventName);
  const subscriberType = `${eventType}Subscriber`;
  const {
    fileName = `${strings.kebab(eventName, "subscriber")}.ts`,
    projectPath = ["application", eventType],
  } = context.currentFile || {};
  const project = new Project();
  const sourceFile = project.createSourceFile(
    fileName,
    `
export class ${subscriberType} implements DomainEventSubscriber<${eventType}> {}    
`
  );

  context.addImportDeclaration({
    moduleSpecifier: `@typescript-ddd/core`,
    namedImports: ["DomainEventSubscriber"],
  });

  context.addImportDeclaration({
    moduleSpecifier: context.resolveDir("domain", "event"),
    namedImports: [eventType],
  });

  context.writeSourceFileImports(sourceFile);

  const classDeclaration = sourceFile.getClass(subscriberType);
  classDeclaration.addJsDoc({
    description: `Represents ${strings.describe(subscriberType)}.`,
  });

  classDeclaration
    .addMethod({
      name: "on",
      parameters: [{ name: "event", type: eventType }],
      returnType: "void",
    })
    .setBodyText((writer) => {
      writer.writeLine(`// TODO: Implement subscriber logic.`);
    });

  return {
    name: chunkName || "DomainEventSubscriber",
    content: sourceFile.getFullText(),
    fileName,
    projectPath,
    values,
  };
};
