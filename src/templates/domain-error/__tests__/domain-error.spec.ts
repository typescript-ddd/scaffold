import { ContextBuilder, GenerateContext } from "../../shared";
import { DomainErrorTemplate } from "../domain-error.template";

describe("DomainError", () => {
  let context: GenerateContext;
  let template: DomainErrorTemplate;

  beforeEach(() => {
    context = ContextBuilder.build("@src");
    template = new DomainErrorTemplate();
  });

  it("should generate domain error", () => {
    // Arrange
    const options = {
      name: "UserLockedOut",
      message: "User is locked out.",
      parameters: []      
    };

    // Act
    const output = template.generate(options, context);

    // Assert
    expect(output).toMatchSnapshot();
  });

  it("should generate domain error with properties", () => {
    // Arrange
    const options = {
      name: "UserAlreadyExists",
      message: "User for {{id}} already exists.",
      parameters: [
        { name: "id", valueType: "UserId"}
      ]
    };
    const context = ContextBuilder.build("@src");
    context.addImportDeclaration({
        moduleSpecifier: context.resolveDir("domain"),
        namedImports: ["UserId"]
    })

    // Act
    const output = template.generate(options, context);

    // Assert
    expect(output).toMatchSnapshot();
  });
});
