import { GenerateContext, ContextBuilder } from "../../shared";
import { EntityUpdaterTemplate } from "../entity-updater.template";

describe("EntityUpdater", () => {
  let context: GenerateContext;
  let template: EntityUpdaterTemplate;

  beforeEach(() => {
    context = ContextBuilder.build("@src");
    template = new EntityUpdaterTemplate();
  });

  it("Should render the entity updater template", () => {
    const chunk = template.generate(
      {
        entityName: "User",
      },
      context
    );

    expect(chunk).toBeDefined();
    expect(chunk.name).toBe("EntityUpdater");
    expect(chunk.content).toMatchSnapshot();
  });
});
