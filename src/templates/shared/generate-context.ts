import { SourceFile } from "ts-morph";

export type ContextImportDeclaration = { moduleSpecifier: string; namedImports: string[] };

export interface GenerateContext {
    rootDir: string;
    fileName: string;
    resolveDir(type: "domain" | "infrastructure" | "application" | "presentation", subPath?: string): string;    
    addImportDeclaration(declaration: ContextImportDeclaration): void;
    getImportDeclarations(moduleSpecifier?: string): ContextImportDeclaration[];
    getModuleSpecifiers(): string[];
    getNamedImports(moduleSpecifier?: string): string[];    
    writeSourceFileImports: (sourceFile: SourceFile) => void;
    clearImportDeclarations(): void;
    tokenize: (text: string, tokens: { name: string }[]) => string;    
}