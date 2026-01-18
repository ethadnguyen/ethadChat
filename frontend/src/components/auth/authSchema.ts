import { z } from 'zod';

export const signupSchema = z.object({
    lastName: z.string().min(1, 'Họ không được để trống').max(50, 'Họ không được vượt quá 50 ký tự'),
    firstName: z.string().min(1, 'Tên không được để trống').max(50, 'Tên không được vượt quá 50 ký tự'),
    username: z.string().min(3, 'Tên tài khoản không được để trống').max(30, 'Tên tài khoản không được vượt quá 30 ký tự'),
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(8, 'Mật khẩu không được để trống').max(30, 'Mật khẩu không được vượt quá 30 ký tự'),
    passwordConfirm: z.string().min(8, 'Mật khẩu không được để trống').max(30, 'Mật khẩu không được vượt quá 30 ký tự'),
}).refine((data: { password: string; passwordConfirm: string }) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Mật khẩu không khớp',
})

export const signinSchema = z.object({
    username: z.string().min(3, 'Tên tài khoản không được để trống').max(30, 'Tên tài khoản không được vượt quá 30 ký tự'),
    password: z.string().min(8, 'Mật khẩu không được để trống').max(30, 'Mật khẩu không được vượt quá 30 ký tự'),
})

export type SignupSchemaType = z.infer<typeof signupSchema>;

export type SigninSchemaType = z.infer<typeof signinSchema>;