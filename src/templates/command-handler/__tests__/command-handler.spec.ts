import { ContextBuilder, GenerateContext } from "../../shared";
import { generateCommandHandler } from "../command-handler";

describe("CommandHandler", () => {
    let context: GenerateContext;

    beforeEach(() => {
        context = ContextBuilder.build("@src");
    })

    it("Should render the command handler template", () => {
        
        context.addImportDeclaration({
            moduleSpecifier: context.resolveDir("domain", "view"),
            namedImports: ["UserView"],
        });

        const output = generateCommandHandler(
            {
                entityName: "User",
                actionName: "create",
                actor: "UserCreator",
                returnType: "UserView",
                returnsView: true,
                commandProperties: [
                    { name: "name", type: "string" },
                ]
            },
            context
        );

        expect(output).toMatchSnapshot();
    });
})