import { GenerateContext, ContextBuilder } from "../../shared";
import { generateEntityUpdater } from "../entity-updater";

describe("EntityUpdater", () => {
  let context: GenerateContext;

  beforeEach(() => {
    context = ContextBuilder.build("@src");
  });

  it("Should render the entity updater template", () => {
    const output = generateEntityUpdater(
      {
        entityName: "User",
      },
      context
    );

    expect(output).toMatchSnapshot();
  });
});
