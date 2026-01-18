import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import type { SignupSchemaType } from './authSchema';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema } from './authSchema';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNavigate } from 'react-router';

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupSchemaType>({ resolver: zodResolver(signupSchema) });

  const { signUp } = useAuthStore();

  const onSubmit: SubmitHandler<SignupSchemaType> = async (data: SignupSchemaType) => {
    await signUp(data).then(() => {
      navigate('/signin');
    });
  };

  return (
    <div className={cn('flex flex-col gap-2', className)} {...props}>
      <Card className='overflow-hidden p-0 border-border'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          <form className='p-3 md:p-5' onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col gap-3'>
              <div className='flex flex-col items-center text-center gap-0.5'>
                <a href='/' className='mx-auto block w-fit text-center'>
                  <img src='/logo.svg' alt='logo' className='h-8' />
                </a>

                <h1 className='text-xl font-bold'>Tạo tài khoản EthadChat</h1>
                <p className='text-muted-foreground text-balance text-sm'>
                  Chào mừng đến với EthadChat, Hãy đăng ký để bắt đầu!
                </p>
              </div>

              <div className='grid grid-cols-2 gap-1.5'>
                <div className='space-y-0.5'>
                  <Label htmlFor='lastname' className='text-sm'>
                    Họ
                  </Label>
                  <Input
                    id='lastname'
                    placeholder='Nhập họ của bạn'
                    className='block text-sm h-9'
                    autoComplete='family-name'
                    {...register('lastName')}
                  />
                  <div className='min-h-[16px]'>
                    {errors.lastName && (
                      <p className='text-destructive text-xs'>
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className='space-y-0.5'>
                  <Label htmlFor='firstname' className='text-sm'>
                    Tên
                  </Label>
                  <Input
                    id='firstname'
                    placeholder='Nhập tên của bạn'
                    className='block text-sm h-9'
                    autoComplete='given-name'
                    {...register('firstName')}
                  />
                  <div className='min-h-[16px]'>
                    {errors.firstName && (
                      <p className='text-destructive text-xs'>
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className='flex flex-col gap-1'>
                <Label htmlFor='username' className='text-sm'>
                  Tên tài khoản
                </Label>
                <Input
                  id='username'
                  placeholder='Nhập tên tài khoản của bạn'
                  className='block text-sm h-9'
                  {...register('username')}
                />
                <div className='min-h-[16px]'>
                  {errors.username && (
                    <p className='text-destructive text-xs'>
                      {errors.username.message}
                    </p>
                  )}
                </div>
              </div>

              <div className='flex flex-col gap-1'>
                <Label htmlFor='email' className='text-sm'>
                  Email
                </Label>
                <Input
                  id='email'
                  placeholder='Nhập email của bạn'
                  className='block text-sm h-9'
                  type='email'
                  autoComplete='email'
                  {...register('email')}
                />
                <div className='min-h-[16px]'>
                  {errors.email && (
                    <p className='text-destructive text-xs'>
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-1.5'>
                <div className='space-y-0.5'>
                  <Label htmlFor='password' className='text-sm'>
                    Mật khẩu
                  </Label>
                  <Input
                    id='password'
                    placeholder='Nhập mật khẩu của bạn'
                    className='block text-sm h-9'
                    type='password'
                    autoComplete='new-password'
                    {...register('password')}
                  />
                  <div className='min-h-[16px]'>
                    {errors.password && (
                      <p className='text-destructive text-xs'>
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className='space-y-0.5'>
                  <Label htmlFor='passwordConfirm' className='text-sm'>
                    Xác nhận mật khẩu
                  </Label>
                  <Input
                    id='passwordConfirm'
                    placeholder='Nhập lại mật khẩu của bạn'
                    className='block text-sm h-9'
                    type='password'
                    autoComplete='new-password'
                    {...register('passwordConfirm')}
                  />
                  <div className='min-h-[16px]'>
                    {errors.passwordConfirm && (
                      <p className='text-destructive text-xs'>
                        {errors.passwordConfirm.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Button
                type='submit'
                className='w-full h-9 text-sm'
                disabled={isSubmitting}
              >
                Đăng ký
              </Button>

              <div className='text-center text-xs'>
                <p>
                  Bạn đã có tài khoản?{' '}
                  <a href='/signin' className='text-primary underline'>
                    Đăng nhập
                  </a>
                </p>
              </div>
            </div>
          </form>
          <div className='bg-muted relative hidden md:block'>
            <img
              src='/placeholderSignUp.png'
              alt='Image'
              className='absolute top-1/2 -translate-y-1/2 object-cover'
            />
          </div>
        </CardContent>
      </Card>
      <div className='px-3 text-center *:[a]:hover:text-primary text-muted-foreground *:[a]:underline *:[a]:underline-offset-4 text-xs text-balance'>
        Bằng cách tiếp tục, bạn đồng ý với <a href='#'>Điều khoản dịch vụ</a> và{' '}
        <a href='#'>Chính sách bảo mật của chúng tôi</a>.
      </div>
    </div>
  );
}
