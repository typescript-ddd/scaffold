import { ContextBuilder, GenerateContext } from "../../shared";
import { CommandHandlerTemplate } from "../command-handler.template";

describe("CommandHandler", () => {
    let context: GenerateContext;
    let template: CommandHandlerTemplate;

    beforeEach(() => {
        context = ContextBuilder.build("@src");
        template = new CommandHandlerTemplate();
    })

    it("Should render the command handler template", () => {
        
        context.addImportDeclaration({
            moduleSpecifier: context.resolveDir("domain", "view"),
            namedImports: ["UserView"],
        });

        const output = template.generate(
            {
                entityName: "User",
                actionName: "create",
                actor: "UserCreator",
                returnType: "UserView",
                returnsView: true,
                commandProperties: [
                    { name: "name", valueType: "string" },
                ]
            },
            context
        );

        expect(output).toMatchSnapshot();
    });    
})