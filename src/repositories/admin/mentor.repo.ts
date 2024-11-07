import pool from "@/configs/database"
import { IInputMentor } from "@/interfaces/admin/mentor.interface"
import { deleteData, insert, update } from "@/utils/generate.util"
import { hash } from "bcryptjs"
import moment from "moment"
import { ResultSetHeader, RowDataPacket } from "mysql2"

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
    },
    insertMentor: async(data: IInputMentor): Promise<boolean> => {
        const connection = await  pool.getConnection()
        try{
            await connection.beginTransaction()
            const password = 'karisma123123'
            const passwordHashing = await hash(password, 10)
            const inputUser = {
                name: data.name,
                email: data.email,
                password: passwordHashing,
                created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
            }

            const [resultUser] = await pool.query<ResultSetHeader>(insert('users', inputUser))

            const user_id = resultUser.insertId

            const inputMentor = {
                phone: data.phone,
                avatar: data.avatar,
                signature: data.signature,
                description: data.description,
                profession: data.profession,
                link: data.link,
                user_id: user_id,
                created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
            }
            
            const [results] = await pool.query<ResultSetHeader>(insert('mentors', inputMentor))

            await connection.commit()

            return results.affectedRows > 0

        }catch(error){
            await connection.rollback()
            console.error('data gagal ditambah')
            return false
        }finally {
            connection.release()
        }
    },
    updateMentor: async (data: any, mentorId: number, userId: number) => {
        // const {name, email, phone, avatar, signature, description, profession} = data
        const connection = await pool.getConnection()
        try {
            await connection.beginTransaction()
            const inputUser = {
                name: data.name,
                email: data.email,
                updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
            }

            const [results] = await pool.query<ResultSetHeader>(update('users', inputUser, ` id = ${userId}` ))
            
            const inputMentor = {
                phone: data.phone,
                avatar: data.avatar,
                signature: data.signature,
                description: data.description,
                profession: data.profession,
                link: data.link,
                updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
            }
            
            const [mentorResult] = await pool.query<ResultSetHeader>(update('mentors', inputMentor, ` id = ${mentorId}` ))

            await connection.commit()
            return results.affectedRows > 0 && mentorResult.affectedRows > 0
        } catch (error) {
            await connection.rollback()
            throw error
        } finally {
            connection.release()
        }
    },
    deleteMentor: async(mentorId: number) => {
        const now =  moment().format('YYYY-MM-DD HH:mm:ss')
        const {sql} = deleteData('mentors', now, `id = ${mentorId}`)
        const [results] = await pool.query<ResultSetHeader>(sql)

        return results
    }
}