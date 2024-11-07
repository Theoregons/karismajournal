export const uploadImage = async (file: Blob, fileName: string, path: string) => {
    const fileBlob = new Blob([file])
    const form = new FormData()
    form.append('file', fileBlob, fileName)
    form.append('location', path)
    // const response = await axios.post(`${process.env.CDN_BASE_URL_LOCAL}/api/v1/upload`, form, {
    //     headers: {
    //         'Content-Type': 'multipart/form-data'
    //     }
    // })

    // const {data} = response.data
    // const {location, filename} = data

    // return `${location}/${filename}`
    return 'upload image'
}

export const showCondition = (table: string, show: string | "*", condition: string) => {
    const sql = `SELECT ${show} FROM ${table} WHERE ${condition}`
    return {
        sql
    }
}

export const insert = (table: string, data: any) => {
    const keys = Object.keys(data).join(',')
    const values = Object.values(data)

    const placeholders = values.map(() => '?').join(',')
    const sql = `INSERT INTO ${table} (${keys})
                 VALUES (${placeholders})`

    return {
        sql, values
    }
}

export const manyInsert = (table: string, data: any[]) => {
    if (data.length === 0) {
        throw new Error('Data array cannot be empty')
    }

    // Extract the keys from the first row of data
    const keys = Object.keys(data[0])
    const keysString = keys.join(',')
    const placeholders = '(' + keys.map(() => '?').join(',') + ')'

    // Create the SQL INSERT statement
    let sql = `INSERT INTO ${table} (${keysString})
               VALUES `

    // Create a string of placeholders for each row
    sql += data.map(() => placeholders).join(',')

    // Flatten the data values into a single array
    const values = data.flatMap(row => keys.map(key => row[key]))

    return {sql, values}
}

export const update = (table: string, data: any, condition: string) => {
    const keys = Object.keys(data)
    const values = Object.values(data)

    const setClause = keys.map(key => `${key} = ?`).join(', ')

    const sql = `UPDATE ${table}
                 SET ${setClause}
                 WHERE ${condition}`

    return {
        sql, values
    }
}

export const manyUpdate = (table: string, data: any[], condition: string) => {
    if (data.length === 0) {
        throw new Error('Data array cannot be empty');
    }

    // Ambil kunci dari item pertama untuk mendapatkan kolom yang akan diupdate
    const keys = Object.keys(data[0]);
    
    // Buat bagian SET dari query
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    // Buat query untuk setiap item dengan kondisi yang sama
    const sql = `UPDATE ${table} SET ${setClause} WHERE ${condition}`;

    // Flatten data values ke dalam satu array
    const values = data.flatMap(row => keys.map(key => row[key]));

    return { sql, values };
};

export const deleteData = (table: string, dateNow: string, condition: string) => {

    const sql = `UPDATE ${table}
                 SET deleted_at = '${dateNow}'
                 WHERE ${condition}`

    return {
        sql
    }
}


export const generateSlug = (name: string): string => {
    return name
        .toLowerCase()                           
        .replace(/[^a-z0-9\s-]/g, '')            
        .replace(/\s+/g, '-')                    
        .replace(/-+/g, '-')                     
        .trim();                                 
}