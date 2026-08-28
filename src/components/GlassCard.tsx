import type { HTMLAttributes, ReactNode } from 'react';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/**
 * Frosted-glass surface. All cards use the 24px corner radius (design.md §10).
 * Extend this with props rather than duplicating card markup elsewhere.
 */
export function GlassCard({ children, className = '', ...rest }: GlassCardProps) {
  return (
    <div
      className={`rounded-card border border-white/10 bg-white/10 p-5 shadow-glass backdrop-blur-glass ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
