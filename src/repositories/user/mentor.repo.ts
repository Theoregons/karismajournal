import pool from "@/configs/database"
import { RowDataPacket } from "mysql2"

export const MentorRepo = {
    getAllMentors: async(page: number, limit: number) => {
        const offset = (page - 1) * limit
        const sql = `SELECT SQL_CALC_FOUND_ROWS 
                            m.id, 
                            u.name, 
                            u.email, 
                            m.user_id, 
                            m.phone, 
                            m.avatar, 
                            m.signature, 
                            m.description, 
                            m.profession, 
                            m.link 
                    FROM mentors m 
                    INNER JOIN users u ON u.id = m.user_id 
                    WHERE m.deleted_at IS NULL 
                    LIMIT ? OFFSET ?`
        const [results] = await pool.query<RowDataPacket[]>(sql, [limit, offset])
        const [total] = await pool.execute<RowDataPacket[]>('SELECT FOUND_ROWS() as total')

        const totalData = total[0].total
        const totalPage = Math.ceil(totalData / limit)
        return {
            items: results,
            totalPage,
            currentPage: page
        }
    },
    getMentorById: async (id: number): Promise<RowDataPacket> => {
        const sql = `SELECT m.id, 
                            u.name, 
                            u.email,
                            m.user_id, 
                            m.phone, 
                            m.avatar, 
                            m.signature, 
                            m.description, 
                            m.profession, 
                            m.link 
                    FROM mentors m 
                    INNER JOIN users u ON u.id = m.user_id 
                    WHERE m.deleted_at IS NULL  
                    AND m.id = ?`
        const [results] = await pool.query<RowDataPacket[]>(sql, [id])
        return results[0]
    }
}