import {z} from 'zod';
import {zValidator} from "@hono/zod-validator";
import {formatZodErrors, ValidationError} from "@/utils/error-handling";


const schema = z.object({
    email: z.string().min(3).email().trim().toLowerCase(),
    password: z.string().min(8, 'kata sandi minimal 8  karakter')
})

export const loginSchema = zValidator('json', schema, (result) => {
    if (!result.success) {
        const errors = formatZodErrors(result.error)

        throw new ValidationError(errors)
    }
})