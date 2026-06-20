'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

interface ProviderProps {
  children: ReactNode;
}

export default function Providers({ children }: ProviderProps) {
  // React 19 / Next 16 fix: suppress the <script> tag warning by
  // telling next-themes to use type="application/json" instead of
  // type="text/javascript", which React won't try to execute
  const scriptProps =
    typeof window === 'undefined' ? undefined : ({ type: 'application/json' } as const);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      disableTransitionOnChange
      scriptProps={scriptProps}>
      {children}
    </ThemeProvider>
  );
}
