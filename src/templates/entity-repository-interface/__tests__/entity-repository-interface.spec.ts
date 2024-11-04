import { ContextBuilder, GenerateContext } from "../../shared";
import { EntityRepositoryInterfaceTemplate } from "../entity-repository-interface.template";

describe("EntityRepositoryInterface", () => {
  let context: GenerateContext;
  let template: EntityRepositoryInterfaceTemplate;

  beforeEach(() => {
    context = ContextBuilder.build("@src");
    template = new EntityRepositoryInterfaceTemplate();
  });

  it("Should render template", () => {
    const chunk = template.generate({ entityName: "User" }, context);
    expect(chunk).toBeDefined();
    expect(chunk.name).toBe("EntityRepositoryInterface");
    expect(chunk.content).toMatchSnapshot();
  });
});
