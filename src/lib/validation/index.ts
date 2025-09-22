import { z } from "zod"

export const SignupValidation = z.object({
    username: z.string().min(2, { message: 'too short' }).max(50, { message: 'too long' }),
    email: z.string().email(),
    category:z.string(),
    password: z.string().min(8, { message: 'minimum 8 characters' }).max(50, { message: 'maximum 50 characters' }),
})

export const SigninValidation = z.object({
    email: z.string().email(),
    password: z.string().min(8, { message: 'minimum 8 characters' }).max(50, { message: 'maximum 50 characters' })
})

export const PostValidation = z.object({
    userID: z.string(),
    caption: z.string().min(10, { message: 'minimum 10 characters' }).max(80, { message: 'maximum 80 characters' }),
    file: z.array(z.instanceof(File)).optional(),
    category: z.string(),
    conditions: z.string(),
    tags: z.string(),
})
export const ProjectValidation = z.object({
    userID: z.string(),
    projectname: z.string().min(10, { message: 'minimum 10 characters' }).max(80, { message: 'maximum 80 characters' }),
    discription: z.string().min(10, { message: 'minimum 10 characters' }).max(80, { message: 'maximum 80 characters' }),
    privacy: z.string(),
    members: z.string(),
})

export const ApplicationValidation = z.object({
    userID: z.string(),
    postID: z.string(),
    file: z.array(z.instanceof(File)),
    fileID: z.string().optional()

})