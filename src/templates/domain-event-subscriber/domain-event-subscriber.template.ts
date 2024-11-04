import { Chunk, GenerateContext } from "../shared";
import { Template } from "../shared/template";
import { generateDomainEventSubscriber } from "./domain-event-subscriber.generator";
import {
  DomainEventSubscriberTemplateOptions,
  DomainEventSubscriberTemplateValues,
} from "./domain-event-subscriber.types";

export class DomainEventSubscriberTemplate
  implements
    Template<
      DomainEventSubscriberTemplateValues,
      DomainEventSubscriberTemplateOptions
    >
{
  readonly name = "Domain Event Subscriber";
  readonly description = "Generates a domain event subscriber";
  readonly options: DomainEventSubscriberTemplateOptions = {
    eventName: {
      name: "eventName",
      label: "Event Name",
      description: "The name of the event",
      optionType: "string",
    },
  };
  readonly defaultValues = {
    eventName: "UserCreated",
  };
  generate(values: DomainEventSubscriberTemplateValues, context: GenerateContext, chunkName?: string): Chunk {
    return generateDomainEventSubscriber(values, context, chunkName);
  }
}
