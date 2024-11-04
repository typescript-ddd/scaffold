import { GenerateContext, ContextBuilder } from "../../shared";
import { EntityViewTemplate } from "../entity-view.template";

describe("EntityView", () => {
  let context: GenerateContext;
  let template: EntityViewTemplate;

  beforeEach(() => {
    context = ContextBuilder.build("@src");
    template = new EntityViewTemplate();
  });

  it("Should render the entity view template", () => {
    const chunk = template.generate(
      {
        entityName: "User",
        properties: [
          { name: "id", valueType: "string", prop: "value" },
          { name: "name", valueType: "string" },
        ],
      },
      context
    );

    expect(chunk).toBeDefined();
    expect(chunk.name).toBe("EntityView");
    expect(chunk.content).toMatchSnapshot();
  });
});
