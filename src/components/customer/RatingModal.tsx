import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { X, Star, CheckCircle2, ThumbsUp } from 'lucide-react';

interface RatingModalProps {
  bookingId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitRating: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  bookingId,
  isOpen,
  onClose,
  onSubmitRating,
}) => {
  const { bookings, submitRating } = useDemo();
  const booking = bookings.find(b => b.id === bookingId) || bookings[0];

  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('Ravi was extremely professional, arrived right on time, and fixed our main switchboard issue quickly. Highly recommend cooperative workers!');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Professional', 'On time', 'Skilled', 'Fair pricing']);

  if (!isOpen || !booking) return null;

  const availableTags = ['Professional', 'On time', 'Skilled', 'Fair pricing', 'Clean work', 'Polite'];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitRating(booking.id, rating, comment, selectedTags);
    onSubmitRating();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl relative border border-slate-100 overflow-hidden text-slate-900">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ThumbsUp className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-extrabold text-white">Rate Experience</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          <div className="text-center">
            <img
              src={booking.workerPhoto}
              alt={booking.workerName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 mx-auto shadow-md"
            />
            <h4 className="font-extrabold text-lg text-slate-900 mt-2">{booking.workerName}</h4>
            <p className="text-xs text-slate-500">{booking.workerCooperative}</p>
          </div>

          {/* Interactive Star Rating */}
          <div className="text-center bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              How was your service experience?
            </span>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-amber-600 mt-2 block">
              {rating === 5 && 'Outstanding! 5 Stars'}
              {rating === 4 && 'Very Good! 4 Stars'}
              {rating === 3 && 'Average'}
              {rating <= 2 && 'Needs Improvement'}
            </span>
          </div>

          {/* Quick Compliment Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Compliments
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected ? `☑ ${tag}` : `☐ ${tag}`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Review Written Text */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Write a Public Review
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={e => setComment(e.target.value)}
              className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-300 text-xs font-medium focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 transition"
          >
            SUBMIT REVIEW & CONFIRM COMPLETION
          </button>
        </form>

      </div>
    </div>
  );
};
