import React from 'react';
import { ShieldCheck, Users } from 'lucide-react';

interface VerifiedBadgeProps {
  cooperativeName?: string;
  size?: 'sm' | 'md' | 'lg';
  status?: string;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  cooperativeName = 'Cooperative Society',
  size = 'md',
  status = 'verified',
}) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  if (status === 'pending') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-md bg-amber-100 text-amber-800 font-extrabold uppercase border border-amber-200 ${isSm ? 'px-2 py-0.5 text-[10px]' : isLg ? 'px-3 py-1.5 text-sm' : 'px-3 py-1 text-xs'}`}>
        Verification Pending
      </span>
    );
  }

  if (status !== 'verified') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-md bg-rose-100 text-rose-800 font-extrabold uppercase border border-rose-200 ${isSm ? 'px-2 py-0.5 text-[10px]' : isLg ? 'px-3 py-1.5 text-sm' : 'px-3 py-1 text-xs'}`}>
        Verification {status || 'Unknown'}
      </span>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-medium ${
        isSm ? 'px-2 py-0.5 text-xs' : isLg ? 'px-3.5 py-1.5 text-sm' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <ShieldCheck className={`${isSm ? 'w-3.5 h-3.5' : isLg ? 'w-5 h-5' : 'w-4 h-4'} text-emerald-600 shrink-0`} />
      <span className="font-semibold text-emerald-900">VERIFIED COOPERATIVE MEMBER</span>
      {cooperativeName && !isSm && (
        <span className="hidden sm:inline-flex items-center text-emerald-700 font-normal border-l border-emerald-300 pl-1.5">
          <Users className="w-3 h-3 mr-1 opacity-70" />
          {cooperativeName}
        </span>
      )}
    </div>
  );
};
