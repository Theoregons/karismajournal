import pool from "@/configs/database"
import { IUpdateStudent } from "@/interfaces/admin/student.interface"
import { deleteData, insert, update } from "@/utils/generate.util"
import moment from "moment"
import { ResultSetHeader, RowDataPacket } from "mysql2"

export const StudentRepo = {
    getAllStudents: async(page:number, limit: number) => {
        const offset = (page - 1) * limit
        const sql = `SELECT SQL_CALC_FOUND_ROWS s.id, 
                            u.name, 
                            u.email, 
                            s.address, 
                            s.phone, 
                            s.user_id, 
                            s.gender, 
                            s.place_of_birth, 
                            s.date_of_birth, 
                            s.img, 
                            s.is_active 
                    FROM students s 
                    INNER JOIN users u ON s.user_id = u.id 
                    WHERE s.deleted_at IS NULL LIMIT ? OFFSET ?`
        const [results] = await pool.query<RowDataPacket[]>(sql, [limit, offset])
        const [total] = await pool.query<RowDataPacket[]>('SELECT FOUND_ROWS() as total')

        const totalData = total[0].total
        const totalPage = Math.ceil(totalData / limit)

        return {
            items: results,
            totalPage,
            currentPage: page
        }
    },
    getStudentById: async(id: number) => {
        const sql = `SELECT s.id, 
                            u.name, 
                            u.email, 
                            s.address, 
                            s.phone, 
                            s.user_id, 
                            s.gender, 
                            s.place_of_birth, 
                            s.date_of_birth, 
                            s.img, 
                            s.is_active 
                    FROM students s
                    INNER JOIN users u ON s.user_id = u.id  
                    WHERE deleted_at IS NULL 
                    AND s.id = ?`
        const [results] = await pool.query<RowDataPacket[]>(sql, [id])
        return results[0]
    },
    updateStudent: async(data: IUpdateStudent, studentId: number) => {
        const input = {
            ...data,
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
        }
        const {sql, values} = update('students', input, `id = ${studentId}`)
        const [results] = await pool.query<ResultSetHeader>(sql, values)

        return results
    },
    deleteStudent: async(studentId: number) => {
        const now =  moment().format('YYYY-MM-DD HH:mm:ss')
        const {sql} = deleteData('students', now, `id = ${studentId}`)
        const [results] = await pool.query<ResultSetHeader>(sql)

        return results
    },
    studentActivation: async(studentId: number) => {
        const input = {
            is_active: true,
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
        }
        const {sql, values} = update('students', input, `id = ${studentId}`)
        const [results] = await pool.query<ResultSetHeader>(sql, values)

        return results

    }
}