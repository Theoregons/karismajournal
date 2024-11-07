import type {Context} from 'hono'
import {  sign, verify} from 'hono/jwt'
import bcrypt, {hash} from 'bcryptjs'
import {AuthRepo} from "@/repositories/admin/auth.repo";
import {IUserInput} from "@/interfaces/auth.interface";
import {createResponderSender} from "@/utils/response";
import {ValidationError} from "@/utils/error-handling";

const AuthController = {
    login: async (c: Context) => {

        const {email, password} = await c.req.json();
        const user = await AuthRepo.getUserByEmail(email)
        const response = createResponderSender(c)
        if (!user) throw new ValidationError([{path: 'email', message: 'Email atau password tidak sesuai!'}])

        if (email === user.email && password) {

            const userPassword = user.password ?? ''
            const hash = userPassword.replace(/^\$2y(.+)$/i, '$2a$1')

            const compare = await bcrypt.compare(password, hash)

            if (!compare) return c.json({success: false, message: 'email atau password salah'}, 401)

            const token = await sign({email}, process.env.JWT_SECRET_TOKEN || 'secret', 'HS256');

            return response(200, {
                user_id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: token,
            }, 'login berhasil')

        }

        return c.json({message: 'Invalid credentials'}, 401)
    },

    register: async (c: Context) => {
        const {name, email, password, password_confirmation} = await c.req.json()
        const hashedPassword = await hash(password, 10)
        const check = await AuthRepo.checkUserExists(email)
        const response = createResponderSender(c)
        if (password != password_confirmation) return response(401, {message: 'Password tidak sesuai'})

        if (check) return response(402, {}, 'Email Sudah Ada')

        const input: IUserInput = {
            name: name,
            email: email,
            password: hashedPassword
        }
        const data = await AuthRepo.createUser(input)

        if (!data) return response(422, {}, "Registrasi Gagal")
        return response(200, {}, 'Register Berhasil')
    }
}

export default AuthController
