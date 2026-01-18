import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import type { SigninSchemaType } from './authSchema';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signinSchema } from './authSchema';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNavigate } from 'react-router';

export function SigninForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SigninSchemaType>({ resolver: zodResolver(signinSchema) });

  const { signIn } = useAuthStore();

  const onSubmit: SubmitHandler<SigninSchemaType> = async (data: SigninSchemaType) => {
    await signIn(data).then(() => {
      navigate('/');
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

                <h1 className='text-xl font-bold'>Đăng nhập EthadChat</h1>
                <p className='text-muted-foreground text-balance text-sm'>
                  Chào mừng trở lại EthadChat, hãy đăng nhập để tiếp tục!
                </p>
              </div>

              <div className='flex flex-col gap-1'>
                <Label htmlFor='username' className='text-sm'>
                  Tên tài khoản
                </Label>
                <Input
                  id='username'
                  placeholder='Nhập tên tài khoản của bạn'
                  className='block text-sm h-9'
                  autoComplete='username'
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
                <Label htmlFor='password' className='text-sm'>
                  Mật khẩu
                </Label>
                <Input
                  id='password'
                  placeholder='Nhập mật khẩu của bạn'
                  className='block text-sm h-9'
                  type='password'
                  autoComplete='current-password'
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

              <Button
                type='submit'
                className='w-full h-9 text-sm'
                disabled={isSubmitting}
              >
                Đăng nhập
              </Button>

              <div className='text-center text-xs'>
                <p>
                  Bạn chưa có tài khoản?{' '}
                  <a href='/signup' className='text-primary underline'>
                    Đăng ký
                  </a>
                </p>
              </div>
            </div>
          </form>
          <div className='bg-muted relative hidden md:block'>
            <img
              src='/placeholder.png'
              alt='Đăng nhập'
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
