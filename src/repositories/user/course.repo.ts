import {RowDataPacket} from "mysql2";
import pool from "@/configs/database";

export const CourseRepo = {
    getAllCourse: async () => {
        const sql = `SELECT c.name,
                            c.slug, 
                            c.short_description,
                            c.image,
                            c.price  
                     FROM courses c  
                     WHERE c.is_active = 1 AND deleted_at IS NULL
                     ORDER BY c.name`
        const [results] = await pool.query<RowDataPacket[]>(sql, [])
        return results
    },

    getCourseBySlug: async(slug: string) => {
        const sql = `SELECT c.id, c.image,
                            c.name,
                            c.slug,
                            c.short_description,
                            c.description,
                            c.requeirement,
                            c.type,
                            c.price
                     FROM courses c WHERE slug = ?`

        const [results] = await pool.query<RowDataPacket[]>(sql, [slug])
        return results[0] as RowDataPacket

    },

    getMentorById: async(id:number) => {
        const sql = `SELECT u.name,
                            m.avatar,
                            m.profession,
                            m.description,
                            m.link
                     FROM mentor_courses mc
                              JOIN mentors m ON m.id = mc.mentor_id
                              JOIN users u ON u.id = m.user_id
                     WHERE mc.course_id = ?`

        const [results] = await pool.query(sql, [id])
        return results as RowDataPacket[]

    }
}