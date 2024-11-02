import { TemplateStringOption } from "../shared/template";

export type DomainEventTemplateValues = {
  entityName: string;
  eventAction: string;
  eventId: string;
};

export type DomainEventTemplateOptions = {
  entityName: TemplateStringOption;
  eventAction: TemplateStringOption;
  eventId: TemplateStringOption;
};
