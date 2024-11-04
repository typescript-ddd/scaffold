import { ContextBuilder, GenerateContext } from "../../shared";
import { DomainEventSubscriberTemplate } from "../domain-event-subscriber.template";

describe("DomainEventSubscriber", () => {
  let context: GenerateContext;;
  let template: DomainEventSubscriberTemplate;

  beforeEach(() => {
    context = ContextBuilder.build("@src");
    template = new DomainEventSubscriberTemplate();
  });
  
  it("should generate domain event subscriber", () => {
    // Arrange
    const options = {
      eventName: "UserCreatedEvent",
    };

    // Act
    const chunk = template.generate(options, context);

    // Assert
    expect(chunk).toBeDefined();
    expect(chunk.name).toBe("DomainEventSubscriber");
    expect(chunk.content).toMatchSnapshot();
  });
});
