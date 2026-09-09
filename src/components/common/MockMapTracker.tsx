import React from 'react';
import { MapPin, Navigation, Car, Home } from 'lucide-react';
import { BookingStatus } from '../../types';

interface MockMapTrackerProps {
  status: BookingStatus;
  customerAddress: string;
  workerName: string;
}

export const MockMapTracker: React.FC<MockMapTrackerProps> = ({ status, customerAddress, workerName }) => {
  // Determine progress percentage based on status
  let progress = 0;
  let statusText = 'Awaiting Action';
  let isMoving = false;

  switch (status) {
    case 'accepted':
      progress = 10;
      statusText = `${workerName} is preparing to leave`;
      break;
    case 'on_the_way':
      progress = 50;
      statusText = `${workerName} is on the way. ETA: 8 mins`;
      isMoving = true;
      break;
    case 'arrived':
      progress = 90;
      statusText = `${workerName} has arrived at destination`;
      break;
    case 'in_progress':
      progress = 100;
      statusText = `Service is in progress at ${customerAddress}`;
      break;
    case 'completed':
      progress = 100;
      statusText = 'Service Completed';
      break;
    default:
      progress = 0;
  }

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-inner relative">
      {/* Fake Map Background */}
      <div className="h-48 bg-emerald-100/50 w-full relative" style={{
        backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}>
        {/* Route Line */}
        <div className="absolute top-1/2 left-[20%] right-[20%] h-1.5 bg-emerald-200 rounded-full -translate-y-1/2">
          <div 
            className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-in-out relative"
            style={{ width: `${progress}%` }}
          >
            {/* Worker Marker */}
            {['accepted', 'on_the_way', 'arrived'].includes(status) && (
              <div className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-8 h-8 bg-white border-2 border-emerald-500 rounded-full flex items-center justify-center shadow-lg z-10 ${isMoving ? 'animate-bounce' : ''}`}>
                <Car className="w-4 h-4 text-emerald-600" />
              </div>
            )}
          </div>
        </div>

        {/* Start Point (Worker Base) */}
        <div className="absolute top-1/2 left-[20%] -translate-y-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="w-6 h-6 bg-slate-800 rounded-full border-2 border-white flex items-center justify-center shadow-md z-0">
            <Navigation className="w-3 h-3 text-white" />
          </div>
        </div>

        {/* End Point (Customer) */}
        <div className="absolute top-1/2 right-[20%] -translate-y-1/2 translate-x-1/2 flex flex-col items-center">
          <div className="w-8 h-8 bg-amber-500 rounded-full border-2 border-white flex items-center justify-center shadow-md z-0">
            <Home className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Live Status Overlay */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full border border-slate-200 shadow-sm flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isMoving ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
          <span className="text-xs font-bold text-slate-700 whitespace-nowrap">{statusText}</span>
        </div>
      </div>
    </div>
  );
};
