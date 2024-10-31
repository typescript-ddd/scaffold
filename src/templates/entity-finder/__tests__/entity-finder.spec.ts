import { GenerateContext, ContextBuilder } from "../../shared";
import { generateEntityFinder } from "../entity-finder";

describe("EntityFinder", () => {
  let context: GenerateContext;

  beforeEach(() => {
    context = ContextBuilder.build("@src");
  });

  it("Should render the entity finder template", () => {
    const output = generateEntityFinder(
      {
        entityName: "User",
      },
      context
    );

    expect(output).toMatchSnapshot();
  });
});
