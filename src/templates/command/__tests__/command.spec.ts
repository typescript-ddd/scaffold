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
    const output = template.generate(
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

    expect(output).toMatchSnapshot();
  });
});
