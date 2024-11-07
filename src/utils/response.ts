import type {Context} from 'hono'
import type {StatusCode} from 'hono/utils/http-status'

export const createResponderSender = (c: Context) => {
    return (
        status: StatusCode, 
        data: any = null, 
        message: string = 'ok', 
        success: boolean = true
    ) => {
        let response: any = {
            success,
            message,
        }

        if (data !== undefined && data !== null && !(typeof data === 'object' && Object.keys(data).length === 0)) {
            response.data = data
        }

        if ([400, 404].includes(status)) {
            response.success = false;
        }

        return c.json(response, status);
    }
}
