import { GenerateContext, ContextBuilder } from "../../shared";
import { generateEntityDeleter } from "../entity-deleter";

describe("EntityDeleter", () => {
  let context: GenerateContext;

  beforeEach(() => {
    context = ContextBuilder.build("@src");
  });

  it("Should render the entity deleter template", () => {
    const output = generateEntityDeleter(
      {
        entityName: "User",
      },
      context
    );

    expect(output).toMatchSnapshot();
  });
});
