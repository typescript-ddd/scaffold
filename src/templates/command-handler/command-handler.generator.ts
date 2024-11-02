import { Project, Scope } from "ts-morph";
import { strings } from "../../utils";
import { GenerateContext } from "../shared";
import { CommandHandlerTemplateValues } from "./command-handler.types";

const actorMap: Record<string, string> = {
  create: "creator",
  update: "updater",
  delete: "deleter",
};

export const generateCommandHandler = (
  values: CommandHandlerTemplateValues,
  context: GenerateContext
) => {
  const {
    entityName,
    actionName,
    actor,
    commandProperties,
    returnType,
    returnsView = false,
  } = values;
  const entityType = strings.capitalize(entityName);
  const actionType = strings.capitalize(actionName);
  const actorType = strings.capitalize(actor);
  const commandType = `${actionType}${entityType}Command`;
  const actorName = strings.lower(actorMap[actionName]);

  const className = `${actionType}${entityType}Handler`;

  const project = new Project();
  const sourceFile = project.createSourceFile(
    `${context.fileName}.ts`,
    `
export class ${className} implements CommandHandler<${commandType}> {}    
`
  );

  context.addImportDeclaration({
    moduleSpecifier: `@typescript-ddd/core`,
    namedImports: ["CommandHandler"],
  });

  context.addImportDeclaration({
    moduleSpecifier: context.resolveDir("application", "create"),
    namedImports: [commandType, actorType],
  });

  context.writeSourceFileImports(sourceFile);

  const classDeclaration = sourceFile.getClass(className);
  classDeclaration.addJsDoc({
    description: `Represents ${strings.describe(className)}.`,
  });

  const constructorDeclaration = classDeclaration.addConstructor({
    parameters: [
      {
        name: actorName,
        type: actorType,
        isReadonly: true,
        scope: Scope.Private,
      },
    ],
  });
  constructorDeclaration.addJsDoc({
    description: `Initializes a new instance of ${strings.describe(
      className
    )}.`,
    tags: [
      {
        tagName: "param",
        text: `{${actorType}} ${actorName} - The ${actorName} to handle the command.`,
      },
    ],
  });

  classDeclaration
    .addMethod({
      name: "handle",
      isAsync: true,
      returnType: `Promise<${returnType}>`,
      parameters: [{ name: "command", type: commandType }],
    })
    .setBodyText((writer) => {
      const isArray = returnType.endsWith("[]");
      const returnName = isArray
        ? strings.plural(strings.lower(entityName))
        : strings.lower(entityName);

      writer.writeLine(
        `const ${returnName} = await this.${actorName}.${strings.lower(
          actionName
        )}({`
      );
      commandProperties.forEach((property, index) => {
        writer.writeLine(
          `  ${property.name}: command.${property.name}${
            index === commandProperties.length - 1 ? "" : ","
          }`
        );
      });
      writer.writeLine(`});`);

      if (!returnsView) {
        writer.writeLine(`return ${returnName};`);
      } else {
        const viewCreator = returnType.endsWith("[]")
          ? returnType.slice(0, -2)
          : returnType;
        writer.writeLine(
          `return ${viewCreator}.${
            isArray ? "createMany" : "create"
          }(${returnName});`
        );
      }
    })
    .addJsDoc({
      description: `Handles ${strings.describe(commandType)}.`,
      tags: [
        {
          tagName: "param",
          text: `{${commandType}} command - The command to handle.`,
        },
        {
          tagName: "returns",
          text: `{Promise<${returnType}>} - ${strings.capitalize(
            strings.describe(returnType)
          )}.`,
        },
      ],
    });

  let output = sourceFile.getFullText();

  return output;
};
