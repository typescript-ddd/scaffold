import {
  generateEntityId,
  generateAggregateRoot,
  generateCommand,
  generateCommandHandler,
  generateEntityRepositoryInterface,
  generateEntityCreator,
  generateEntityFinder,
  generateEntityUpdater,
  generateQuery,
  generateQueryHandler,
  generateDomainEvent,
  generateEntityView,
  generateCommandAction,
  generateQueryAction,
  GenerateContext,
  Chunk,
  generateEntityDeleter,
} from "../../templates";
import { AggregateBundleTemplateValues } from "./aggregate-bundle.types";
import * as strings from "../../utils/string-helpers";

export const generateAggregateBundle = (
  values: AggregateBundleTemplateValues,
  context: GenerateContext
): Chunk[] => {
  const { entityName, properties = [], trackable } = values;
  const { capitalize, lower, plural } = strings;

  const entityClass = capitalize(entityName);
  const entityIdClass = `${entityClass}Id`;
  const entityPath = lower(plural(entityClass));

  context.addChunk(
    generateEntityId(
      {
        entityName: values.entityName,
      },
      context
    )
  );

  context.addChunk(
    generateAggregateRoot(
      {
        entityName: entityClass,
        properties: properties,
        trackable: trackable,
      },
      context
    )
  );

  context.addChunk(
    generateEntityView(
      {
        entityName: entityClass,
        properties: properties,
      },
      context
    )
  );

  context.addImportDeclaration({
    moduleSpecifier: context.resolveDir("domain"),
    namedImports: [entityIdClass],
  });

  ["create", "update", "delete"].map((action) => {
    context.addChunk(
      generateCommand(
        {
          entityName: values.entityName,
          actionName: action,
          properties: [
            ...(action === "create" || action === "update" ? properties : []),
            ...(action === "delete"
              ? [{ name: "id", valueType: entityIdClass }]
              : []),
          ],
        },
        context
      )
    );
  });

  context.addChunk(
    generateQuery(
      {
        entityName: values.entityName,
        actionName: "find",
        properties: [{ name: "id", valueType: entityIdClass }],
      },
      context
    )
  );

  ["create|Creator", "update|Updater", "delete|Deleter"].map((action) => {
    const [act, actor] = action.split("|");
    context.addChunk(
      generateCommandHandler(
        {
          entityName: entityClass,
          actionName: act,
          actor: `${entityClass}${actor}`,
          returnType: ["create", "update"].includes(act)
            ? `${entityClass}View`
            : "void",
          returnsView: ["create", "update"].includes(act),
          commandProperties: ["create", "update"].includes(act)
            ? properties
            : [{ name: "id", valueType: entityIdClass, prop: "fromValue" }],
        },
        context
      )
    );
  });

  ["created", "updated", "deleted"].map((action) => {
    context.addChunk(
      generateDomainEvent(
        {
          entityName: entityClass,
          eventAction: action,
          eventId: `${lower(entityClass)}/${action}`,
        },
        context
      )
    );
  });

  context.addChunk(
    generateQueryHandler(
      {
        entityName: entityClass,
        actionName: "find",
        actor: `${entityClass}Finder`,
        returnType: `${entityClass}View`,
        returnsView: true,
        queryProperties: [
          { name: "id", valueType: entityIdClass, prop: "fromValue" },
        ],
      },
      context
    )
  );

  context.addChunk(
    generateEntityRepositoryInterface(
      {
        entityName: entityClass,
      },
      context
    )
  );

  context.addChunk(
    generateEntityCreator(
      {
        entityName: entityClass,
      },
      context
    )
  );

  context.addChunk(
    generateEntityFinder(
      {
        entityName: entityClass,
      },
      context
    )
  );

  context.addChunk(
    generateEntityUpdater(
      {
        entityName: entityClass,
      },
      context
    )
  );

  context.addChunk(
    generateEntityDeleter(
      {
        entityName: entityClass,
      },
      context
    )
  );

  ["delete", "post", "put"].map((action) => {
    context.addChunk(
      generateCommandAction(
        {
          method: action.toUpperCase(),
          path: action === "post" ? `/${entityPath}` : `/${entityPath}/:id`,
          subject: entityClass,
        },
        context
      )
    );
  });

  context.addChunk(
    generateQueryAction(
      {
        subject: entityClass,
        path: `/${entityPath}/:id`,
        requestType: null,
        responseType: null,
        contextType: null,
      },
      context
    )
  );

  context.addChunk(
    generateQueryAction(
      {
        subject: plural(entityClass),
        path: `/${entityPath}`,
        requestType: null,
        responseType: null,
        contextType: null,
      },
      context
    )
  );

  return context.getChunks();
};
