import { GenerateContext } from "../shared";
import { Template } from "../shared/template";
import { generateDomainEvent } from "./domain-event.generator";
import {
  DomainEventTemplateOptions,
  DomainEventTemplateValues,
} from "./domain-event.types";

export class DomainEventTemplate
  implements Template<DomainEventTemplateValues, DomainEventTemplateOptions>
{
  readonly name = "Command";
  readonly description = "Generates a command";
  readonly options: DomainEventTemplateOptions = {
    entityName: {
      name: "entityName",
      label: "Entity Name",
      description: "The name of the entity",
      optionType: "string",
    },
    eventAction: {
      name: "eventAction",
      label: "Event Action",
      description: "The action of the event",
      optionType: "string",
    },
    eventId: {
      name: "eventId",
      label: "Event Id",
      description: "The id of the event",
      optionType: "string",
    },
  };
  readonly defaultValues = {
    entityName: "User",
    eventAction: "Created",
    eventId: "user/created",
  };
  generate(values: DomainEventTemplateValues, context: GenerateContext): string {
    return generateDomainEvent(values, context);
  }
}
