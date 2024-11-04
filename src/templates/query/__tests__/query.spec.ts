import { ContextBuilder, GenerateContext } from "../../shared";
import { QueryTemplate } from "../query.template";

describe("query", () => {
  let context: GenerateContext;
  let template: QueryTemplate;

  beforeEach(() => {
    context = ContextBuilder.build("@src");
    template = new QueryTemplate();
  });

  it("Should render the query template", () => {
    context.addImportDeclaration({
      moduleSpecifier: context.resolveDir("domain"),
      namedImports: ["UserId"],
    });

    const chunk = template.generate(
      {
        entityName: "User",
        actionName: "find",
        properties: [
          { name: "id", valueType: "UserId" },
        ],
      },
      context
    );

    expect(chunk).toBeDefined();
    expect(chunk.name).toBe("Query");
    expect(chunk.content).toMatchSnapshot();
  });
});
