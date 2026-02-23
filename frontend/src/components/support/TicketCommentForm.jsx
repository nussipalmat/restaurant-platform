import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Button from '../common/Button';
import { supportAPI } from '../../api/support';
import toast from 'react-hot-toast';
import { Send } from 'lucide-react';

const TicketCommentForm = ({ ticketId, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await supportAPI.addComment(ticketId, { comment: data.comment });
      toast.success('SYSTEM: Comment broadcasted');
      reset();
      onSuccess?.();
    } catch (error) {
      toast.error('COMMUNICATION ERROR: Retry failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className="p-6 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
    >
      <div className="mb-6">
        <label className="inline-block bg-black text-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] mb-4 rotate-[-1deg]">
          Transmission Input
        </label>
        
        <div className="relative">
          <textarea
            {...register('comment', {
              required: 'Input required for transmission',
              minLength: {
                value: 10,
                message: 'Data string too short (min 10 chars)',
              },
            })}
            rows="4"
            className={`w-full px-4 py-4 border-4 border-black bg-gray-50 font-bold text-black placeholder:text-gray-400 focus:outline-none focus:bg-white focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all ${
              errors.comment ? 'border-red-500' : 'border-black'
            }`}
            placeholder="ENTER YOUR RESPONSE HERE..."
          />
          <div className="absolute bottom-4 right-4 opacity-10 pointer-events-none">
             <Send className="h-12 w-12 stroke-[3px]" />
          </div>
        </div>

        {errors.comment && (
          <div className="mt-2 bg-red-500 text-white px-3 py-1 border-2 border-black inline-block text-[10px] font-black uppercase italic">
            Error: {errors.comment.message}
          </div>
        )}
      </div>

      <Button 
        type="submit" 
        loading={isSubmitting} 
        className="w-full py-4 bg-yellow-400 hover:bg-black hover:text-white border-4 border-black font-black uppercase tracking-widest shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-3"
      >
        {!isSubmitting && <Send className="h-5 w-5 stroke-[3px]" />}
        {isSubmitting ? 'UPLOADING...' : 'POST COMMENT'}
      </Button>

      <div className="mt-4 flex justify-between items-center opacity-30">
        <div className="h-[2px] bg-black flex-1 border-b border-white" />
        <span className="mx-4 text-[9px] font-black uppercase italic tracking-widest">End of Form</span>
        <div className="h-[2px] bg-black flex-1 border-b border-white" />
      </div>
    </form>
  );
};

export default TicketCommentForm;