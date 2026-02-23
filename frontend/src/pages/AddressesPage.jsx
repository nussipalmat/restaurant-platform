import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { addressesAPI } from '../api/addresses';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';
import { MapPin, Edit, Trash2, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AddressesPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['addresses'],
    queryFn: addressesAPI.getAll,
  });

  const addresses = data?.results || data || [];

  const { register, handleSubmit, formState: { errors, isDirty }, reset } = useForm();

  const handleAddNew = () => {
    setEditingAddress(null);
    reset({});
    setShowForm(true);
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    reset(address);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    if (isDirty && !confirm('You have unsaved changes. Are you sure you want to cancel?')) {
      return;
    }
    setShowForm(false);
    setEditingAddress(null);
    reset({});
  };

  const handleDelete = async (addressId) => {
    if (!confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      await addressesAPI.delete(addressId);
      toast.success('Address deleted successfully!');
      refetch();
    } catch {
      toast.error('Failed to delete address');
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingAddress) {
        await addressesAPI.update(editingAddress.id, data);
        toast.success('Address updated successfully!');
      } else {
        await addressesAPI.create(data);
        toast.success('Address added successfully!');
      }
      setShowForm(false);
      setEditingAddress(null);
      reset({});
      refetch();
    } catch {
      toast.error('Failed to save address');
    }
  };

  if (isLoading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-extrabold text-black tracking-tight">My Addresses</h1>
          <Button variant="primary" size="md" onClick={handleAddNew} className="shadow-lg border-2 border-black">
            <Plus className="h-5 w-5 mr-2" />
            Add Address
          </Button>
        </div>

        {showForm && (
          <div className="mb-10 bg-white rounded-xl shadow-xl p-8 border-4 border-black animate-slide-down">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-black">{editingAddress ? 'Edit Address' : 'Add New Address'}</h2>
              <button onClick={handleCancelForm} className="p-2 hover:bg-gray-200 rounded-full transition-colors border-2 border-transparent hover:border-black">
                <X className="h-6 w-6 text-black" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-base font-bold text-black mb-2">
                  Address Type <span className="text-red-600">*</span>
                </label>
                <select
                  {...register('address_type', { required: 'Address type is required' })}
                  className="w-full px-4 py-3 border-3 border-black rounded-lg focus:ring-4 focus:ring-blue-200 bg-white text-black font-medium"
                >
                  <option value="HOME">Home</option>
                  <option value="WORK">Work</option>
                  <option value="OTHER">Other</option>
                </select>
                {errors.address_type && (
                  <p className="mt-2 text-sm font-bold text-red-600">{errors.address_type.message}</p>
                )}
              </div>

              <Input
                label="Street Address"
                {...register('street_address', { required: 'Street address is required' })}
                error={errors.street_address?.message}
                required
                className="border-3 border-black text-black font-medium"
              />

              <div className="grid grid-cols-2 gap-6">
                <Input
                  label="City"
                  {...register('city', { required: 'City is required' })}
                  error={errors.city?.message}
                  required
                  className="border-3 border-black"
                />

                <Input
                  label="State"
                  {...register('state', { required: 'State is required' })}
                  error={errors.state?.message}
                  required
                  className="border-3 border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <Input
                  label="ZIP Code"
                  {...register('postal_code', { required: 'ZIP code is required' })}
                  error={errors.postal_code?.message}
                  required
                  className="border-3 border-black"
                />

                <Input
                  label="Country"
                  {...register('country', { required: 'Country is required' })}
                  defaultValue="USA"
                  error={errors.country?.message}
                  required
                  className="border-3 border-black"
                />
              </div>

              <div className="flex items-center bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-400">
                <input
                  id="is_default"
                  type="checkbox"
                  {...register('is_default')}
                  className="h-6 w-6 text-blue-600 border-3 border-black rounded focus:ring-0"
                />
                <label htmlFor="is_default" className="ml-3 text-base font-bold text-black">
                  Set as default address
                </label>
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
                <Button type="submit" fullWidth className="py-4 text-lg border-2 border-black">
                  {editingAddress ? 'Update Address' : 'Add Address'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  className="py-4 text-lg border-2 border-gray-400 hover:border-black"
                  onClick={handleCancelForm}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {addresses.length === 0 ? (
          <EmptyState
            icon={MapPin}
            title="No addresses saved"
            message="Add your delivery addresses for faster checkout"
            action={<Button variant="primary" size="lg" fullWidth onClick={handleAddNew} className="border-2 border-black">Add Your First Address</Button>}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="bg-white border-3 border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-black text-black uppercase tracking-wide">
                        {address.address_type_display || address.address_type || 'Address'}
                      </h3>
                      {address.is_default && (
                        <span className="text-xs font-black px-3 py-1 bg-black text-white rounded-full">
                          DEFAULT
                        </span>
                      )}
                    </div>
                    <p className="text-base font-bold text-gray-800 leading-tight">
                      {address.street_address}
                    </p>
                    <p className="text-base font-bold text-gray-800">
                      {address.city}, {address.state} {address.postal_code}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-4 pt-4 border-t-3 border-black">
                    <button
                      onClick={() => handleEdit(address)}
                      className="flex items-center space-x-1 font-bold text-blue-700 hover:text-blue-900 transition-colors"
                    >
                      <Edit className="h-5 w-5" />
                      <span>EDIT</span>
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="flex items-center space-x-1 font-bold text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                      <span>DELETE</span>
                    </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressesPage;