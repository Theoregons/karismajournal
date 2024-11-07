
import { createResponderSender } from "@/utils/response";
import { Context } from "hono";
import {MentorRepo} from "@/repositories/user/mentor.repo";

export const MentorController = {
    getAll: async(c: Context) => {
        const response = createResponderSender(c);
        const query = c.req.query()
        const page = (query.page) ? parseInt(query.page) : 1
        const limit = (query.limit) ? parseInt(query.limit) : 10
        const data = await MentorRepo.getAllMentors(page, limit)
        return response(200, data, "ok")
    }
}