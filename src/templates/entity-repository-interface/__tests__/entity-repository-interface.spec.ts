import { ContextBuilder, GenerateContext } from "../../shared";
import { EntityRepositoryInterfaceTemplate } from "../entity-repository-interface.template";

describe("EntityRepositoryInterface", () => {
    let context: GenerateContext;
    let template: EntityRepositoryInterfaceTemplate;
    
    beforeEach(() => {
        context = ContextBuilder.build("@src");
        template = new EntityRepositoryInterfaceTemplate();
    });
    
    it("Should render template", () => {
        const output = template.generate(
        { entityName: "User" },
        context
        );
        expect(output).toMatchSnapshot();
    });
});