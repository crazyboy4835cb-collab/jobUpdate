import React from 'react';

interface AdPlaceholderProps {
  format?: 'banner' | 'card' | 'inline';
  label?: string;
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({
  format = 'banner',
  label = 'Advertisement',
}) => {
  if (format === 'banner') {
    return (
      <div className="w-full my-6 bg-slate-50/70 border border-dashed border-slate-300/80 rounded-2xl p-6 text-center shadow-2xs">
        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
          {label}
        </span>
        <p className="text-xs text-slate-500 font-medium">
          Sponsored announcement / Partner advertisement space
        </p>
      </div>
    );
  }

  return (
    <div className="my-5 bg-slate-50/60 border border-dashed border-slate-300/80 rounded-xl p-4 text-center">
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-0.5">
        {label}
      </span>
      <p className="text-xs text-slate-500">
        Sponsored promotion
      </p>
    </div>
  );
};

