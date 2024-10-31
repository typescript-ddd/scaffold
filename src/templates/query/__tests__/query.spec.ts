import { ContextBuilder, GenerateContext } from "../../shared";
import { generateQuery } from "../query";

describe("query", () => {
  let context: GenerateContext;

  beforeEach(() => {
    context = ContextBuilder.build("@src");
  });

  it("Should render the query template", () => {
    context.addImportDeclaration({
      moduleSpecifier: context.resolveDir("domain"),
      namedImports: ["UserId"],
    });

    const output = generateQuery(
      {
        entityName: "User",
        properties: [
          { name: "id", type: "UserId", description: "The user's id." },
        ],
      },
      context
    );

    expect(output).toMatchSnapshot();
  });
});
