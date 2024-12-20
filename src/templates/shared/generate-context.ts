import { SourceFile } from "ts-morph";

export type ContextImportDeclaration = {
  moduleSpecifier: string;
  namedImports: string[];
};

export type Chunk = {
  name: string;
  fileName: string;
  projectPath: string[];
  content: string;
  values: any;
};

export interface GenerateContext {
  rootDir: string;
  currentFile?: { fileName: string, projectPath: string[] };
  resolveDir(
    type: "domain" | "infrastructure" | "application" | "presentation",
    subPath?: string
  ): string;
  addImportDeclaration(declaration: ContextImportDeclaration): void;
  getImportDeclarations(moduleSpecifier?: string): ContextImportDeclaration[];
  getModuleSpecifiers(): string[];
  getNamedImports(moduleSpecifier?: string): string[];
  writeSourceFileImports: (sourceFile: SourceFile) => void;
  clearImportDeclarations(): void;
  tokenize: (text: string, tokens: { name: string }[]) => string;
  addChunk: (chunk: Chunk) => void;
  getChunks: () => Chunk[];
  getChunk: (name: string) => Chunk | undefined;
  flushChunks: () => Chunk[];
}
