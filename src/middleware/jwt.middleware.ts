import type {Context, Next} from 'hono'
import {verify} from 'hono/jwt'
import {UserRepo} from "@/repositories/user/user.repo";
import {RowDataPacket} from "mysql2";

export const JwtMiddleware = async (c: Context, next: Next) => {
    try {
        const authorization  = c.req.header('Authorization')

        if (!authorization) return c.json({success: false, message: 'harap login terlebih dahulu'}, 401)

        const tokens = authorization.split(' ')[1]
        const decodedToken = await verify(tokens, process.env.JWT_SECRET_TOKEN || 'secret')

        if (!decodedToken) return c.json({success: false, message: 'harap login terlebih dahulu'}, 401)

        await next()
    } catch (e) {
        console.log(e)
        return c.json({success: false, message: 'harap login terlebih dahulu'}, 401)
    }
}

export const getUserToken = async (c: Context) => {
    const authorization = c.req.header('Authorization')

    if (!authorization) return ''

    const tokens = authorization.split(' ')[1]
    const decodedToken = await verify(tokens, process.env.JWT_SECRET_TOKEN || 'secret')
    const {email} = decodedToken

    return email
}

export const getToken = async (c: Context) => {
    const authorization = c.req.header('Authorization')

    if (!authorization) return ''

    return authorization.split(' ')[1]

}


export const getUserLoggedin = async (c: Context) => {
    const authorization = c.req.header('Authorization')

    if (!authorization) return ''

    const tokens = authorization.split(' ')[1]
    const decodedToken = await verify(tokens, process.env.JWT_SECRET_TOKEN || 'secret')
    const {email} = decodedToken
    const users = await UserRepo.getUserByEmail(email)
    return users
}
