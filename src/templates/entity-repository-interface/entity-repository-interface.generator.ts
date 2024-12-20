import { Project } from "ts-morph";
import { strings } from "../../utils";
import { Chunk, GenerateContext } from "../shared";
import { EntityRepositoryInterfaceTemplateValues } from "./entity-repository-interface.types";

export const generateEntityRepositoryInterface = (
  values: EntityRepositoryInterfaceTemplateValues,
  context: GenerateContext,
  chunkName?: string
): Chunk => {
  const { entityName } = values;
  const entityType = strings.capitalize(entityName);
  const entityTypeId = `${entityType}Id`;
  const repositoryType = `${entityType}Repository`;
  const {
    fileName = `${strings.kebab(entityName, "repository")}.ts`,
    projectPath = ["domain", "repository"],
  } = context.currentFile || {};
  const project = new Project();
  const sourceFile = project.createSourceFile(
    fileName,
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

  return {
    name: chunkName || "EntityRepositoryInterface",
    fileName,
    projectPath,
    content: sourceFile.getFullText(),
    values,
  };
};
