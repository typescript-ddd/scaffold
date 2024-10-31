import { Project, Scope } from "ts-morph";
import { strings } from "../../utils";
import { GenerateContext } from "../shared";

export type GenerateEntityUpdaterOptions = {
  entityName: string;
};

export const generateEntityUpdater = (
  options: GenerateEntityUpdaterOptions,
  context: GenerateContext
) => {
  const { entityName } = options;
  const entityUpdaterType = `${strings.capitalize(entityName)}Updater`;
  const repositoryType = `${strings.capitalize(entityName)}Repository`;
  const entityType = strings.capitalize(entityName);
  const updatePropsType = `Update${entityType}Props`;
  const finderType = `${strings.capitalize(entityName)}Finder`;

  const project = new Project();
  const sourceFile = project.createSourceFile(
    `${context.fileName}.ts`,
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
        text: `{${finderType}} finder - The ${strings.natural(entityName)} finder.`,
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
      writer.writeLine(`const ${strings.lower(entityName)} = await this.finder.findById(props.id);`);
      writer.writeLine(
        `${strings.lower(entityName)}.update(props);`
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

  let output = sourceFile.getFullText();

  return output;
};
