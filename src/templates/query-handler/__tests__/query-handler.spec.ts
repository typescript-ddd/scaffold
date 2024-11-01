import { ContextBuilder, GenerateContext } from "../../shared";
import { generateQueryHandler } from "../query-handler";

describe("CommandHandler", () => {
    let context: GenerateContext;

    beforeEach(() => {
        context = ContextBuilder.build("@src");
    })

    it("Should render the command handler template", () => {
        
        context.addImportDeclaration({
            moduleSpecifier: context.resolveDir("domain"),
            namedImports: ["UserView"],
        });

        const output = generateQueryHandler(
            {
                entityName: "User",
                actor: "UserFinder",
                returnType: "UserView[]",
                actionName: "findAll",
                returnsView: true,
                queryProperties: [
                    { name: "name", type: "string" },
                ]
            },
            context
        );

        expect(output).toMatchSnapshot();
    });
})