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
    const output = template.generate(
      { name: "FirstName", valueType: "string" },
      context
    );

    expect(output).toMatchSnapshot();
  });

  it("Should render the value object component with properties", () => {
    const output = template.generate(
      {
        name: "Phone",
        valueType: "PhoneProps",
        valueProps: [{ name: "number", valueType: "string" }],
        generateValueGetters: true,
      },
      context
    );

    expect(output).toMatchSnapshot();
  });
});
