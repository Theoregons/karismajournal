import type {Context} from "hono";
import {createResponderSender} from "@/utils/response";
import {CourseRepo} from "@/repositories/user/course.repo";

const CourseController =  {
    courseAll: async (c: Context) => {
        const response = createResponderSender(c)

        const courses = await CourseRepo.getAllCourse()
        return response(200, courses)
    },

    courseById: async (c: Context) => {
        const response = createResponderSender(c)
        const {slug} = c.req.param()
        const course = await CourseRepo.getCourseBySlug(slug)

        const {id}  = course

        if (!course) return response(400, {}, 'data tidak ditemukan')

        const mentor =  await CourseRepo.getMentorById(id)

        course.mentors = mentor

        return response(200, course)
    }

}

export default CourseController