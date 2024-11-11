import { Hono } from "hono";
import {JwtMiddleware} from "../middleware/jwt.middleware";
import AuthController from "../controllers/auth.controller";
import ProfileController from "../controllers/categories.controller";
import {registerSchema} from "../schemas/user/register.schema";
import {loginSchema} from "../schemas/user/login.schema";
import CategoriesController from "../controllers/categories.controller";

const UserApp = new Hono()

//GET PUBLIC FILES
UserApp.get('/public/*', ProfileController.getPub);

// AUTH ROUTES
UserApp.post('/auth/login', loginSchema, AuthController.login)
UserApp.post('/auth/register', registerSchema,  AuthController.register)

// SESSION START
UserApp.use(JwtMiddleware)

// CATEGORIES ROUTES
UserApp.get('/category',  CategoriesController.getAllCategories)
UserApp.get('/category/:id',  CategoriesController.getCategoriesById)
UserApp.post('/category',  CategoriesController.createCategories)
UserApp.put('/category/:id',  CategoriesController.updateCategories)
UserApp.delete('/category/:id',  CategoriesController.createCategories)

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