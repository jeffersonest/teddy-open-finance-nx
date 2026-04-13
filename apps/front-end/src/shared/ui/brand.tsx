interface BrandProps {
  className?: string;
  inverted?: boolean;
}

export function Brand({ className = '', inverted = false }: BrandProps) {
  const accentColor = inverted ? 'bg-orange-400' : 'bg-orange-500';
  const textColor = inverted ? 'text-white' : 'text-slate-950';
  const subtitleColor = inverted ? 'text-white/65' : 'text-slate-500';

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div className="relative h-10 w-10 shrink-0">
        <span
          className={`absolute left-0 top-1 h-2.5 w-2.5 rounded-[3px] ${accentColor}`}
        />
        <span
          className={`absolute left-3 top-0 h-2.5 w-2.5 rounded-[3px] ${accentColor}`}
        />
        <span
          className={`absolute left-3 top-3 h-2.5 w-2.5 rounded-[3px] ${accentColor}`}
        />
        <span
          className={`absolute left-6 top-2 h-8 w-8 rounded-xl ${accentColor}`}
        />
        <span className="absolute left-[1.45rem] top-[0.42rem] text-3xl font-black text-white">
          t
        </span>
      </div>
      <div className="leading-none">
        <div
          className={`text-[2rem] font-black tracking-[-0.06em] ${textColor}`}
        >
          teddy
        </div>
        <div
          className={`mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.4em] ${subtitleColor}`}
        >
          Open Finance
        </div>
      </div>
    </div>
  );
}
