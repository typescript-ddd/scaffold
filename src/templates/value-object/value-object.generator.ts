import { Project, Scope } from "ts-morph";
import { strings } from "../../utils";
import { Chunk, GenerateContext } from "../shared";
import { ValueObjectTemplateValues } from "./value-object.types";

export const generateValueObject = (
  values: ValueObjectTemplateValues,
  context: GenerateContext,
  chunkName?: string
): Chunk => {
  const {
    name,
    valueType = "string",
    valueProps,
    validationErrorMessage,
    generateValueGetters = false,
  } = values;
  const className = strings.capitalize(name);
  const {
    fileName = `${strings.kebab(name)}.ts`,
    projectPath = ["domain", "model"],
  } = context.currentFile || {};
  const project = new Project();
  const sourceFile = project.createSourceFile(
    fileName,
    `
export class ${className} extends ValueObject<${valueType}> {}    
`
  );
  context.addImportDeclaration({
    moduleSpecifier: `@typescript-ddd/core`,
    namedImports: ["InvariantViolationError", "ValueObject"],
  });

  context.writeSourceFileImports(sourceFile);

  if (valueProps?.length) {
    sourceFile
      .insertInterface(1, {
        name: valueType,
        properties: valueProps.map((prop) => ({
          name: prop.name,
          type: prop.valueType,
        })),
        isExported: true,
      })
      .addJsDoc({
        description: `Represents the value properties of ${strings.describe(
          className
        )}.`,
      });
  }

  const classDeclaration = sourceFile.getClass(className);
  classDeclaration.addJsDoc({
    description: `Represents ${strings.describe(name)} value.`,
    tags: [{ tagName: "extends", text: "{ValueObject}" }],
  });

  const constructorDeclaration = classDeclaration.addConstructor({
    scope: Scope.Private,
    parameters: [{ name: "value", type: valueType }],
  });

  constructorDeclaration.setBodyText((writer) => {
    writer.write("super(value);");
    writer.writeLine(`if (!${className}.validate(value)) {`);
    writer.writeLine(
      `  throw new InvariantViolationError("${
        validationErrorMessage ||
        `Invalid value for ${strings.describe(className)}.`
      }");`
    );
    writer.writeLine(`}`);
  });
  constructorDeclaration.addJsDoc({
    description: `Initializes a new instance of ${strings.describe(
      name
    )} value.`,
    tags: [
      {
        tagName: "param",
        text: `{${valueType}} value - ${strings.describe(valueType)} value.`,
      },
    ],
  });

  if (valueProps?.length && generateValueGetters) {
    valueProps.forEach((prop) => {
      classDeclaration
        .addMethod({
          name: `get${strings.capitalize(prop.name)}`,
          returnType: prop.valueType,
        })
        .setBodyText(`return this.value.${prop.name};`)
        .insertJsDoc(0, {
          description: `Gets the ${strings.lower(prop.name)} value.`,
          tags: [
            {
              tagName: "returns",
              text: `{${prop.valueType}} - The ${strings.lower(
                prop.name
              )} value.`,
            },
          ],
        });
    });
  }

  classDeclaration
    .addMethod({
      name: "selfEquals",
      returnType: "boolean",
      scope: Scope.Protected,
      parameters: [{ name: "other", type: className }],
    })
    .setBodyText((writer) => {
      if (["string", "number"].includes(valueType)) {
        writer.writeLine("return this.value === other.value;");
        return;
      }
      writer.writeLine("//TODO: Implement value comparison");
      writer.writeLine("return false;");
    })
    .insertJsDoc(0, {
      tags: [{ tagName: "inhertiDoc" }],
    });

  classDeclaration
    .addMethod({
      name: "validate",
      isStatic: true,
      parameters: [{ name: "value", type: valueType }],
      returnType: "boolean",
    })
    .setBodyText((writer) => {
      writer.writeLine("// TODO : Implement validation");
      writer.writeLine("return true;");
    })
    .insertJsDoc(0, {
      description: `Validates the value of ${strings.describe(name)}.`,
      tags: [
        {
          tagName: "param",
          text: `{${valueType}} value - The value to validate.`,
        },
        {
          tagName: "returns",
          text: `{boolean} - True if the value is valid, otherwise false.`,
        },
      ],
    });

  classDeclaration
    .addMethod({
      name: "create",
      isStatic: true,
      parameters: [{ name: "value", type: "string" }],
      returnType: className,
    })
    .setBodyText(`return new ${className}(value);`)
    .insertJsDoc(0, {
      description: `Creates a new instance of ${strings.describe(name)} value.`,
      tags: [
        {
          tagName: "returns",
          text: `{${className}} - ${strings.capitalize(
            strings.describe(name)
          )} value.`,
        },
      ],
    });

  return {
    name: chunkName || "ValueObject",
    fileName,
    projectPath,
    content: sourceFile.getFullText(),
    values,
  };
};
