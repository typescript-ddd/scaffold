import { ContextBuilder, GenerateContext } from "../../shared";
import { EntityTemplate } from "../entity.template";

describe("Entity", () => {
  let context: GenerateContext;
  let template: EntityTemplate;

  beforeEach(() => {
    context = ContextBuilder.build("@src");
    context.addImportDeclaration({
      moduleSpecifier: context.resolveDir("domain"),
      namedImports: ["OrderId"],
    });
    template = new EntityTemplate();
  });

  it("Should render the entity component", () => {
    const chunk = template.generate(
      {
        entityName: "Invoice",
        properties: [{ name: "orderId", valueType: "OrderId" }],
        trackable: false,
      },
      context
    );

    expect(chunk).toBeDefined();
    expect(chunk.name).toBe("Entity");
    expect(chunk.content).toMatchSnapshot();
  });

  it("Should render the trackable entity component", () => {
    const context = ContextBuilder.build("@src");
    const chunk = template.generate(
      {
        entityName: "Invoice",
        properties: [{ name: "orderId", valueType: "OrderId" }],
        trackable: true,
      },
      context
    );

    expect(chunk).toBeDefined();
    expect(chunk.name).toBe("Entity");
    expect(chunk.content).toMatchSnapshot();
  });
});
