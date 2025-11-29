import z from "zod";

export const formSchema = z.object({
    name: z.string().nonempty("Name cannot be empty!"),
    latitude: z
        .string()
        .nonempty("Latitude cannot be empty!")
        .refine(
            (val) => {
                const num = parseFloat(val);
                return !isNaN(num) && num >= -90 && num <= 90;
            },
            { message: "Latitude must be a number between -90 and 90" }
        ),
    longitude: z
        .string()
        .nonempty("Longitude cannot be empty!")
        .refine(
            (val) => {
                const num = parseFloat(val);
                return !isNaN(num) && num >= -180 && num <= 180;
            },
            { message: "Longitude must be a number between -180 and 180" }
        ),
    radius: z
        .string()
        .nonempty("Radius cannot be empty!")
        .refine(
            (val) => {
                const num = parseFloat(val);
                return !isNaN(num) && num > 0 && num <= 100;
            },
            {
                message: "Radius must be a number greater than 0 and not exceed 100 km",
            }
        ),
});
