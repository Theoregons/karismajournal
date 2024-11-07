import pool from "@/configs/database"
import { IMaterial, IMaterialPractice, IMaterialQuiz, IMaterialReading, IMaterialVideo, IMaterialWebinar, IUpdateMaterialPractice, IUpdateMaterialQuiz, IUpdateMaterialReading, IUpdateMaterialVideo, IUpdateMaterialWebinar } from "@/interfaces/admin/course.interface"
import { insert, manyInsert, showCondition, update } from "@/utils/generate.util"
import moment from "moment"
import { ResultSetHeader, RowDataPacket } from "mysql2"

export const MaterialRepo = {
    getMaterialCourse: async(chapterId: number): Promise<RowDataPacket[]> => {
        const sql = `SELECT m.id, m.name, m.slug, m.type 
                    FROM materials m 
                    WHERE m.chapter_id = ?`
        const [results] = await pool.query<RowDataPacket[]>(sql, [chapterId])
        return results
    },
    getMaterialBySlug: async(slug:  string): Promise<RowDataPacket> => {
        const sql = `SELECT m.id, m.name, m.slug, m.type 
                        FROM materials m 
                        WHERE m.slug = ?`
        const [results] = await pool.query<RowDataPacket[]>(sql, [slug])
        return results[0]
    },
    getMaterialsByChapterId: async(chapterId: number): Promise<RowDataPacket[]> => {
        const sql = `SELECT m.id, m.name, m.slug, m.type 
                    FROM materials m 
                    WHERE m.chapter_id = ?`
        const [results] = await pool.query<RowDataPacket[]>(sql, [chapterId])
        return results
            
    },
    insertMaterialCourse: async(data: IMaterial[]) => {
        const input = data.map(item => {
            return {
                ...item,
                created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
            }
        })
        const {sql, values} = manyInsert('materials', input)

        const [results] = await pool.query<ResultSetHeader>(sql, values)
        
        return results   
    },
    updateMaterial: async(materialId: number, data: any) => {
        const input = {
            ...data,
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
        }
        const {sql, values} = update('materials', input, ` id = ${materialId}`)
        const [results] = await pool.query<ResultSetHeader>(sql, values)
        
        return results
    },
    deleteMaterials: async(materialIds: number[]) => {
        if (materialIds.length === 0) return
        
        const sql = "DELETE FROM materials WHERE id IN (?)"
        const [results] = await pool.query<ResultSetHeader>(sql, [materialIds])
        return results
    },
    getMaterialByMaterialId: async(materialId: number, type: string) => {
        let table: string | null = null
        let show = "*"
        const condition = ` material_id = ? AND deleted_at IS NULL`
        if (type === "video") {
            table = "material_videos"
            show = "url, type, material_id"
        } else if (type === "webinar") {
            table = "material_webinars"
            show = "id, url, duration, material_id"
        } else if (type === "quiz") {
            table = "material_quizzes"
            show = "id, is_random, target_score, duration, opportunity, material_id"
        } else if (type === "reading") {
            table = "material_readings"
            show = "id, pdf, material_id"
        } else if (type === "practice") {
            table = "material_practices"
            show = "id, document, instruction, objective, material_id"
        } else {
            throw new Error("Invalid material type");
        }        

        const {sql} = showCondition(table, show, condition)
        const [results] = await pool.query<RowDataPacket[]>(sql, [materialId])
        return results[0]
        
    },
    insertMaterial: async(data: IMaterialVideo | IMaterialWebinar | IMaterialQuiz | IMaterialReading | IMaterialPractice, type: string) => {
        let table
        if (type === "video") {
            table = "material_videos"
        } else if (type === "webinar") {
            table = "material_webinars"
        } else if (type === "quiz") {
            table = "material_quizzes"
        } else if (type === "reading") {
            table = "material_readings"
        }  else if (type === "practice") {
            table = "material_practices"
        } else {
            throw new Error("Invalid material type");
        }

        const input = {
            ...data,
            created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
        }


        const {sql, values} = insert(table, input)
        const [results] = await pool.query<ResultSetHeader>(sql, values)

        return results
    }, 
    updateMaterialData: async(materialId: number, data: IUpdateMaterialVideo | IUpdateMaterialWebinar | IUpdateMaterialQuiz | IUpdateMaterialReading | IUpdateMaterialPractice, type: string) => {
        
        let table
        if (type === "video") {
            table = "material_videos"
        } else if (type === "webinar") {
            table = "material_webinars"
        } else if (type === "quiz") {
            table = "material_quizzes"
        } else if (type === "reading") {
            table = "material_readings"
        }  else if (type === "practice") {
            table = "material_practices"
        } else {
            throw new Error("Invalid material type");
        }
        
        const input = {
            ...data,
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
        }
        const {sql, values} = update(table, input, ` material_id = ${materialId}`)
        const [results] = await pool.query<ResultSetHeader>(sql, values)

        return results
    }
}