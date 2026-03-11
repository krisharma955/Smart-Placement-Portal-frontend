const { z } = require('zod');

const schema = z.object({
    companyName: z.string().min(2, "Company name is required"),
    website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    industry: z.string().min(2, "Industry is required"),
    description: z.string().min(10, "Description should be at least 10 characters"),
    location: z.string().min(2, "HQ Location is required"),
});

const result = schema.safeParse({
    companyName: "Google",
    website: "",
    industry: "Software",
    description: "baap of all tech company",
    location: "US"
});

console.log(result);
