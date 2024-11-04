import { ContextBuilder, GenerateContext } from "../../shared";
import { CommandTemplate } from "../command.template";

describe("Command", () => {
  let context: GenerateContext;
  let template: CommandTemplate;

  beforeEach(() => {
    context = ContextBuilder.build("@src");
    template = new CommandTemplate();
  });

  it("Should render the command template", () => {
    const chunk = template.generate(
      {
        entityName: "User",
        actionName: "Create",
        properties: [
          { name: "name", valueType: "string", nullable: false },
          {
            name: "email",
            valueType: "string",
          },
        ],
      },
      context
    );

    expect(chunk).toBeDefined();
    expect(chunk.name).toBe("CreateEntityCommand");
    expect(chunk.content).toMatchSnapshot();
  });
});
