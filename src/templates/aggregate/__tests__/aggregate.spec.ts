import { ContextBuilder, GenerateContext } from "../../shared";
import { generateAggregate } from "../aggregate";

describe("Aggregate", () => {
  let context: GenerateContext;

  beforeEach(() => {
    context = ContextBuilder.build("@src");
  });

  it("Should render the aggregate component", () => {
    const output = generateAggregate(
      {
        entityName: "User",
        properties: [{ name: "name", type: "string" }],
        trackable: false,
      },
      context
    );

    expect(output).toMatchSnapshot();
  });

  it("Should render the trackable aggregate component", () => {
    const output = generateAggregate(
      {
        entityName: "User",
        properties: [{ name: "name", type: "string" }],
        trackable: true,
      },
      context
    );

    expect(output).toMatchSnapshot();
  });
});
