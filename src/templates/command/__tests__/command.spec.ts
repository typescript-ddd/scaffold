import { ContextBuilder, GenerateContext } from "../../shared";
import { generateCommand } from "../command";

describe("Command", () => {
  let context: GenerateContext;

  beforeEach(() => {
    context = ContextBuilder.build("@src");
  });

  it("Should render the command template", () => {
    const output = generateCommand(
      {
        entityName: "User",
        actionName: "Create",
        properties: [
          { name: "name", type: "string", description: "The user's name." },
          {
            name: "email",
            type: "string",
            description: "The user's email address.",
          },
        ],
      },
      context
    );

    expect(output).toMatchSnapshot();
  });
});
