import { generateAggregateBundle } from "../aggregate-bundle.generator";

describe("AggregateBundle", () => {

    it("should generate an aggregate bundle", () => {

        const bundle = generateAggregateBundle({
            entityName: "User",
            properties: [
                { name: "name", valueType: "string" },
                { name: "email", valueType: "string" },
            ],
            trackable: true,
        }, "@contexts/users");

        console.log(bundle);

    });
});