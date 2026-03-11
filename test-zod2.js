const { z } = require('zod');

const companyProfileSchema = z.object({
    companyName: z.string().min(2, "Company name is required"),
    website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    industry: z.string().min(2, "Industry is required"),
    description: z.string().min(10, "Description should be at least 10 characters"),
    location: z.string().min(2, "HQ Location is required"),
});

try {
  companyProfileSchema.parse({
    companyName: "Google",
    website: "",
    industry: "Software",
    description: "baap of",
    location: "US"
  });
  console.log("Success");
} catch(e) {
  console.log(e.errors);
}
