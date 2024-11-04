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
    const chunk = template.generate(
      {
        entityName: "User",
      },
      context
    );

    expect(chunk).toBeDefined();
    expect(chunk.name).toBe("EntityFinder");
    expect(chunk.content).toMatchSnapshot();
  });
});
