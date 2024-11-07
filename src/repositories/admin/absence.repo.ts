import pool from "@/configs/database"
import { deleteData, insert, update } from "@/utils/generate.util"
import moment from "moment"
import { ResultSetHeader, RowDataPacket } from "mysql2"

export const AbsenceRepo = {
    getAll: async(materialId: number, scheduleId: number) => {
        const sql = `SELECT a.id, a.code, a.exp_date 
                    FROM absences a 
                    WHERE a.material_id = ? 
                    AND a.schedule_id = ? 
                    AND a.deleted_at IS NULL`
        const [results] = await pool.query<RowDataPacket[]>(sql, [materialId, scheduleId])
        return results

    },
    getAbsenceByCode: async(code: string) => {
        const sql = `SELECT a.id, a.code, a.exp_date 
                    FROM absences a 
                    WHERE a.code = ? AND a.deleted_at IS NULL`
        const [results] = await pool.query<RowDataPacket[]>(sql, [code])
        return results
    },
    insertAbsence: async(data: any, materialId: number, scheduleId: number) => {
        const input ={
            ...data,
            material_id: materialId,
            schedule_id: scheduleId,
            created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
        }

        const {sql, values} = insert('absences', input)
        const [results] = await pool.query<ResultSetHeader>(sql, values)
        return results.affectedRows > 0
    },
    updateAbsence: async(data: any, materialId: number, scheduleId: number, absenceId: number) => {
        const input ={
            ...data,
            material_id: materialId,
            schedule_id: scheduleId,
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
        }

        const {sql, values} = update('absences', input, ` id=${absenceId}`)
        const [results] = await pool.query<ResultSetHeader>(sql, values)

        return results

    },
    deleteAbsence: async(absenceId: number) => {
        const now =  moment().format('YYYY-MM-DD HH:mm:ss')
        const {sql} = deleteData('absences', now, ` id = ${absenceId}`)
        const [results] = await pool.query<ResultSetHeader>(sql)

        return results

    },
    insertlLogAbsence: async() => {

    }

}