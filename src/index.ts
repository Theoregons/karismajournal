import { Hono } from 'hono'
import UserApp from "./routes/user.route";
import process from "process";
import {ValidationError} from "@/utils/error-handling";

const app = new Hono()

app.route('/api', UserApp)

app.notFound((c) => {
    c.status(404)
    return c.json({
        success: false,
        message: 'Endpoint not found'
    })
})

app.onError((err: any, c) => {

    if (err instanceof ValidationError) {
        return c.json({
            success: false,
            message: 'Validation error',
            errors: err.errors
        }, 422)
    }

    c.status(500)
    err.message = 'Internal Server Error'

    return c.json({
        success: false,
        message: err.message
    })
})

export default {
    port: process.env.APP_PORT || 3000,
    fetch: app.fetch
}
