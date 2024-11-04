import { ContextBuilder } from "../../../templates";
import { generateAggregateBundle } from "../aggregate-bundle.generator";

describe("AggregateBundle", () => {

    it("should generate an aggregate bundle", () => {

        const context = ContextBuilder.build("@contexts/users");

        generateAggregateBundle({
            entityName: "User",
            properties: [
                { name: "name", valueType: "string" },
                { name: "email", valueType: "string" },
            ],
            trackable: true,
        }, context);

        const chunks = context.getChunks();

        expect(chunks).toHaveLength(24);
    });
});