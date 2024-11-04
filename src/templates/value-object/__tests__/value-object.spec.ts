import { GenerateContext, ContextBuilder } from "../../shared";
import { ValueObjectTemplate } from "../value-object.template";

describe("ValueObject", () => {
  let context: GenerateContext;
  let template: ValueObjectTemplate;

  beforeEach(() => {
    context = ContextBuilder.build("@src");
    template = new ValueObjectTemplate();
  });

  it("Should render the value object component", () => {
    const chunk = template.generate(
      { name: "FirstName", valueType: "string" },
      context
    );

    expect(chunk).toBeDefined();
    expect(chunk.name).toBe("ValueObject");
    expect(chunk.content).toMatchSnapshot();
  });

  it("Should render the value object component with properties", () => {
    const chunk = template.generate(
      {
        name: "Phone",
        valueType: "PhoneProps",
        valueProps: [{ name: "number", valueType: "string" }],
        generateValueGetters: true,
      },
      context
    );

    expect(chunk).toBeDefined();
    expect(chunk.name).toBe("ValueObject");
    expect(chunk.content).toMatchSnapshot();
  });
});
