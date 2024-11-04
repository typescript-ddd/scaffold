import { Project, Scope } from "ts-morph";
import { strings } from "../../utils";
import { Chunk, GenerateContext } from "../shared";
import { EntityCreatorTemplateValues } from "./entity-creator.types";

export const generateEntityCreator = (
  values: EntityCreatorTemplateValues,
  context: GenerateContext,
  chunkName?: string
): Chunk => {
  const { entityName } = values;
  const entityCreatorType = `${strings.capitalize(entityName)}Creator`;
  const repositoryType = `${strings.capitalize(entityName)}Repository`;
  const entityType = strings.capitalize(entityName);
  const entityIdType = `${entityType}Id`;
  const createPropsType = `Create${entityType}Props`;
  const {
    fileName = `${strings.kebab(entityName, "creator")}.ts`,
    projectPath = ["application", "create"],
  } = context.currentFile || {};
  const project = new Project();
  const sourceFile = project.createSourceFile(
    fileName,
    `
export class ${entityCreatorType} {}    
`
  );

  context.addImportDeclaration({
    moduleSpecifier: `@typescript-ddd/core`,
    namedImports: ["DomainEventBus", "Uuid"],
  });

  context.addImportDeclaration({
    moduleSpecifier: context.resolveDir("domain"),
    namedImports: [entityType, entityIdType, createPropsType, repositoryType],
  });

  context.writeSourceFileImports(sourceFile);

  const classDeclaration = sourceFile.getClass(entityCreatorType);
  classDeclaration.addJsDoc({
    description: `Represents ${strings.describe(entityCreatorType)}.`,
  });

  const constructorDeclaration = classDeclaration.addConstructor({
    scope: Scope.Private,
    parameters: [
      {
        name: "repository",
        type: repositoryType,
        scope: Scope.Private,
        isReadonly: true,
      },
      {
        name: "domainEventBus",
        type: "DomainEventBus",
        scope: Scope.Private,
        isReadonly: true,
      },
    ],
  });
  constructorDeclaration.addJsDoc({
    description: `Initializes a new instance of ${strings.describe(
      entityCreatorType
    )}.`,
    tags: [
      {
        tagName: "param",
        text: `{${repositoryType}} repository - The ${strings.natural(
          entityName
        )} repository.`,
      },
      {
        tagName: "param",
        text: `{DomainEventBus} domainEventBus - The domain event bus.`,
      },
    ],
  });

  classDeclaration
    .addMethod({
      name: "create",
      scope: Scope.Public,
      returnType: `Promise<${entityType}>`,
      parameters: [
        {
          name: "props",
          type: createPropsType,
        },
      ],
      isAsync: true,
    })
    .setBodyText((writer) => {
      writer.writeLine(
        `const ${strings.lower(
          entityName
        )} = ${entityType}.create(props, ${entityIdType}.create());`
      );
      writer.writeLine(
        `await this.repository.save(${strings.lower(entityName)});`
      );
      writer.writeLine(
        `const events = ${strings.lower(entityName)}.getUncommittedEvents();`
      );
      writer.writeLine(`this.domainEventBus.publish(...events);`);
      writer.writeLine(`return ${strings.lower(entityName)};`);
    })
    .addJsDoc({
      description: `Creates a new ${strings.natural(entityName)}.`,
      tags: [
        {
          tagName: "param",
          text: `{${createPropsType}} props - The properties to create the ${strings.natural(
            entityName
          )}.`,
        },
        {
          tagName: "returns",
          text: `{Promise<${entityType}>} The created ${strings.natural(
            entityName
          )}.`,
        },
      ],
    });

  return {
    name: chunkName || "EntityCreator",
    fileName,
    projectPath,
    content: sourceFile.getFullText(),
    values,
  };
};
