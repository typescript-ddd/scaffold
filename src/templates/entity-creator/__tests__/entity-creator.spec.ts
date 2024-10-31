import { GenerateContext, ContextBuilder } from "../../shared";
import { generateEntityCreator } from "../entity-creator";

describe("EntityCreator", () => {
  let context: GenerateContext;

  beforeEach(() => {
    context = ContextBuilder.build("@src");
  });

  it("Should render the entity creator template", () => {
    const output = generateEntityCreator(
      {
        entityName: "User",
      },
      context
    );

    expect(output).toMatchSnapshot();
  });
});
