import { GenerateContext, ContextBuilder } from "../../shared";
import { EntityDeleterTemplate } from "../entity-deleter.template";

describe("EntityDeleter", () => {
  let context: GenerateContext;
  let template: EntityDeleterTemplate;

  beforeEach(() => {
    context = ContextBuilder.build("@src");
    template = new EntityDeleterTemplate();
  });

  it("Should render the entity deleter template", () => {
    const output = template.generate(
      {
        entityName: "User",
      },
      context
    );

    expect(output).toMatchSnapshot();
  });
});
