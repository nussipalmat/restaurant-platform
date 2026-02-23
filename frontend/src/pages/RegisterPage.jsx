import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    setIsLoading(true);
    const result = await registerUser({
      ...data,
      password2: data.password_confirm,
      role: 'CUSTOMER',
    });
    setIsLoading(false);

    if (result.success) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-white border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12">
          
          {/* Header Section */}
          <div className="text-center mb-10">
            <h2 className="text-5xl font-black text-black uppercase tracking-tighter leading-none mb-4">
              Join the <br /> Squad
            </h2>
            <div className="inline-block bg-yellow-400 border-2 border-black px-4 py-1 font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              Already a member?{' '}
              <Link to="/login" className="underline decoration-2 hover:text-white transition-colors">
                Sign In
              </Link>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Name Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="FIRST NAME"
                placeholder="John"
                {...register('first_name', { required: 'Required' })}
                error={errors.first_name?.message}
                required
                className="border-3 border-black focus:bg-yellow-50"
              />

              <Input
                label="LAST NAME"
                placeholder="Doe"
                {...register('last_name', { required: 'Required' })}
                error={errors.last_name?.message}
                required
                className="border-3 border-black focus:bg-yellow-50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="USERNAME"
                placeholder="johndoe123"
                {...register('username', {
                  required: 'Required',
                  minLength: { value: 3, message: 'Too short' },
                })}
                error={errors.username?.message}
                required
                className="border-3 border-black focus:bg-yellow-50"
              />

              <Input
                label="PHONE NUMBER"
                type="tel"
                placeholder="+1 234 567 890"
                {...register('phone_number', { required: 'Required' })}
                error={errors.phone_number?.message}
                required
                className="border-3 border-black focus:bg-yellow-50"
              />
            </div>

            <Input
              label="EMAIL ADDRESS"
              type="email"
              placeholder="hello@example.com"
              {...register('email', {
                required: 'Required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email',
                },
              })}
              error={errors.email?.message}
              required
              className="border-3 border-black focus:bg-yellow-50"
            />

            {/* Password Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="PASSWORD"
                type="password"
                placeholder="••••••••"
                {...register('password', {
                  required: 'Required',
                  minLength: { value: 8, message: 'Min 8 chars' },
                })}
                error={errors.password?.message}
                required
                className="border-3 border-black focus:bg-yellow-50"
              />

              <Input
                label="CONFIRM PASSWORD"
                type="password"
                placeholder="••••••••"
                {...register('password_confirm', {
                  required: 'Required',
                  validate: (value) => value === password || 'No match',
                })}
                error={errors.password_confirm?.message}
                required
                className="border-3 border-black focus:bg-yellow-50"
              />
            </div>

            {/* Terms and Conditions */}
            <div className="pt-4 border-t-4 border-dashed border-black">
              <div className="flex items-start">
                <input
                  id="terms"
                  type="checkbox"
                  {...register('terms', {
                    required: 'You must agree to continue',
                  })}
                  className="h-6 w-6 text-black focus:ring-0 border-3 border-black rounded-none cursor-pointer"
                />
                <label htmlFor="terms" className="ml-3 block text-sm font-bold text-black uppercase leading-tight cursor-pointer">
                  I accept the{' '}
                  <a href="#" className="underline decoration-2 decoration-blue-500 hover:text-blue-500">
                    Terms of Service
                  </a>{' '}
                  and Privacy Policy.
                </label>
              </div>
              {errors.terms && (
                <p className="mt-2 text-xs font-black text-red-600 uppercase italic">
                  ⚠ {errors.terms.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              loading={isLoading}
              fullWidth
              className="py-5 text-2xl font-black uppercase tracking-widest bg-black text-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(59,130,246,1)] hover:bg-gray-800 hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
            >
              Get Started
            </Button>
          </form>
        </div>

        {/* Decorative Footer Badge */}
        <div className="mt-8 text-center">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em]">
            Secure Registration Protocol v2.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;