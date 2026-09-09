import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { X, Send, Phone, MapPin, Image } from 'lucide-react';

interface ChatDrawerProps {
  bookingId: string;
  workerName: string;
  workerPhoto: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  bookingId,
  workerName,
  workerPhoto,
  isOpen,
  onClose,
}) => {
  const { messages, sendMessage, role } = useDemo();
  const [inputText, setInputText] = useState<string>('');

  if (!isOpen) return null;

  const chatList = messages[bookingId] || [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendMessage(bookingId, inputText.trim(), role === 'worker' ? 'worker' : 'customer');
    setInputText('');
  };

  const handleSendLocation = () => {
    sendMessage(
      bookingId,
      "📍 Shared current live location: Flat 402, Green Valley Apartments, Banjara Hills",
      role === 'worker' ? 'worker' : 'customer'
    );
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right">
      
      {/* Header */}
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src={workerPhoto} alt={workerName} className="w-10 h-10 rounded-full object-cover border border-emerald-400" />
            <span className="w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 absolute bottom-0 right-0" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">{workerName}</h4>
            <span className="text-[10px] text-emerald-400 font-semibold">🟢 Active Booking Chat</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="tel:+919876543210"
            className="p-2 rounded-xl bg-slate-800 text-emerald-400 hover:bg-slate-700 transition"
            title="Call Worker"
          >
            <Phone className="w-4 h-4" />
          </a>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
        <div className="text-center my-2">
          <span className="text-[10px] bg-slate-200 text-slate-600 px-3 py-1 rounded-full font-bold">
            End-to-End Encrypted Cooperative Chat
          </span>
        </div>

        {chatList.map(msg => {
          const isMe = (role === 'customer' && msg.sender === 'customer') || (role === 'worker' && msg.sender === 'worker');

          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-xs font-medium leading-relaxed shadow-xs ${
                  isMe
                    ? 'bg-emerald-600 text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                }`}
              >
                {!isMe && <span className="block font-bold text-[10px] text-emerald-700 mb-0.5">{msg.senderName}</span>}
                {msg.text}
              </div>
              <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
            </div>
          );
        })}
      </div>

      {/* Quick Location / Action Bar */}
      <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 flex items-center gap-2 overflow-x-auto">
        <button
          onClick={handleSendLocation}
          className="text-[11px] font-bold bg-white text-slate-700 hover:bg-slate-200 px-2.5 py-1 rounded-lg border border-slate-300 flex items-center gap-1 shrink-0"
        >
          <MapPin className="w-3 h-3 text-emerald-600" />
          <span>Share Location</span>
        </button>
        <button
          onClick={() => sendMessage(bookingId, "I'm at the main entrance gate.", role === 'worker' ? 'worker' : 'customer')}
          className="text-[11px] font-bold bg-white text-slate-700 hover:bg-slate-200 px-2.5 py-1 rounded-lg border border-slate-300 shrink-0"
        >
          "I'm at the main entrance"
        </button>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-3 py-2 rounded-xl bg-slate-100 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
        />
        <button
          type="submit"
          className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-md shadow-emerald-600/30"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
