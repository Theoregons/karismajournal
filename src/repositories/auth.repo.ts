import {IAuth, IUserInput} from "@/interfaces/auth.interface";
import pool from "@/configs/database";
import {ResultSetHeader, RowDataPacket} from "mysql2";
import {insert} from "@/utils/generate.util";

export const AuthRepo  = {
    getUserByEmail: async(email: string): Promise<IAuth> => {
        const sql = `SELECT users.name,
                            users.email,
                            users.password,
                            users.role
                     FROM users 
                     WHERE email = ? `

        const [results] = await pool.query<IAuth[]>(sql, [email])
        return results[0]
    },

    createUser: async(data: IUserInput) => {
        const [resultUser] = await pool.query<ResultSetHeader>(insert('users', data))

        return resultUser
    },

    checkUserExists: async(email : string): Promise<boolean> => {
        const sql = 'SELECT COUNT(email) AS count FROM users WHERE email = ?'
        const [results] = await pool.query<RowDataPacket[]>(sql, [email])

        return results[0].count > 0
    }
}