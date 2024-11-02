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
        const output = template.generate(options, context);

        // Assert
        expect(output).toMatchSnapshot();
    }); 
})