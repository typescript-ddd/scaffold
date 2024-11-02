import { GenerateContext, ContextImportDeclaration } from "./generate-context";
import { arrays } from "../../utils";
import { SourceFile } from "ts-morph";

export class ContextBuilder implements GenerateContext {
  private _fileName: string;
  private _importDeclarations: ContextImportDeclaration[] = [];

  private constructor(
    private rootDir: string = "@/src",
    fileName: string = "example.ts"
  ) {
    this._fileName = fileName;
  }

  resolveDir(
    type: "domain" | "infrastructure" | "application" | "presentation",
    subPath?: string
  ): string {
    switch (type) {
      case "domain":
        return `${this.rootDir}/domain${subPath ? `/${subPath}` : ""}`;
      case "infrastructure":
        return `${this.rootDir}/infrastructure${subPath ? `/${subPath}` : ""}`;
      case "application":
        return `${this.rootDir}/application${subPath ? `/${subPath}` : ""}`;
      case "presentation":
        return `${this.rootDir}/presentation${subPath ? `/${subPath}` : ""}`;
      default:
        throw new Error(`Unknown type ${type} for resolveDir`);
    }
  }

  getImportDeclarations(moduleSpecifier?: string): ContextImportDeclaration[] {
    const modules = this.getModuleSpecifiers();

    const declarations: ContextImportDeclaration[] = [];

    for (const currentModule of modules) {
      const namedImports = this.getNamedImports(currentModule);
      declarations.push({ moduleSpecifier: currentModule, namedImports });
    }

    if (moduleSpecifier) {
      return declarations.filter((x) => x.moduleSpecifier === moduleSpecifier);
    }

    return declarations;
  }

  addImportDeclaration(declaration: ContextImportDeclaration): void {
    this._importDeclarations.push(declaration);
  }

  getModuleSpecifiers(): string[] {
    return arrays.distinct(
      this._importDeclarations.map((x) => x.moduleSpecifier)
    );
  }

  getNamedImports(moduleSpecifier: string): string[] {
    return arrays.distinct(
      this._importDeclarations
        .filter((x) => x.moduleSpecifier === moduleSpecifier)
        .map((x) => x.namedImports)
        .flat()
    );
  }

  writeSourceFileImports(sourceFile: SourceFile) {
    const importDeclarations = this.getImportDeclarations();
    const moduleSpecifiers = this.getModuleSpecifiers();

    const coreImports = importDeclarations.filter(
      (x) => x.moduleSpecifier === "@typescript-ddd/core"
    );

    if (coreImports) {
      sourceFile.addImportDeclaration({
        moduleSpecifier: `@typescript-ddd/core`,
        namedImports: coreImports.map((x) => x.namedImports).flat(),
      });
    }

    // Non core and root imports
    for (const moduleSpecifier of moduleSpecifiers
      .filter(
        (x) => x !== "@typescript-ddd/core" && !x.startsWith(this.rootDir)
      )
      .sort((a, b) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      })) {
      sourceFile.addImportDeclaration({
        moduleSpecifier,
        namedImports: this.getNamedImports(moduleSpecifier),
      });
    }

    // Root imports
    for (const moduleSpecifier of moduleSpecifiers
      .filter((x) => x.startsWith(this.rootDir))
      .sort((a, b) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      })) {
      sourceFile.addImportDeclaration({
        moduleSpecifier,
        namedImports: this.getNamedImports(moduleSpecifier),
      });
    }
  }

  clearImportDeclarations(): void {
    this._importDeclarations = [];
  }

  tokenize(text: string, tokens: { name: string }[]): string {
    let output = text;
    tokens.forEach((token) => {
      output = output.replace(`{{${token.name}}}`, "${" + token.name + "}");
    });
    return "`" + output + "`";
  }

  get fileName(): string {
    return this._fileName;
  }

  static build(rootDir: string): ContextBuilder {
    return new ContextBuilder(rootDir);
  }
}
