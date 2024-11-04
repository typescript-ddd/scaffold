import { ContextBuilder, GenerateContext } from "../../shared";
import { AggregateRootTemplate } from "../aggregate-root.template";

describe("Aggregate", () => {
  let context: GenerateContext;
  let template: AggregateRootTemplate;

  beforeEach(() => {
    context = ContextBuilder.build("@src");
    template = new AggregateRootTemplate();
  });

  it("Should render the aggregate root component", () => {
    
    context.addImportDeclaration({
      moduleSpecifier: "@src/domain/models",
      namedImports: ["Phone"],
    });

    const chunk = template.generate(
      {
        entityName: "User",
        properties: [{ name: "name", valueType: "string" }, { name: "phone", valueType: "Phone"}],
        trackable: false,
      },
      context
    );

    expect(chunk).toBeDefined();
    expect(chunk.name).toBe("AggregateRoot");
    expect(chunk.content).toMatchSnapshot();
  });

  it("Should render the trackable aggregate root component", () => {
    const chunk = template.generate(
      {
        entityName: "User",
        properties: [{ name: "name", valueType: "string" }],
        trackable: true,
      },
      context
    );

    expect(chunk).toBeDefined();
    expect(chunk.name).toBe("AggregateRoot");
    expect(chunk.content).toMatchSnapshot();
  });
});
