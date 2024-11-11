import type {Context} from "hono";
import {createResponderSender} from "@/utils/response";
import {CategoryRepo} from "@/repositories/category.repo";

const CourseController =  {
    courseAll: async (c: Context) => {
        const response = createResponderSender(c)

        const courses = await CategoryRepo.getAllCourse()
        return response(200, courses)
    },

    courseById: async (c: Context) => {
        const response = createResponderSender(c)
        const {slug} = c.req.param()
        const course = await CategoryRepo.getCourseBySlug(slug)

        const {id}  = course

        if (!course) return response(400, {}, 'data tidak ditemukan')

        const mentor =  await CategoryRepo.getMentorById(id)

        course.mentors = mentor

        return response(200, course)
    }

}

export default CourseController