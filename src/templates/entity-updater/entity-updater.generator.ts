import { Project, Scope } from "ts-morph";
import { strings } from "../../utils";
import { Chunk, GenerateContext } from "../shared";
import { EntityUpdaterTemplateValues } from "./entity-updater.types";

export const generateEntityUpdater = (
  values: EntityUpdaterTemplateValues,
  context: GenerateContext,
  chunkName?: string
): Chunk => {
  const { entityName } = values;
  const entityUpdaterType = `${strings.capitalize(entityName)}Updater`;
  const repositoryType = `${strings.capitalize(entityName)}Repository`;
  const entityType = strings.capitalize(entityName);
  const updatePropsType = `Update${entityType}Props`;
  const finderType = `${strings.capitalize(entityName)}Finder`;
  const {
    fileName = `${strings.kebab(entityName, "updater")}.ts`,
    projectPath = ["application", "update"],
  } = context.currentFile || {};
  const project = new Project();
  const sourceFile = project.createSourceFile(
    fileName,
    `
export class ${entityUpdaterType} {}    
`
  );

  context.addImportDeclaration({
    moduleSpecifier: `@typescript-ddd/core`,
    namedImports: ["DomainEventBus"],
  });

  context.addImportDeclaration({
    moduleSpecifier: context.resolveDir("domain"),
    namedImports: [entityType, updatePropsType, repositoryType],
  });

  context.addImportDeclaration({
    moduleSpecifier: context.resolveDir("application"),
    namedImports: [finderType],
  });

  context.writeSourceFileImports(sourceFile);

  const classDeclaration = sourceFile.getClass(entityUpdaterType);
  classDeclaration.addJsDoc({
    description: `Represents ${strings.describe(entityUpdaterType)}.`,
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
      entityUpdaterType
    )}.`,
    tags: [
      {
        tagName: "param",
        text: `{${finderType}} finder - The ${strings.natural(
          entityName
        )} finder.`,
      },
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
      name: "update",
      scope: Scope.Public,
      returnType: `Promise<${entityType}>`,
      parameters: [
        {
          name: "props",
          type: updatePropsType,
        },
      ],
      isAsync: true,
    })
    .setBodyText((writer) => {
      writer.writeLine(
        `const ${strings.lower(
          entityName
        )} = await this.finder.findById(props.id);`
      );
      writer.writeLine(`${strings.lower(entityName)}.update(props);`);
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
      description: `Updates ${strings.describe(entityName)}.`,
      tags: [
        {
          tagName: "param",
          text: `{${updatePropsType}} props - The properties to update the ${strings.natural(
            entityName
          )}.`,
        },
        {
          tagName: "returns",
          text: `{Promise<${entityType}>} The updated ${strings.natural(
            entityName
          )}.`,
        },
      ],
    });

  return {
    name: chunkName || "EntityUpdater",
    fileName,
    projectPath,
    content: sourceFile.getFullText(),
    values,
  };
};
