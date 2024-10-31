import { ContextBuilder, GenerateContext } from "../../shared";
import { generateEntity } from "../entity";

describe("Entity", () => {
  let context: GenerateContext;

  beforeEach(() => {
    context = ContextBuilder.build("@src");
  });

  it("Should render the entity component", () => {
    const output = generateEntity(
      {
        entityName: "Invoice",
        properties: [{ name: "orderId", type: "OrderId" }],
        trackable: false,
        importDeclarations: [
          {
            moduleSpecifier: context.resolveDir("domain", "models"),
            namedImports: ["OrderId"],
          },
        ],
      },
      context
    );

    expect(output).toMatchSnapshot();
  });

  it("Should render the trackable entity component", () => {
    const context = ContextBuilder.build("@src");
    const output = generateEntity(
      {
        entityName: "Invoice",
        properties: [{ name: "orderId", type: "OrderId" }],
        trackable: true,
        importDeclarations: [
          {
            moduleSpecifier: context.resolveDir("domain", "models"),
            namedImports: ["OrderId"],
          },
        ],
      },
      context
    );

    expect(output).toMatchSnapshot();
  });
});
