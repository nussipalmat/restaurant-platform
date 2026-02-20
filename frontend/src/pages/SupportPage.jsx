import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { supportAPI } from '../api/support';
import TicketCard from '../components/support/TicketCard';
import TicketCommentForm from '../components/support/TicketCommentForm';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';
import { HelpCircle, Plus, X, ChevronUp, MessageSquare, Tag } from 'lucide-react';
import { TICKET_CATEGORIES } from '../utils/constants';
import { formatDateTime } from '../utils/formatters';
import toast from 'react-hot-toast';

const SupportPage = () => {
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [expandedTicketId, setExpandedTicketId] = useState(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['support-tickets'],
    queryFn: () => supportAPI.getAll({ ordering: '-created_at' }),
  });

  const tickets = data?.results || data || [];
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const handleCreateTicket = async (data) => {
    try {
      await supportAPI.create(data);
      toast.success('Ticket Dispatched!', { style: { border: '3px solid black', borderRadius: 0 } });
      setShowNewTicketForm(false);
      reset();
      refetch();
    } catch {
      toast.error('Transmission Failed');
    }
  };

  const handleTicketClick = async (ticket) => {
    if (expandedTicketId === ticket.id) {
      setExpandedTicketId(null);
      setSelectedTicket(null);
      return;
    }

    try {
      const fullTicket = await supportAPI.getById(ticket.id);
      const comments = await supportAPI.getComments(ticket.id);
      setSelectedTicket({ ...fullTicket, comments: comments.results || comments });
      setExpandedTicketId(ticket.id);
    } catch {
      toast.error('Failed to load details');
    }
  };

  const handleCommentSuccess = async () => {
    if (selectedTicket) {
      await handleTicketClick({ id: selectedTicket.id });
    }
    refetch();
  };

  if (isLoading) return <Loading fullScreen />;

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b-8 border-black pb-8">
          <div>
            <h1 className="text-6xl font-black text-black uppercase tracking-tighter leading-none">
              Support <br /> Center
            </h1>
            <p className="mt-4 text-lg font-bold text-gray-600 uppercase italic">We're here to fix what's broken.</p>
          </div>
          <Button 
            onClick={() => setShowNewTicketForm(!showNewTicketForm)}
            className={`h-16 px-8 text-xl font-black uppercase border-4 border-black transition-all ${
              showNewTicketForm 
              ? 'bg-red-500 text-white shadow-none translate-x-1 translate-y-1' 
              : 'bg-yellow-400 text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none'
            }`}
          >
            {showNewTicketForm ? <X className="mr-2" strokeWidth={3} /> : <Plus className="mr-2" strokeWidth={3} />}
            {showNewTicketForm ? 'Close Form' : 'Open Ticket'}
          </Button>
        </div>

        {/* New Ticket Form - Brutalist Modal Style */}
        {showNewTicketForm && (
          <div className="mb-12 bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(168,85,247,1)] relative animate-slide-down">
            <h2 className="text-3xl font-black uppercase mb-8 flex items-center gap-3">
              <Plus size={32} className="bg-black text-white p-1" /> New Inquiry
            </h2>
            
            <form onSubmit={handleSubmit(handleCreateTicket)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-2">Issue Category</label>
                  <select
                    {...register('category', { required: 'Pick a category' })}
                    className="w-full px-4 py-3 border-4 border-black font-bold focus:bg-yellow-50 outline-none"
                  >
                    <option value="">-- SELECT CATEGORY --</option>
                    {Object.values(TICKET_CATEGORIES).map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {errors.category && <p className="mt-2 text-xs font-black text-red-600 uppercase">{errors.category.message}</p>}
                </div>

                <Input
                  label="SUBJECT"
                  {...register('subject', { required: 'Subject needed' })}
                  error={errors.subject?.message}
                  placeholder="What's going on?"
                  className="border-3 border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest mb-2">Full Description</label>
                <textarea
                  {...register('description', {
                    required: 'Details please',
                    minLength: { value: 20, message: 'Give us more info (min 20 chars)' },
                  })}
                  rows="5"
                  className="w-full px-4 py-3 border-4 border-black font-bold focus:bg-yellow-50 outline-none"
                  placeholder="Tell us everything..."
                />
                {errors.description && <p className="mt-2 text-xs font-black text-red-600 uppercase italic">⚠ {errors.description.message}</p>}
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="py-5 flex-1 text-xl font-black uppercase bg-black text-white border-4 border-black hover:bg-gray-800 shadow-[6px_6px_0px_0px_rgba(34,197,94,1)] transition-all">
                  Launch Ticket
                </Button>
                <Button type="button" variant="outline" onClick={() => { setShowNewTicketForm(false); reset(); }} className="py-5 px-10 border-4 border-black font-black uppercase">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Tickets Grid */}
        {tickets.length === 0 ? (
          <EmptyState
            icon={HelpCircle}
            title="All Clear"
            message="No active support tickets found. Everything seems to be running smooth!"
            action={
              <Button variant="warning" className="px-10 py-4 border-4 border-black font-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]" onClick={() => setShowNewTicketForm(true)}>
                Create Ticket Anyway
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="flex flex-col gap-4">
                <TicketCard ticket={ticket} onClick={handleTicketClick} />

                {/* Expanded Details - NEU-BRUTALIST STYLE */}
                {expandedTicketId === ticket.id && selectedTicket && (
                  <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(59,130,246,1)] animate-slide-down col-span-full">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b-4 border-black">
                      <h3 className="text-2xl font-black uppercase tracking-tighter italic">Case Log #{selectedTicket.id}</h3>
                      <button onClick={() => { setExpandedTicketId(null); setSelectedTicket(null); }} className="p-2 border-2 border-black hover:bg-black hover:text-white transition-colors">
                        <ChevronUp size={24} />
                      </button>
                    </div>

                    <div className="mb-8">
                      <div className="flex items-center gap-2 mb-2">
                        <Tag size={16} className="text-purple-600" />
                        <span className="text-xs font-black uppercase bg-purple-100 px-2 py-0.5 border-2 border-black tracking-widest">
                          {selectedTicket.category}
                        </span>
                      </div>
                      <h4 className="text-2xl font-black uppercase mb-3 leading-none">{selectedTicket.subject}</h4>
                      <p className="text-lg font-bold text-gray-700 bg-gray-50 p-4 border-l-8 border-black italic">
                        "{selectedTicket.description}"
                      </p>
                    </div>

                    {/* Comments Section */}
                    <div className="space-y-6">
                      <h4 className="text-lg font-black uppercase flex items-center gap-2">
                        <MessageSquare size={20} /> Discussion Thread
                      </h4>
                      
                      <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                        {selectedTicket.comments?.map((comment) => (
                          <div key={comment.id} className="bg-yellow-50 border-3 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-black uppercase text-xs underline decoration-2">{comment.user_name || 'System'}</span>
                              <span className="text-[10px] font-bold text-gray-500">{formatDateTime(comment.created_at)}</span>
                            </div>
                            <p className="font-bold text-black">{comment.comment}</p>
                          </div>
                        ))}
                      </div>

                      {selectedTicket.status !== 'CLOSED' && (
                        <div className="mt-8 border-t-4 border-dashed border-black pt-6">
                          <TicketCommentForm
                            ticketId={selectedTicket.id}
                            onSuccess={handleCommentSuccess}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportPage;