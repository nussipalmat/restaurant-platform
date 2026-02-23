import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { usersAPI } from '../api/users';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Loading from '../components/common/Loading';
import toast from 'react-hot-toast';
import { User, Upload, Edit3, ShieldCheck } from 'lucide-react';

const ProfilePage = () => {
  const { updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { data: profile, isLoading, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: usersAPI.getProfile,
  });

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      date_of_birth: '',
    },
  });

  const resetFormToProfile = (profileData) => {
    if (profileData) {
      setValue('first_name', profileData.first_name || '');
      setValue('last_name', profileData.last_name || '');
      setValue('email', profileData.email || '');
      setValue('phone_number', profileData.phone_number || '');
      setValue('date_of_birth', profileData.date_of_birth || '');
    } else {
      reset();
    }
  };

  useEffect(() => {
    resetFormToProfile(profile);
  }, [profile, setValue]);

  const onSubmit = async (data) => {
    setIsSaving(true);
    try {
      const formattedData = {
        ...data,
        date_of_birth: data.date_of_birth || null,
      };
      const updated = await usersAPI.updateProfile(formattedData);
      updateUser(updated);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      refetch();
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await usersAPI.uploadImage(file);
      toast.success('Profile image updated!');
      refetch();
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };

  if (isLoading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center justify-between border-b-8 border-black pb-6">
          <h1 className="text-5xl font-black text-black uppercase tracking-tighter">My Account</h1>
          <div className="hidden sm:flex items-center gap-2 bg-yellow-400 border-4 border-black px-4 py-1 font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <ShieldCheck size={18} />
            Verified User
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Avatar Column */}
          <div className="lg:col-span-1">
            <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
              <div className="relative inline-block">
                <div className="w-40 h-40 border-4 border-black bg-gray-200 overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  {profile?.image ? (
                    <img src={profile.image} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User size={64} className="text-black" />
                    </div>
                  )}
                </div>
                <label className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-3 border-4 border-black cursor-pointer hover:bg-blue-600 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none">
                  <Upload size={20} />
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
              <h2 className="mt-6 text-2xl font-black text-black uppercase truncate">
                {profile?.first_name || 'GUEST'}
              </h2>
              <p className="text-gray-600 font-bold break-all lowercase">{profile?.email}</p>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-2">
            <div className={`bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all ${isEditing ? 'border-blue-500' : ''}`}>
              <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-4">
                <h3 className="text-xl font-black text-black uppercase tracking-tight">Identity Details</h3>
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 font-black text-blue-600 hover:text-black uppercase text-sm"
                  >
                    <Edit3 size={16} /> Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="FIRST NAME"
                    {...register('first_name', { required: 'Required' })}
                    error={errors.first_name?.message}
                    disabled={!isEditing}
                    className="border-3 border-black focus:ring-0"
                  />
                  <Input
                    label="LAST NAME"
                    {...register('last_name', { required: 'Required' })}
                    error={errors.last_name?.message}
                    disabled={!isEditing}
                    className="border-3 border-black focus:ring-0"
                  />
                </div>

                <Input
                  label="EMAIL ADDRESS"
                  type="email"
                  {...register('email', { required: 'Required' })}
                  error={errors.email?.message}
                  disabled={!isEditing}
                  className="border-3 border-black focus:ring-0"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="PHONE NUMBER"
                    type="tel"
                    {...register('phone_number')}
                    error={errors.phone_number?.message}
                    disabled={!isEditing}
                    className="border-3 border-black focus:ring-0"
                  />
                  <Input
                    label="DATE OF BIRTH"
                    type="date"
                    {...register('date_of_birth')}
                    disabled={!isEditing}
                    className="border-3 border-black focus:ring-0"
                  />
                </div>

                {isEditing && (
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                      type="submit"
                      loading={isSaving}
                      className="bg-green-500 text-white font-black uppercase py-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none hover:bg-green-600 flex-1"
                    >
                      Apply Changes
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        resetFormToProfile(profile);
                      }}
                      className="font-black uppercase py-4 border-4 border-black hover:bg-gray-100 flex-1"
                    >
                      Abort
                    </Button>
                  </div>
                )}
              </form>
            </div>
            
            <div className="mt-8 p-6 bg-black text-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Account Security</p>
                <p className="font-bold">Your data is stored in accordance with the current security protocols.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;