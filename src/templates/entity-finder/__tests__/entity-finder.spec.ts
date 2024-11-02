import { GenerateContext, ContextBuilder } from "../../shared";
import { EntityFinderTemplate } from "../entity-finder.template";

describe("EntityFinder", () => {
  let context: GenerateContext;
  let template: EntityFinderTemplate;

  beforeEach(() => {
    context = ContextBuilder.build("@src");
    template = new EntityFinderTemplate();
  });

  it("Should render the entity finder template", () => {
    const output = template.generate(
      {
        entityName: "User",
      },
      context
    );

    expect(output).toMatchSnapshot();
  });
});
