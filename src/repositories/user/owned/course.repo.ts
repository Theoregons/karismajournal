import {ResultSetHeader, RowDataPacket} from "mysql2";
import pool from "@/configs/database";
import {insert} from "@/utils/generate.util";
import moment from 'moment'
import {InsertLogMaterial} from "@/interfaces/user/course.interface";

export const CourseRepo = {
    getOwnedCourse: async (id:number) => {
        const sql = `SELECT c.name, c.slug, c.price, c.image, progress FROM student_courses INNER JOIN courses c ON student_courses.course_id = c.id WHERE student_courses.student_id  = ? AND c.deleted_at IS NULL
                     ORDER BY c.name`
        const [results] = await pool.query<RowDataPacket[]>(sql, [id])
        return results
    },
    getOwnedCourseBySlug: async(slug: string) => {
        const sql = `SELECT *
                     FROM courses
                     WHERE slug = ?`
        const [results] = await pool.query<RowDataPacket[]>(sql, [slug])
        return results[0] as RowDataPacket
    },
    getOwnedById: async(idSlug: string) => {
        const sql = `SELECT ch.id, ch.name, m.id AS material_id, m.name AS material_name, m.type
                        FROM chapters ch 
                        INNER JOIN materials m ON m.chapter_id = ch.id
                        INNER JOIN courses c ON ch.course_id = c.id 
                        WHERE ch.course_id = ?`
        const [results] = await pool.query<RowDataPacket[]>(sql, [idSlug])
        return results
    },
    getActiveCourse: async(id: number) => {
        const sql = `SELECT *
                    FROM materials
                    WHERE id = ?`
        const [results] = await pool.query<RowDataPacket[]>(sql, [id])
        return results[0] as RowDataPacket
    },
    completeMaterial: async(id: number) => {
        const sql = `SELECT *
                    FROM materials
                    WHERE id = ?`
        const [results] = await pool.query<RowDataPacket[]>(sql, [id])
        return results[0] as RowDataPacket
    },
    getStudentLog: async(material_id: number, student_id: number) => {
        const sql = `SELECT *
                    FROM log_student_materials
                    WHERE material_id = ? AND student_id = ?`
        const [results] = await pool.query<RowDataPacket[]>(sql, [material_id, student_id])
        return results as RowDataPacket[]
    },
    insertLogMaterialStudent: async(data: InsertLogMaterial ):Promise<ResultSetHeader> => {
        const input = {
            ...data,
            created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
        }

        const {sql, values} = insert('log_student_materials', input)
        console.log(sql, values)
        const [results] = await pool.query<ResultSetHeader>(sql, values)
        return results
    }
}