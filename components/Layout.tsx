import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <main className="w-full bg-swiss-bg text-swiss-black antialiased selection:bg-swiss-red selection:text-white">
      {children}
    </main>
  );
};