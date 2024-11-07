import {Context} from "hono";
import {getToken, getUserToken} from "@/middleware/jwt.middleware";
import {createResponderSender} from "@/utils/response";
import path from "path";
import {StudentRepo} from "@/repositories/admin/student.repo";
import {decode} from 'hono/jwt'
import {UserRepo} from "@/repositories/user/user.repo";


const ProfileController = {
    getAll: async (c: Context) => {
        const response = createResponderSender(c)
        const user = await getUserToken(c)

        return response(200, user, "ok")
    },
    updateProfile: async (c: Context) => {
        const response = createResponderSender(c)

        const token = await getToken(c);

        const {payload}: any = decode(token)
        const {email} = payload
        const userByEmail = await UserRepo.getUserByEmail(email)

        const formData = await c.req.formData();

        const form = ['address', 'gender', 'place_of_birth', 'date_of_birth', 'phone', 'profession', 'identity_img', 'identity_number']

        const forms= form.map(field => formData.get(field) as string);

        const customData = Object.fromEntries(
            Object.entries(forms).map(([key, value]) =>
                // @ts-ignore
                [form[key], value])
        );

        const file = formData.get('img') as File;

        if (!file) return c.text('Tidak ada file yang diunggah', 400);

        const uploadDir = './public';
        const filePath = `${uploadDir}/${file.name}`;

        await Bun.write(filePath, file);

        const data = Object.assign({}, forms)

        const res = await UserRepo.updateStudent(customData, userByEmail.id)

        if (!res) return response(400, {}, "Gagal Mengubah Data")

        return response(201, res, "Berhasil Mengubah Profile")
    },

    getPub: async (c: Context) => {
        const filePath = c.req.path.replace('/public', '');
        const fullPath = path.join(process.cwd(), 'public', filePath);

        try {
            const file = await Bun.file(fullPath);
            if (!file) return c.text('File not found', 404);

            // @ts-ignore
            return c.body(file);

        } catch (error) {
            console.error('Error serving static file:', error);
            return c.text('Failed to load file', 500);
        }
    }
}

export default ProfileController