import { ContextBuilder, GenerateContext } from "../../shared";
import { CommandActionTemplate } from "../command-action.template";

describe("CommandAction", () => {

    let context: GenerateContext;
    let template: CommandActionTemplate;

    beforeEach(() => {
        context = ContextBuilder.build("@src");
        template = new CommandActionTemplate();
    })

    it("should generate command action", () => {
        // Arrange
        const options = {
            method: "GET",
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
        expect(chunk.name).toBe("GetEntityCommandAction");
        expect(chunk.content).toMatchSnapshot();
    }); 
})