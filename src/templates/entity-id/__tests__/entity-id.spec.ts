import { GenerateContext } from "../../shared";
import { ContextBuilder } from "../../shared/context-builder";
import { generateEntityId } from "../entity-id";

describe("EntityId", () => {
  let context: GenerateContext;

  beforeEach(() => {
    context = ContextBuilder.build("@src");
  });

  it("Should render the entity id component", () => {
    const output = generateEntityId({ entityName: "User" }, context);

    expect(output).toMatchSnapshot();
  });
});
