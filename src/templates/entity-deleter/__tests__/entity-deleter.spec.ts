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
    const chunk = template.generate(
      {
        entityName: "User",
      },
      context
    );

    expect(chunk).toBeDefined();
    expect(chunk.name).toBe("EntityDeleter");
    expect(chunk.content).toMatchSnapshot();
  });
});
