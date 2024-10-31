import { ContextBuilder, GenerateContext } from "../../shared";
import { generateDomainEvent } from "../domain-event";

describe("DomainEvent", () => {
  let context: GenerateContext;

  beforeEach(() => {
    context = ContextBuilder.build("@src");
  });

  it("Should render template", () => {
    const output = generateDomainEvent(
      { entityName: "User", eventAction: "Created" },
      context
    );
    expect(output).toMatchSnapshot();
  });
});
