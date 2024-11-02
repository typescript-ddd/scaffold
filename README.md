# TypeScript DDD

A scaffolding tool for generating TypeScript DDD types.

## Installation

```bash
npm install @typescript-ddd/scaffold
```

Run tests:
```bash
npm run test
```
## Available Generators

- Aggregate Root
- Command
- Command Action
- Command Handler
- Domain Error
- Domain Event
- Domain Event Subscriber
- Entity
- Entity Creator
- Entity Deleter
- Entity Finder
- Entity ID
- Entity Repository Interface
- Entity Updater
- Entity View
- Query
- Query Action
- Query Handler
- Value Object

## Code Example

```ts
import { 
    GenerateContext, 
    ContextBuilder,
    AggregateRootTemplate,
    AggregateRootTemplateValues,
} from "@typescript-ddd/scaffold";

/* Create a context and template instance */
const context: GenerateContext = ContextBuilder.build("@src");
const template = new AggregateRootTemplate();

/* Setup the template values */
const values: AggregateRootTemplateValues = {
  entityName: "User",
  properties: [
    { name: "name", valueType: "string" },
    { name: "phone", valueType: "Phone" },
  ],
  trackable: false,
};

/* Add a named import to the template */
context.addImportDeclaration({
    moduleSpecifier: context.resolveDir("domain", "models"),
    namedImports: ["Phone"],
});

/* Run the template with the values and context */
const output = template.generate(values, context);
```

### Output:

```ts
import { AggregateRoot, EntityCreateProps, EntityUpdateProps, InvariantViolationError  } from "@typescript-ddd/core";
import { UserCreatedEvent, UserUpdatedEvent, UserDeletedEvent } from "@src/domain/events";
import { Phone, UserId } from "@src/domain/models";

/**
 * Represents the properties required to create a user.
 * @extends {EntityCreateProps}
 */
export interface CreateUserProps extends EntityCreateProps {
    name: string;
    phone: Phone;
}
/**
 * Represents the properties required to update a user.
 * @extends {EntityUpdateProps}
 */
export interface UpdateUserProps extends EntityUpdateProps<UserId> {
    name: string;
    phone: Phone;
}
/**
 * Represents a user aggregate.
 * @extends AggregateRoot
 */
export class User extends AggregateRoot<UserId> {
    /**
     * Initializes a new instance of a user.
     * @param {UserId} id - An optional identifier of the user.
     * @param {string} name - The name of the user.
     * @param {Phone} phone - The phone of the user.
     */
    private constructor(private name: string, private phone: Phone, id?: UserId) {
        super(id ?? UserId.create());
        if (!id) {
          this.applyChange(new UserCreatedEvent(this.id, this));
        }
    }

    /**
     * Gets the name of the user.
     * @returns {string} - The name of the user.
     */
    getName(): string {
        return this.name;
    }

    /**
     * Gets the phone of the user.
     * @returns {Phone} - The phone of the user.
     */
    getPhone(): Phone {
        return this.phone;
    }

    /**
     * Update the user.
     * @param {UpdateUserProps} props - The properties to update.
     * @throws {InvariantViolationError} - When the properties are invalid.
     * @returns {void}
     */
    update(props: UpdateUserProps): void {
        // TODO: validate props
        this.name = props.name;
        this.phone = props.phone;
        this.applyChange(new UserUpdatedEvent(this.id, this));
    }

    /**
     * Delete the user.
     * @throws {InvariantViolationError} - When the operation is not allowed.
     * @returns {void}
     */
    delete(): void {
        this.applyChange(new UserDeletedEvent(this.id, this));
    }

    /**
     * Creates a new instance of a user.
     * @param {CreateUserProps} props - The properties to create.
     * @throws {InvariantViolationError} - When the properties are invalid.
     * @returns {User} - The new instance of a user.
     */
    static create(props: CreateUserProps, id?: UserId): User {
        const user = new User(
          props.name,
          props.phone,
          id
        );
        return user;
    }
}
```