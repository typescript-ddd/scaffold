import { Project, Scope } from "ts-morph";
import { strings } from "../../utils";
import { GenerateContext } from "../shared";

export type GenerateEntityRepositoryInterfaceOptions = {
  entityName: string;
};

export const generateEntityRepositoryInterface = (
  options: GenerateEntityRepositoryInterfaceOptions,
  context: GenerateContext
) => {
  const { entityName } = options;
  const entityType = strings.capitalize(entityName);
  const entityTypeId = `${entityType}Id`;
  const repositoryType = `${entityType}Repository`;

  const project = new Project();
  const sourceFile = project.createSourceFile(
    `${context.fileName}.ts`,
    `
export interface ${repositoryType} extends Repository<${entityTypeId},${entityType}> {}    
`
  );

  context.addImportDeclaration({
    moduleSpecifier: `@typescript-ddd/core`,
    namedImports: ["Repository"],
  });

  context.addImportDeclaration({
    moduleSpecifier: context.resolveDir("domain"),
    namedImports: [entityType, entityTypeId],
  });

  context.writeSourceFileImports(sourceFile);

  const interfaceDeclaration = sourceFile.getInterface(repositoryType);

  interfaceDeclaration.addJsDoc({
    description: `Represents ${strings.describe(repositoryType)} interface.`,
  });

  let output = sourceFile.getFullText();

  return output;
};
