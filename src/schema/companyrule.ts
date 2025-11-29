import { z } from "zod";

export const formSchema = z.object({
    companyRuleCode: z.string().nonempty("Company Rule Code cannot be empty!"),
    description: z.string().nonempty("Description cannot be empty!"),
    value: z.string().nonempty("Value cannot be empty!"),
});
