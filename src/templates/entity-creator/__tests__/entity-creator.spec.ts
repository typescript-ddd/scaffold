import { GenerateContext, ContextBuilder } from "../../shared";
import { EntityCreatorTemplate } from "../entity-creator.template";

describe("EntityCreator", () => {
  let context: GenerateContext;
  let template: EntityCreatorTemplate;

  beforeEach(() => {
    context = ContextBuilder.build("@src");
    template = new EntityCreatorTemplate();
  });

  it("Should render the entity creator template", () => {
    const output = template.generate(
      {
        entityName: "User",
      },
      context
    );

    expect(output).toMatchSnapshot();
  });
});
