import { GenerateContext, ContextBuilder } from "../../shared";
import { generateEntityView } from "../entity-view";

describe("EntityView", () => {
  let context: GenerateContext;

  beforeEach(() => {
    context = ContextBuilder.build("@src");
  });

  it("Should render the entity view template", () => {
    const output = generateEntityView(
      {
        entityName: "User",
        properties: [
          { name: "id", type: "string", prop: "value" },
          { name: "name", type: "string" },
        ],
      },
      context
    );

    expect(output).toMatchSnapshot();
  });
});
