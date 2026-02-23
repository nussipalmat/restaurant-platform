import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { reservationsAPI } from '../api/reservations';
import { restaurantsAPI } from '../api/restaurants';
import { useAuth } from '../hooks/useAuth';
import ReservationCard from '../components/reservation/ReservationCard';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';
import { Calendar, X, Utensils, Users, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const ReservationsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [availableTables, setAvailableTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [loadingTables, setLoadingTables] = useState(false);
  const { user } = useAuth();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['reservations'],
    queryFn: () => reservationsAPI.getAll({ ordering: '-date_time' }),
  });

  const { data: restaurantsData } = useQuery({
    queryKey: ['restaurants'],
    queryFn: restaurantsAPI.getAll,
  });

  const reservations = data?.results || data || [];
  const restaurants = restaurantsData?.results || restaurantsData || [];

  const { register, handleSubmit, formState: { errors, isDirty }, reset, watch } = useForm();

  const watchRestaurant = watch('restaurant');
  const watchDate = watch('date');
  const watchTime = watch('time');
  const watchGuests = watch('party_size');

  const selectedRestaurant = restaurants.find(
    (r) => String(r.id) === String(watchRestaurant)
  );

  const fetchAvailableTables = async (restaurant, date, time, guests) => {
    setLoadingTables(true);
    try {
      const tables = await reservationsAPI.getAvailableTables(restaurant, date, time, guests);
      setAvailableTables(tables?.results || tables || []);
    } catch {
      toast.error('Failed to fetch available tables');
      setAvailableTables([]);
    } finally {
      setLoadingTables(false);
    }
  };

  useEffect(() => {
    if (watchRestaurant && watchDate && watchTime && watchGuests) {
      fetchAvailableTables(watchRestaurant, watchDate, watchTime, watchGuests);
    } else {
      setAvailableTables([]);
      setSelectedTable(null);
    }
  }, [watchRestaurant, watchDate, watchTime, watchGuests]);

  const handleCreateReservation = async (data) => {
    if (!selectedTable) {
      toast.error('Please select a table');
      return;
    }

    try {
      await reservationsAPI.create({
        restaurant: data.restaurant,
        table: selectedTable,
        reservation_date: data.date,
        reservation_time: data.time,
        guests_count: parseInt(data.party_size),
        phone: data.phone || user?.phone_number || '',
        email: data.email || user?.email || '',
        special_requests: data.special_requests || '',
      });
      
      toast.success('Reservation secured!', { style: { border: '3px solid black', borderRadius: 0 }});
      setShowForm(false);
      reset();
      setAvailableTables([]);
      setSelectedTable(null);
      refetch();
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to create reservation';
      toast.error(message);
    }
  };

  const handleCancelForm = () => {
    if (isDirty && !confirm('Discard changes?')) return;
    setShowForm(false);
    reset();
    setAvailableTables([]);
    setSelectedTable(null);
  };

  const handleCancelReservation = async (reservationId) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await reservationsAPI.cancel(reservationId);
      toast.success('Cancelled successfully');
      refetch();
    } catch {
      toast.error('Error cancelling reservation');
    }
  };

  if (isLoading) return <Loading fullScreen />;

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b-8 border-black pb-8">
          <div>
            <h1 className="text-6xl font-black text-black uppercase tracking-tighter leading-none">
              Book <br /> A Table
            </h1>
            <p className="mt-4 text-lg font-bold text-gray-600 uppercase">Manage your dining schedule</p>
          </div>
          <Button 
            variant="success" 
            className="h-16 px-10 text-xl font-black uppercase border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
            onClick={() => setShowForm(true)}
          >
            New Reservation
          </Button>
        </div>

        {/* Dynamic Reservation Form */}
        {showForm && (
          <div className="mb-12 bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(59,130,246,1)] relative">
            <button 
              onClick={handleCancelForm} 
              className="absolute top-4 right-4 p-2 border-2 border-black hover:bg-red-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <form onSubmit={handleSubmit(handleCreateReservation)} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Inputs Column */}
                <div className="lg:col-span-1 space-y-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest mb-2">Select Venue</label>
                    <select
                      {...register('restaurant', { required: 'Required' })}
                      className="w-full px-4 py-3 border-4 border-black font-bold focus:ring-0 focus:bg-yellow-50 outline-none"
                    >
                      <option value="">-- CHOOSE RESTAURANT --</option>
                      {restaurants.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input label="DATE" type="date" {...register('date', { required: true })} min={new Date().toISOString().split('T')[0]} className="border-3 border-black" />
                    <Input label="TIME" type="time" {...register('time', { required: true })} className="border-3 border-black" />
                  </div>

                  <Input 
                    label="GUESTS COUNT" 
                    type="number" 
                    {...register('party_size', { required: true, min: 1, max: 20 })} 
                    className="border-3 border-black"
                  />
                </div>

                {/* Table Selector Column */}
                <div className="lg:col-span-2 bg-gray-50 border-4 border-black p-6">
                  <h3 className="text-sm font-black uppercase mb-4 flex items-center gap-2">
                    <Utensils size={16} /> Available Seating
                  </h3>
                  
                  {loadingTables ? (
                    <div className="h-48 flex items-center justify-center font-black animate-pulse">SCANNING TABLES...</div>
                  ) : availableTables.length === 0 ? (
                    <div className="h-48 flex flex-col items-center justify-center border-4 border-dashed border-gray-300 text-gray-400">
                      <p className="font-black uppercase">No tables found</p>
                      <p className="text-xs">Select restaurant, date & time first</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {availableTables.map((table) => (
                        <button
                          key={table.id}
                          type="button"
                          onClick={() => setSelectedTable(table.id)}
                          className={`group p-4 border-4 transition-all text-left relative ${
                            selectedTable === table.id 
                            ? 'border-black bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                            : 'border-gray-300 bg-white hover:border-black'
                          }`}
                        >
                          <div className="font-black text-xl italic uppercase">№ {table.table_number}</div>
                          <div className="flex items-center gap-1 text-xs font-bold mt-2">
                            <Users size={12} /> {table.capacity} SEATS
                          </div>
                          {table.location && (
                            <div className="flex items-center gap-1 text-[10px] font-bold opacity-60">
                              <MapPin size={10} /> {table.location}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Contact & Extra */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t-4 border-black">
                <div className="space-y-4">
                  <Input label="DIRECT PHONE" {...register('phone')} placeholder={user?.phone_number} className="border-3 border-black" />
                  <Input label="EMAIL FOR CONFIRMATION" {...register('email')} placeholder={user?.email} className="border-3 border-black" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase mb-2">Special Requests</label>
                  <textarea
                    {...register('special_requests')}
                    rows="4"
                    className="w-full px-4 py-3 border-4 border-black font-bold focus:bg-yellow-50 outline-none"
                    placeholder="Allergies, birthday, window seat..."
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button type="submit" fullWidth className="py-6 text-2xl font-black uppercase bg-black text-white hover:bg-blue-600 transition-colors shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
                  Confirm My Spot
                </Button>
                <Button type="button" variant="outline" onClick={handleCancelForm} className="py-6 font-black uppercase border-4 border-black hover:bg-gray-100">
                  Abort
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Reservations List */}
        {reservations.length === 0 ? (
          <div className="mt-12 bg-white border-4 border-black p-20 text-center shadow-[16px_16px_0px_0px_rgba(0,0,0,0.1)]">
            <Calendar className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-3xl font-black uppercase mb-2">Empty Schedule</h3>
            <p className="font-bold text-gray-500 mb-8 uppercase">You have no upcoming reservations.</p>
            <Button variant="success" className="px-12 py-4 font-black uppercase border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]" onClick={() => setShowForm(true)}>
              Book Your First Table
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {reservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                onCancel={handleCancelReservation}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationsPage;