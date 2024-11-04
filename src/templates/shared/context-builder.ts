import {
  GenerateContext,
  ContextImportDeclaration,
  Chunk,
} from "./generate-context";
import { arrays } from "../../utils";
import { SourceFile } from "ts-morph";

export class ContextBuilder implements GenerateContext {
  private _currentFile?: { fileName: string; projectPath: string[] };
  private _importDeclarations: ContextImportDeclaration[] = [];
  private _chunks: Chunk[] = [];

  private constructor(
    public readonly rootDir: string = "@/src",
    currentFile?: { fileName: string; projectPath: string[] }
  ) {
    this._currentFile = currentFile;
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

  addChunk(chunk: Chunk): void {
    this._chunks.push(chunk);
    this._currentFile = undefined;
  }

  getChunks(): Chunk[] {
    return this._chunks;
  }

  getChunk(name: string): Chunk | undefined {
    return this._chunks.find((x) => x.name === name);
  }

  flushChunks(): Chunk[] {
    const chunks = this._chunks;
    this._chunks = [];
    return chunks;
  }

  get currentFile(): { fileName: string; projectPath: string[] } | undefined {
    return this._currentFile;
  }

  set currentFile(value: { fileName: string; projectPath: string[] } | undefined) {
    this._currentFile = value;
  }

  static build(rootDir: string): ContextBuilder {
    return new ContextBuilder(rootDir);
  }
}
