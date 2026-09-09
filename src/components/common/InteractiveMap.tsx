import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Navigation, Compass, ShieldCheck } from 'lucide-react';

// Fix Leaflet icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icon for Customer
const customerIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1004/1004233.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Custom Icon for Worker
const getWorkerIcon = (photoUrl: string) => {
  return new L.DivIcon({
    className: 'custom-worker-icon',
    html: `
      <div style="position: relative; width: 36px; height: 36px;">
        <img src="${photoUrl}" style="width: 100%; height: 100%; border-radius: 50%; border: 2px solid #10b981; object-fit: cover;" />
        <div style="position: absolute; bottom: -4px; right: -4px; background: #10b981; border-radius: 50%; padding: 2px; border: 1px solid white;">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path></svg>
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
};

interface InteractiveMapProps {
  customerLocationName?: string;
  workerName?: string;
  workerPhoto?: string;
  workerCategory?: string;
  distanceKm?: number;
  etaMinutes?: number;
  statusText?: string;
  heightClass?: string;
  isRadarMode?: boolean;
  customerLatLng?: [number, number];
  workers?: Array<{
    id: string;
    name: string;
    photo: string;
    category: string;
    latLng: [number, number];
    isMain?: boolean;
  }>;
}

const RecenterMap = ({ latLng }: { latLng: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(latLng);
  }, [latLng, map]);
  return null;
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  customerLocationName = 'Banjara Hills, Hyderabad',
  workerName = 'Ravi Kumar',
  workerPhoto = 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80',
  workerCategory = 'Electrician',
  distanceKm = 2.1,
  etaMinutes = 8,
  statusText = 'Worker is on the way',
  heightClass = 'h-72',
  isRadarMode = false,
  customerLatLng = [17.4156, 78.4396], // Default Banjara Hills
  workers = [],
}) => {
  // If no workers passed, construct one from props for backwards compatibility
  const displayWorkers = workers.length > 0 ? workers : [{
    id: 'w-default',
    name: workerName,
    photo: workerPhoto,
    category: workerCategory,
    latLng: [customerLatLng[0] + 0.015, customerLatLng[1] + 0.015] as [number, number],
    isMain: true
  }, {
    id: 'w-context',
    name: 'Context Worker',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    category: 'Plumber',
    latLng: [customerLatLng[0] - 0.01, customerLatLng[1] + 0.02] as [number, number],
    isMain: false
  }];

  return (
    <div className={`relative w-full ${heightClass} bg-slate-900 rounded-2xl overflow-hidden shadow-inner border border-slate-700 select-none z-0`}>
      <MapContainer 
        center={customerLatLng} 
        zoom={13} 
        style={{ height: '100%', width: '100%', zIndex: 1 }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterMap latLng={customerLatLng} />
        
        {/* Customer Marker */}
        <Marker position={customerLatLng} icon={customerIcon}>
          <Popup>
            <div className="font-bold text-xs text-slate-800">📍 You ({customerLocationName})</div>
          </Popup>
        </Marker>

        {/* Worker Markers */}
        {displayWorkers.map(w => (
          <Marker key={w.id} position={w.latLng} icon={getWorkerIcon(w.photo)}>
            <Popup>
              <div className="text-xs">
                <strong className="text-slate-800 block">{w.name}</strong>
                <span className="text-slate-500">{w.category}</span>
                {w.isMain && <div className="text-emerald-600 font-bold mt-1">Status: {statusText}</div>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Overlays */}
      <div className="absolute top-3 left-3 z-[400] flex items-center gap-2 pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-700/80 shadow-md flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{statusText}</span>
        </div>
      </div>

      <div className="absolute bottom-3 right-3 z-[400] flex items-center gap-2 pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-md text-slate-200 text-xs px-3 py-1.5 rounded-xl border border-slate-700 shadow-md flex items-center gap-2">
          <Compass className="w-4 h-4 text-emerald-400" />
          <span>Distance: <strong className="text-white">{distanceKm} km</strong></span>
          <span className="text-slate-600">|</span>
          <span>ETA: <strong className="text-emerald-400">{etaMinutes} mins</strong></span>
        </div>
      </div>
      
      {isRadarMode && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[399]">
          <div className="w-48 h-48 rounded-full border border-emerald-500/40 bg-emerald-500/10 animate-ping" />
        </div>
      )}
    </div>
  );
};
