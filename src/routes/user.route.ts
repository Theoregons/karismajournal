import { Hono } from "hono";
import {JwtMiddleware} from "../middleware/jwt.middleware";
import AuthController from "../controllers/user/auth.controller";
import ProfileController from "../controllers/user/profille.controller";
import {registerSchema} from "../schemas/user/register.schema";
import {loginSchema} from "../schemas/user/login.schema";

const UserApp = new Hono()

//GET PUBLIC FILES
UserApp.get('/public/*', ProfileController.getPub);

// AUTH ROUTES
UserApp.post('/auth/login', loginSchema, AuthController.login)
UserApp.post('/auth/register', registerSchema,  AuthController.register)

// SESSION START
UserApp.use(JwtMiddleware)
//
// // COURSE ROUTES
// UserApp.post('/course', CourseController.courseAll)
// UserApp.post('/course/:slug', CourseController.courseById)
//
// // MENTOR ROUTES
// UserApp.post('/mentors', MentorController.getAll)
//
//
// // PROFILE ROUTES
// UserApp.post('/profile', ProfileController.getAll)
// UserApp.post('/profile/:id/update', ProfileController.updateProfile)
//
// // USER COURSES
// UserApp.post('/owned/course', OwnedCourseController.courseOwned)
// UserApp.post('/owned/course/active', OwnedCourseController.courseActive)
// UserApp.post('/owned/course/complete', OwnedCourseController.completeOwnedMaterial)
// UserApp.post('/owned/course/:slug', OwnedCourseController.courseOwnedDetail)

export default UserApp