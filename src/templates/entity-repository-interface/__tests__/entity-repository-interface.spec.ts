import { ContextBuilder, GenerateContext } from "../../shared";
import { generateEntityRepositoryInterface } from "../entity-repository-interface";

describe("EntityRepositoryInterface", () => {
    let context: GenerateContext;
    
    beforeEach(() => {
        context = ContextBuilder.build("@src");
    });
    
    it("Should render template", () => {
        const output = generateEntityRepositoryInterface(
        { entityName: "User" },
        context
        );
        expect(output).toMatchSnapshot();
    });
});