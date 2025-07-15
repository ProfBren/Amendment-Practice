import React, { forwardRef } from 'react';

export const Card = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(function Card(props, ref) {
  return <div ref={ref} {...props} style={{ border: '1px solid #ddd', borderRadius: '1rem', background: '#fff', ...props.style }} />;
});

export function CardHeader({ title }: { title: string }) {
  return <div style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '0.5rem' }}>{title}</div>;
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
