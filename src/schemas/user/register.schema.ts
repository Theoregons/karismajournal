import {z} from "zod";
import {zValidator} from "@hono/zod-validator";
import {formatZodErrors, ValidationError} from "@/utils/error-handling";

const schema = z.object({
    email: z.string().min(3, 'Email harus terdiri dari setidaknya 3 karakter').email({message: 'Email tidak valid'}).trim().toLowerCase(),
    name: z.string().min(3, 'Nama pengguna minimal 3 karakter'),
    password: z.string().min(8, 'Kata sandi harus terdiri dari setidaknya 8 karakter')
        .regex(/[A-Z]/, 'Kata sandi harus mengandung huruf besar')
        .regex(/[a-z]/, 'Kata sandi harus mengandung huruf kecil')
        .regex(/[0-9]/, 'Kata sandi harus mengandung angka')
        .regex(/[^A-Za-z0-9]/, 'Kata sandi harus mengandung karakter khusus')
})


export const registerSchema = zValidator('json', schema, (result) => {
    if (!result.success) {
        const errors = formatZodErrors(result.error)
        throw new ValidationError(errors)
    }
})