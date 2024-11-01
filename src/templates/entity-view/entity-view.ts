import { Project, Scope } from "ts-morph";
import { strings } from "../../utils";
import { GenerateContext } from "../shared";
import { writer } from "repl";

export type GenerateEntityViewOptions = {
  entityName: string;
  properties: {
    name: string;
    type: string;
    valueType?: string;
    method?: string;
    prop?: string;
    nullable?: boolean;
    format?: string;
    description?: string;
  }[];
};

export const generateEntityView = (
  options: GenerateEntityViewOptions,
  context: GenerateContext
) => {
  const { entityName, properties = [] } = options;
  const entityType = strings.capitalize(entityName);
  const viewType = `${entityType}View`;

  const project = new Project();
  const sourceFile = project.createSourceFile(
    `${context.fileName}.ts`,
    `
export class ${viewType} {}    
`
  );

  context.addImportDeclaration({
    moduleSpecifier: context.resolveDir("domain"),
    namedImports: [entityType],
  });

  context.writeSourceFileImports(sourceFile);

  const classDeclaration = sourceFile.getClass(viewType);
  classDeclaration.addJsDoc({
    description: `Represents ${strings.describe(viewType)}.`,
  });

  const constructorDeclaration = classDeclaration.addConstructor({
    scope: Scope.Private,
    parameters: [{ name: strings.lower(entityName), type: entityType }],
  });
  constructorDeclaration.setBodyText((writer) => {
    properties.forEach((property) => {
      if (property.name === "id") {
        writer.writeLine(`this.id = ${strings.lower(entityName)}.id${property.type === "string" ? ".value" : "" };`);
      } else {
        writer.writeLine(
          `this.${property.name} = ${strings.lower(
            entityName
          )}.get${strings.capitalize(property.name)}();`
        );
      }
    });
  });
  constructorDeclaration.addJsDoc({
    description: `Initializes a new instance of ${strings.describe(viewType)}.`,
    tags: [{ tagName: "param", text: "{string} id - The entity id." }],
  });

  properties.forEach((property) => {
    classDeclaration
      .addProperty({
        name: property.name,
        type: property.type,
        scope: Scope.Public,
        isReadonly: true,
        hasQuestionToken: property.nullable,
      })
      .addJsDoc({
        description:
          property.description ||
          `The ${strings.natural(property.name)} of the ${strings.natural(
            entityName
          )}.`,
        tags: [
          ...(property.format
            ? [{ tagName: "format", text: property.format }]
            : []),
        ],
      });
  });

  classDeclaration
    .addMethod({
      name: "create",
      isStatic: true,
      parameters: [{ name: strings.lower(entityName), type: entityType }],
      returnType: viewType,
    })
    .setBodyText((writer) => {
      writer.writeLine(`return new ${viewType}(${strings.lower(entityName)});`);
    });

  classDeclaration
    .addMethod({
      name: "createMany",
      isStatic: true,
      parameters: [
        { name: strings.lower(entityName), type: `${entityType}[]` },
      ],
      returnType: `${viewType}[]`,
    })
    .setBodyText((writer) => {
      writer.writeLine(
        `return ${strings.lower(entityName)}.map(${strings.lower(
          entityName
        )} => ${viewType}.create(${strings.lower(entityName)}));`
      );
    });

  let output = sourceFile.getFullText();

  return output;
};
