import {
  ContextBuilder,
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
} from "../../templates";
import { AggregateBundleTemplateValues } from "./aggregate-bundle.types";
import * as strings from "../../utils/string-helpers";

export const generateAggregateBundle = (values: AggregateBundleTemplateValues, rootPath: string) => {
  const { entityName, properties = [], trackable } = values;
  const { capitalize, lower, plural } = strings;

  const context = ContextBuilder.build(rootPath);

  const entityClass = capitalize(entityName);
  const entityIdClass = `${entityClass}Id`;
  const entityPath = lower(plural(entityClass));

  const entityId = generateEntityId(
    {
      entityName: values.entityName,
    },
    context
  );

  const aggregateRoot = generateAggregateRoot(
    {
      entityName: entityClass,
      properties: properties,
      trackable: trackable,
    },
    context
  );

  const view = generateEntityView({
    entityName: entityClass,
    properties: properties,
  }, context);

  context.addImportDeclaration({
    moduleSpecifier: context.resolveDir("domain"),
    namedImports: [entityIdClass]
  });

  const [createCommand, updateCommand, deleteCommand] = [
    "create",
    "update",
    "delete",
  ].map((action) => {
    return generateCommand(
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
    );
  });

  const findQuery = generateQuery({
    entityName: values.entityName,
    actionName: "find",
    properties: [{ name: "id", valueType: entityIdClass }],
  }, context);

  const [createCommandHandler, updateCommandHandler, deleteCommandHandler] = ["create|Creator", "update|Updater", "delete|Deleter"].map((action) => {
    const [act, actor] = action.split("|");
    return generateCommandHandler({
      entityName: entityClass,
      actionName: act,
      actor: `${entityClass}${actor}`,
      returnType: ["create", "update"].includes(act) ? `${entityClass}View` : "void",
      returnsView: ["create", "update"].includes(act),
      commandProperties: ["create", "update"].includes(act) ? properties : [{ name: "id", valueType: entityIdClass, prop: "fromValue" }],
    }, context)
  });

  const [createdEvent, updatedEvent, deletedEvent] = ["created", "updated", "deleted"].map((action) => {
    return generateDomainEvent({
      entityName: entityClass,
      eventAction: action,
      eventId: `${lower(entityClass)}/${action}`,
    }, context);
  })

  const findQueryHandler = generateQueryHandler({
    entityName: entityClass,
    actionName: "find",
    actor: `${entityClass}Finder`,
    returnType: `${entityClass}View`,
    returnsView: true,
    queryProperties: [{ name: "id", valueType: entityIdClass, prop: "fromValue" }],
  }, context);

  const repository = generateEntityRepositoryInterface({
    entityName: entityClass,    
  }, context);

  const creator = generateEntityCreator({
    entityName: entityClass,    
  }, context);

  const finder = generateEntityFinder({
    entityName: entityClass,
  }, context);

  const updater = generateEntityUpdater({
    entityName: entityClass,
  }, context);

  const deleter = generateEntityUpdater({
    entityName: entityClass,
  }, context);

  

  const [deleteAction, postAction, putAction] = ["delete", "post", "put"].map((action) => {
    return generateCommandAction({
      method: action.toUpperCase(),
      path: action === "post" ? `/${entityPath}` : `/${entityPath}/:id`,
      subject: entityClass,
    }, context);
  });

  const getAction = generateQueryAction({
    subject: entityClass,
    path: `/${entityPath}/:id`,
    requestType: null,
    responseType: null,
    contextType: null,
  }, context);

  const getAllAction = generateQueryAction({
    subject: plural(entityClass),
    path: `/${entityPath}`,
    requestType: null,
    responseType: null,
    contextType: null,
  }, context);

  return {
    entityId,
    aggregateRoot,
    createdEvent,
    createCommand,
    createCommandHandler,
    updatedEvent,
    updateCommand,
    updateCommandHandler,
    deletedEvent,
    deleteCommand,
    deleteCommandHandler,
    findQuery,
    findQueryHandler,
    repository,
    creator,
    finder,
    updater,
    deleter,
    deleteAction,
    postAction,
    putAction,
    getAction,
    getAllAction,
    view,
  };
}
