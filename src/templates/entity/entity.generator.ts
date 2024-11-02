import { Project, Scope, StructureKind } from "ts-morph";
import { strings } from "../../utils";
import { GenerateContext } from "../shared";
import { EntityTemplateValues } from "./entity.types";

export const generateEntity = (
  values: EntityTemplateValues,
  context: GenerateContext
) => {
  const { entityName, properties = [], trackable = false } = values;
  const name = strings.capitalize(entityName);
  const idName = `${name}Id`;
  const fileName = strings.kebab(entityName);
  const baseName = trackable ? "TrackableEntity" : "Entity";

  const project = new Project();
  const sourceFile = project.createSourceFile(
    `${fileName}.ts`,
    `
export interface Create${name}Props extends EntityCreateProps {}
export interface Update${name}Props extends EntityUpdateProps<${idName}> {}
export class ${name} extends ${baseName}<${idName}> {}    
`
  );

  context.addImportDeclaration({
    moduleSpecifier: `@typescript-ddd/core`,
    namedImports: [
      baseName,
      "EntityCreateProps",
      "EntityUpdateProps",
      trackable ? "UtcDate" : "",
    ],
  });

  context.addImportDeclaration({
    moduleSpecifier: context.resolveDir("domain"),
    namedImports: [`${name}Id`],
  });

  context.writeSourceFileImports(sourceFile);

  const createInterface = sourceFile.getInterface(`Create${name}Props`);
  createInterface.addProperties(
    properties.map((property) => ({
      name: property.name,
      type: property.valueType,
      hasQuestionToken: property.nullable,
    }))
  );
  createInterface.addJsDoc({
    description: `Represents the properties required to create a ${strings.lower(
      name
    )}.`,
    tags: [{ tagName: "extends", text: "{EntityCreateProps}" }],
  });
  if (trackable) {
    createInterface.addProperties([
      { name: "createdAtUtc", type: "UtcDate", hasQuestionToken: true },
      { name: "updatedAtUtc", type: "UtcDate", hasQuestionToken: true },
    ]);
  }
  const updateInterface = sourceFile.getInterface(`Update${name}Props`);
  updateInterface.addProperties(
    properties.map((property) => ({
      name: property.name,
      type: property.valueType,
      hasQuestionToken: property.nullable,
    }))
  );
  updateInterface.addJsDoc({
    description: `Represents the properties required to update a ${strings.lower(
      name
    )}.`,
    tags: [{ tagName: "extends", text: "{EntityUpdateProps}" }],
  });
  const classDeclaration = sourceFile.getClass(name);
  classDeclaration.addJsDoc({
    description: `Represents a ${strings.lower(name)} entity.`,
    tags: [{ tagName: "extends", text: baseName }],
  });
  const constructorDeclaration = classDeclaration.addConstructor({
    scope: Scope.Private,
    parameters: trackable
      ? [
          { name: "id", type: `${name}Id`, hasQuestionToken: true },
          ...properties.map((property) => ({
            name: property.name,
            type: property.valueType,
            scope: Scope.Private,
            hasQuestionToken: property.nullable,
          })),
          { name: "createdAtUtc", type: "UtcDate", hasQuestionToken: true },
          { name: "updatedAtUtc", type: "UtcDate", hasQuestionToken: true },
        ]
      : [
          { name: "id", type: `${name}Id`, hasQuestionToken: true },
          ...properties.map((property) => ({
            name: property.name,
            type: property.valueType,
            scope: Scope.Private,
            hasQuestionToken: property.nullable,
          })),
        ],
  });
  constructorDeclaration.setBodyText((writer) => {
    if (trackable) {
      writer.writeLine(
        `super(id ?? ${idName}.create(), createdAtUtc, updatedAtUtc);`
      );
    } else {
      writer.writeLine(`super(id ?? ${idName}.create());`);
    }
  });
  constructorDeclaration.addJsDoc({
    description: `Initializes a new instance of ${strings.describe(name)}.`,
    tags: [
      {
        tagName: "param",
        text: `{${name}Id} id - An optional identifier of the ${strings.lower(
          name
        )}.`,
      },
      ...properties.map((property) => ({
        tagName: "param",
        text: `{${property.valueType}${property.nullable ? "?" : ""}} ${
          property.name
        } - The ${property.name} of the ${strings.lower(name)}.`,
      })),
      ...(trackable
        ? [
            {
              tagName: "param",
              text: "{UtcDate} createdAtUtc - An optional creation date.",
            },
            {
              tagName: "param",
              text: "{UtcDate} updatedAtUtc - An optional last update date.",
            },
          ]
        : []),
    ],
  });

  properties.forEach((property) => {
    classDeclaration
      .addMethod({
        name: `get${strings.capitalize(property.name)}`,
        returnType: property.valueType,
        hasQuestionToken: property.nullable,
      })
      .setBodyText(`return this.${property.name};`)
      .addJsDoc({
        description: `Gets the ${property.name} of the ${strings.lower(name)}.`,
        tags: [
          {
            tagName: "returns",
            text: `{${property.valueType}${
              property.nullable ? "?" : ""
            }} - The ${property.name} of the ${strings.lower(name)}.`,
          },
        ],
      });
  });

  classDeclaration
    .addMethod({
      name: "update",
      returnType: "void",
      parameters: [{ name: "props", type: `Update${name}Props` }],
      docs: [
        {
          description: `Update the ${strings.natural(name)}.`,
          kind: StructureKind.JSDoc,
          tags: [
            {
              tagName: "param",
              text: `{Update${name}Props} props - The properties to update.`,
            },
            {
              tagName: "returns",
              text: "void",
            },
          ],
        },
      ],
    })
    .setBodyText((writer) => {
      writer.writeLine(`// TODO: validate props`);
      properties.forEach((property) => {
        writer.writeLine(`this.${property.name} = props.${property.name};`);
      });
      if (trackable) {
        writer.writeLine(`this.updatedAtUtc = UtcDate.now();`);
      }
      writer.writeLine(
        `this.applyChange(new ${name}UpdatedEvent(this.id, this));`
      );
    });

  let output = sourceFile.getFullText();

  return output;
};
