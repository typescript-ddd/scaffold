import { GenerateContext } from "../../shared";
import { ContextBuilder } from "../../shared/context-builder";
import { EntityIdTemplate } from "../entity-id.template";

describe("EntityId", () => {
  let context: GenerateContext;
  let template: EntityIdTemplate;

  beforeEach(() => {
    context = ContextBuilder.build("@src");
    template = new EntityIdTemplate();
  });

  it("Should render the entity id component", () => {
    const chunk = template.generate({ entityName: "User" }, context);

    expect(chunk).toBeDefined();
    expect(chunk.name).toBe("EntityId");
    expect(chunk.content).toMatchSnapshot();
  });
});
