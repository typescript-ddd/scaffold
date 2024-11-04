import { ContextBuilder, GenerateContext } from "../../shared";
import { DomainEventTemplate } from "../domain-event.template";

describe("DomainEvent", () => {
  let context: GenerateContext;
  let template: DomainEventTemplate;

  beforeEach(() => {
    context = ContextBuilder.build("@src");
    template = new DomainEventTemplate();
  });

  it("Should render template", () => {
    const chunk = template.generate(
      { entityName: "User", eventAction: "Created", eventId: "user/created" },
      context
    );
    expect(chunk).toBeDefined();
    expect(chunk.name).toBe("EntityCreatedDomainEvent");
    expect(chunk.content).toMatchSnapshot();
  });
});
