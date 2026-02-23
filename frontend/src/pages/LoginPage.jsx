import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    const result = await login(data);
    setIsLoading(false);

    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Main Login Card */}
        <div className="bg-white border-4 border-black rounded-xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 sm:p-10">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-black uppercase tracking-tighter">
              Welcome Back
            </h2>
            <div className="mt-4 flex flex-col space-y-2">
              <p className="text-lg font-bold text-gray-800 uppercase tracking-tight">
                Sign in to your account
              </p>
              <Link 
                to="/register" 
                className="inline-block font-black text-blue-700 hover:text-blue-900 underline decoration-2 underline-offset-4"
              >
                Need a new account?
              </Link>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-5">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                error={errors.email?.message}
                required
                className="border-3 border-black focus:ring-4 focus:ring-yellow-200"
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                {...register('password', {
                  required: 'Password is required',
                })}
                error={errors.password?.message}
                required
                className="border-3 border-black focus:ring-4 focus:ring-yellow-200"
              />
            </div>

            <div className="flex items-center bg-gray-50 p-3 border-2 border-dashed border-gray-400 rounded-lg">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-5 w-5 text-black focus:ring-0 border-3 border-black rounded cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-3 block text-sm font-black text-black uppercase tracking-wide cursor-pointer">
                Stay signed in
              </label>
            </div>

            <Button
              type="submit"
              loading={isLoading}
              fullWidth
              size="lg"
              className="py-4 text-xl font-black uppercase tracking-widest border-4 border-black bg-black text-white hover:bg-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
            >
              Sign In
            </Button>
          </form>

          {/* Bottom Footer Info */}
          <div className="mt-8 pt-6 border-t-2 border-black border-dashed text-center">
            <p className="text-xs font-bold text-gray-500 uppercase">
              By signing in, you agree to our terms of service
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;