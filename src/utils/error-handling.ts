import { Context } from "hono";
import { StatusCode } from "hono/utils/http-status";
import {ZodError} from "zod";

export class ValidationError extends Error {
    constructor(public errors: { path: string; message: string }[]) {

        super('validation error!')
        this.name = 'Error'
    }
}

export const formatZodErrors = (error: ZodError) => {
    return error.issues.map(issue => ({
        path: issue.path.join('.'),
        message: issue.message
    }))
}

export const createErrorResponderSender = (c: Context) => {
    return (status: StatusCode = 400, data: any = null, message: string = 'error', success: boolean = false) => {
        const response: any = {
            success,
            message,
        }

        if (data !== undefined && data !== null && !(typeof data === 'object' && Object.keys(data).length == 0)) {
            response.data = data
        }

        return c.json(response, status)
    }
}