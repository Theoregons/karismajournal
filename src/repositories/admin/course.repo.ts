import {ResultSetHeader, RowDataPacket} from "mysql2";
import pool from "@/configs/database";
import {IChapter, ICompetency, IInsertLevelCourse, IInsertMentorCourse, IInsertSchedule, IInsertStudentCourse, IMaterial, IMaterialPractice, IMaterialQuiz, IMaterialReading, IMaterialVideo, IMaterialWebinar, InsertCategories, InsertCourse, IUnitCompetency, IUpdateCategory, IUpdateCourse, IUpdateMaterial, IUpdateMaterialVideo} from "@/interfaces/admin/course.interface";
import {deleteData, insert, manyInsert, manyUpdate, update} from "@/utils/generate.util";
import moment from "moment";

export const CourseRepo = {
    getAllCourse: async (page: number, limit: number) => {
        const offset = (page - 1) * limit
        const sql = `SELECT SQL_CALC_FOUND_ROWS c.id, c.name,
                            c.slug,
                            c.price, 
                            c.is_active, 
                            COALESCE(sc.student_count, 0) AS student_count
                     FROM courses c
                              LEFT JOIN (SELECT course_id, COUNT(*) AS student_count
                                         FROM student_courses
                                         GROUP BY course_id) sc ON c.id = sc.course_id
                     WHERE c.is_active = 1 AND c.deleted_at IS NULL 
                     ORDER BY c.name LIMIT ? OFFSET ?`
        const [results] = await pool.query<RowDataPacket[]>(sql, [limit, offset])
        const [count] = await pool.query<RowDataPacket[]>('SELECT FOUND_ROWS() as total')
        const totalData= count[0].total as number
        const totalPage = Math.ceil(totalData/ limit)
        return {
            items: results,
            totalData,
            totalPage,
            currentPage: page
        }
    },
    getCourseBySlug: async(slug: string): Promise<RowDataPacket> => {
        const sql = `SELECT c.id, 
                            c.name,
                            c.slug,
                            c.price, 
                            c.code, 
                            c.short_description, 
                            c.description, 
                            c.is_active, 
                            c.requeirement, 
                            c.type,
                            c.course_category_id, 
                            cc.name AS category, 
                            COALESCE(sc.student_count, 0) AS student_count
                     FROM courses c
                              LEFT JOIN (SELECT course_id, COUNT(*) AS student_count
                                         FROM student_courses
                                         GROUP BY course_id) sc ON c.id = sc.course_id
                                INNER JOIN course_categories cc ON cc.id = c.course_category_id
                     WHERE c.is_active = 1 AND c.slug = ? AND c.deleted_at IS NULL
                     ORDER BY c.name`
        const [results] = await pool.query<RowDataPacket[]>(sql, [slug])
        return results[0]
    },
    insertCourse: async (data: InsertCourse): Promise<ResultSetHeader> => {
        const input = {
            ...data,
            created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
        }
        const {sql, values} = insert('courses', input)
        const [results] = await pool.query<ResultSetHeader>(sql, values)

        return results
    },
    updateCourse: async(data: IUpdateCourse, courseId: number) => {
        const input = {
            ...data,
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
        }
        const {sql, values} = update('courses', input, ` id = ${courseId}`)
        const [results] = await pool.query<ResultSetHeader>(sql, values)

        return results
    },
    deleteCourseData: async(courseId: number) => {
        const now =  moment().format('YYYY-MM-DD HH:mm:ss')
        const {sql} = deleteData('courses', now, ` id = ${courseId}`)
        const [results] = await pool.query<ResultSetHeader>(sql)

        return results

    },
    getAllCourseCategories: async(): Promise<RowDataPacket[]> => {
        const sql = `SELECT cc.id, cc.name, cc.slug, cc.short_description, cc.description FROM course_categories cc WHERE cc.deleted_at IS NULL`
        const [results] = await pool.query<RowDataPacket[]>(sql)

        return results
    },
    getCourseCategoryById: async(categoryId: number) => {
        const sql = `SELECT cc.id, cc.name, cc.slug, cc.short_description, cc.description FROM course_categories cc WHERE cc.deleted_at IS NULL AND cc.id = ?`
        const [results] = await pool.query<RowDataPacket[]>(sql, [categoryId])

        return results[0]
    },
    insertCourseCategories: async (data: InsertCategories): Promise<ResultSetHeader> => {
        const input = {
            ...data,
            created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
        }
        const {sql, values} = insert('course_categories', input)
        const [results] = await pool.query<ResultSetHeader>(sql, values)

        return results
    },
    updateCourseCategory: async(data: IUpdateCategory, categoryId: number): Promise<ResultSetHeader> => {
        
        const input = {
            ...data,
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
        }
        const {sql, values} = update('course_categories', input, ` id = ${categoryId}`)
        const [results] = await pool.query<ResultSetHeader>(sql, values)

        return results
    },
    deleteCourseCategory: async(categoryId: number) => {
        const now =  moment().format('YYYY-MM-DD HH:mm:ss')
        const {sql} = deleteData('course_categories', now, ` id = ${categoryId}`)
        const [results] = await pool.query<ResultSetHeader>(sql)

        return results
    },
    getAllLevels: async() => {
        const sql = `SELECT id, name FROM levels l WHERE l.deleted_at IS NULL`
        const [results] = await pool.query<RowDataPacket[]>(sql)
        
        return results
    },
    getLevelById: async(levelId: number) => {
        const sql = `SELECT id, name FROM levels l WHERE l.deleted_at IS NULL AND l.id = ? `
        const [results] = await pool.query<RowDataPacket[]>(sql, [levelId])

        return results
    },
    insertLevel: async(data: any) => {
        const input = {
            ...data,
            created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
        }
        const {sql, values} = insert('levels', input)
        const [results] = await pool.query<ResultSetHeader>(sql, values)

        return results
    },
    updateLevel: async(data: any, levelId: number) => {
        const input = {
            ...data,
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
        }
        const {sql, values} = update('levels', input, ` id = ${levelId}`)
        const [results] = await pool.query<ResultSetHeader>(sql, values)

        return results
    },
    deleteLevel: async(levelId: number) => {
        const now =  moment().format('YYYY-MM-DD HH:mm:ss')
        const {sql} = deleteData('levels', now, ` id = ${levelId}`)
        const [results] = await pool.query<ResultSetHeader>(sql)

        return results
    },
    getLevelByCourseId: async(courseId: number) => {
        const sql = `SELECT cl.level_id 
                    FROM course_levels cl 
                    INNER JOIN courses c ON cl.course_id = c.id 
                    WHERE cl.course_id = ? 
                    AND c.deleted_at IS NULL`
        const [results] = await pool.query<RowDataPacket[]>(sql, [courseId])
        return results
    },
    insertLevelCourse: async(data: IInsertLevelCourse[]): Promise<ResultSetHeader> => {
        const input = data.map(item => {
            return {
                ...item,
                created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
            }
        })

        const {sql, values} = manyInsert('course_levels', input)
        const [results] = await pool.query<ResultSetHeader>(sql, values)

        return results
    },
    deleteLevelCourseByIds: async (courseId: number, levelIds:number[]) => { 
        console.log(levelIds)
        
        const sql = `DELETE FROM course_levels WHERE course_id = ? AND level_id IN (?)`
        const [results] = await pool.query<ResultSetHeader>(sql, [courseId, levelIds])

        return results
    },
    getStudentCourseByStudentId: async(studentId: number): Promise<boolean> => {
        const sql = `SELECT COUNT(id) AS total FROM student_courses sc WHERE sc.student_id = ?`
        const [results] = await pool.query<RowDataPacket[]>(sql, [studentId])
        return results[0].total < 1
    },
    inserStudentCourse: async(data: IInsertStudentCourse): Promise<ResultSetHeader> => {
        const input = {
            ...data,
            created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
        }

        const {sql, values} = insert('student_courses', input)
        const [results] = await pool.query<ResultSetHeader>(sql, values)

        return results

    },
    getMentorByCourseId: async(courseId: number) => {
        const sql = `SELECT mc.mentor_id 
                    FROM mentor_courses mc 
                    INNER JOIN courses c ON mc.course_id = c.id 
                    WHERE mc.course_id = ? 
                    AND c.deleted_at IS NULL`
        const [results] = await pool.query<RowDataPacket[]>(sql, [courseId])
        return results
    } ,
    insertMentorCourse: async(data: IInsertMentorCourse[]): Promise<ResultSetHeader> => {
        const input = data.map(item => {
            return {
                ...item,
                created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
            }
        })        

        const {sql, values} = manyInsert('mentor_courses', input)
        const [results] = await pool.query<ResultSetHeader>(sql, values)

        return results
    },
    deleteMentorCourseByIds: async (courseId: number, mentorIds:number[]) => { 
        const sql = `DELETE FROM mentor_courses WHERE course_id = ? AND mentor_id IN (?)`
        const [results] = await pool.query<ResultSetHeader>(sql, [courseId, mentorIds])

        return results
    },
    getCompetencyByCourseId: async(courseId: number) => {
        const sql = `SELECT COUNT(*) AS total FROM competencies c WHERE c.course_id = ?`
        const [results] = await pool.query<RowDataPacket[]>(sql, [courseId])
        return results[0].total > 0
    },
    insertCompetencyCourse: async(data: ICompetency[]): Promise<ResultSetHeader> => {
        const input = data.map(item => {
            return {
                name: item.name,
                course_id: item.course_id,
                created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
            }
        })        
        
        const {sql, values} = manyInsert('competencies', input)
        const [results] = await pool.query<ResultSetHeader>(sql, values)

        return results
    },
    deleteCompetencyCourse: async(courseId: number): Promise<ResultSetHeader> => {
        const sql = `DELETE FROM competencies WHERE course_id = ?`
        const [results] =  await pool.query<ResultSetHeader>(sql, [courseId])
        return results
    },
    insertCompetencyUnitCourse: async(data: IUnitCompetency[]): Promise<ResultSetHeader> => {
        const input = data.map(item => {
            return {
                ...item,
                created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
            }
        })
        
        const {sql, values} = manyInsert('competency_units', input)
        const [results] = await pool.query<ResultSetHeader>(sql, values)

        return results
    },
    getChapterByCoursesId: async(courseId: number): Promise<RowDataPacket[]> => {
        const sql = `SELECT ch.id, ch.name, ch.slug, ch.description
                    FROM chapters ch 
                    WHERE ch.course_id = ?`
        const [results] = await pool.query<RowDataPacket[]>(sql, [courseId])
        return results
    },
    insertChapterCourse: async(data: IChapter[]) => {                
        const input = data.map(item => {
            return {
                name: item.name,
                slug: item.slug,
                sequence: item.sequence,
                description: item.description,
                course_id: item.course_id,
                created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
            }
        })        
        
        const {sql, values} = manyInsert('chapters', input)

        const [results] = await pool.query<ResultSetHeader>(sql, values)
        
        return results
    },
    updateChapterCourse: async(chapterId: number, data: any) => {
        const input = {
            name: data.name,
            slug: data.slug,
            sequence: data.sequence,
            description: data.description,
            course_id: data.course_id,
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
        }

        const {sql, values} = update('chapters', input, ` id = ${chapterId}`)
        const [results] = await pool.query<ResultSetHeader>(sql, values)
        
        return results
    },
    deleteChapters: async(chapterIds: number[]) => {
        if (chapterIds.length === 0) return
        
        const sql = "DELETE FROM chapters WHERE id IN (?)"
        const [results] = await pool.query<ResultSetHeader>(sql, [chapterIds])
        return results
    },
    getAllSchedulesByCourseId: async(courseId: number, page: number, limit: number): Promise<{items:RowDataPacket[], totalData:number, totalPage: number, currentPage: number}> => {
        const offset = (page - 1) * limit
        const sql = `SELECT SQL_CALC_FOUND_ROWS s.name,s.code,s.start_at, s.end_at, s.capacity, s.is_active 
                    FROM schedules s 
                    WHERE s.deleted_at IS NULL AND s.course_id = ?
                    LIMIT ? OFFSET ?`
        const [results] = await pool.query<RowDataPacket[]>(sql, [courseId, limit, offset])
        const [count] = await pool.query<RowDataPacket[]>('SELECT FOUND_ROWS() as total')
        const totalData= count[0].total as number
        const totalPage = Math.ceil(totalData/ limit)
        return {
            items: results,
            totalData,
            totalPage,
            currentPage: page
        }

    },
    getScheduleByCode: async(code: string) => {
        const sql = `SELECT s.id, s.name,s.code,s.start_at, s.end_at, s.capacity, s.is_active, s.course_id 
                    FROM schedules s 
                    WHERE s.deleted_at IS NULL AND s.code = ?`
        const [results] = await pool.query<RowDataPacket[]>(sql, [code])
        return results[0]
    },
    insertScheduleCourse: async(data: IInsertSchedule) => {        
        const input = {
            ...data,
            created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
        }

        const {sql, values} = insert('schedules', input)
        const [results] = await pool.query<ResultSetHeader>(sql, values)

        return results
    }, 
    updateScheduleCourse: async(data: IInsertSchedule, scheduleId: number) => {
        const input = {
            ...data,
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
        }

        const {sql, values} = update('schedules', input, ` id = ${scheduleId}`)
        const [results] = await pool.query<ResultSetHeader>(sql, values)

        return results
    },
    deleteScheduleCourse: async(scheduleId: number) => {
        const now =  moment().format('YYYY-MM-DD HH:mm:ss')
        const {sql} = deleteData('schedules', now, ` id = ${scheduleId}`)
        const [results] = await pool.query<ResultSetHeader>(sql)

        return results
    },
    getScheduleStudents: async(scheduleId: number) => {
        const sql = `SELECT u.name, u.email 
                    FROM student_schedules ss 
                    INNER JOIN students s ON ss.student_id = s.id 
                    INNER JOIN users u ON u.id = s.user_id
                    INNER JOIN schedules sc ON sc.id = ss.schedule_id
                    WHERE sc.deleted_at IS NULL AND ss.schedule_id = ?`
        const [results] =  await pool.query<RowDataPacket[]>(sql, [scheduleId])
        return results
    }
}