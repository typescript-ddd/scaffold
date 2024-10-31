import { GenerateContext, ContextBuilder } from "../../shared";
import { generateValueObject } from "../value-object";

describe("ValueObject", () => {
  let context: GenerateContext;

  beforeEach(() => {
    context = ContextBuilder.build("@src");
  });

  it("Should render the value object component", () => {
        
    const output = generateValueObject(
      { name: "FirstName", valueType: "string" },
      context
    );

    expect(output).toMatchSnapshot();
  });

  it("Should render the value object component with properties", () => {
    const output = generateValueObject(
      { name: "Phone", valueType: "PhoneProps", valueProps: [{ name: "number", type: "string" }], generateValueGetters: true },
      context
    );

    expect(output).toMatchSnapshot();
  });
});
