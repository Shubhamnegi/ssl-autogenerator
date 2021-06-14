export const schema = {
    type: "object",
    properties: {
        country: { type: "string", maxLength: 2, minLength: 2 },
        state: { type: "string" },
        location: { type: "string" },
        organization: { type: "string" },
        organizationalUnit: { type: "string" },
        commonName: { type: "string" },
    },
    required: [
        "country",
        "state",
        "location",
        "organization",
        "organizationalUnit",
        "commonName"
    ],
    additionalProperties: false,
}