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

    const output = template.generate(
      {
        entityName: "User",
        properties: [{ name: "name", valueType: "string" }, { name: "phone", valueType: "Phone"}],
        trackable: false,
      },
      context
    );

    expect(output).toMatchSnapshot();
  });

  it("Should render the trackable aggregate root component", () => {
    const output = template.generate(
      {
        entityName: "User",
        properties: [{ name: "name", valueType: "string" }],
        trackable: true,
      },
      context
    );

    expect(output).toMatchSnapshot();
  });
});
