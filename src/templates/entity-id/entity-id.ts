import { Project, Scope } from "ts-morph";
import { strings } from "../../utils";
import { GenerateContext } from "../shared";

export type GenerateEntityIdOptions = {
  entityName: string;
};

export const generateEntityId = (
  options: GenerateEntityIdOptions,
  context: GenerateContext
) => {
  const { entityName } = options;
  const name = strings.capitalize(entityName);
  const idName = `${name}Id`;
  const fileName = strings.kebab(entityName);

  const project = new Project();
  const sourceFile = project.createSourceFile(
    `${fileName}.ts`,
    `
export class ${idName} extends EntityId {}    
`
  );

  sourceFile.addImportDeclaration({
    moduleSpecifier: `@typescript-ddd/core`,
    namedImports: ["EntityId", "Uuid"],
  });

  const classDeclaration = sourceFile.getClass(idName);
  classDeclaration.addJsDoc({
    description: `Represents the unique identifier of ${strings.describe(
      name
    )}.`,
    tags: [{ tagName: "extends", text: "{EntityId}" }],
  });

  const constructorDeclaration = classDeclaration.addConstructor({
    scope: Scope.Private,
    parameters: [{ name: "value", type: "string" }],
  });
  constructorDeclaration.setBodyText(`super(value);`);
  constructorDeclaration.addJsDoc({
    description: `Initializes a new instance of ${strings.describe(
      name
    )} identifier.`,
    tags: [{ tagName: "param", text: "value The value of the identifier." }],
  });

  classDeclaration
    .addMethod({
      name: "create",
      isStatic: true,
      returnType: idName,
    })
    .setBodyText(`return new ${idName}(Uuid.create().value);`)
    .insertJsDoc(0, {
      description: `Creates a new instance of ${strings.describe(
        name
      )} identifier.`,
      tags: [
        {
          tagName: "returns",
          text: `{${idName}} - ${strings.capitalize(strings.describe(name))} identifier.`,
        },
      ],
    });

  classDeclaration
    .addMethod({
      name: "fromValue",
      isStatic: true,
      parameters: [{ name: "value", type: "string" }],
      returnType: idName,
    })
    .setBodyText(`return new ${idName}(value);`)
    .insertJsDoc(0, {
      description: `Creates a new instance of ${strings.describe(
        name
      )} identifier from its value.`,
      tags: [
        {
          tagName: "param",
          text: "{string} value - The value of the identifier.",
        },
        {
            tagName: "throws",
            text: `{InvariantViolationError} - When the value is null, empty or invalid.`,
        },
        {
          tagName: "returns",
          text: `{${idName}} - ${strings.capitalize(strings.describe(name))} identifier.`,
        }
      ],
    });

  let output = sourceFile.getFullText();

  return output;
};
