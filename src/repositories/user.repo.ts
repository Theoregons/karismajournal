import pool from "@/configs/database";
import {ResultSetHeader, RowDataPacket} from "mysql2";
import moment from "moment/moment";
import {update} from "@/utils/generate.util";

export const UserRepo = {
    getUserByEmail: async (email: string | unknown) => {
        const sql = `SELECT users.name,
                            users.email, 
                            users.role_as, 
                            users.id as user_id,
                            students.*
                     FROM users
                              INNER JOIN students ON students.user_id = users.id
                     WHERE email = ? AND users.role_as = 'Student'`

        const [results] = await pool.query<RowDataPacket[]>(sql, [email])

        return results[0] as RowDataPacket
    },
}