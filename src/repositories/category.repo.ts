import {ResultSetHeader, RowDataPacket} from "mysql2";
import pool from "@/configs/database";
import {ICatInput, IUserInput} from "@/interfaces/auth.interface";
import {insert, update} from "@/utils/generate.util";
import moment from "moment/moment";


export const CategoryRepo = {
    getAllCategories: async () => {
        const sql = `SELECT * 
                     FROM category
                      ORDER BY id`
        const [results] = await pool.query<RowDataPacket[]>(sql, [])
        return results
    },
    getByIdCategories: async (id:number) => {
        const sql = `SELECT * FROM category WHERE id = ?`
        const [results] = await pool.query<RowDataPacket[]>(sql, [id])
        return results
    },

    createCategory: async(data: ICatInput) => {
        const [resultUser] = await pool.query<ResultSetHeader>(insert('category', data))
        return resultUser
    },

    updateCategory: async(id:number, data: ICatInput) => {
        // const sql = 'UPDATE category SET name =  WHERE id = ?'
        const input = {
            ...data,
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
        }
        console.log(input)
        const {sql, values} = update('category', input, ` id = ${id}`)
        const [results] = await pool.query<ResultSetHeader>(sql, values)

        return results
    },

    //
    // getCourseBySlug: async(slug: string) => {
    //     const sql = `SELECT c.id, c.image,
    //                         c.name,
    //                         c.slug,
    //                         c.short_description,
    //                         c.description,
    //                         c.requeirement,
    //                         c.type,
    //                         c.price
    //                  FROM courses c WHERE slug = ?`
    //
    //     const [results] = await pool.query<RowDataPacket[]>(sql, [slug])
    //     return results[0] as RowDataPacket
    //
    // },
    //
    // getMentorById: async(id:number) => {
    //     const sql = `SELECT u.name,
    //                         m.avatar,
    //                         m.profession,
    //                         m.description,
    //                         m.link
    //                  FROM mentor_courses mc
    //                           JOIN mentors m ON m.id = mc.mentor_id
    //                           JOIN users u ON u.id = m.user_id
    //                  WHERE mc.course_id = ?`
    //
    //     const [results] = await pool.query(sql, [id])
    //     return results as RowDataPacket[]
    //
    // }
}