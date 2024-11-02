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
    const output = template.generate(
      {
        entityName: "User",
      },
      context
    );

    expect(output).toMatchSnapshot();
  });
});
