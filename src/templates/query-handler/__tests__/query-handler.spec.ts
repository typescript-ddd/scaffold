import { ContextBuilder, GenerateContext } from "../../shared";
import { QueryHandlerTemplate } from "../query-handler.template";

describe("CommandHandler", () => {
  let context: GenerateContext;
  let template: QueryHandlerTemplate;

  beforeEach(() => {
    context = ContextBuilder.build("@src");
    template = new QueryHandlerTemplate();
  });

  it("Should render the command handler template", () => {
    context.addImportDeclaration({
      moduleSpecifier: context.resolveDir("domain"),
      namedImports: ["UserView"],
    });

    const output = template.generate(
      {
        entityName: "User",
        actor: "UserFinder",
        returnType: "UserView[]",
        actionName: "findAll",
        returnsView: true,
        queryProperties: [{ name: "name", valueType: "string" }],
      },
      context
    );

    expect(output).toMatchSnapshot();
  });
});
