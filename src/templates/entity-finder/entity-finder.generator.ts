import { Project, Scope } from "ts-morph";
import { strings } from "../../utils";
import { GenerateContext } from "../shared";
import { EntityFinderTemplateValues } from "./entity-finder.types";

export const generateEntityFinder = (
  values: EntityFinderTemplateValues,
  context: GenerateContext
) => {
  const { entityName } = values;
  const entityFinderType = `${strings.capitalize(entityName)}Finder`;
  const repositoryType = `${strings.capitalize(entityName)}Repository`;
  const entityType = strings.capitalize(entityName);
  const entityIdType = `${entityType}Id`;

  const project = new Project();
  const sourceFile = project.createSourceFile(
    `${context.fileName}.ts`,
    `
export class ${entityFinderType} {}    
`
  );

  context.addImportDeclaration({
    moduleSpecifier: `@typescript-ddd/core`,
    namedImports: ["Criteria", "DomainEventBus", "EntityNotFoundError", "Uuid"],
  });

  context.addImportDeclaration({
    moduleSpecifier: context.resolveDir("domain"),
    namedImports: [entityType, entityIdType, repositoryType],
  });

  context.writeSourceFileImports(sourceFile);

  const classDeclaration = sourceFile.getClass(entityFinderType);
  classDeclaration.addJsDoc({
    description: `Represents ${strings.describe(entityFinderType)}.`,
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
      entityFinderType
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
      name: "findById",
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
        `const ${strings.lower(
          entityName
        )} = await this.repository.getById(id);`
      );
      writer.writeLine(`if (!${strings.lower(entityName)}) {`);
      writer.writeLine(`  throw new EntityNotFoundError("${entityType}", id);`);
      writer.writeLine(`}`);
      writer.writeLine(`return ${strings.lower(entityName)};`);
    })
    .addJsDoc({
      description: `Finds ${strings.describe(entityName)} by ${strings.describe(
        entityName
      )} identifier.`,
      tags: [
        {
          tagName: "param",
          text: `{${entityIdType}} id - The identifier of the ${strings.natural(
            entityName
          )}.`,
        },
        {
          tagName: "returns",
          text: `{Promise<${entityType}>} The ${strings.natural(entityName)}.`,
        },
      ],
    });

  classDeclaration
    .addMethod({
      name: "findAll",
      parameters: [{ name: "criteria", type: "Criteria" }],
      isAsync: true,
      returnType: `Promise<${entityType}[]>`,
    })
    .setBodyText((writer) => {
      const instances = strings.plural(strings.lower(entityName));
      writer.writeLine(
        `const ${instances} = await this.repository.getAll(criteria);`
      );
      writer.writeLine(`return ${instances};`);
    })
    .addJsDoc({
      description: `Finds all ${strings.plural(
        strings.natural(entityName)
      )} with the specified criteria.`,
      tags: [
        {
          tagName: "param",
          text: `{Criteria} criteria - The criteria to find the ${strings.plural(
            strings.natural(entityName)
          )}.`,
        },
        {
          tagName: "returns",
          text: `{Promise<${entityType}[]>} The ${strings.plural(strings.natural(entityName))} matching the criteria.`,
        },
      ],
    });

  let output = sourceFile.getFullText();

  return output;
};
