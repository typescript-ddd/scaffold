import { ContextBuilder } from "../../shared";
import { generateQueryAction } from "../query-action";

describe("QueryAction", () => {
    it("should generate a query action template", () => {
        // Arrange
        const options = {
            path: "/user/:id",
            subject: "User",            
        };
        const context = ContextBuilder.build("@src");

        // Act
        const output = generateQueryAction(options, context);

        // Assert
        expect(output).toMatchSnapshot();
    }); 
})