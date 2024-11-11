import {RowDataPacket} from "mysql2";

export interface IAuth extends RowDataPacket {
    name: string
    email: string
    password?: string
    role: string
    instagram: string
    whatsapp: string
    tiktok: string
    user_id: number
    id: number
    wallet: number
    coin: number
    bank_type: string
    bank_account: string
    bank_verification: number
    bank_name: string
}

export interface IUserInput{
    name: string
    email: string
    password?: string
}

export interface ICatInput{
    name: string
}