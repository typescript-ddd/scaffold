import { ContextBuilder, GenerateContext } from "../../shared";
import { QueryActionTemplate } from "../query-action.template";

describe("QueryAction", () => {
    let context: GenerateContext;
    let template: QueryActionTemplate;

    beforeEach(() => {
        context = ContextBuilder.build("@src");
        template = new QueryActionTemplate();
    });
    it("should generate a query action template", () => {
        // Arrange
        const options = {
            path: "/user/:id",
            subject: "User",
            requestType: null,
            responseType: null,
            contextType: null,           
        };

        // Act
        const chunk = template.generate(options, context);

        // Assert
        expect(chunk).toBeDefined();
        expect(chunk.name).toBe("QueryAction");
        expect(chunk.content).toMatchSnapshot();
    }); 
})