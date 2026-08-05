const YELLOW = "#F6D44B";

export function AwardIcon({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="6" fill={YELLOW} />
      <path d="M8.5 12.8L6.5 21l5.5-3 5.5 3-2-8.2" fill={YELLOW} />
      <path d="M9.7 8l1.3 1.5 3.3-3.5" stroke="#333333" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SparklesIcon({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3l2.1 6.9L21 12l-6.9 2.1L12 21l-2.1-6.9L3 12l6.9-2.1L12 3z" fill={YELLOW} />
      <path d="M18.5 2.2l0.95 2.75 2.75 0.95-2.75 0.95-0.95 2.75-0.95-2.75-2.75-0.95 2.75-0.95 0.95-2.75z" fill={YELLOW} />
    </svg>
  );
}

export function StethoscopeIcon({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 2.5v5.2a3 3 0 0 0 6 0V2.5" stroke={YELLOW} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10 10.6v2.7a5.3 5.3 0 0 0 10.6 0v-1.3" stroke={YELLOW} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="20.6" cy="12" r="1.9" stroke={YELLOW} strokeWidth="1.8" />
    </svg>
  );
}

export function BooksIcon({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="15" width="18" height="4" rx="1.3" fill={YELLOW} />
      <rect x="4" y="10" width="16" height="4" rx="1.3" fill={YELLOW} opacity="0.7" />
      <rect x="5" y="5" width="14" height="4" rx="1.3" fill={YELLOW} opacity="0.45" />
    </svg>
  );
}

