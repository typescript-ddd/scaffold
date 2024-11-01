import { Project, Scope } from "ts-morph";
import { strings } from "../../utils";
import { GenerateContext } from "../shared";

const actorMap: Record<string, string> = {
  find: "finder",
}

export type GenerateQueryHandlerOptions = {
  entityName: string;
  actionName?: string;
  actor: string;
  returnType: string;
  queryProperties: { name: string; type: string }[];
};

export const generateQueryHandler = (
  options: GenerateQueryHandlerOptions,
  context: GenerateContext
) => {
  const { entityName, actionName = "find", actor, queryProperties, returnType } =
    options;
  const entityType = strings.capitalize(entityName);
  const actionType = strings.capitalize(actionName);
  const actorType = strings.capitalize(actor);
  const queryType = `${actionType}${entityType}Query`;
  const actorName = strings.lower(actorMap[actionName] ?? "finder");

  const className = `${actionType}${entityType}Handler`;

  const project = new Project();
  const sourceFile = project.createSourceFile(
    `${context.fileName}.ts`,
    `
export class ${className} implements QueryHandler<${queryType}> {}    
`
  );

  context.addImportDeclaration({
    moduleSpecifier: `@typescript-ddd/core`,
    namedImports: ["QueryHandler"],
  });

  context.addImportDeclaration({
    moduleSpecifier: context.resolveDir("application"),
    namedImports: [queryType, actorType],
  });

  context.writeSourceFileImports(sourceFile);

  const classDeclaration = sourceFile.getClass(className);
  classDeclaration.addJsDoc({
    description: `Represents ${strings.describe(className)}.`,
  });

  classDeclaration.addConstructor({
    parameters: [{ name: actorName, type: actorType, isReadonly: true, scope: Scope.Private }],
  })
  .addJsDoc({
    description: `Initializes a new instance of ${strings.describe(
      className
    )}.`,
    tags: [
      {
        tagName: "param",
        text: `{${actorType}} ${actorName} - The ${actorName} to handle the query.`,
      },
    ],
  });

  classDeclaration
    .addMethod({
      name: "handle",
      isAsync: true,
      returnType: `Promise<${returnType}>`,
      parameters: [{ name: "query", type: queryType }],
    })
    .setBodyText((writer) => {
      writer.writeLine(
        `const ${strings.lower(entityName)} = await this.${actorName}.${strings.lower(
          actionName
        )}(`
      );
      queryProperties.forEach((property, index) => {
        writer.writeLine(
          `  query.${property.name}${
            index === queryProperties.length - 1 ? "" : ","
          }`
        );
      });
      writer.writeLine(`);`);
      writer.writeLine(
        `return ${returnType}.${strings.lower(actionName)}(${strings.lower(
          entityName
        )});`
      );
    })
    .addJsDoc({
      description: `Handles ${strings.describe(queryType)}.`,
      tags: [
        {
          tagName: "param",
          text: `{${queryType}} query - The query to handle.`,
        },
        {
          tagName: "returns",
          text: `{Promise<${returnType}>} - ${strings.capitalize(strings.describe(returnType))}.`,
        },
      ],
    })

  let output = sourceFile.getFullText();

  return output;
};