import { Project, Scope } from "ts-morph";
import { strings } from "../../utils";
import { GenerateContext } from "../shared";

export type GenerateEntityDeleterOptions = {
  entityName: string;
};

export const generateEntityDeleter = (
  options: GenerateEntityDeleterOptions,
  context: GenerateContext
) => {
  const { entityName } = options;
  const entityDeleterType = `${strings.capitalize(entityName)}Deleter`;
  const repositoryType = `${strings.capitalize(entityName)}Repository`;
  const entityType = strings.capitalize(entityName);
  const entityIdType = `${entityType}Id`;
  const finderType = `${strings.capitalize(entityName)}Finder`;

  const project = new Project();
  const sourceFile = project.createSourceFile(
    `${context.fileName}.ts`,
    `
export class ${entityDeleterType} {}    
`
  );

  context.addImportDeclaration({
    moduleSpecifier: `@typescript-ddd/core`,
    namedImports: ["DomainEventBus"],
  });

  context.addImportDeclaration({
    moduleSpecifier: context.resolveDir("domain"),
    namedImports: [entityType, entityIdType, repositoryType],
  });

  context.addImportDeclaration({
    moduleSpecifier: context.resolveDir("application"),
    namedImports: [finderType],
  });

  context.writeSourceFileImports(sourceFile);

  const classDeclaration = sourceFile.getClass(entityDeleterType);
  classDeclaration.addJsDoc({
    description: `Represents ${strings.describe(entityDeleterType)}.`,
  });

  const constructorDeclaration = classDeclaration.addConstructor({
    scope: Scope.Private,
    parameters: [
      {
        name: "finder",
        type: finderType,
        scope: Scope.Private,
        isReadonly: true,
      },
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
      entityDeleterType
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
      name: "delete",
      scope: Scope.Public,
      returnType: `Promise<${entityType}>`,
      parameters: [
        {
          name: "id",
          type: entityIdType,
        },
      ],
      isAsync: true,
    })
    .setBodyText((writer) => {      
      writer.writeLine(
        `const ${strings.lower(entityName)} = await this.finder.findById(id);`
      );
      writer.writeLine(`${strings.lower(entityName)}.delete();`);
      writer.writeLine(`await this.repository.remove(id);`);
      writer.writeLine(
        `const events = ${strings.lower(entityName)}.getUncommittedEvents();`
      );
      writer.writeLine(`this.domainEventBus.publish(...events);`);
      writer.writeLine(`return ${strings.lower(entityName)};`);
    })
    .addJsDoc({
      description: `Deletes ${strings.describe(entityName)}.`,
      tags: [
        {
          tagName: "param",
          text: `{${entityIdType}} id - The identity of the ${strings.natural(
            entityName
          )} to delete.`,
        },
        {
          tagName: "returns",
          text: `{Promise<void>}`,
        },
      ],
    });

  let output = sourceFile.getFullText();

  return output;
};
