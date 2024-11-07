import type {Context} from "hono";
import {createResponderSender} from "@/utils/response";
import {CourseRepo} from "@/repositories/user/owned/course.repo";
import {getUserLoggedin, getUserToken} from "@/middleware/jwt.middleware";
import {UserRepo} from "@/repositories/user/user.repo";
import {InsertLogMaterial} from "@/interfaces/user/course.interface";

const CourseController =  {
    courseOwned: async (c: Context) => {

        const response = createResponderSender(c)
        const email = await getUserToken(c);
        const users = await UserRepo.getUserByEmail(email)
        const courses = await CourseRepo.getOwnedCourse(users.id)

        return courses.length === 0 ? response(200, {}, "belum ada kelas") : response(200, courses)
    },
    courseOwnedDetail: async (c: Context) => {
        const response = createResponderSender(c)
        const slug  = c.req.param('slug') as string
        await getUserToken(c);
        const courseBySlug =  await CourseRepo.getOwnedCourseBySlug(slug)

        if (!courseBySlug) return response(404, {}, "Kelas tidak ditemukan")

        const {id: idSlug} = courseBySlug
        const courses = await CourseRepo.getOwnedById(idSlug)
        const output = courses.reduce((acc:  {id:number; name:string; materials: any[] } [], item) => {
            const { id, name, material_id, material_name, type } = item;
            let existing: {id:number; name:string; materials: any[] } | undefined  = acc.find(i => i.id === id);

            if (!existing) {
                 existing = {
                     id,
                     name,
                     materials: []
                };
                acc.push(existing);
            }

             existing.materials.push({
                id,
                 material_id,
                name: material_name,
                type
            });

            return acc;
        }, []);

        return output.length === 0 ? response(404, {}, "tidak ada data") : response(200, output)
    },
    courseActive: async (c: Context) => {
        const response = createResponderSender(c)
        const {id} = await c.req.json()
        const active = await CourseRepo.getActiveCourse(id)

        if (!active) return response(404, {}, "Material tidak ditemukan")

        return response(200, active)
    },
    completeOwnedMaterial: async (c: Context) => {
        const response = createResponderSender(c)
        const users = await getUserLoggedin(c)
        //@ts-ignore
        const student_id = users?.id;
        const {id} = await c.req.json()

        const active = await CourseRepo.getActiveCourse(id)

        if (!active) return response(404, {}, "Material tidak ditemukan")


        const {id:material_id, type, chapter_id} = active
        console.log(material_id, type, chapter_id, student_id)

        const complete = await CourseRepo.completeMaterial(material_id)

        if (!complete) return response(404, {}, "gagal")

        const checkStudentLog = await CourseRepo.getStudentLog(material_id, student_id)

        const input: InsertLogMaterial = {
            material_id: material_id,
            student_id: student_id,
        }

        return checkStudentLog.length == 0 ? await CourseRepo.insertLogMaterialStudent(input)
            .then(result => response(200, result, "Berhasil menyelesaikan materi"))
            .catch(error => response(400, {}, error.message)) : response(400, {}, "Materi sudah diselesaikan")
    }
}

export default CourseController