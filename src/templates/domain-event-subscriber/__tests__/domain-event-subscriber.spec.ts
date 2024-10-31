import { ContextBuilder } from "../../shared";
import { generateDomainEventSubscriber } from "../domain-event-subscriber";

describe("DomainEventSubscriber", () => {
    it("should generate domain event subscriber", () => {
        // Arrange
        const options = {
        eventName: "UserCreatedEvent",
        };
        const context = ContextBuilder.build("@src");
    
        // Act
        const output = generateDomainEventSubscriber(options, context);
    
        // Assert
        expect(output).toMatchSnapshot();
    });
});