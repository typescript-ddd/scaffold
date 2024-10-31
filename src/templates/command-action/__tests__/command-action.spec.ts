import { ContextBuilder } from "../../shared";
import { generateCommandAction } from "../command-action";

describe("CommandAction", () => {
    it("should generate command action", () => {
        // Arrange
        const options = {
            method: "GET",
            path: "/user/:id",
            subject: "User",
        };
        const context = ContextBuilder.build("@src");

        // Act
        const output = generateCommandAction(options, context);

        // Assert
        expect(output).toMatchSnapshot();
    }); 
})