import { ContextBuilder } from "../../shared";
import { generateDomainError } from "../domain-error";

describe("DomainError", () => {
  it("should generate domain error", () => {
    // Arrange
    const options = {
      name: "UserLockedOut",
      message: "User is locked out.",
    };
    const context = ContextBuilder.build("@src");

    // Act
    const output = generateDomainError(options, context);

    // Assert
    expect(output).toMatchSnapshot();
  });

  it("should generate domain error with properties", () => {
    // Arrange
    const options = {
      name: "UserAlreadyExists",
      message: "User for {{id}} already exists.",
      parameters: [
        { name: "id", type: "UserId"}
      ]
    };
    const context = ContextBuilder.build("@src");
    context.addImportDeclaration({
        moduleSpecifier: context.resolveDir("domain"),
        namedImports: ["UserId"]
    })

    // Act
    const output = generateDomainError(options, context);

    // Assert
    expect(output).toMatchSnapshot();
  });
});
